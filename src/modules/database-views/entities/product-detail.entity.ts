import { ViewColumn, ViewEntity } from "typeorm";

/**
 * Entidad que mapea la vista VW_DETALLE_PRODUCTO
 * Proporciona información detallada de productos incluyendo categoría,
 * cliente, pedido, estado, área actual, empleado asignado y fechas
 */
@ViewEntity({
  name: 'VW_DETALLE_PRODUCTO',
  synchronize: false
})
export class ProductDetail {

  @ViewColumn({ name: 'ID_PRODUCTO' })
  id_producto: number;

  @ViewColumn({ name: 'NOMBRE_PRODUCTO' })
  nombre_producto: string;

  @ViewColumn({ name: 'CATEGORIA' })
  categoria: string;

  @ViewColumn({ name: 'CLIENTE' })
  cliente: string;

  @ViewColumn({ name: 'PEDIDO' })
  pedido: number;

  @ViewColumn({ name: 'ESTADO_PRODUCTO' })
  estado_producto: string;

  @ViewColumn({ name: 'AREA_ACTUAL' })
  area_actual: string;

  @ViewColumn({ name: 'EMPLEADO_ASIGNADO' })
  empleado_asignado: string;

  @ViewColumn({ name: 'FECHA_INICIO' })
  fecha_inicio: string;

  @ViewColumn({ name: 'FECHA_FIN' })
  fecha_fin: string;

  @ViewColumn({ name: 'ESTADO_TAREA' })
  estado_tarea: string;
}
