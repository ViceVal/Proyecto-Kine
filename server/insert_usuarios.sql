-- ============================================
-- VERIFICAR USUARIOS EXISTENTES
-- ============================================
SELECT id_usuario, username, password_hash, nombre, rol, creado_at 
FROM usuario 
ORDER BY creado_at DESC;

-- ============================================
-- INSERTAR USUARIO SUPERVISOR
-- ============================================
-- Solo ejecutar si no existe ya
INSERT INTO usuario (id_usuario, username, password_hash, nombre, rol, creado_at)
VALUES (
  gen_random_uuid(),
  'supervisor1',
  'admin123',
  'Dr. Carlos Supervisor',
  'supervisor',
  now()
)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- INSERTAR PRACTICANTE ADICIONAL
-- ============================================
INSERT INTO usuario (id_usuario, username, password_hash, nombre, rol, creado_at)
VALUES (
  gen_random_uuid(),
  'practicante2',
  'practica456',
  'María González',
  'practicante',
  now()
)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- VERIFICAR USUARIOS DESPUÉS DE INSERT
-- ============================================
SELECT username, password_hash, nombre, rol 
FROM usuario 
ORDER BY rol, username;

/*
╔═══════════════════════════════════════════════════════════════╗
║         CREDENCIALES PARA PRUEBAS - KINEAPP                   ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  USUARIO EXISTENTE EN LA BD (según dump):                     ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                      ║
║  👤 Usuario: practicante1                                     ║
║  🔑 Contraseña: 12345hash                                     ║
║  📋 Rol: practicante                                          ║
║  🔗 Redirige a: /practicante/menu                             ║
║                                                                ║
║  SUPERVISOR (nuevo - ejecutar INSERT arriba):                 ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                      ║
║  👤 Usuario: supervisor1                                      ║
║  🔑 Contraseña: admin123                                      ║
║  📋 Rol: supervisor                                           ║
║  🔗 Redirige a: /supervisor/menu                              ║
║                                                                ║
║  PRACTICANTE (nuevo - ejecutar INSERT arriba):                ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                      ║
║  👤 Usuario: practicante2                                     ║
║  🔑 Contraseña: practica456                                   ║
║  📋 Rol: practicante                                          ║
║  🔗 Redirige a: /practicante/menu                             ║
║                                                                ║
╠═══════════════════════════════════════════════════════════════╣
║  ⚠️  NOTA IMPORTANTE:                                         ║
║  Las contraseñas están en texto plano solo para desarrollo.   ║
║  En producción usar bcrypt para hashear.                      ║
╚═══════════════════════════════════════════════════════════════╝

PARA EJECUTAR ESTE SCRIPT:
========================
Opción 1 - Desde terminal:
  psql -h kine-app-db.ccnqye4wgpbx.us-east-1.rds.amazonaws.com \
       -U admin_kine -d kine_app -f insert_usuarios.sql

Opción 2 - Copiar y pegar en pgAdmin o cliente PostgreSQL
*/

