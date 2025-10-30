# Módulo de Vistas de Base de Datos - TailorFlow

## Descripción

Este módulo proporciona acceso a vistas de base de datos Oracle que contienen información analítica y de reportes del sistema TailorFlow. Todas las vistas están diseñadas para consultas de solo lectura y proporcionan datos agregados y procesados para facilitar el análisis y toma de decisiones.

## Instalación de las Vistas

Antes de utilizar los endpoints del módulo, es necesario ejecutar el script SQL que crea las vistas en la base de datos Oracle:

```bash
# Ejecutar el script en Oracle SQL Developer, SQL*Plus o cualquier cliente Oracle
@create-views.sql
```

O conectarse a la base de datos y ejecutar:

```bash
sqlplus usuario/password@servicio @create-views.sql
```

## Vistas Disponibles

### 1. VW_DETALLE_PRODUCTO

**Descripción:** Proporciona información detallada de productos incluyendo categoría, cliente, pedido, estado, área actual, empleado asignado y fechas.

**Columnas:**
- `ID_PRODUCTO`: Identificador único del producto
- `NOMBRE_PRODUCTO`: Nombre del producto
- `CATEGORIA`: Categoría del producto
- `CLIENTE`: Nombre del cliente
- `PEDIDO`: ID del pedido asociado
- `ESTADO_PRODUCTO`: Estado actual del producto
- `AREA_ACTUAL`: Área donde se encuentra actualmente
- `EMPLEADO_ASIGNADO`: Empleado asignado a la tarea
- `FECHA_INICIO`: Fecha de inicio de la tarea (formato DD/MM/YYYY)
- `FECHA_FIN`: Fecha de finalización de la tarea (formato DD/MM/YYYY)
- `ESTADO_TAREA`: Estado de la tarea (COMPLETADA, EN PROCESO, PENDIENTE)

**Endpoints:**
- `GET /database-views/product-details` - Obtiene todos los detalles de productos
- `GET /database-views/product-details/:id` - Obtiene detalles de un producto específico

---

### 2. VW_CONSUMO_MATERIALES

**Descripción:** Vista agregada del consumo de materiales por área, mostrando el total consumido y las tareas asociadas.

**Columnas:**
- `AREA`: Nombre del área de producción
- `MATERIAL`: Nombre del material
- `TOTAL_CONSUMIDO`: Cantidad total consumida del material
- `TAREAS_ASOCIADAS`: Número de tareas que han utilizado este material

**Endpoints:**
- `GET /database-views/material-consumption` - Obtiene todo el consumo de materiales
- `GET /database-views/material-consumption/area/:area` - Obtiene consumo filtrado por área

---

### 3. VW_ALERTA_STOCK_MINIMO

**Descripción:** Vista de alertas para materiales que están en o por debajo del stock mínimo, ordenados por urgencia (stock actual ascendente).

**Columnas:**
- `MATERIAL`: Nombre del material
- `AREA_ASOCIADA`: Área a la que pertenece el material
- `STOCK_ACTUAL`: Cantidad actual en stock
- `STOCK_MINIMO`: Stock mínimo configurado
- `DIFERENCIA`: Diferencia entre stock actual y mínimo (valores negativos indican urgencia crítica)

**Endpoints:**
- `GET /database-views/stock-alerts` - Obtiene todas las alertas de stock mínimo
- `GET /database-views/stock-alerts/area/:area` - Obtiene alertas filtradas por área

**Nota:** Si no hay alertas, se retorna un array vacío con un mensaje informativo.

---

### 4. VW_TAREAS_ATRASADAS

**Descripción:** Vista de tareas que están actualmente en proceso (estado 'IN PROCESS'), mostrando el tiempo transcurrido desde su inicio.

**Columnas:**
- `ID_TAREA`: Identificador único de la tarea
- `AREA_PRODUCCION`: Área de producción donde se ejecuta la tarea
- `EMPLEADO_ASIGNADO`: Nombre del empleado asignado
- `FECHA_INICIO_REAL`: Fecha y hora de inicio de la tarea
- `DIAS_EN_CURSO`: Número de días transcurridos desde el inicio
- `ID_PRODUCTO_AFECTADO`: ID del producto asociado a la tarea

