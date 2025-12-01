import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.PGHOST || 'kine-app-db.ccnqye4wgpbx.us-east-1.rds.amazonaws.com',
  port: parseInt(process.env.PGPORT, 10),
  user: process.env.PGUSER ,
  password: process.env.PGPASSWORD ,
  database: process.env.PGDATABASE ,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL');
});

// Health check with DB connection test
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    console.error('Health check - DB connection failed:', err.message);
    res.status(503).json({ status: 'degraded', database: 'disconnected', error: err.message });
  }
});

// GET /api/boxes - returns all boxes from database
app.get('/api/boxes', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_box, nombre, descripcion FROM box ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/boxes error:', error);
    res.status(500).json({ error: 'failed to load boxes', details: error.message });
  }
});

// GET /api/qr_codes/:codigo_qr - validate a QR code and get associated box
app.get('/api/qr_codes/:codigo_qr', async (req, res) => {
  try {
    const { codigo_qr } = req.params;
    const result = await pool.query(
      'SELECT q.id_qr, q.id_box, q.codigo_qr, q.scheduled_at, b.nombre, b.descripcion FROM qr_code q JOIN box b ON q.id_box = b.id_box WHERE q.codigo_qr = $1 AND q.activo = true LIMIT 1',
      [codigo_qr]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found or inactive' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('GET /api/qr_codes error:', error);
    res.status(500).json({ error: 'failed to validate QR code', details: error.message });
  }
});

// POST /api/qr_codes - create a new QR code (prevents duplicates by box+scheduled_at)
app.post('/api/qr_codes', async (req, res) => {
  const { boxName, scheduledAt } = req.body || {};
  
  if (!boxName) {
    return res.status(400).json({ error: 'boxName is required' });
  }

  if (!scheduledAt) {
    return res.status(400).json({ error: 'scheduledAt (fecha y hora) is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Find box by name
    const boxResult = await client.query('SELECT id_box FROM box WHERE nombre = $1 LIMIT 1', [boxName]);
    if (boxResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'box not found' });
    }
    const id_box = boxResult.rows[0].id_box;

    // Check for duplicate (scheduledAt is now required, so always check)
    const dupResult = await client.query(
      'SELECT id_qr, codigo_qr FROM qr_code WHERE id_box = $1 AND scheduled_at = $2 AND activo = true LIMIT 1',
      [id_box, scheduledAt]
    );
    if (dupResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ 
        error: 'duplicate', 
        message: 'Ya existe un QR activo para este box en esa fecha y hora',
        existing: dupResult.rows[0] 
      });
    }

    // Generate codigo_qr
    const random = Math.random().toString(36).slice(2, 10).toUpperCase();
    const safeName = boxName.replace(/\s+/g, '-');
    const codigo_qr = `QR-${safeName}-${random}`;

    // Insert qr_code with scheduled_at
    const insertResult = await client.query(
      'INSERT INTO qr_code (id_qr, id_box, codigo_qr, activo, fecha_creacion, scheduled_at) VALUES (gen_random_uuid(), $1, $2, true, now(), $3) RETURNING id_qr, codigo_qr, id_box, fecha_creacion, scheduled_at',
      [id_box, codigo_qr, scheduledAt]
    );

    await client.query('COMMIT');
    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('POST /api/qr_codes error:', error);
    res.status(500).json({ error: 'failed to create QR code', details: error.message });
  } finally {
    client.release();
  }
});

