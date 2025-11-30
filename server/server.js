import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// ✅ Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MOCK DATA - Datos hardcodeados en memoria
const MOCK_BOXES = [
  { idbox: '1', nombre: 'Box 1', descripcion: 'Box de atención 1' },
  { idbox: '2', nombre: 'Box 2', descripcion: 'Box de atención 2' },
  { idbox: '3', nombre: 'Box 3', descripcion: 'Box de atención 3' },
];

const MOCK_QRCODES = [
  {
    idqr: 'qr-001',
    idbox: '1',
    codigoqr: 'QR-Box-1-ABC123',
    scheduledat: '2025-11-26T10:00:00',
    activo: true,
    fechacreacion: '2025-11-25T12:00:00',
    nombre: 'Box 1',
    descripcion: 'Box de atención 1'
  },
  {
    idqr: 'qr-002',
    idbox: '2',
    codigoqr: 'QR-Box-2-XYZ789',
    scheduledat: '2025-11-26T14:00:00',
    activo: true,
    fechacreacion: '2025-11-25T12:00:00',
    nombre: 'Box 2',
    descripcion: 'Box de atención 2'
  }
];

// ✅ MOCK ATTENDANCES - Asistencias registradas
const MOCK_ATTENDANCES = [];

// Contadores para generar IDs únicos
let qrCounter = MOCK_QRCODES.length;
let attendanceCounter = 0;

// ✅ Health check (sin DB)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'mock (no database connection)',
    mode: 'development'
  });
});

// ✅ GET /api/boxes - Retorna boxes mockeados
app.get('/api/boxes', (req, res) => {
  console.log('GET /api/boxes - returning mock data');
  res.json(MOCK_BOXES);
});

// ✅ GET /api/qrcodes/:codigoqr - Valida un QR code mockeado
app.get('/api/qrcodes/:codigoqr', (req, res) => {
  const { codigoqr } = req.params;
  console.log(`GET /api/qrcodes/${codigoqr}`);

  const qr = MOCK_QRCODES.find(q => q.codigoqr === codigoqr && q.activo);

  if (!qr) {
    return res.status(404).json({
      error: 'QR code not found or inactive',
      codigoqr
    });
  }

  res.json(qr);
});

// ✅ POST /api/qrcodes - Crea un nuevo QR code (en memoria)
app.post('/api/qrcodes', (req, res) => {
  const { boxName, scheduledAt } = req.body;

  console.log('POST /api/qrcodes', { boxName, scheduledAt });

  // Validación
  if (!boxName) {
    return res.status(400).json({ error: 'boxName is required' });
  }
  if (!scheduledAt) {
    return res.status(400).json({ error: 'scheduledAt (fecha y hora) is required' });
  }

  // Buscar box por nombre
  const box = MOCK_BOXES.find(b => b.nombre === boxName);
  if (!box) {
    return res.status(404).json({ error: 'box not found' });
  }

  // Verificar duplicado (mismo box + mismo scheduledAt)
  const duplicate = MOCK_QRCODES.find(
    q => q.idbox === box.idbox && q.scheduledat === scheduledAt && q.activo
  );

  if (duplicate) {
    return res.status(409).json({
      error: 'duplicate',
      message: 'Ya existe un QR activo para este box en esa fecha y hora',
      existing: duplicate
    });
  }

  // Generar código QR único
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  const safeName = boxName.replace(/\s+/g, '-');
  const codigoqr = `QR-${safeName}-${random}`;

  // Crear nuevo QR en memoria
  const newQR = {
    idqr: `qr-${String(++qrCounter).padStart(3, '0')}`,
    idbox: box.idbox,
    codigoqr,
    scheduledat: scheduledAt,
    activo: true,
    fechacreacion: new Date().toISOString(),
    nombre: box.nombre,
    descripcion: box.descripcion
  };

  MOCK_QRCODES.push(newQR);

  console.log('QR created:', newQR);
  res.status(201).json(newQR);
});

