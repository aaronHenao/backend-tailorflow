import { Expose } from "class-transformer";

/**
 * DTO de respuesta para la vista de tareas atrasadas/en proceso
 */
export class DelayedTaskResponseDto {

  @Expose()
  id_tarea: number;

  @Expose()
  area_produccion: string;

  @Expose()
  empleado_asignado: string;

  @Expose()
  fecha_inicio_real: Date;

  @Expose()
  dias_en_curso: number;

  @Expose()
  id_producto_afectado: number;
}
