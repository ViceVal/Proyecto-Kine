
**Archivo: `CONFIGURACION.md`**

```markdown
# Configuración para Desarrollo en Red Local

## Problema

Al trabajar en red local (accediendo desde celular a `192.168.1.X`), el frontend necesita conectarse al backend usando la IP de red en lugar de `localhost`.

## Solución Simple

Modificar el archivo `.env` en la raíz del proyecto con la IP local de tu máquina.

---

## Pasos

### 1. Obtener tu IP local

**Windows (PowerShell):**
```

ipconfig

```

**Linux/Mac:**
```

ifconfig

# o

ip addr show

```

Busca algo como: `192.168.X.X`

### 2. Modificar `.env`

Edita el archivo `.env` en la raíz del proyecto:

```

# Desarrollo en red local (usar IP real de la máquina)

VITE_API_URL=<https://{IP máquina local}:4000>

# Para desarrollo solo en PC (localhost)

# VITE_API_URL=<https://localhost:4000>

# Para producción (cuando despliegues)

# VITE_API_URL=<https://api.kineapp.com>

```

### 3. Reiniciar frontend

```

npm run dev

```

## Resumen

- **En PC:** Funciona con `localhost` o IP local
- **En celular:** Requiere IP local (`192.168.X.X`)
- **Cambio necesario:** Solo modificar `VITE_API_URL` en `.env`
- **Portabilidad:** Cada desarrollador debe ajustar su IP local

---

## Notas

- El backend ya escucha en todas las interfaces por defecto
- El firewall de Windows puede requerir permitir el puerto 4000
- Asegúrate de haber aceptado el certificado HTTPS en el celular visitando `https://192.168.1.X:4000/health`
```