// ✅ POST /api/attendance - Registrar nueva asistencia/atención
app.post('/api/attendance', (req, res) => {
  const {
    codigoqr,
    boxName,
    fecha,
    hora,
    modulo,
    tipoAtencion,
    procedimiento,
    practicanteId
  } = req.body;

  console.log('POST /api/attendance', req.body);

  // Validaciones
  if (!boxName) return res.status(400).json({ error: 'boxName is required' });
  if (!fecha) return res.status(400).json({ error: 'fecha is required' });
  if (!hora) return res.status(400).json({ error: 'hora is required' });
  if (!tipoAtencion) return res.status(400).json({ error: 'tipoAtencion is required' });
  if (!procedimiento) return res.status(400).json({ error: 'procedimiento is required' });

  // Buscar box
  const box = MOCK_BOXES.find(b => b.nombre === boxName);
  if (!box) return res.status(404).json({ error: 'box not found' });

  // Validar QR si fue proporcionado
  if (codigoqr) {
    const qr = MOCK_QRCODES.find(q => q.codigoqr === codigoqr && q.activo);
    if (!qr) {
      return res.status(404).json({
        error: 'QR code not found or inactive',
        codigoqr
      });
    }
  }

  // Crear asistencia
  const newAttendance = {
    idattendance: `att-${String(++attendanceCounter).padStart(4, '0')}`,
    idbox: box.idbox,
    boxName: box.nombre,
    codigoqr: codigoqr || null,
    fecha,
    hora,
    modulo: modulo || null,
    tipoAtencion,
    procedimiento,
    practicanteId: practicanteId || 'practicante-mock',
    practicanteNombre: 'Practicante Demo',
    estado: 'pendiente',
    retroalimentacion: null,
    createdAt: new Date().toISOString()
  };

  MOCK_ATTENDANCES.push(newAttendance);
  console.log('✅ Attendance created:', newAttendance);
  res.status(201).json(newAttendance);
});

// ✅ GET /api/attendance - Obtener historial de asistencias
app.get('/api/attendance', (req, res) => {
  const { practicanteId, boxId, desde, hasta } = req.query;

  let filtered = [...MOCK_ATTENDANCES];

  if (practicanteId) filtered = filtered.filter(a => a.practicanteId === practicanteId);
  if (boxId) filtered = filtered.filter(a => a.idbox === boxId);
  if (desde) filtered = filtered.filter(a => new Date(a.fecha) >= new Date(desde));
  if (hasta) filtered = filtered.filter(a => new Date(a.fecha) <= new Date(hasta));

  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  console.log(`GET /api/attendance - returning ${filtered.length} records`);
  res.json(filtered);
});

// ✅ Error handling
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'internal server error',
    details: err.message
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'endpoint not found' });
});

// ✅ Start server con HTTPS
const PORT = process.env.PORT || 4000;

// Cargar certificados SSL
const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'localhost+2-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'localhost+2.pem')),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`\n🚀 KineApp API server (MOCK MODE) listening on port ${PORT} (HTTPS)`);
  console.log(`📦 Mock boxes loaded: ${MOCK_BOXES.length}`);
  console.log(`🎫 Mock QR codes loaded: ${MOCK_QRCODES.length}`);
  console.log(`📋 Mock attendances: ${MOCK_ATTENDANCES.length}`);
  console.log(`\nEndpoints disponibles:`);
  console.log(`  GET  https://localhost:${PORT}/health`);
  console.log(`  GET  https://localhost:${PORT}/api/boxes`);
  console.log(`  GET  https://localhost:${PORT}/api/qrcodes/:codigoqr`);
  console.log(`  POST https://localhost:${PORT}/api/qrcodes`);
  console.log(`  POST https://localhost:${PORT}/api/attendance`);
  console.log(`  GET  https://localhost:${PORT}/api/attendance`);
  console.log(`\n✅ Servidor listo para desarrollo sin base de datos (HTTPS)\n`);
});
