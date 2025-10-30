import { ViewColumn, ViewEntity } from "typeorm";

/**
 * Entidad que mapea la vista VW_ALERTA_STOCK_MINIMO
 * Proporciona alertas de materiales que están en o por debajo del stock mínimo
 * ordenados por urgencia (stock actual ascendente)
 */
@ViewEntity({
  name: 'VW_ALERTA_STOCK_MINIMO',
  synchronize: false
})
export class MinStockAlert {

  @ViewColumn({ name: 'MATERIAL' })
  material: string;

  @ViewColumn({ name: 'AREA_ASOCIADA' })
  area_asociada: string;

  @ViewColumn({ name: 'STOCK_ACTUAL' })
  stock_actual: number;

  @ViewColumn({ name: 'STOCK_MINIMO' })
  stock_minimo: number;

  @ViewColumn({ name: 'DIFERENCIA' })
  diferencia: number;
}
