# Sistema de Carga Aérea

Aplicación web para la administración de operaciones de carga aérea. El proyecto está organizado como un **monorepo** que integra:

- un backend REST desarrollado con **ASP.NET Core / .NET 10**;
- un frontend web desarrollado con **Next.js, React y TypeScript**;
- una base de datos **SQL Server** gestionada mediante **Entity Framework Core**.

El sistema permite administrar vuelos, encomiendas, personas, destinos, estados, roles y usuarios, además de controlar el ciclo operativo de los vuelos y la asignación de encomiendas.

---

## Contenido

- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos previos](#requisitos-previos)
- [Configuración de la base de datos](#configuración-de-la-base-de-datos)
- [Configuración del backend](#configuración-del-backend)
- [Configuración del frontend](#configuración-del-frontend)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Endpoints](#endpoints)
- [Autenticación](#autenticación)
- [Estados del sistema](#estados-del-sistema)
- [Reglas de negocio](#reglas-de-negocio)
- [Migraciones y seed](#migraciones-y-seed)
- [Compilación](#compilación)
- [Pruebas](#pruebas)
- [Errores frecuentes](#errores-frecuentes)
- [Git](#git)
- [Consideraciones de seguridad](#consideraciones-de-seguridad)

---

# Funcionalidades

## Autenticación

- Inicio de sesión mediante usuario y contraseña.
- Autenticación mediante **JWT**.
- Contraseñas almacenadas mediante hash con **BCrypt**.
- Sesión administrada desde el frontend mediante cookies.
- Protección de las rutas privadas del frontend.
- Protección de los endpoints del backend mediante `[Authorize]`.
- Cierre de sesión.
- Detección de sesión expirada.

## Gestión de vuelos

- Listado de vuelos.
- Consulta de vuelo por ID.
- Registro de vuelos.
- Edición de vuelos.
- Eliminación de vuelos.
- Inicio de un vuelo.
- Registro del aterrizaje.
- Cancelación de vuelos.
- Asignación de encomiendas a un vuelo.
- Control del peso máximo.
- Visualización del porcentaje de capacidad utilizada.
- Asociación de vuelos con destinos.

## Gestión de encomiendas

- Listado de encomiendas.
- Consulta por ID.
- Registro.
- Edición.
- Eliminación.
- Asignación a un vuelo.
- Liberación de una encomienda de su vuelo.
- Asociación con remitente y destinatario.
- Control del peso.
- Gestión de estados.

## Gestión de destinos

- Listado.
- Consulta por ID.
- Registro.
- Edición.
- Eliminación.
- Código IATA.
- País asociado.

## Gestión de personas

- Listado.
- Consulta por ID.
- Registro.
- Edición.
- Documento de identidad.
- Datos utilizados como remitente o destinatario de encomiendas.

## Gestión de usuarios

- Listado.
- Consulta por ID.
- Registro.
- Cambio de contraseña.
- Cambio de rol.
- Activación.
- Desactivación.

## Gestión de roles

- Listado.
- Consulta por ID.
- Registro.
- Edición.
- Eliminación.

## Gestión de estados

Se administran dos catálogos:

- Estados de encomienda.
- Estados de vuelo.

Ambos disponen de operaciones de consulta, creación, actualización y eliminación, respetando las restricciones de integridad definidas por la aplicación.

## Dashboard

El frontend incluye un dashboard que consulta información de:

- vuelos;
- encomiendas;
- personas;
- destinos.

También muestra información resumida sobre el estado de la operación y los vuelos registrados.

## Página pública

El frontend dispone de una página pública de presentación del sistema, accesible sin autenticación.

## Interfaz

- Diseño responsive.
- Componentes reutilizables.
- Formularios con validación.
- Tablas.
- Paginación.
- Diálogos de confirmación.
- Notificaciones de éxito y error.
- Estados de carga.
- Navegación protegida.

---

# Tecnologías

## Backend

- **C#**
- **.NET 10**
- **ASP.NET Core Web API**
- **Entity Framework Core 10**
- **SQL Server**
- **JWT Bearer Authentication**
- **BCrypt.Net-Next**
- **OpenAPI**
- Dependency Injection nativa de ASP.NET Core.

## Arquitectura backend

El backend está dividido en cuatro proyectos:

- `SistemaCargaAerea.Api`
- `SistemaCargaAerea.Application`
- `SistemaCargaAerea.Domain`
- `SistemaCargaAerea.Infrastructure`

La solución utiliza una separación por capas inspirada en **Clean Architecture**.

## Frontend

- **Next.js 16**
- **React 19**
- **TypeScript**
- **pnpm 11**
- **TanStack React Query**
- **TanStack React Table**
- **React Hook Form**
- **Zod**
- **Recharts**
- **Tailwind CSS 4**
- **shadcn**
- **Lucide React**
- **Sonner / Sileo** para notificaciones.

## Herramientas

- Git
- GitHub
- Node.js
- pnpm
- Visual Studio / Visual Studio Code
- SQL Server Management Studio

---

# Arquitectura

El repositorio utiliza una arquitectura de monorepo:

```text
                    ┌──────────────────────┐
                    │       Usuario        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Next.js / React    │
                    │     localhost:3000   │
                    └──────────┬───────────┘
                               │
                         HTTP / API
                               │
                               ▼
                    ┌──────────────────────┐
                    │   ASP.NET Core API   │
                    │     localhost:5278   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Entity Framework Core│
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      SQL Server      │
                    │ SistemaCargaAereaBD  │
                    └──────────────────────┘
```

## Flujo de una petición

```text
Frontend
   │
   │ fetch()
   ▼
Next.js API Route
   │
   │ Authorization: Bearer <JWT>
   ▼
ASP.NET Core Controller
   │
   ▼
Application Service
   │
   ▼
Repository / UnitOfWork
   │
   ▼
Entity Framework Core
   │
   ▼
SQL Server
```

---

# Estructura del repositorio

```text
sistema-carga-aerea-dotnet/
│
├── backend/
│   └── SistemaCargaAerea/
│       ├── SistemaCargaAerea.slnx
│       │
│       ├── SistemaCargaAerea.Api/
│       │   ├── Controllers/
│       │   ├── Extensions/
│       │   ├── Middlewares/
│       │   ├── Properties/
│       │   ├── Program.cs
│       │   ├── appsettings.json
│       │   └── SistemaCargaAerea.Api.csproj
│       │
│       ├── SistemaCargaAerea.Application/
│       │   ├── DTOs/
│       │   ├── Exceptions/
│       │   ├── Interfaces/
│       │   ├── Mappings/
│       │   ├── Services/
│       │   └── SistemaCargaAerea.Application.csproj
│       │
│       ├── SistemaCargaAerea.Domain/
│       │   ├── Entities/
│       │   ├── Enums/
│       │   └── SistemaCargaAerea.Domain.csproj
│       │
│       └── SistemaCargaAerea.Infrastructure/
│           ├── Data/
│           │   ├── Configurations/
│           │   └── Seeder/
│           ├── Migrations/
│           ├── Repositories/
│           ├── Security/
│           └── SistemaCargaAerea.Infrastructure.csproj
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (panel)/
│   │   │   ├── (public)/
│   │   │   └── api/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── providers/
│   │   └── types/
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
│
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── .gitignore
```

---

# Backend

## Domain

`SistemaCargaAerea.Domain` contiene el núcleo del dominio.

### Entidades

```text
Destino
Encomienda
EstadoEncomienda
EstadoVuelo
Persona
Rol
Usuario
Vuelo
```

### Enumeraciones

```text
EstadoEncomiendaClave
EstadoVueloClave
RolClave
```

Esta capa no depende de Entity Framework ni de ASP.NET Core.

---

## Application

`SistemaCargaAerea.Application` contiene la lógica de aplicación y las abstracciones.

Incluye:

- DTOs.
- Interfaces de repositorios.
- Interfaces de servicios.
- Interfaces de seguridad.
- Servicios de aplicación.
- Mapeos.
- Excepciones de aplicación.

Ejemplos:

```text
IEncomiendaService
IVueloService
IUsuarioService
IAuthService
```

y:

```text
IEncomiendaRepository
IVueloRepository
IUsuarioRepository
IUnitOfWork
```

---

## Infrastructure

`SistemaCargaAerea.Infrastructure` implementa los mecanismos concretos de persistencia y seguridad.

Incluye:

- `AppDbContext`.
- Configuraciones de Entity Framework Core.
- Migraciones.
- Repositorios.
- Unit of Work.
- Seeder.
- Hash de contraseñas.
- Generación y validación de tokens.

### Persistencia

La aplicación utiliza:

```text
Entity Framework Core
        +
SQL Server
```

---

## API

`SistemaCargaAerea.Api` expone la API REST.

Incluye:

- Controllers.
- Configuración de Dependency Injection.
- Configuración de JWT.
- Middleware global de excepciones.
- Configuración de ASP.NET Core.
- OpenAPI.

---

# Frontend

El frontend está desarrollado con **Next.js 16 + React 19 + TypeScript**.

## Rutas

### Públicas

```text
/
```

Página principal de presentación del sistema.

### Autenticación

```text
/login
```

Inicio de sesión.

### Panel

```text
/dashboard
/destinos
/encomiendas
/estados-encomienda
/estados-vuelo
/personas
/roles
/usuarios
/vuelos
```

Estas rutas requieren una sesión válida.

---

# Configuración del entorno

## Backend

El backend utiliza:

```text
backend/SistemaCargaAerea/SistemaCargaAerea.Api/appsettings.json
```

La configuración principal contiene:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "..."
  },
  "Jwt": {
    "Key": "...",
    "Issuer": "SistemaCargaAerea",
    "Audience": "SistemaCargaAereaClientes",
    "ExpirationMinutes": "60"
  }
}
```

## Frontend

El frontend necesita conocer la dirección del backend mediante:

```text
BACKEND_URL
```

Crea:

```text
frontend/.env.local
```

con:

```env
BACKEND_URL=http://localhost:5278
```

El frontend utiliza rutas API de Next.js como intermediario entre el navegador y ASP.NET Core.

Por ejemplo:

```text
Browser
   │
   ▼
/api/backend/Vuelos
   │
   ▼
BACKEND_URL/api/Vuelos
   │
   ▼
ASP.NET Core
```

Esto permite mantener el token de autenticación en cookies y reenviarlo al backend desde el servidor de Next.js.

---

# Requisitos previos

| Herramienta | Versión |
|---|---|
| .NET SDK | 10 |
| Node.js | Compatible con Next.js 16 |
| pnpm | 11.15.1 |
| SQL Server | Compatible con EF Core 10 |
| Git | Versión estable |

Para comprobar las instalaciones:

```powershell
dotnet --version
node --version
pnpm --version
git --version
```

Para comprobar los SDK de .NET instalados:

```powershell
dotnet --list-sdks
```

Debe existir un SDK `10.x`.

---

# Configuración de la base de datos

El backend utiliza SQL Server.

La cadena de conexión incluida para desarrollo local tiene esta estructura:

```text
Server=localhost;
Database=SistemaCargaAereaBD;
Trusted_Connection=True;
TrustServerCertificate=True;
MultipleActiveResultSets=True
```

Por lo tanto, se espera:

```text
Servidor: localhost
Base de datos: SistemaCargaAereaBD
Autenticación: Windows / Trusted Connection
```

Si tu instancia de SQL Server utiliza una configuración diferente, modifica `DefaultConnection` en:

```text
backend/SistemaCargaAerea/SistemaCargaAerea.Api/appsettings.json
```

Ejemplo para SQL Server con instancia:

```text
Server=localhost\SQLEXPRESS;
Database=SistemaCargaAereaBD;
Trusted_Connection=True;
TrustServerCertificate=True;
```

---

# Instalación

## 1. Clonar el repositorio

```powershell
git clone <URL_DEL_REPOSITORIO>
cd sistema-carga-aerea-dotnet
```

## 2. Restaurar dependencias

### Backend

Desde la raíz:

```powershell
dotnet restore backend/SistemaCargaAerea/SistemaCargaAerea.slnx
```

### Frontend

```powershell
pnpm --dir frontend install
```

También puedes instalar las dependencias del monorepo con:

```powershell
pnpm install
```

---

# Ejecución

## Ejecutar únicamente el backend

Desde la raíz:

```powershell
pnpm backend
```

Este comando utiliza:

```text
dotnet watch
```

y ejecuta:

```text
backend/SistemaCargaAerea/SistemaCargaAerea.Api/
```

La configuración de desarrollo define:

```text
http://localhost:5278
https://localhost:7289
```

## Ejecutar únicamente el frontend

Desde la raíz:

```powershell
pnpm frontend
```

El frontend de Next.js se ejecuta normalmente en:

```text
http://localhost:3000
```

## Ejecutar todo el monorepo

Desde la raíz:

```powershell
pnpm dev
```

El comando utiliza `concurrently` para iniciar simultáneamente:

```text
BACKEND
FRONTEND
```

Después abre:

```text
http://localhost:3000
```

---

# Login inicial

El `DatabaseSeeder` crea automáticamente un usuario administrador si todavía no existen usuarios.

Credenciales iniciales:

```text
Usuario: admin
Contraseña: Admin1234!
Rol: Administrador
```

El login se realiza mediante:

```http
POST /api/Auth/login
```

Ejemplo:

```json
{
  "username": "admin",
  "password": "Admin1234!"
}
```

> **Importante:** estas credenciales son las definidas actualmente por el código de desarrollo. Deben cambiarse antes de utilizar el sistema en un entorno real.

---

# Endpoints

Todos los endpoints, excepto el login, requieren autenticación mediante JWT.

## Autenticación

```http
POST /api/Auth/login
```

## Destinos

```http
GET    /api/Destinos
GET    /api/Destinos/{id}
POST   /api/Destinos
PUT    /api/Destinos/{id}
DELETE /api/Destinos/{id}
```

## Encomiendas

```http
GET    /api/Encomiendas
GET    /api/Encomiendas/{id}
POST   /api/Encomiendas
PUT    /api/Encomiendas/{id}
DELETE /api/Encomiendas/{id}
DELETE /api/Encomiendas/{id}/vuelo
```

## Estados de encomienda

```http
GET    /api/estados-encomienda
GET    /api/estados-encomienda/{id}
POST   /api/estados-encomienda
PUT    /api/estados-encomienda/{id}
DELETE /api/estados-encomienda/{id}
```

## Estados de vuelo

```http
GET    /api/estados-vuelo
GET    /api/estados-vuelo/{id}
POST   /api/estados-vuelo
PUT    /api/estados-vuelo/{id}
DELETE /api/estados-vuelo/{id}
```

## Personas

```http
GET    /api/Personas
GET    /api/Personas/{id}
POST   /api/Personas
PUT    /api/Personas/{id}
```

## Roles

```http
GET    /api/Roles
GET    /api/Roles/{id}
POST   /api/Roles
PUT    /api/Roles/{id}
DELETE /api/Roles/{id}
```

## Usuarios

```http
GET   /api/Usuarios
GET   /api/Usuarios/{id}
POST  /api/Usuarios
PATCH /api/Usuarios/{id}/password
PATCH /api/Usuarios/{id}/rol
POST  /api/Usuarios/{id}/activar
POST  /api/Usuarios/{id}/desactivar
```

## Vuelos

```http
GET  /api/Vuelos
GET  /api/Vuelos/{id}
POST /api/Vuelos
PUT  /api/Vuelos/{id}
DELETE /api/Vuelos/{id}

POST /api/Vuelos/{id}/iniciar
POST /api/Vuelos/{id}/aterrizar
POST /api/Vuelos/{id}/cancelar
POST /api/Vuelos/{id}/encomiendas
```

---

# Autenticación

El backend utiliza **JWT Bearer Authentication**.

El flujo es:

```text
1. Usuario ingresa usuario y contraseña
              │
              ▼
2. Next.js → /api/auth/login
              │
              ▼
3. Next.js → ASP.NET Core /api/Auth/login
              │
              ▼
4. ASP.NET Core valida credenciales
              │
              ▼
5. Se genera JWT
              │
              ▼
6. Next.js administra la sesión mediante cookie
              │
              ▼
7. Las peticiones protegidas incluyen el JWT
              │
              ▼
8. ASP.NET Core valida el token
```

La clave, issuer, audience y duración del token se configuran en:

```text
appsettings.json
```

---

# Estados del sistema

## Estados de vuelo

Los estados iniciales sembrados por el sistema son:

```text
Programado
En vuelo
Aterrizado
Cancelado
```

## Estados de encomienda

Los estados iniciales son:

```text
En almacén
Asignada
Embarcada
```

## Roles

Los roles iniciales son:

```text
Administrador
Operador
```

---

# Reglas de negocio

El dominio contiene reglas para evitar operaciones inválidas.

## Destinos

- El nombre es obligatorio.
- El código IATA es obligatorio.
- El código IATA debe tener exactamente tres caracteres.
- El código IATA se normaliza a mayúsculas.
- No se permite eliminar un destino que tenga vuelos asociados.

## Encomiendas

- Una nueva encomienda inicia en `En almacén`.
- El código de encomienda debe ser único.
- Remitente y destinatario deben existir.
- Una encomienda solo puede eliminarse cuando está en almacén.
- Una encomienda puede asignarse a un vuelo.
- Al asignarla, se actualiza el estado correspondiente.
- Se puede liberar una encomienda de un vuelo.

## Vuelos

- El código de vuelo debe ser único.
- El destino debe existir.
- El peso máximo debe ser mayor que cero.
- Un vuelo nuevo inicia en estado `Programado`.
- Solo un vuelo programado puede modificarse.
- Un vuelo solo puede eliminarse si permanece en estado programado y no tiene encomiendas asociadas.
- Un vuelo puede pasar a `En vuelo`.
- Un vuelo puede pasar a `Aterrizado`.
- Un vuelo puede ser cancelado mientras su estado lo permita.
- Las encomiendas asignadas se controlan mediante el peso acumulado del vuelo.

## Usuarios

- El nombre de usuario debe ser único.
- Las contraseñas se almacenan mediante hash BCrypt.
- Se puede cambiar la contraseña.
- Se puede cambiar el rol.
- Los usuarios pueden activarse y desactivarse.
- Un usuario desactivado no puede autenticarse.

## Catálogos

No se permite eliminar estados o roles que todavía estén siendo utilizados por otras entidades.

---

# Migraciones y seed

El proyecto utiliza **Entity Framework Core Migrations**.

La migración inicial se encuentra en:

```text
backend/SistemaCargaAerea/SistemaCargaAerea.Infrastructure/Migrations/
```

La aplicación ejecuta automáticamente:

```csharp
await _context.Database.MigrateAsync(ct);
```

al iniciar.

Después ejecuta el `DatabaseSeeder`, que crea inicialmente:

- estados de encomienda;
- estados de vuelo;
- roles;
- usuario administrador.

Por ello, normalmente no es necesario ejecutar manualmente la migración al levantar el proyecto por primera vez.

## Crear una nueva migración

Desde la raíz:

```powershell
dotnet ef migrations add NombreDeLaMigracion `
  --project backend/SistemaCargaAerea/SistemaCargaAerea.Infrastructure `
  --startup-project backend/SistemaCargaAerea/SistemaCargaAerea.Api
```

## Aplicar migraciones

```powershell
dotnet ef database update `
  --project backend/SistemaCargaAerea/SistemaCargaAerea.Infrastructure `
  --startup-project backend/SistemaCargaAerea/SistemaCargaAerea.Api
```

Si `dotnet ef` no está instalado:

```powershell
dotnet tool install --global dotnet-ef
```

---

# OpenAPI

En entorno de desarrollo, ASP.NET Core expone el documento OpenAPI mediante:

```text
/openapi/v1.json
```

Con el backend ejecutándose en HTTP:

```text
http://localhost:5278/openapi/v1.json
```

La configuración está habilitada mediante:

```csharp
builder.Services.AddOpenApi();
```

y:

```csharp
app.MapOpenApi();
```

---

# Compilación

## Backend

```powershell
dotnet build backend/SistemaCargaAerea/SistemaCargaAerea.slnx
```

## Frontend

```powershell
pnpm --dir frontend build
```

## Todo el proyecto

El comando conceptual es:

```powershell
pnpm build
```

pero debe tenerse en cuenta que los scripts de raíz incluidos actualmente en `package.json` utilizan una ruta de solución antigua (`backend/SistemaCargaAerea.sln`). La solución real del repositorio es:

```text
backend/SistemaCargaAerea/SistemaCargaAerea.slnx
```

Por ello, para garantizar una compilación correcta se recomienda utilizar los comandos directos mostrados arriba hasta actualizar esos scripts.

---

# Pruebas

## Backend

El repositorio no incluye actualmente un proyecto de pruebas separado visible en la solución.

El script de raíz:

```powershell
pnpm test:backend
```

está configurado para utilizar una ruta antigua de la solución y debe actualizarse si se desea utilizarlo.

## Frontend

El `package.json` actual del frontend no define un script `test`.

Por lo tanto, el comando:

```powershell
pnpm test:frontend
```

no está disponible de forma funcional en el estado actual del repositorio.

---

# Scripts del monorepo

El `package.json` de la raíz define los siguientes comandos:

| Comando | Función |
|---|---|
| `pnpm backend` | Ejecuta el backend con `dotnet watch` |
| `pnpm frontend` | Ejecuta Next.js |
| `pnpm dev` | Ejecuta backend y frontend simultáneamente |
| `pnpm restore:backend` | Restauración del backend; revisar ruta de solución actual |
| `pnpm restore:frontend` | Instala dependencias del frontend |
| `pnpm restore` | Ejecuta ambas restauraciones |
| `pnpm build:backend` | Compila el backend; revisar ruta de solución actual |
| `pnpm build:frontend` | Compila el frontend |
| `pnpm build` | Compila backend y frontend |
| `pnpm test:backend` | Pruebas backend; actualmente apunta a una ruta de solución antigua |
| `pnpm test:frontend` | Pruebas frontend; actualmente no existe script `test` en frontend |
| `pnpm test` | Ejecuta las pruebas configuradas |

---

# Errores frecuentes

## `BACKEND_URL` no configurado

Si Next.js muestra:

```text
No se configuró BACKEND_URL
```

crea:

```text
frontend/.env.local
```

con:

```env
BACKEND_URL=http://localhost:5278
```

Después reinicia Next.js.

---

## Error de conexión con SQL Server

Comprueba:

1. Que SQL Server esté iniciado.
2. Que el servidor utilizado coincida con `DefaultConnection`.
3. Que exista la base de datos o que el usuario tenga permisos para crearla.
4. Que `Trusted_Connection=True` sea compatible con tu configuración.

---

## `dotnet` no se reconoce

Instala el **.NET 10 SDK** y verifica:

```powershell
dotnet --version
```

---

## `pnpm` no se reconoce

Instala pnpm:

```powershell
npm install --global pnpm
```

Después reinicia la terminal.

---

## El frontend carga pero no puede comunicarse con el backend

Comprueba:

```text
Backend:  http://localhost:5278
Frontend: http://localhost:3000
```

y verifica:

```text
frontend/.env.local
```

Debe contener:

```env
BACKEND_URL=http://localhost:5278
```

---

## Error 401 Unauthorized

Significa que el endpoint requiere autenticación y el token no está disponible, expiró o no es válido.

Comprueba:

- que hayas iniciado sesión;
- que la sesión no haya expirado;
- que el backend esté utilizando la misma configuración JWT;
- que `BACKEND_URL` sea correcto.

---

# Git

Para comprobar los cambios:

```powershell
git status
```

Agregar archivos:

```powershell
git add .
```

Crear commit:

```powershell
git commit -m "feat: descripción del cambio"
```

Subir cambios:

```powershell
git push
```

Antes de hacer `git add .`, comprueba que no estés agregando archivos con secretos o credenciales.

---

# Consideraciones de seguridad

El repositorio actual contiene valores de desarrollo en `appsettings.json`, incluyendo una clave JWT y credenciales iniciales del usuario administrador.

Para producción se recomienda:

- mover secretos a variables de entorno o un gestor de secretos;
- no almacenar claves JWT reales en el repositorio;
- cambiar la contraseña inicial del administrador;
- utilizar HTTPS;
- configurar correctamente `AllowedHosts`;
- utilizar una cadena de conexión segura;
- separar configuraciones de desarrollo y producción;
- no subir `.env.local`;
- no publicar archivos con credenciales.

El archivo:

```text
frontend/.env.local
```

debe permanecer fuera del control de versiones.

---

# Resumen de ejecución

Después de clonar y configurar SQL Server:

```powershell
cd sistema-carga-aerea-dotnet

pnpm install

dotnet restore backend/SistemaCargaAerea/SistemaCargaAerea.slnx

# Crear frontend/.env.local:
# BACKEND_URL=http://localhost:5278

pnpm dev
```

Luego abrir:

```text
http://localhost:3000
```

Credenciales iniciales:

```text
Usuario: admin
Contraseña: Admin1234!
```

---
