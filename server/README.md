# KineApp API Server

Node.js + Express server para gestionar boxes y códigos QR de la aplicación KineApp.

## Features

- **GET `/api/boxes`** — Obtiene la lista de boxes desde la BD.
- **POST `/api/qr_codes`** — Crea un código QR asociado a un box (previene duplicados por box + fecha/hora).
- **GET `/api/qr_codes/:codigo_qr`** — Valida un código QR y obtiene el box asociado.
- **Pool de conexiones PostgreSQL** — Reutiliza conexiones para mejor rendimiento.
- **Error handling robusto** — Manejo de errores con transacciones ACID.
- **CORS habilitado** — Permite peticiones desde el frontend.

## Instalación

### Requisitos

- Node.js 18+
- PostgreSQL 12+ (con extensión `pgcrypto`)
- Base de datos `postgres` en AWS RDS o local

### Setup

1. Navega a la carpeta del servidor:
```bash
cd server
```

2. Instala dependencias:
```bash
npm install
```

3. Crea un archivo `.env` con tus credenciales:
```env
PGHOST=kine-app-db.ccnqye4wgpbx.us-east-1.rds.amazonaws.com
PGPORT=5432
PGUSER=admin_kine
PGPASSWORD=kineappdb
PGDATABASE=postgres
PGSSL=true
PORT=4000
```

### Ejecución

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor arrancará en `http://localhost:4000` (o el puerto definido en `PORT`).

## Endpoints

### GET `/health`
Verifica que el servidor está activo.

**Respuesta:**
```json
{ "status": "ok" }
```

---

### GET `/api/boxes`
Obtiene la lista de boxes desde la BD.

**Respuesta (200):**
```json
[
  { "id_box": "...", "nombre": "Sala ira", "descripcion": "Sala IRA" },
  { "id_box": "...", "nombre": "Medicina", "descripcion": "Servicio de Medicina" }
]
```

**Errores:**
- 500: Error al consultar la BD.

---

### POST `/api/qr_codes`
Crea un nuevo código QR asociado a un box. Previene duplicados si se especifica `scheduledAt`.

**Body:**
```json
{
  "boxName": "Sala ira",
  "scheduledAt": "2025-11-26T09:00:00.000Z"  // opcional
}
```

**Respuesta (201 — creado):**
```json
{
  "id_qr": "...",
  "codigo_qr": "QR-Sala-ira-ABC12345",
  "id_box": "...",
  "fecha_creacion": "2025-11-25T10:30:00.000Z",
  "scheduled_at": "2025-11-26T09:00:00.000Z"
}
```

**Respuesta (409 — duplicado):**
```json
{
  "error": "duplicate",
  "existing": {
    "id_qr": "...",
    "codigo_qr": "QR-Sala-ira-ABC12345"
  }
}
```

**Errores:**
- 400: `boxName` no proporcionado.
- 404: Box no existe.
- 500: Error al crear el QR.

---

### GET `/api/qr_codes/:codigo_qr`
Valida un código QR y obtiene la información del box asociado.

**Parámetros:**
- `codigo_qr` — el código QR a validar (ej. `QR-Sala-ira-ABC12345`).

**Respuesta (200):**
```json
{
  "id_qr": "...",
  "id_box": "...",
  "codigo_qr": "QR-Sala-ira-ABC12345",
  "scheduled_at": "2025-11-26T09:00:00.000Z",
  "nombre": "Sala ira",
  "descripcion": "Sala IRA"
}
```

**Errores:**
- 404: Código QR no encontrado o inactivo.
- 500: Error al validar.

---

## Configuración avanzada

### SSL/TLS para PostgreSQL

Si tu BD requiere SSL:
```env
PGSSL=true
```

El servidor asume `rejectUnauthorized=false`; para producción usa certificados válidos.

### Pool de conexiones

Ajusta en `server.js`:
```javascript
const pool = new Pool({
  // ... otras config
  max: 10,                      // máx conexiones simultáneas
  idleTimeoutMillis: 30000,     // tiempo antes de cerrar conexión idle
  connectionTimeoutMillis: 2000 // timeout para obtener conexión
});
```

## Operaciones de Base de Datos

### Insertar boxes
Usa el script SQL:
```bash
psql --host=... --username=... --dbname=postgres -f ../scripts/insert_boxes.sql
```

### Migración (agregar columna scheduled_at)
```bash
psql --host=... --username=... --dbname=postgres -f ../scripts/migration_add_scheduled_at.sql
```

## Testing

### Prueba de boxes
```bash
curl http://localhost:4000/api/boxes
```

### Crear un QR
```bash
curl -X POST http://localhost:4000/api/qr_codes \
  -H "Content-Type: application/json" \
  -d '{"boxName":"Sala ira","scheduledAt":"2025-11-26T09:00:00Z"}'
```

### Validar un QR
```bash
curl http://localhost:4000/api/qr_codes/QR-Sala-ira-ABC12345
```

## Notas

- **Transacciones ACID:** Las operaciones POST usan transacciones para garantizar consistencia.
- **Rollback automático:** En caso de error, los cambios se revierten.
- **Conexión pool:** Reutiliza conexiones para mejor rendimiento bajo carga.
- **Graceful shutdown:** El servidor espera a que las conexiones se cierren al recibir `SIGINT`.

## Troubleshooting

### Error: `connect ECONNREFUSED`
- Verifica que PostgreSQL está activo y que `PGHOST`/`PGPORT` son correctos.

### Error: `password authentication failed`
- Verifica credenciales en `.env`.

### Error: `undefined` en `PGHOST`
- Asegúrate de que `dotenv` está cargando `.env` correctamente (debe estar en la raíz de `server/`).

## Ambiente de Desarrollo

Para desarrollo rápido, usa `npm run dev`:
```bash
cd server
npm install
npm run dev
```

Esto arranca el servidor con auto-reload. Edita `server.js` y los cambios se aplicarán automáticamente.

## Próximos Pasos

- Implementar autenticación (JWT).
- Añadir validación de entrada (schemas).
- Implementar rate limiting.
- Añadir logging centralizado (Winston, etc).
- Tests unitarios e integración (Jest, Supertest).
