import { ViewColumn, ViewEntity } from "typeorm";

/**
 * Entidad que mapea la vista VW_CONSUMO_MATERIALES
 * Proporciona información agregada del consumo de materiales por área
 * incluyendo el total consumido y las tareas asociadas
 */
@ViewEntity({
  name: 'VW_CONSUMO_MATERIALES',
  synchronize: false
})
export class MaterialConsumptionView {

  @ViewColumn({ name: 'AREA' })
  area: string;

  @ViewColumn({ name: 'MATERIAL' })
  material: string;

  @ViewColumn({ name: 'TOTAL_CONSUMIDO' })
  total_consumido: number;

  @ViewColumn({ name: 'TAREAS_ASOCIADAS' })
  tareas_asociadas: number;
}