// POST /api/validate-location - valida que el practicante esté dentro del edificio
app.post('/api/validate-location', async (req, res) => {
  const { latitude, longitude, id_box } = req.body;

  if (!latitude || !longitude || !id_box) {
    return res.status(400).json({ error: 'latitude, longitude, id_box are required' });
  }

  try {
    // Obtener coordenadas del box desde BD
    const boxResult = await pool.query(
      'SELECT id_box, nombre, latitud, longitud, radio_metros FROM box WHERE id_box = $1',
      [id_box]
    );

    if (boxResult.rows.length === 0) {
      return res.status(404).json({ error: 'box not found' });
    }

    const box = boxResult.rows[0];

    // Validar que el box tenga coordenadas
    if (!box.latitud || !box.longitud) {
      return res.status(400).json({ 
        error: 'box_not_configured', 
        message: 'El box no tiene coordenadas configuradas' 
      });
    }

    // Calcular distancia usando Haversine en SQL
    const distResult = await pool.query(
      `SELECT 
        6371 * acos(
          cos(radians($1)) * cos(radians(latitud)) * 
          cos(radians(longitud) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitud))
        ) * 1000 as distance_meters
       FROM box WHERE id_box = $3`,
      [latitude, longitude, id_box]
    );

    const distance = distResult.rows[0].distance_meters;
    const allowedRadius = box.radio_metros || 50; // 50 metros por defecto

    const isInside = distance <= allowedRadius;

    res.json({
      valid: isInside,
      box_name: box.nombre,
      distance_meters: Math.round(distance),
      allowed_radius: allowedRadius,
      message: isInside 
        ? `✓ Dentro del área autorizada (${Math.round(distance)}m)` 
        : `✗ Fuera del área. Distancia: ${Math.round(distance)}m, radio permitido: ${allowedRadius}m`
    });

  } catch (error) {
    console.error('POST /api/validate-location error:', error);
    res.status(500).json({ error: 'validation failed', details: error.message });
  }
});

