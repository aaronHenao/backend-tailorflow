import { Expose } from "class-transformer";

/**
 * DTO de respuesta para la vista de detalle de productos
 */
export class ProductDetailResponseDto {

  @Expose()
  id_producto: number;

  @Expose()
  nombre_producto: string;

  @Expose()
  categoria: string;

  @Expose()
  cliente: string;

  @Expose()
  pedido: number;

  @Expose()
  estado_producto: string;

  @Expose()
  area_actual: string;

  @Expose()
  empleado_asignado: string;

  @Expose()
  fecha_inicio: string;

  @Expose()
  fecha_fin: string;

  @Expose()
  estado_tarea: string;
}
