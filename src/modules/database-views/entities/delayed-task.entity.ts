import { ViewColumn, ViewEntity } from "typeorm";

/**
 * Entidad que mapea la vista VW_TAREAS_ATRASADAS
 * Proporciona información de tareas que están actualmente en proceso,
 * mostrando el tiempo transcurrido desde su inicio
 */
@ViewEntity({
  name: 'VW_TAREAS_ATRASADAS',
  synchronize: false
})
export class DelayedTask {

  @ViewColumn({ name: 'ID_TAREA' })
  id_tarea: number;

  @ViewColumn({ name: 'AREA_PRODUCCION' })
  area_produccion: string;

  @ViewColumn({ name: 'EMPLEADO_ASIGNADO' })
  empleado_asignado: string;

  @ViewColumn({ name: 'FECHA_INICIO_REAL' })
  fecha_inicio_real: Date;

  @ViewColumn({ name: 'DIAS_EN_CURSO' })
  dias_en_curso: number;

  @ViewColumn({ name: 'ID_PRODUCTO_AFECTADO' })
  id_producto_afectado: number;
}