// POST /api/atencion - registrar una atención con ubicación (usa PostGIS)
app.post('/api/atencion', async (req, res) => {
  const { id_usuario, id_box, id_qr, id_paciente, latitude, longitude, duracion_min, observaciones } = req.body || {};

  if (!id_box || !latitude || !longitude) {
    return res.status(400).json({ error: 'id_box, latitude and longitude are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO atencion 
        (id_usuario, id_box, id_qr, id_paciente, ubicacion, duracion_min, observaciones)
       VALUES 
        ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8)
       RETURNING id_atencion, fecha_hora_registro`,
      [id_usuario, id_box, id_qr, id_paciente, longitude, latitude, duracion_min, observaciones]
    );

    res.status(201).json({
      success: true,
      id_atencion: result.rows[0].id_atencion,
      timestamp: result.rows[0].fecha_hora_registro
    });
  } catch (error) {
    console.error('POST /api/atencion error:', error);
    res.status(500).json({ error: 'Error al registrar atención', details: error.message });
  }
});

// POST /api/attendance - registrar asistencia con validación de ubicación
app.post('/api/attendance', async (req, res) => {
  const { boxName, codigoqr, fecha, hora, modulo, tipoAtencion, procedimiento, latitude, longitude } = req.body || {};

  // Validaciones básicas
  if (!codigoqr) {
    return res.status(400).json({ error: 'codigoqr es requerido' });
  }
  if (!fecha || !hora) {
    return res.status(400).json({ error: 'fecha y hora son requeridos' });
  }
  if (!tipoAtencion || !procedimiento) {
    return res.status(400).json({ error: 'tipoAtencion y procedimiento son requeridos' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Validar que el QR existe y está activo
    const qrResult = await client.query(
      'SELECT id_qr, id_box, codigo_qr, scheduled_at FROM qr_code WHERE codigo_qr = $1 AND activo = true LIMIT 1',
      [codigoqr]
    );

    if (qrResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'QR code no encontrado o inactivo' });
    }

    const qrData = qrResult.rows[0];
    const id_box = qrData.id_box;

    // 2. Si se proporcionan coordenadas, validar ubicación (a menos que esté en modo demo)
    const isDemoMode = process.env.DEMO_MODE === 'true';
    
    if (latitude && longitude && !isDemoMode) {
      const boxResult = await client.query(
        'SELECT latitud, longitud, radio_metros FROM box WHERE id_box = $1',
        [id_box]
      );

      if (boxResult.rows.length > 0) {
        const box = boxResult.rows[0];
        
        if (box.latitud && box.longitud) {
          // Calcular distancia usando Haversine
          const distResult = await client.query(
            `SELECT 
              6371 * acos(
                cos(radians($1)) * cos(radians($2)) * 
                cos(radians($3) - radians($4)) + 
                sin(radians($1)) * sin(radians($2))
              ) * 1000 as distance_meters`,
            [latitude, box.latitud, longitude, box.longitud]
          );

          const distance = distResult.rows[0].distance_meters;
          const allowedRadius = box.radio_metros || 50;

          if (distance > allowedRadius) {
            await client.query('ROLLBACK');
            return res.status(403).json({ 
              error: 'location_out_of_range',
              message: `Estás fuera del área autorizada. Distancia: ${Math.round(distance)}m, permitido: ${allowedRadius}m`
            });
          }
        }
      }
    } else if (isDemoMode) {
      console.log('⚠️ DEMO_MODE activo: omitiendo validación de ubicación');
    }

    // 3. Registrar la asistencia en la tabla attendance (o similar)
    // Nota: ajusta el nombre de la tabla y campos según tu esquema de BD
    const insertResult = await client.query(
      `INSERT INTO attendance 
        (id_attendance, id_qr, box_name, fecha, hora, modulo, tipo_atencion, procedimiento, ubicacion, fecha_registro)
       VALUES 
        (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 
         ${latitude && longitude ? 'ST_SetSRID(ST_MakePoint($8, $9), 4326)' : 'NULL'},
         now())
       RETURNING id_attendance, fecha_registro`,
      latitude && longitude 
        ? [qrData.id_qr, boxName || modulo, fecha, hora, modulo, tipoAtencion, procedimiento, longitude, latitude]
        : [qrData.id_qr, boxName || modulo, fecha, hora, modulo, tipoAtencion, procedimiento]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      id_attendance: insertResult.rows[0].id_attendance,
      timestamp: insertResult.rows[0].fecha_registro,
      message: 'Asistencia registrada exitosamente'
    });

  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('POST /api/attendance error:', error);
    res.status(500).json({ error: 'Error al registrar asistencia', details: error.message });
  } finally {
    client.release();
  }
});

// GET /api/attendance/:id - obtener detalles de una asistencia
app.get('/api/attendance/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        a.id_attendance,
        a.box_name,
        a.fecha,
        a.hora,
        a.modulo,
        a.tipo_atencion,
        a.procedimiento,
        a.fecha_registro,
        ST_X(a.ubicacion) as longitude,
        ST_Y(a.ubicacion) as latitude,
        q.codigo_qr
       FROM attendance a
       LEFT JOIN qr_code q ON a.id_qr = q.id_qr
       WHERE a.id_attendance = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asistencia no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('GET /api/attendance/:id error:', error);
    res.status(500).json({ error: 'Error al obtener asistencia', details: error.message });
  }
});

// GET /api/attendance - listar todas las asistencias (con filtros opcionales)
app.get('/api/attendance', async (req, res) => {
  const { fecha, boxName, limit = 50, offset = 0 } = req.query;

  try {
    let query = `
      SELECT 
        a.id_attendance,
        a.box_name,
        a.fecha,
        a.hora,
        a.modulo,
        a.tipo_atencion,
        a.procedimiento,
        a.fecha_registro,
        q.codigo_qr
      FROM attendance a
      LEFT JOIN qr_code q ON a.id_qr = q.id_qr
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (fecha) {
      paramCount++;
      query += ` AND a.fecha = $${paramCount}`;
      params.push(fecha);
    }

    if (boxName) {
      paramCount++;
      query += ` AND a.box_name ILIKE $${paramCount}`;
      params.push(`%${boxName}%`);
    }

    query += ` ORDER BY a.fecha_registro DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/attendance error:', error);
    res.status(500).json({ error: 'Error al listar asistencias', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'internal server error', details: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'endpoint not found' });
});

// Start server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`🚀 KineApp API server listening on port ${port}`);
  console.log(`📡 DB Config: host=${process.env.PGHOST}, user=${process.env.PGUSER}, ssl=${process.env.PGSSL}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});
