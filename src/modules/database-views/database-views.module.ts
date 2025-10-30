import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseViewsController } from './database-views.controller';
import { DatabaseViewsService } from './database-views.service';

// Importar las entidades de las vistas
import { ProductDetail } from './entities/product-detail.entity';
import { MaterialConsumptionView } from './entities/material-consumption-view.entity';
import { MinStockAlert } from './entities/min-stock-alert.entity';
import { DelayedTask } from './entities/delayed-task.entity';

/**
 * Módulo para gestionar el acceso a las vistas de base de datos
 * Proporciona endpoints protegidos para consultas analíticas y reportes
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductDetail,
      MaterialConsumptionView,
      MinStockAlert,
      DelayedTask
    ])
  ],
  controllers: [DatabaseViewsController],
  providers: [DatabaseViewsService],
  exports: [DatabaseViewsService]
})
export class DatabaseViewsModule {}
