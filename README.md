[🇨🇴 Español](#español) · [🇺🇸 English](#english)

---

## <a name="español">🇨🇴 Español</a>

# Backend TaillorFlow - ERP para Producción Personalizada

Backend para **TaillorFlow**, un sistema ERP especializado en gestión de producción **personalizada** con trazabilidad completa de pedidos. Desarrollado con **NestJS** y **TypeORM**, proporciona una API REST para la administración de órdenes, productos personalizados e ingreso manual de especificaciones, con asignación automática de tareas según carga de trabajo.

---

## 1. DESCRIPCIÓN GENERAL

TaillorFlow es una solución empresarial para **empresas que fabrican productos personalizados** (muebles, prendas de vestir, artículos especiales, etc.).

### Características Principales:

- **Ingreso manual de productos personalizados** - Cada producto se registra con especificaciones únicas (tela, dimensiones, referencias fotográficas)
- **Flujos de trabajo configurables** - Líneas de producción secuenciadas por categoría (Corte → Confección → Empaque)
- **Asignación automática de tareas** - Sistema que asigna productos al empleado con menor carga de trabajo en cada rol/área
- **Trazabilidad completa** - Seguimiento de cada pedido a través de múltiples productos y tareas
- **Gestión de clientes** - Registro de clientes vinculados a sus órdenes
- **Control de fechas estimadas** - Sistema de validación de fechas de entrega

---

## 2. FLUJO DE TRABAJO OPERATIVO

### Proceso desde la perspectiva del Administrador:

```
1. CONFIGURACIÓN INICIAL (Solo Admin)
   ├─ Crear Áreas → Espacios de producción (Corte, Confección, Empaque, etc.)
   ├─ Crear Roles → Puestos de trabajo (Cortador, Costurero, Empacador, etc.)
   ├─ Crear Empleados → Asignar rol + área a cada trabajador
   ├─ Crear Categorías → Tipos de productos (Camisas, Pantalones, etc.)
   └─ Crear Flujos → Secuencia de roles para cada categoría

2. INGRESO DE PEDIDOS (Solo Admin)
   ├─ Registrar Cliente (si es nuevo)
   ├─ Crear Orden vinculada a cliente
   ├─ Crear Producto(s) con especificaciones personalizadas
   │  (tela, dimensiones, referencias fotográficas, descripción)
   └─ Sistema crea automáticamente tareas según flujo

3. PRODUCCIÓN (Operarios con roles específicos)
   ├─ Ver tareas asignadas
   ├─ Iniciar tarea (cambiar estado a IN PROCESS)
   ├─ Completar tarea (cambiar estado a FINISHED)
   └─ Sistema automáticamente:
      ├─ Valida que tarea anterior esté completada
      ├─ Actualiza estado del producto
      └─ Actualiza estado de la orden

4. SEGUIMIENTO (Solo Admin)
   ├─ Revisar estado de órdenes y productos
   └─ Ver progreso de tareas en cada área
```

---

## 3. STACK TECNOLÓGICO

### Backend
- **NestJS** 11.0.1 - Framework Node.js progresivo
- **TypeORM** 0.3.27 - ORM para TypeScript
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **Passport** - Estrategia de autenticación
- **Class Validator** - Validación de DTOs
- **bcrypt** - Hash de contraseñas

### Herramientas de Desarrollo
- **TypeScript** 5.7.3 - Tipado estático
- **Jest** 30.0.0 - Testing framework
- **ESLint** 9.18.0 - Linting
- **Prettier** 3.4.2 - Formateo de código

---

## 4. REQUISITOS PREVIOS

- **Node.js** >= 18.x
- **npm** >= 10.x o **yarn**
- **PostgreSQL** >= 14.x
- **Git** para clonar el repositorio

---

## 5. INSTALACIÓN Y CONFIGURACIÓN

### Clonar el repositorio
```bash
git clone https://github.com/aaronHenao/backend-tailorflow.git
cd backend-tailorflow
```

### Instalar dependencias
```bash
npm install
```

### Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=tailorflow_user
DB_PASSWORD=your_secure_password
DB_NAME=tailorflow_db

# Servidor
PORT=3000

# JWT
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# Entorno
NODE_ENV=development
```

### Crear base de datos
```bash
# Accede a PostgreSQL
psql -U postgres

# Dentro de psql:
CREATE DATABASE tailorflow_db;
CREATE USER tailorflow_user WITH PASSWORD 'your_secure_password';
ALTER ROLE tailorflow_user SET client_encoding TO 'utf8';
ALTER ROLE tailorflow_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE tailorflow_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE tailorflow_db TO tailorflow_user;
\q
```

---

## 6. ESTRUCTURA DEL PROYECTO

```
src/
├── common/
│   ├── decorators/
│   │   ├── get-user/
│   │   │   └── get-user.decorator.ts
│   │   └── roles/
│   │       └── roles.decorator.ts
│   ├── dto/
│   │   └── base-application-response.dto.ts
│   ├── entities/
│   │   └── state.entity.ts                # Estados: PENDING, IN PROCESS, FINISHED, DELAYED
│   └── modules/
│       └── auth/                          # Módulo de autenticación JWT
│           ├── auth.controller.ts
│           ├── auth.service.ts
│           ├── jwt.strategy/
│           ├── dto/
│           └── auth.module.ts
├── guards/
│   └── roles/
│       └── roles.guard.ts                 # Guard para validar roles
├── modules/
│   ├── roles/                             # Gestión de roles
│   ├── employees/                         # Gestión de empleados
│   ├── areas/                             # Áreas de producción
│   ├── categories/                        # Categorías de productos
│   ├── flows/                             # Flujos de trabajo secuenciados
│   ├── customers/                         # Gestión de clientes
│   ├── products/                          # Productos personalizados
│   ├── orders/                            # Órdenes de pedidos
│   └── tasks/                             # Tareas asignadas a empleados
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

---

## 7. ENTIDADES DEL SISTEMA

### 7.1 States (Estados Globales)
Define los posibles estados para órdenes, productos y tareas.

```typescript
enum StateName {
  PENDING = 'PENDING',           // Estado 1: Pendiente
  IN_PROCESS = 'IN PROCESS',     // Estado 2: En proceso
  FINISHED = 'FINISHED',         // Estado 3: Finalizado
  DELAYED = 'DELAYED'            // Estado 4: Retrasado
}
```

**Relaciones:**
- Tiene múltiples órdenes
- Tiene múltiples productos
- Tiene múltiples tareas

---

### 7.2 Role (Rol de Empleado)
Define los puestos de trabajo dentro de un área.

**Campos:**
- `id_role`: Identificador único
- `id_area`: Área donde aplica el rol
- `name`: Nombre del rol (ej: "Cortador", "Costurero", "Empacador")
- `description`: Descripción del rol

**Relaciones:**
- Pertenece a un Área
- Tiene múltiples Empleados
- Tiene múltiples Flows

**Permisos por Rol:**

| Operación | ADMIN | Otros Roles |
|-----------|-------|-------------|
| Listar roles | ✅ | ❌ |
| Ver rol | ✅ | ❌ |
| Crear rol | ✅ | ❌ |
| Actualizar rol | ✅ | ❌ |
| Eliminar rol | ✅ | ❌ |

**Endpoints:**
```bash
GET /roles/all                    # Listar todos los roles
GET /roles/:id                    # Obtener rol por ID
POST /roles                       # Crear nuevo rol
PATCH /roles/:id                  # Actualizar rol
DELETE /roles/:id                 # Eliminar rol
```

---

### 7.3 Area (Área de Producción)
Espacios físicos donde se ejecutan tareas en el proceso de producción.

**Campos:**
- `id_area`: Identificador único
- `name`: Nombre único del área (ej: "Corte", "Confección", "Empaque")

**Relaciones:**
- Tiene múltiples Roles
- Tiene múltiples Tasks

**Permisos por Rol:**

| Operación | ADMIN | Otros Roles |
|-----------|-------|-------------|
| Listar áreas | ✅ | ❌ |
| Ver área | ✅ | ❌ |
| Crear área | ✅ | ❌ |
| Actualizar área | ✅ | ❌ |
| Eliminar área | ✅ | ❌ |

**Endpoints:**
```bash
GET /areas/all                    # Listar todas las áreas
GET /areas/:id                    # Obtener área por ID
POST /areas                       # Crear nueva área
PATCH /areas/:id                  # Actualizar área
DELETE /areas/:id                 # Eliminar área
```

---

### 7.4 Employee (Empleado)
Trabajadores del sistema asignados a un rol en un área.

**Campos:**
- `id_employee`: Identificador único
- `id_role`: Rol del empleado
- `cc`: Cédula de identidad (única)
- `name`: Nombre del empleado
- `password`: Contraseña encriptada con bcrypt
- `state`: ACTIVE o INACTIVE

**Relaciones:**
- Pertenece a un Role
- Tiene múltiples Tasks

**Permisos por Rol:**

| Operación | ADMIN | Otros Roles |
|-----------|-------|-------------|
| Listar empleados | ✅ | ❌ |
| Ver empleado | ✅ | ✅ |
| Crear empleado | ✅ | ❌ |
| Actualizar empleado | ✅ | ❌ |
| Desactivar empleado | ✅ | ❌ |

**Endpoints:**
```bash
GET /employees/all                # Listar todos los empleados (ADMIN)
GET /employees/:id                # Obtener empleado por ID (cualquiera autenticado)
GET /employees/cc/:cc             # Obtener empleado por cédula (cualquiera autenticado)
POST /employees                   # Crear empleado (ADMIN)
PATCH /employees/:id              # Actualizar empleado (ADMIN)
DELETE /employees/:id             # Desactivar empleado (ADMIN)
```

---

### 7.5 Category (Categoría de Producto)
Tipos de productos que la empresa fabrica.

**Campos:**
- `id_category`: Identificador único
- `name`: Nombre único (ej: "Camisas Personalizadas", "Muebles")
- `description`: Descripción

**Relaciones:**
- Tiene múltiples Flows
- Tiene múltiples Products

**Permisos por Rol:**

| Operación | ADMIN | Otros Roles |
|-----------|-------|-------------|
| Listar categorías | ✅ | ❌ |
| Ver categoría | ✅ | ❌ |
| Crear categoría | ✅ | ❌ |
| Actualizar categoría | ✅ | ❌ |
| Eliminar categoría | ✅ | ❌ |

**Endpoints:**
```bash
GET /categories/all               # Listar todas las categorías
GET /categories/:id               # Obtener categoría por ID
POST /categories                  # Crear categoría
PATCH /categories/:id             # Actualizar categoría
DELETE /categories/:id            # Eliminar categoría
```

---

### 7.6 Flow (Flujo de Producción)
Define la secuencia de roles por los que pasa un producto según su categoría.

**Concepto:** Un flujo define qué roles en qué orden deben procesar un producto de una categoría.

**Campos:**
- `id_flow`: Identificador único
- `id_category`: Categoría a la que pertenece
- `id_role`: Rol responsable en este paso
- `sequence`: Orden de ejecución (1, 2, 3...)

**Ejemplo de Flujo para "Camisas Personalizadas":**
```
Flujo 1: sequence=1, role=CORTADOR
Flujo 2: sequence=2, role=COSTURERO
Flujo 3: sequence=3, role=EMPACADOR
```

**Relaciones:**
- Pertenece a una Category
- Pertenece a un Role

**Validaciones:**
- No puede haber duplicate: misma categoría + mismo rol
- No puede haber duplicate: misma categoría + misma secuencia
- No puede eliminarse una vez creado

**Permisos por Rol:**

| Operación | ADMIN | Otros Roles |
|-----------|-------|-------------|
| Listar flujos | ✅ | ❌ |
| Ver flujo | ✅ | ❌ |
| Crear flujo | ✅ | ❌ |
| Actualizar flujo | ✅ | ❌ |
| Eliminar flujo | ✅ | ❌ |

**Endpoints:**
```bash
GET /flows/all                    # Listar todos los flujos
GET /flows/:id                    # Obtener flujo por ID
POST /flows                       # Crear flujo
PATCH /flows/:id                  # Actualizar flujo
DELETE /flows                     # No disponible (retorna error)
```

---

### 7.7 Customer (Cliente)
Personas que solicitan productos personalizados.

**Campos:**
- `id_customer`: Identificador único
- `name`: Nombre único del cliente
- `address`: Dirección (opcional)
- `phone`: Teléfono

**Relaciones:**
- Tiene múltiples Orders

**Permisos por Rol:**

| Operación | ADMIN | Otros Roles |
|-----------|-------|-------------|
| Listar clientes | ✅ | ❌ |
| Ver cliente | ✅ | ❌ |
| Crear cliente | ✅ | ❌ |
| Actualizar cliente | ✅ | ❌ |

**Endpoints:**
```bash
GET /customers/all                # Listar todos los clientes
GET /customers/:id                # Obtener cliente por ID
POST /customers                   # Crear cliente
PATCH /customers/:id              # Actualizar cliente
```

---

### 7.8 Order (Orden de Pedido)
Agrupación de productos personalizados para un cliente.

**Campos:**
- `id_order`: Identificador único
- `id_state`: Estado actual (PENDING, IN_PROCESS, FINISHED, DELAYED)
- `id_customer`: Cliente que hace el pedido
- `entry_date`: Fecha de creación (automática)
- `estimated_delivery_date`: Fecha estimada de entrega

**Relaciones:**
- Pertenece a un State
- Pertenece a un Customer
- Tiene múltiples Products

**Estados:**
```
PENDING (1)      → Orden creada, sin productos en proceso
IN_PROCESS (2)   → Al menos un producto en proceso
FINISHED (3)     → Todos los productos finalizados
DELAYED (4)      → (Validación: si hoy > estimated_delivery_date y state != FINISHED)
```

**Validaciones:**
- La fecha estimada no puede ser menor que la fecha actual
- La fecha estimada no puede ser menor que la fecha de ingreso

**Actualización de estado (automática):**
- El sistema actualiza el estado según el estado de los productos
- Si todos los productos están FINISHED → orden pasa a FINISHED
- Si algún producto está IN_PROCESS → orden pasa a IN_PROCESS
- Si todos los productos están PENDING → orden permanece PENDING

**Permisos por Rol:**

| Operación | ADMIN | Otros Roles |
|-----------|-------|-------------|
| Listar órdenes | ✅ | ❌ |
| Ver orden | ✅ | ❌ |
| Crear orden | ✅ | ❌ |
| Actualizar fecha estimada | ✅ | ❌ |

**Endpoints:**
```bash
GET /orders/all                   # Listar todas las órdenes
GET /orders/:id                   # Obtener orden con todos sus productos
POST /orders                      # Crear orden
PATCH /orders/:id                 # Actualizar fecha estimada
```

---

### 7.9 Product (Producto Personalizado)
Productos únicos creados manualmente con especificaciones específicas.

**Campos:**
- `id_product`: Identificador único
- `id_order`: Orden a la que pertenece
- `id_category`: Categoría del producto
- `id_state`: Estado actual (hereda del State)
- `name`: Nombre descriptivo (ej: "Camisa Azul Talla M Logo Empresa")
- `ref_photo`: URL o referencia de foto (opcional)
- `dimensions`: Dimensiones del producto (opcional, ej: "20x30x50cm")
- `fabric`: Material o tela (opcional, ej: "Algodón 100%")
- `description`: Descripción detallada de especificaciones

**Relaciones:**
- Pertenece a una Order
- Pertenece a una Category
- Pertenece a un State
- Tiene múltiples Tasks

**Validaciones:**
- No puede actualizarse si ya está en producción (state != PENDING)

**Actualización de estado (automática):**
- El sistema actualiza el estado según el estado de las tareas del producto
- Si todas las tareas están FINISHED → producto pasa a FINISHED
- Si alguna tarea está IN_PROCESS → producto pasa a IN_PROCESS
- Si todas las tareas están PENDING → producto permanece PENDING

**Creación automática de tareas:**
Cuando se crea un producto, el sistema:
1. Busca el flujo de la categoría ordenado por secuencia
2. Para cada paso del flujo crea una tarea
3. Asigna cada tarea al empleado con menor carga de trabajo en ese rol

**Permisos por Rol:**

| Operación | ADMIN | Otros Roles |
|-----------|-------|-------------|
| Listar productos | ✅ | ❌ |
| Ver producto | ✅ | ✅ |
| Crear producto | ✅ | ❌ |
| Actualizar producto | ✅ | ❌ |

**Endpoints:**
```bash
GET /products                     # Listar todos los productos
GET /products/:id                 # Obtener producto (ADMIN o Operarios específicos)
POST /products                    # Crear producto (crea automáticamente tareas)
PATCH /products/:id               # Actualizar producto (solo si state=PENDING)
```

---

### 7.10 Task (Tarea)
Pasos individuales que un empleado debe completar para procesar un producto.

**Campos:**
- `id_task`: Identificador único
- `id_product`: Producto que se está procesando
- `id_employee`: Empleado asignado (puede ser NULL al inicio)
- `id_area`: Área donde se ejecuta
- `id_state`: Estado de la tarea (PENDING=1, IN_PROCESS=2, FINISHED=3)
- `sequence`: Orden dentro del producto (1, 2, 3...)
- `start_date`: Fecha cuando el empleado inicia la tarea
- `end_date`: Fecha cuando se completa la tarea

**Relaciones:**
- Pertenece a un Product
- Pertenece a un Employee (puede ser NULL)
- Pertenece a un Area
- Pertenece a un State

**Validaciones:**
- Única combinación: misma orden + misma secuencia
- Solo se puede iniciar si la tarea anterior está FINISHED
- Solo el empleado asignado puede iniciar/completar la tarea
- No puede iniciarse si ya está en proceso
- No puede completarse si no está en proceso

**Flujo de estados:**
```
PENDING (1) 
    ↓ (startTask)
IN_PROCESS (2)
    ↓ (completeTask)
FINISHED (3)
```

**Permisos por Rol:**

| Operación | ADMIN | Operarios |
|-----------|-------|-----------|
| Listar todas las tareas | ✅ | ✅ |
| Ver tarea | ✅ | ✅ |
| Ver mis tareas | ✅ | ✅ |
| Iniciar tarea | ❌ | ✅ |
| Completar tarea | ❌ | ✅ |
| Ver tareas de un producto | ✅ | ✅ |

**Endpoints:**
```bash
GET /tasks                        # Listar todas las tareas (ADMIN + Operarios)
GET /tasks/assigned               # Ver mis tareas asignadas (Operarios)
GET /tasks/:id                    # Obtener tarea por ID (Operarios)
PATCH /tasks/:id/start            # Iniciar tarea (Operarios)
PATCH /tasks/:id/complete         # Completar tarea (Operarios)
GET /tasks/:id/product-tasks      # Ver todas las tareas de un producto (Operarios)
```

---

## 8. AUTENTICACIÓN Y AUTORIZACIÓN

### 8.1 Login (Sin autenticación)

**Endpoint:**
```bash
POST /auth/login
```

**Request:**
```json
{
  "cc": "1234567890",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "id_employee": 1,
    "cc": "1234567890",
    "name": "Juan Pérez",
    "state": "ACTIVE",
    "role": {
      "id_role": 1,
      "name": "ADMIN",
      "description": "Administrador del sistema"
    }
  }
}
```

**Token características:**
- Válido por **1 hora**
- Incluye: `sub` (id_employee), `cc`, `id_rol`
- Debe enviarse en header: `Authorization: Bearer <token>`

---

### 8.2 Autorización basada en Roles

El sistema valida roles mediante:

- **@Roles()**: Decorador que especifica qué roles acceden a un endpoint
- **RolesGuard**: Valida que el usuario tenga el rol requerido
- **AuthGuard('jwt')**: Valida que el token sea válido

**Roles específicos del sistema:**
- `ADMIN`: Acceso completo a administración
- `Esqueletería`, `Corte`, `Tapicero`, `Costurero`, `Pintor`: Roles operacionales

---

## 9. FLUJO OPERATIVO COMPLETO (Basado en Código Real)

### Paso 1: Configuración Inicial (Solo Admin)

```bash
# 1. Crear Áreas
POST /areas
{
  "name": "Corte"
}

POST /areas
{
  "name": "Confección"
}

POST /areas
{
  "name": "Empaque"
}

# 2. Crear Roles (vinculados a áreas)
POST /roles
{
  "id_area": 1,
  "name": "Cortador",
  "description": "Responsable de corte"
}

POST /roles
{
  "id_area": 2,
  "name": "Costurero",
  "description": "Responsable de confección"
}

# 3. Crear Empleados
POST /employees
{
  "id_role": 1,
  "cc": "1001234567",
  "name": "Carlos López",
  "password": "securePass123"
}

POST /employees
{
  "id_role": 2,
  "cc": "1001234568",
  "name": "María García",
  "password": "securePass123"
}

# 4. Crear Categoría
POST /categories
{
  "name": "Camisas Personalizadas",
  "description": "Camisas confeccionadas bajo especificaciones del cliente"
}

# 5. Crear Flujo de Producción para Camisas
POST /flows
{
  "id_role": 1,
  "id_category": 1,
  "sequence": 1
}

POST /flows
{
  "id_role": 2,
  "id_category": 1,
  "sequence": 2
}
```

### Paso 2: Ingresar Pedido

```bash
# 1. Crear Cliente
POST /customers
{
  "name": "Confecciones ABC",
  "phone": "3001234567",
  "address": "Calle 10 #5-20"
}

# 2. Crear Orden
POST /orders
{
  "id_customer": 1,
  "estimated_delivery_date": "2024-03-01T00:00:00Z"
}

# 3. Crear Producto Personalizado
POST /products
{
  "id_order": 1,
  "id_category": 1,
  "name": "Camisa Azul Talla M",
  "fabric": "Algodón 100%",
  "dimensions": "Talla M",
  "description": "Camisa azul royal con botones negros",
  "ref_photo": "https://..."
}

# Sistema automáticamente:
# ✅ Busca flujo de categoría 1
# ✅ Crea 2 tareas (seq 1 y 2)
# ✅ Asigna tarea 1 a empleado con menor carga en rol CORTADOR
# ✅ Asigna tarea 2 a empleado con menor carga en rol COSTURERO
# ✅ Actualiza estado de orden a PENDING
```

### Paso 3: Ejecución de Tareas (Operarios)

```bash
# Operario Carlos (CORTADOR) hace login
POST /auth/login
{
  "cc": "1001234567",
  "password": "securePass123"
}

# Recibe token...

# Ver mis tareas
GET /tasks/assigned
Header: Authorization: Bearer <token>

# Response:
{
  "statusCode": 200,
  "message": "Tareas asignadas obtenidas correctamente",
  "data": [
    {
      "id_task": 1,
      "id_product": 1,
      "id_employee": 1,
      "id_area": 1,
      "id_state": 1,
      "sequence": 1,
      "start_date": null,
      "end_date": null,
      "product": {
        "name": "Camisa Azul Talla M",
        "description": "Camisa azul..."
      }
    }
  ]
}

# Iniciar tarea
PATCH /tasks/1/start
Header: Authorization: Bearer <token>

# Sistema:
# ✅ Cambia estado a IN_PROCESS (2)
# ✅ Registra start_date
# ✅ Actualiza estado del producto a IN_PROCESS
# ✅ Actualiza estado de la orden a IN_PROCESS

# Completar tarea
PATCH /tasks/1/complete
Header: Authorization: Bearer <token>

# Sistema:
# ✅ Valida que empleado sea el asignado
# ✅ Valida que estado sea IN_PROCESS
# ✅ Cambia estado a FINISHED (3)
# ✅ Registra end_date
# ✅ Valida y actualiza estado del producto
# ✅ Valida y actualiza estado de la orden

# Siguiente operario (María) recibe su tarea automáticamente
```

---

## 10. ALGORITMO DE ASIGNACIÓN DE TAREAS

Cuando se crea un producto, el sistema:

1. **Obtiene el flujo** de su categoría ordenado por secuencia
2. **Para cada paso del flujo:**
   - Obtiene todos los empleados del rol requerido
   - **Calcula carga de trabajo:**
     - Cuenta tareas PENDING + IN_PROCESS por empleado
   - **Selecciona empleado con menor carga**
   - Crea tarea y la asigna

**Código relevante (ProductsService):**
```typescript
for(const flow of flows){
  const task = await this.tasksService.createTask({
    id_product: savedProduct.id_product, 
    id_area: flow.role.id_area, 
    sequence: flow.sequence, 
    id_state: 1
  });
  
  const employee = await this.employeesService.findEmployeeWithLeastWorkload(flow.id_role);
  await this.tasksService.assignEmployee(task.id_task, employee.id_employee);
}
```

---

## 11. ACTUALIZACIÓN AUTOMÁTICA DE ESTADOS

### Task → Product
Cuando se completa una tarea del producto:
- Si **TODAS las tareas = FINISHED** → Product = FINISHED
- Si **ALGUNA tarea = IN_PROCESS** → Product = IN_PROCESS
- Si **TODAS las tareas = PENDING** → Product = PENDING

### Product → Order
Cuando cambia el estado de un producto:
- Si **TODOS los productos = FINISHED** → Order = FINISHED
- Si **ALGÚN producto = IN_PROCESS** → Order = IN_PROCESS
- Si **TODOS los productos = PENDING** → Order = PENDING

**Validación de secuencia de tareas:**
Un empleado solo puede iniciar una tarea si:
1. La tarea anterior está FINISHED
2. O es la primera tarea (sequence = 1)

---

## 12. RESUMEN DE PERMISOS

### 👨‍💼 Usuario con Rol ADMIN
**Tiene acceso COMPLETO a:**
- ✅ CRUD de roles
- ✅ CRUD de áreas
- ✅ CRUD de empleados
- ✅ CRUD de categorías
- ✅ CRUD de flujos (creación, actualización, lectura - NO puede eliminar)
- ✅ CRUD de clientes
- ✅ CRUD de órdenes (crear, leer, actualizar fecha estimada)
- ✅ CRUD de productos (crear automáticamente genera tareas)
- ✅ Listar todas las tareas del sistema
- ✅ Ver detalles de cualquier tarea

### 👷 Usuario con Rol Operacional (Cortador, Costurero, etc.)
**Tiene acceso LIMITADO a:**
- ✅ Ver sus tareas asignadas
- ✅ Iniciar sus tareas asignadas
- ✅ Completar sus tareas asignadas
- ✅ Ver detalles del producto que está procesando
- ✅ Ver secuencia de tareas del producto
- ✅ Autenticarse y cambiar contraseña
- ❌ Ver órdenes, clientes, otros productos
- ❌ Crear o modificar órdenes/productos
- ❌ Ver tareas de otros empleados
- ❌ Acceder a configuración del sistema

---

## 13. EJECUCIÓN DEL PROYECTO

### Modo desarrollo con hot-reload
```bash
npm run start:dev
```

### Modo producción
```bash
npm run build
npm run start:prod
```

### Modo debug
```bash
npm run start:debug
```

El servidor estará disponible en `http://localhost:3000`

---

## 14. TESTING

### Ejecutar todos los tests
```bash
npm run test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

### Ejecutar tests con cobertura
```bash
npm run test:cov
```

### Ejecutar tests E2E
```bash
npm run test:e2e
```

---

## 15. ESTADO DEL PROYECTO

- [x] Estructura base con módulos principales
- [x] Autenticación JWT implementada
- [x] Sistema de roles y autorización
- [x] CRUD de roles, áreas, empleados, categorías
- [x] CRUD de flujos (sin eliminación)
- [x] CRUD de clientes y órdenes
- [x] Creación de productos con tareas automáticas
- [x] Sistema de asignación por carga de trabajo
- [x] Actualización automática de estados (tareas → productos → órdenes)
- [x] Validación de secuencia de tareas
- [x] Endpoints para operarios (iniciar/completar tareas)
- [ ] Implementar detección de retrasos (fechas)
- [ ] Notificaciones a clientes
- [ ] Reportes de productividad
- [ ] Dashboard en tiempo real

**Versión Actual:** 0.0.1 (Desarrollo inicial)

---

## 16. VARIABLES DE ENTORNO

```env
# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=tailorflow_user
DB_PASSWORD=secure_password_123
DB_NAME=tailorflow_db

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=mi_clave_secreta_super_larga_y_segura_2024
```

---

## 17. COMANDOS ÚTILES

### Linting y Formateo
```bash
npm run lint        # Ejecutar ESLint
npm run format      # Formatear código con Prettier
```

### Compilación
```bash
npm run build       # Compilar TypeScript
```

### Limpieza
```bash
rm -rf dist/        # Limpiar carpeta de compilación
rm -rf coverage/    # Limpiar reportes de cobertura
```

---

## 18. SOLUCIÓN DE PROBLEMAS

### Error: "No hay flujos configurados para la categoría"
- Verificar que se crearon flujos para la categoría del producto
- Los flujos deben estar ordenados por secuencia

### Error: "La tarea anterior aún no ha sido completada"
- Las tareas deben completarse en orden secuencial
- Verificar que la tarea anterior (sequence-1) esté en estado FINISHED

### Error: "Solo el empleado asignado puede iniciar esta tarea"
- Solo el empleado asignado puede iniciar/completar la tarea
- Verificar que el token JWT pertenece al empleado correcto

### Error: "No existen tareas"
- No hay tareas en el sistema
- Crear un producto para generar tareas automáticamente

### El producto no pasa a FINISHED
- Verificar que todas las tareas estén FINISHED
- Las tareas deben completarse en orden secuencial

---

## 19. CONTRIBUCIÓN

1. Fork el repositorio
2. Crear rama para tu feature: `git checkout -b feature/mi-feature`
3. Commit cambios: `git commit -m 'Add mi-feature'`
4. Push a la rama: `git push origin feature/mi-feature`
5. Abrir Pull Request

---

## 20. LICENCIA

UNLICENSED - Proyecto privado

---

## 21. CONTACTO Y SOPORTE

Para consultas o soporte, contactar al propietario del repositorio: **aaronHenao**

---

**Última actualización:** Febrero 2026
**Rama principal:** `master`
**TypeScript:** 99.2% | JavaScript: 0.8%


---

## <a name="english">🇺🇸 English</a>

# TaillorFlow Backend - ERP for Customized Production

Backend for **TaillorFlow**, an ERP system specialized in **custom** production management with full order traceability. Developed with **NestJS** and **TypeORM**, it provides a REST API for order management, custom products, and manual specification entry, with automatic task assignment based on workload.

---

## 1. OVERVIEW

TaillorFlow is a business solution for **companies that manufacture custom products** (furniture, clothing, specialty items, etc.).

### Key Features:

- **Manual entry of custom products** - Each product is registered with unique specifications (fabric, dimensions, photo references)
- **Configurable workflows** - Production lines sequenced by category (Cutting → Sewing → Packaging)
- **Automatic task assignment** - System that assigns products to the employee with the lightest workload in each role/area
- **Full traceability** - Tracking of each order across multiple products and tasks
- **Customer management** - Registration of customers linked to their orders
- **Estimated date control** - Delivery date validation system

---

## 2. OPERATIONAL WORKFLOW

### Process from the Administrator’s perspective:

```
1. INITIAL SETUP (Admin Only)
   ├─ Create Areas → Production areas (Cutting, Sewing, Packaging, etc.)
   ├─ Create Roles → Job titles (Cutter, Seamstress, Packer, etc.)
   ├─ Create Employees → Assign a role and area to each worker
   ├─ Create Categories → Product types (Shirts, Pants, etc.)
   └─ Create Workflows → Role sequence for each category

2. ORDER ENTRY (Admin Only)
   ├─ Register Customer (if new)
   ├─ Create Order linked to customer
   ├─ Create Product(s) with custom specifications
   │  (fabric, dimensions, photo references, description)
   └─ System automatically creates tasks based on workflow

3. PRODUCTION (Operators with specific roles)
   ├─ View assigned tasks
   ├─ Start task (change status to IN PROCESS)
   ├─ Complete task (change status to FINISHED)
   └─ System automatically:
      ├─ Verifies that the previous task is complete
      ├─ Updates product status
      └─ Updates order status

4. TRACKING (Admin Only)
   ├─ Review order and product statuses
   └─ View task progress in each area
```

---

## 3. TECHNOLOGY STACK

### Backend
- **NestJS** 11.0.1 - Progressive Node.js framework
- **TypeORM** 0.3.27 - ORM for TypeScript
- **PostgreSQL** - Relational database
- **JWT** - Token-based authentication
- **Passport** - Authentication strategy
- **Class Validator** - DTO validation
- **bcrypt** - Password hashing

### Development Tools
- **TypeScript** 5.7.3 - Static typing
- **Jest** 30.0.0 - Testing framework
- **ESLint** 9.18.0 - Linting
- **Prettier** 3.4.2 - Code formatting

---

## 4. PREREQUISITES

- **Node.js** >= 18.x
- **npm** >= 10.x or **yarn**
- **PostgreSQL** >= 14.x
- **Git** to clone the repository

---

## 5. INSTALLATION AND CONFIGURATION

### Clone the repository
```bash
git clone https://github.com/aaronHenao/backend-tailorflow.git
cd backend-tailorflow
```

### Install dependencies
```bash
npm install
```

### Configure environment variables
Create a `.env` file in the project root:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=tailorflow_user
DB_PASSWORD=your_secure_password
DB_NAME=tailorflow_db

# Server
PORT=3000

# JWT
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# Environment
NODE_ENV=development
```

### Create database
```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql:
CREATE DATABASE tailorflow_db;
CREATE USER tailorflow_user WITH PASSWORD ‘your_secure_password’;
ALTER ROLE tailorflow_user SET client_encoding TO ‘utf8’;
ALTER ROLE tailorflow_user SET default_transaction_isolation TO ‘read committed’;
ALTER ROLE tailorflow_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE tailorflow_db TO tailorflow_user;
\q
```

---

## 6. PROJECT STRUCTURE

```
src/
├── common/
│   ├── decorators/
│   │   ├── get-user/
│   │   │   └── get-user.decorator.ts
│   │   └── roles/
│   │       └── roles.decorator.ts
│   ├── dto/
│   │   └── base-application-response.dto.ts
│   ├── entities/
│   │   └── state.entity.ts                # States: PENDING, IN PROCESS, FINISHED, DELAYED
│   └── modules/
│       └── auth/                          # JWT authentication module
│           ├── auth.controller.ts
│           ├── auth.service.ts
│           ├── jwt.strategy/
│           ├── dto/
│           └── auth.module.ts
├── guards/
│   └── roles/
│       └── roles.guard.ts                 # Guard to validate roles
├── modules/
│   ├── roles/                             # Role management
│   ├── employees/                         # Employee management
│   ├── areas/                             # Production areas
│   ├── categories/                        # Product categories
│   ├── flows/                             # Sequenced workflows
│   ├── customers/                         # Customer management
│   ├── products/                          # Custom products
│   ├── orders/                            # Purchase Orders
│   └── tasks/                             # Tasks Assigned to Employees
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

---

## 7. SYSTEM ENTITIES

### 7.1 States (Global States)
Defines the possible states for orders, products, and tasks.

```typescript
enum StateName {
  PENDING = ‘PENDING’,           // State 1: Pending
  IN_PROCESS = ‘IN PROCESS’,     // State 2: In Process
  FINISHED = ‘FINISHED’,         // State 3: Finished
  DELAYED = ‘DELAYED’            // State 4: Delayed
}
```

**Relationships:**
- Has multiple orders
- Has multiple products
- Has multiple tasks

---

### 7.2 Role (Employee Role)
Defines job positions within an area.

**Fields:**
- `id_role`: Unique identifier
- `id_area`: Area where the role applies
- `name`: Role name (e.g., “Cutter,” “Seamstress,” “Packer”)
- `description`: Role description

**Relationships:**
- Belongs to an Area
- Has multiple Employees
- Has multiple Flows

**Permissions by Role:**

| Operation | ADMIN | Other Roles |
|-----------|-------|-------------|
| List roles | ✅ | ❌ |
| View role | ✅ | ❌ |
| Create role | ✅ | ❌ |
| Update role | ✅ | ❌ |
| Delete role | ✅ | ❌ |

**Endpoints:**
```bash
GET /roles/all                    # List all roles
GET /roles/:id                    # Get role by ID
POST /roles                       # Create new role
PATCH /roles/:id                  # Update role
DELETE /roles/:id                 # Delete role
```

---

### 7.3 Area (Production Area)
Physical spaces where tasks are executed in the production process.

**Fields:**
- `id_area`: Unique identifier
- `name`: Unique name of the area (e.g., “Cutting,” “Seamstressing,” “Packaging”)

**Relationships:**
- Has multiple Roles
- Has multiple Tasks

**Permissions by Role:**

| Operation | ADMIN | Other Roles |
|-----------|-------|-------------|
| List areas | ✅ | ❌ |
| View area | ✅ | ❌ |
| Create area | ✅ | ❌ |
| Update area | ✅ | ❌ |
| Delete area | ✅ | ❌ |

**Endpoints:**
```bash
GET /areas/all                    # List all areas
GET /areas/:id                    # Get area by ID
POST /areas                       # Create new area
PATCH /areas/:id                  # Update area
DELETE /areas/:id                 # Delete area
```

---

### 7.4 Employee
System users assigned to a role in an area.

**Fields:**
- `id_employee`: Unique identifier
- `id_role`: Employee role
- `cc`: ID number (unique)
- `name`: Employee name
- `password`: Password encrypted with bcrypt
- `state`: ACTIVE or INACTIVE

**Relationships:**
- Belongs to a Role
- Has multiple Tasks

**Permissions by Role:**

| Operation | ADMIN | Other Roles |
|-----------|-------|-------------|
| List employees | ✅ | ❌ |
| View employee | ✅ | ✅ |
| Create employee | ✅ | ❌ |
| Update employee | ✅ | ❌ |
| Deactivate employee | ✅ | ❌ |

**Endpoints:**
```bash
GET /employees/all                # List all employees (ADMIN)
GET /employees/:id                # Get employee by ID (any authenticated user)
GET /employees/cc/:cc             # Get employee by ID number (any authenticated user)
POST /employees                   # Create employee (ADMIN)
PATCH /employees/:id              # Update employee (ADMIN)
DELETE /employees/:id             # Deactivate employee (ADMIN)
```

---

### 7.5 Category (Product Category)
Types of products the company manufactures.

**Fields:**
- `id_category`: Unique identifier
- `name`: Unique name (e.g., “Custom Shirts,” “Furniture”)
- `description`: Description

**Relationships:**
- Has multiple Flows
- Has multiple Products

**Permissions by Role:**

| Operation | ADMIN | Other Roles |
|-----------|-------|-------------|
| List categories | ✅ | ❌ |
| View category | ✅ | ❌ |
| Create category | ✅ | ❌ |
| Update category | ✅ | ❌ |
| Delete category | ✅ | ❌ |

**Endpoints:**
```bash
GET /categories/all               # List all categories
GET /categories/:id               # Get category by ID
POST /categories                  # Create category
PATCH /categories/:id             # Update category
DELETE /categories/:id            # Delete category
```

---

### 7.6 Flow (Production Flow)
Defines the sequence of roles a product goes through based on its category.

**Concept:** A flow defines which roles, in what order, should process a product from a category.

**Fields:**
- `id_flow`: Unique identifier
- `id_category`: Category to which it belongs
- `id_role`: Role responsible for this step
- `sequence`: Execution order (1, 2, 3...)

**Example Flow for “Custom Shirts”:**
```
Flow 1: sequence=1, role=CUTTER
Flow 2: sequence=2, role=SEAMSTITCHER
Flow 3: sequence=3, role=PACKER
```

**Relationships:**
- Belongs to a Category
- Belongs to a Role

**Validations:**
- No duplicates allowed: same category + same role
- No duplicates allowed: same category + same sequence
- Cannot be deleted once created

**Permissions by Role:**

| Operation | ADMIN | Other Roles |
|-----------|-------|-------------|
| List flows | ✅ | ❌ |
| View flow | ✅ | ❌ |
| Create flow | ✅ | ❌ |
| Update flow | ✅ | ❌ |
| Delete flow | ✅ | ❌ |

**Endpoints:**
```bash
GET /flows/all                    # List all flows
GET /flows/:id                    # Get flow by ID
POST /flows                       # Create flow
PATCH /flows/:id                  # Update flow
DELETE /flows                     # Not available (returns error)
```

---

### 7.7 Customer
People who request customized products.

**Fields:**
- `id_customer`: Unique identifier
- `name`: Unique customer name
- `address`: Address (optional)
- `phone`: Phone number

**Relationships:**
- Has multiple Orders

**Permissions by Role:**

| Operation | ADMIN | Other Roles |
|-----------|-------|-------------|
| List customers | ✅ | ❌ |
| View customer | ✅ | ❌ |
| Create customer | ✅ | ❌ |
| Update customer | ✅ | ❌ |

**Endpoints:**
```bash
GET /customers/all                # List all customers
GET /customers/:id                # Get customer by ID
POST /customers                   # Create customer
PATCH /customers/:id              # Update customer
```

---

### 7.8 Order (Order)
A collection of products customized for a customer.

**Fields:**
- `id_order`: Unique identifier
- `id_state`: Current status (PENDING, IN_PROCESS, FINISHED, DELAYED)
- `id_customer`: Customer placing the order
- `entry_date`: Creation date (automatic)
- `estimated_delivery_date`: Estimated delivery date

**Relationships:**
- Belongs to a State
- Belongs to a Customer
- Has multiple Products

**States:**
```
PENDING (1)      → Order created, no products in process
IN_PROCESS (2)   → At least one product in process
FINISHED (3)     → All products completed
DELAYED (4)      → (Validation: if today > estimated_delivery_date and state != FINISHED)
```

**Validations:**
- The estimated date cannot be earlier than the current date
- The estimated date cannot be earlier than the order date

**Status Update (Automatic):**
- The system updates the status based on the status of the products
- If all products are FINISHED → order changes to FINISHED
- If any product is IN_PROCESS → order changes to IN_PROCESS
- If all products are PENDING → order remains PENDING

**Permissions by Role:**

| Operation | ADMIN | Other Roles |
|-----------|-------|-------------|
| List orders | ✅ | ❌ |
| View order | ✅ | ❌ |
| Create order | ✅ | ❌ |
| Update estimated date | ✅ | ❌ |

**Endpoints:**
```bash
GET /orders/all                   # List all orders
GET /orders/:id                   # Get order with all its products
POST /orders                      # Create order
PATCH /orders/:id                 # Update estimated date
```

---

### 7.9 Product (Custom Product)
Unique products created manually with specific specifications.

**Fields:**
- `id_product`: Unique identifier
- `id_order`: Order to which it belongs
- `id_category`: Product category
- `id_state`: Current status (inherited from State)
- `name`: Descriptive name (e.g., “Blue Shirt Size M Company Logo”)
- `ref_photo`: Photo URL or reference (optional)
- `dimensions`: Product dimensions (optional, e.g., “20x30x50cm”)
- `fabric`: Material or fabric (optional, e.g., “100% Cotton”)
- `description`: Detailed description of specifications

**Relationships:**
- Belongs to an Order
- Belongs to a Category
- Belongs to a State
- Has multiple Tasks

**Validations:**
- Cannot be updated if it is already in production (state != PENDING)

**Status Update (Automatic):**
- The system updates the status based on the status of the product's tasks
- If all tasks are FINISHED → product becomes FINISHED
- If any task is IN_PROCESS → product becomes IN_PROCESS
- If all tasks are PENDING → product remains PENDING

**Automatic task creation:**
When a product is created, the system:
1. Searches for the category workflow sorted by sequence
2. Creates a task for each step of the workflow
3. Assigns each task to the employee with the lowest workload in that role

**Permissions by Role:**

| Operation | ADMIN | Other Roles |
|-----------|-------|-------------|
| List products | ✅ | ❌ |
| View product | ✅ | ✅ |
| Create product | ✅ | ❌ |
| Update product | ✅ | ❌ |

**Endpoints:**
```bash
GET /products                     # List all products
GET /products/:id                 # Get product (ADMIN or specific operators)
POST /products                    # Create product (automatically creates tasks)
PATCH /products/:id               # Update product (only if state=PENDING)
```

---

### 7.10 Task
Individual steps an employee must complete to process a product.

**Fields:**
- `id_task`: Unique identifier
- `id_product`: Product being processed
- `id_employee`: Assigned employee (may be NULL at the start)
- `id_area`: Area where it is executed
- `id_state`: Task status (PENDING=1, IN_PROCESS=2, FINISHED=3)
- `sequence`: Order within the product (1, 2, 3...)
- `start_date`: Date when the employee starts the task
- `end_date`: Date when the task is completed

**Relationships:**
- Belongs to a Product
- Belongs to an Employee (may be NULL)
- Belongs to an Area
- Belongs to a State

**Validations:**
- Unique combination: same order + same sequence
- Can only be started if the previous task is FINISHED
- Only the assigned employee can start/complete the task
- Cannot be started if already in progress
- Cannot be completed if not in progress

**State Flow:**
```
PENDING (1) 
    ↓ (startTask)
IN_PROCESS (2)
    ↓ (completeTask)
FINISHED (3)
```

**Permissions by Role:**

| Operation | ADMIN | Operators |
|-----------|-------|-----------|
| List all tasks | ✅ | ✅ |
| View task | ✅ | ✅ |
| View my tasks | ✅ | ✅ |
| Start task | ❌ | ✅ |
| Complete task | ❌ | ✅ |
| View tasks for a product | ✅ | ✅ |

**Endpoints:**
```bash
GET /tasks                        # List all tasks (ADMIN + Operators)
GET /tasks/assigned               # View my assigned tasks (Operators)
GET /tasks/:id                    # Get task by ID (Operators)
PATCH /tasks/:id/start            # Start task (Operators)
PATCH /tasks/:id/complete         # Complete task (Operators)
GET /tasks/:id/product-tasks      # View all tasks for a product (Operators)
```

---

## 8. AUTHENTICATION AND AUTHORIZATION

### 8.1 Login (No authentication)

**Endpoint:**
```bash
POST /auth/login
```

**Request:**
```json
{
  “cc”: “1234567890”,
  “password”: “password123”
}
```

**Response (200 OK):**
```json
{
  “access_token”: “eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...”,
  “employee”: {
    “id_employee”: 1,
    “cc”: “1234567890”,
    “name”: “Juan Pérez”,
    “state”: “ACTIVE”,
    “role”: {
      “id_role”: 1,
      “name”: “ADMIN”,
      “description”: “System Administrator”
    }
  }
}
```

**Token characteristics:**
- Valid for **1 hour**
- Includes: `sub` (id_employee), `cc`, `id_role`
- Must be sent in the header: `Authorization: Bearer <token>`

---

### 8.2 Role-Based Authorization

The system validates roles using:

- **@Roles()**: Decorator that specifies which roles can access an endpoint
- **RolesGuard**: Validates that the user has the required role
- **AuthGuard(‘jwt’)**: Validates that the token is valid

**System-Specific Roles:**
- `ADMIN`: Full access to administration
- `Skeleton Maker`, `Cutter`, `Upholsterer`, `Seamstress`, `Painter`: Operational roles

---

## 9. COMPLETE OPERATIONAL FLOW (Based on Real Code)

### Step 1: Initial Setup (Admin Only)

```bash
# 1. Create Areas
POST /areas
{
  “name”: “Cutting”
}

POST /areas
{
  “name”: “Seamstressing”
}

POST /areas
{
  “name”: “Packaging”
}

# 2. Create Roles (linked to areas)
POST /roles
{
  “id_area”: 1,
  “name”: “Cutter”,
  “description”: “Responsible for cutting”
}

POST /roles
{
  “id_area”: 2,
  “name”: “Seamstress”,
  “description”: “Responsible for manufacturing”
}

# 3. Create Employees
POST /employees
{
  “id_role”: 1,
  “cc”: “1001234567”,
  “name”: “Carlos López”,
  “password”: “securePass123”
}

POST /employees
{
  “id_role”: 2,
  “cc”: “1001234568”,
  “name”: “María García”,
  “password”: “securePass123”
}

# 4. Create Category
POST /categories
{
  “name”: “Custom Shirts”,
  “description”: “Shirts made to customer specifications”
}

# 5. Create a Production Flow for Shirts
POST /flows
{
  “id_role”: 1,
  “id_category”: 1,
  “sequence”: 1
}

POST /flows
{
  “id_role”: 2,
  “id_category”: 1,
  “sequence”: 2
}
```

### Step 2: Enter Order

```bash
# 1. Create Customer
POST /customers
{
  “name”: “ABC Apparel”,
  “phone”: “3001234567”,
  “address”: “10th Street #5-20”
}

# 2. Create Order
POST /orders
{
  “id_customer”: 1,
  “estimated_delivery_date”: “2024-03-01T00:00:00Z”
}

# 3. Create Custom Product
POST /products
{
  “id_order”: 1,
  “id_category”: 1,
  “name”: “Blue Shirt Size M”,
  “fabric”: “100% Cotton”,
  “dimensions”: “Size M”,
  “description”: “Royal blue shirt with black buttons”,
  “ref_photo”: “https://...”
}

# System automatically:
# ✅ Searches category flow 1
# ✅ Creates 2 tasks (seq 1 and 2)
# ✅ Assigns task 1 to the employee with the lightest workload in the CUTTER role
# ✅ Assigns task 2 to the employee with the lightest workload in the SEAMSTRESS role
# ✅ Updates order status to PENDING
```

### Step 3: Task Execution (Operators)

```bash
# Operator Carlos (CUTTER) logs in
POST /auth/login
{
  “cc”: “1001234567”,
  “password”: “securePass123”
}

# Receives token...

# View my tasks
GET /tasks/assigned
Header: Authorization: Bearer <token>

# Response:
{
  “statusCode”: 200,
  “message”: “Assigned tasks retrieved successfully”,
  “data”: [
    {
      “id_task”: 1,
      “id_product”: 1,
      “id_employee”: 1,
      “id_area”: 1,
      “id_state”: 1,
      “sequence”: 1,
      “start_date”: null,
      “end_date”: null,
      “product”: {
        “name”: “Blue Shirt Size M”,
        “description”: “Blue shirt...”
      }
    }
  ]
}

# Start task
PATCH /tasks/1/start
Header: Authorization: Bearer <token>

# System:
# ✅ Change status to IN_PROCESS (2)
# ✅ Record start_date
# ✅ Update product status to IN_PROCESS
# ✅ Update order status to IN_PROCESS

# Complete task
PATCH /tasks/1/complete
Header: Authorization: Bearer <token>

# System:
# ✅ Verifies that the employee is the assigned one
# ✅ Verifies that the status is IN_PROCESS
# ✅ Changes status to FINISHED (3)
# ✅ Records end_date
# ✅ Verifies and updates product status
# ✅ Validates and updates order status

# Next operator (Maria) automatically receives her task
```

---

## 10. TASK ASSIGNMENT ALGORITHM

When a product is created, the system:

1. **Retrieves the workflow** for its category, sorted by sequence
2. **For each step in the flow:**
   - Retrieves all employees with the required role
   - **Calculates workload:**
     - Counts PENDING + IN_PROCESS tasks per employee
   - **Selects the employee with the lowest workload**
   - Creates a task and assigns it

**Relevant code (ProductsService):**
```typescript
for(const flow of flows){
  const task = await this.tasksService.createTask({
    id_product: savedProduct.id_product, 
    id_area: flow.role.id_area, 
    sequence: flow.sequence, 
    id_state: 1
  });
  
  const employee = await this.employeesService.findEmployeeWithLeastWorkload(flow.id_role);
  await this.tasksService.assignEmployee(task.id_task, employee.id_employee);
}
```

---

## 11. AUTOMATIC STATUS UPDATE

### Task → Product
When a product task is completed:
- If **ALL tasks = FINISHED** → Product = FINISHED
- If **ANY task = IN_PROCESS** → Product = IN_PROCESS
- If **ALL tasks = PENDING** → Product = PENDING

### Product → Order
When a product’s status changes:
- If **ALL products = FINISHED** → Order = FINISHED
- If **ANY product = IN_PROCESS** → Order = IN_PROCESS
- If **ALL products = PENDING** → Order = PENDING

**Task Sequence Validation:**
An employee can only start a task if:
1. The previous task is FINISHED
2. Or it is the first task (sequence = 1)

---

## 12. PERMISSIONS SUMMARY

### 👨‍💼 User with ADMIN Role
**Has FULL access to:**
- ✅ CRUD for roles
- ✅ CRUD for areas
- ✅ CRUD for employees
- ✅ CRUD for categories
- ✅ CRUD for workflows (create, update, read - CANNOT delete)
- ✅ CRUD for customers
- ✅ CRUD for orders (create, read, update estimated date)
- ✅ Product CRUD (creation automatically generates tasks)
- ✅ List all tasks in the system
- ✅ View details of any task

### 👷 User with Operational Role (Cutter, Seamstress, etc.)
**Has LIMITED access to:**
- ✅ View their assigned tasks
- ✅ Start their assigned tasks
- ✅ Complete their assigned tasks
- ✅ View details of the product they are processing
- ✅ View the product’s task sequence
- ✅ Log in and change password
- ❌ View orders, customers, other products
- ❌ Create or modify orders/products
- ❌ View other employees' tasks
- ❌ Access system settings

---

## 13. PROJECT EXECUTION

### Development mode with hot-reload
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

### Debug mode
```bash
npm run start:debug
```

The server will be available at `http://localhost:3000`

---

## 14. TESTING

### Run all tests
```bash
npm run test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:cov
```

### Run E2E tests
```bash
npm run test:e2e
```

---

## 15. PROJECT STATUS

- [x] Base structure with main modules
- [x] JWT authentication implemented
- [x] Roles and authorization system
- [x] CRUD for roles, areas, employees, categories
- [x] CRUD for workflows (without deletion)
- [x] CRUD for customers and orders
- [x] Product creation with automated tasks
- [x] Workload-based assignment system
- [x] Automatic status updates (tasks → products → orders)
- [x] Task sequence validation
- [x] Endpoints for operators (start/complete tasks)
- [ ] Implement delay detection (dates)
- [ ] Customer notifications
- [ ] Productivity reports
- [ ] Real-time dashboard

**Current Version:** 0.0.1 (Initial development)

---

## 16. ENVIRONMENT VARIABLES

```env
# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=tailorflow_user
DB_PASSWORD=secure_password_123
DB_NAME=tailorflow_db

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=my_super_long_and_secure_secret_key_2024
```

---

## 17. USEFUL COMMANDS

### Linting and Formatting
```bash
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
```

### Compilation
```bash
npm run build       # Compile TypeScript
```

### Cleanup
```bash
rm -rf dist/        # Clean up build folder
rm -rf coverage/    # Clean up coverage reports
```

---

## 18. TROUBLESHOOTING

### Error: “No flows configured for the category”
- Verify that flows were created for the product category
- Flows must be ordered by sequence

### Error: “The previous task has not yet been completed”
- Tasks must be completed in sequential order
- Verify that the previous task (sequence-1) is in the FINISHED state

### Error: “Only the assigned employee can start this task”
- Only the assigned employee can start/complete the task
- Verify that the JWT token belongs to the correct employee

### Error: “No tasks exist”
- There are no tasks in the system
- Create a product to generate tasks automatically

### The product does not transition to FINISHED
- Verify that all tasks are FINISHED
- Tasks must be completed in sequential order

---

## 19. CONTRIBUTION

1. Fork the repository
2. Create a branch for your feature: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m ‘Add my-feature’`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 20. LICENSE

UNLICENSED - Private project

---

## 21. CONTACT AND SUPPORT

For questions or support, contact the repository owner: **aaronHenao**

---

**Last updated:** February 2026
**Main branch:** `master`
**TypeScript:** 99.2% | JavaScript: 0.8%

