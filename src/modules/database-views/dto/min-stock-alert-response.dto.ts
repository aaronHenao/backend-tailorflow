import { Expose } from "class-transformer";

/**
 * DTO de respuesta para la vista de alertas de stock mínimo
 */
export class MinStockAlertResponseDto {

  @Expose()
  material: string;

  @Expose()
  area_asociada: string;

  @Expose()
  stock_actual: number;

  @Expose()
  stock_minimo: number;

  @Expose()
  diferencia: number;
}
