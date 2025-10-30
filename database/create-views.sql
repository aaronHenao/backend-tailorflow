-- ============================================================================
-- SCRIPT DE CREACIÓN DE VISTAS PARA EL SISTEMA TAILORFLOW
-- ============================================================================
-- Descripción: Este script crea las vistas necesarias para el módulo de
--              reportes y análisis del sistema TailorFlow
-- Autor: Sistema TailorFlow
-- Fecha: 2025-10-30
-- ============================================================================

-- ============================================================================
-- VISTA 1: VW_DETALLE_PRODUCTO
-- Descripción: Vista detallada de productos con información completa de
--              categoría, cliente, pedido, estado, área, empleado y fechas
-- ============================================================================
CREATE OR REPLACE VIEW VW_DETALLE_PRODUCTO AS
SELECT
    p.id_product               AS ID_PRODUCTO,
    p.name                     AS NOMBRE_PRODUCTO,
    cat.name                   AS CATEGORIA,
    c.name                     AS CLIENTE,
    o.id_order                 AS PEDIDO,
    s.name                     AS ESTADO_PRODUCTO,
    a.name                     AS AREA_ACTUAL,
    e.name                     AS EMPLEADO_ASIGNADO,
    TO_CHAR(t.start_date,'DD/MM/YYYY') AS FECHA_INICIO,
    TO_CHAR(t.end_date,'DD/MM/YYYY')   AS FECHA_FIN,
    CASE
      WHEN t.end_date IS NOT NULL THEN 'COMPLETADA'
      WHEN t.start_date IS NOT NULL THEN 'EN PROCESO'
      ELSE 'PENDIENTE'
    END AS ESTADO_TAREA
FROM products p
JOIN category cat   ON p.id_category = cat.id_category
JOIN orders o       ON p.id_order    = o.id_order
JOIN customer c     ON o.id_customer = c.id_customer
LEFT JOIN tasks t   ON p.id_product  = t.id_product
LEFT JOIN employees e ON t.id_employee = e.id_employee
LEFT JOIN areas a   ON t.id_area = a.id_area
LEFT JOIN states s  ON p.id_state = s.id_state;

-- ============================================================================
-- VISTA 2: VW_CONSUMO_MATERIALES
-- Descripción: Vista de consumo de materiales agrupada por área y material,
--              mostrando el total consumido y las tareas asociadas
-- ============================================================================
CREATE OR REPLACE VIEW VW_CONSUMO_MATERIALES AS
SELECT
    a.name             AS AREA,
    m.name             AS MATERIAL,
    SUM(mc.quantity)   AS TOTAL_CONSUMIDO,
    COUNT(DISTINCT mc.id_task) AS TAREAS_ASOCIADAS
FROM material_consumption mc
JOIN materials m ON mc.id_material = m.id_material
JOIN areas a     ON m.id_area = a.id_area
GROUP BY a.name, m.name;

-- ============================================================================
-- VISTA 3: VW_ALERTA_STOCK_MINIMO
-- Descripción: Vista de alertas para materiales que están en o por debajo
--              del stock mínimo, ordenados por urgencia
-- ============================================================================
CREATE OR REPLACE VIEW VW_ALERTA_STOCK_MINIMO AS
SELECT
    m.name                 AS MATERIAL,
    a.name                 AS AREA_ASOCIADA,
    m.current_stock        AS STOCK_ACTUAL,
    m.min_stock            AS STOCK_MINIMO,
    (m.current_stock - m.min_stock) AS DIFERENCIA
FROM materials m
JOIN areas a ON m.id_area = a.id_area
WHERE m.current_stock <= m.min_stock
ORDER BY m.current_stock ASC;

-- ============================================================================
-- VISTA 4: VW_TAREAS_ATRASADAS
-- Descripción: Vista de tareas que están actualmente en proceso, mostrando
--              el tiempo transcurrido desde su inicio
-- ============================================================================
CREATE OR REPLACE VIEW VW_TAREAS_ATRASADAS AS
SELECT
    t.id_task              AS ID_TAREA,
    a.name                 AS AREA_PRODUCCION,
    e.name                 AS EMPLEADO_ASIGNADO,
    t.start_date           AS FECHA_INICIO_REAL,
    TRUNC(SYSDATE - t.start_date) AS DIAS_EN_CURSO,
    p.id_product           AS ID_PRODUCTO_AFECTADO
FROM tasks t
JOIN areas a ON t.id_area = a.id_area
LEFT JOIN employees e ON t.id_employee = e.id_employee
JOIN products p ON t.id_product = p.id_product
WHERE t.id_state = (SELECT id_state FROM states WHERE name = 'IN PROCESS')
ORDER BY DIAS_EN_CURSO DESC;

-- ============================================================================
-- VERIFICACIÓN DE VISTAS CREADAS
-- ============================================================================
-- Para verificar que las vistas se crearon correctamente, ejecutar:
-- SELECT * FROM VW_DETALLE_PRODUCTO;
-- SELECT * FROM VW_ALERTA_STOCK_MINIMO;
-- SELECT * FROM VW_CONSUMO_MATERIALES;
-- SELECT * FROM VW_TAREAS_ATRASADAS;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. Estas vistas deben ejecutarse en la base de datos Oracle antes de
--    utilizar los endpoints del módulo database-views
-- 2. Las vistas son de solo lectura y están diseñadas para consultas
--    de reportes y análisis
-- 3. El acceso a estas vistas a través de la API está restringido
--    únicamente al rol de ADMIN
-- ============================================================================
