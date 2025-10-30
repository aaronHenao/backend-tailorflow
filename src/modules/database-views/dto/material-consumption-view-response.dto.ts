import { Expose } from "class-transformer";

/**
 * DTO de respuesta para la vista de consumo de materiales
 */
export class MaterialConsumptionViewResponseDto {

  @Expose()
  area: string;

  @Expose()
  material: string;

  @Expose()
  total_consumido: number;

  @Expose()
  tareas_asociadas: number;
}