**Endpoints:**
- `GET /database-views/delayed-tasks` - Obtiene todas las tareas en proceso
- `GET /database-views/delayed-tasks/area/:area` - Obtiene tareas filtradas por área
- `GET /database-views/delayed-tasks/employee/:employee` - Obtiene tareas filtradas por empleado

---

## Seguridad

**⚠️ IMPORTANTE:** Todos los endpoints de este módulo están protegidos y requieren:

1. **Autenticación JWT**: Header `Authorization: Bearer <token>`
2. **Rol de ADMIN**: Solo usuarios con rol ADMIN pueden acceder a estas vistas

### Ejemplo de uso:

```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cc": "admin123", "password": "password"}'

# Response: { "access_token": "eyJhbGc..." }

# 2. Usar el token en las peticiones
curl -X GET http://localhost:3000/database-views/product-details \
  -H "Authorization: Bearer eyJhbGc..."
```

## Formato de Respuesta

Todos los endpoints retornan el formato estándar de la aplicación:

```json
{
  "statusCode": 200,
  "message": "Descripción del resultado",
  "data": [ /* Array de objetos con los datos */ ]
}
```

### Ejemplo de respuesta exitosa:

```json
{
  "statusCode": 200,
  "message": "Detalles de productos obtenidos correctamente",
  "data": [
    {
      "id_producto": 1,
      "nombre_producto": "Silla Ejecutiva",
      "categoria": "SILLAS",
      "cliente": "Empresa XYZ",
      "pedido": 100,
      "estado_producto": "IN PROCESS",
      "area_actual": "TAPICERIA",
      "empleado_asignado": "Juan Pérez",
      "fecha_inicio": "15/10/2025",
      "fecha_fin": null,
      "estado_tarea": "EN PROCESO"
    }
  ]
}
```

### Ejemplo de error (sin autenticación):

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Ejemplo de error (sin rol ADMIN):

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

## Estructura del Módulo

```
src/modules/database-views/
├── entities/
│   ├── product-detail.entity.ts
│   ├── material-consumption-view.entity.ts
│   ├── min-stock-alert.entity.ts
│   └── delayed-task.entity.ts
├── dto/
│   ├── product-detail-response.dto.ts
│   ├── material-consumption-view-response.dto.ts
│   ├── min-stock-alert-response.dto.ts
│   └── delayed-task-response.dto.ts
├── database-views.controller.ts
├── database-views.service.ts
└── database-views.module.ts
```

## Testing

Para verificar que las vistas funcionan correctamente:

1. Ejecutar el script SQL en la base de datos
2. Iniciar el servidor: `npm run start:dev`
3. Autenticarse como ADMIN
4. Realizar peticiones a los endpoints

```bash
# Verificar vistas en Oracle
SELECT COUNT(*) FROM VW_DETALLE_PRODUCTO;
SELECT COUNT(*) FROM VW_CONSUMO_MATERIALES;
SELECT COUNT(*) FROM VW_ALERTA_STOCK_MINIMO;
SELECT COUNT(*) FROM VW_TAREAS_ATRASADAS;
```

## Mantenimiento

### Recrear las vistas

Si necesitas actualizar las vistas, simplemente ejecuta nuevamente el script `create-views.sql`. El comando `CREATE OR REPLACE VIEW` reemplazará las vistas existentes sin afectar los datos.

### Eliminar las vistas

```sql
DROP VIEW VW_DETALLE_PRODUCTO;
DROP VIEW VW_CONSUMO_MATERIALES;
DROP VIEW VW_ALERTA_STOCK_MINIMO;
DROP VIEW VW_TAREAS_ATRASADAS;
```

## Notas Importantes

1. Las vistas son de **solo lectura** - no se pueden realizar operaciones INSERT, UPDATE o DELETE
2. El rendimiento de las vistas depende de los índices en las tablas base
3. Las vistas se actualizan automáticamente cuando cambian los datos de las tablas base
4. El acceso a través de la API está completamente controlado por el sistema de autenticación y autorización de NestJS

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contactar al equipo de desarrollo de TailorFlow.
