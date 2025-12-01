# Guía de Usuario KineApp

## Flujo de Uso

1. **Inicio:**
    * El usuario accede a la página de inicio (`/`) donde se muestra una bienvenida.
2. **Login/Registro:**
    * Si el usuario ya tiene una cuenta, puede iniciar sesión en la página `/login`.
    * Si el usuario no tiene una cuenta, puede registrarse en la página `/registro`.
3. **Menú (Practicante/Supervisor):**
    * Después de iniciar sesión, el usuario es redirigido al menú correspondiente a su rol:
        * Practicante: `/practicante/menu`
        * Supervisor: `/supervisor/menu`
4. **Funcionalidades del Practicante:**
    * **Escanear Código QR:**
        * El practicante accede a la página `/practicante/scan` para escanear el código QR del paciente.
        * La aplicación utiliza la cámara del dispositivo para escanear el código QR.
        * Después de escanear el código QR, la aplicación muestra los detalles del paciente.
    * **Detalles de Atención:**
        * El practicante accede a la página `/detalles-atencion` para registrar los detalles de la atención del paciente.
    * **Historial:**
        * El practicante accede a la página `/historial` para ver el historial de asistencias del paciente.
    * **Créditos:**
        * El practicante accede a la página `/creditos` para ver los créditos de la aplicación.
5. **Funcionalidades del Supervisor:**
    * **Lista de Practicantes:**
        * El supervisor accede a la página `/lista-practicantes` para ver la lista de practicantes.
    * **Consultas de Practicantes:**
        * El supervisor accede a la página `/consultas-practicante` para ver las consultas de los practicantes.
    * **Detalle de Consulta:**
        * El supervisor accede a la página `/detalle-consulta` para ver los detalles de una consulta específica.
    * **Retroalimentación:**
        * El supervisor accede a la página `/retroalimentacion` para dar retroalimentación a los practicantes.
    * **Generador QR:**
        * El supervisor accede a la página `/generador-qr` para generar códigos QR para los boxes.

## Diagrama de Flujo

```mermaid
graph LR
    A[Inicio] --> B{Login/Registro};
    B -- Login --> C{Menú};
    B -- Registro --> C;
    C -- Practicante --> D{Escanear QR};
    C -- Practicante --> E{Detalles Atención};
    C -- Practicante --> F{Historial};
    C -- Practicante --> G{Créditos};
    C -- Supervisor --> H{Lista Practicantes};
    C -- Supervisor --> I{Consultas Practicantes};
    C -- Supervisor --> J{Detalle Consulta};
    C -- Supervisor --> K{Retroalimentación};
    C -- Supervisor --> L{Generador QR};
    D --> E;
    E --> F;
    F --> A;
    H --> I;
    I --> J;
    J --> K;
    K --> L;
    L --> A;
