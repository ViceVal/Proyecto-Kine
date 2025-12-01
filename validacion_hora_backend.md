# Implementación de la validación de la hora en el backend para evitar el salto de horas

Este documento describe cómo se podría implementar la validación de la hora en el backend para evitar que los practicantes generen un código QR y lo utilicen para saltarse horas.

## Contexto

Actualmente, la aplicación permite generar códigos QR para registrar la asistencia a un box en una fecha y hora específica. Sin embargo, no existe ninguna validación que impida que un practicante genere un código QR y lo utilice para registrar su asistencia en un horario diferente al programado.

## Propuesta de solución

Se propone modificar el endpoint `/api/attendance` para validar la hora del código QR escaneado con la hora actual. Si la hora del código QR es anterior a la hora actual, se podría retornar un error y no registrar la asistencia.

## Implementación

1. **Obtener la hora programada del código QR:** Al recibir una solicitud al endpoint `/api/attendance`, se debe obtener la hora programada (`scheduledAt`) del código QR que se está utilizando para registrar la asistencia. Esta información se puede obtener buscando el código QR en la base de datos (en este caso, en el array `MOCK_QRCODES`).

2. **Obtener la hora actual:** Se debe obtener la hora actual del servidor.

3. **Comparar las horas:** Se debe comparar la hora programada del código QR con la hora actual. Si la hora programada es anterior a la hora actual, se debe retornar un error.

4. **Registrar la asistencia:** Si la hora programada es igual o posterior a la hora actual, se debe registrar la asistencia normalmente.

## Ejemplo de código

A continuación, se muestra un ejemplo de cómo se podría implementar esta validación en el endpoint `/api/attendance` del archivo `server/server.js`.

```javascript
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

    // ✅ Validar la hora programada
    const scheduledAt = new Date(qr.scheduledat);
    const now = new Date();

    if (scheduledAt < now) {
      return res.status(400).json({
        error: 'QR code is expired',
        message: 'El código QR ya no es válido.'
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
```

## Consideraciones adicionales

* Se podría agregar un margen de tiempo para permitir que los practicantes registren su asistencia unos minutos antes o después de la hora programada.
* Se podría implementar un sistema de "check-in" y "check-out" donde el practicante escanea un código QR al iniciar su hora y otro código QR al finalizar su hora. Esto permitiría controlar el tiempo real que el practicante está trabajando.
* Se debe tener en cuenta que este ejemplo de código utiliza datos mockeados en memoria. En una implementación real, se debería utilizar una base de datos para almacenar los boxes, códigos QR y asistencias.
