import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

// Entidades
import { ProductDetail } from './entities/product-detail.entity';
import { MaterialConsumptionView } from './entities/material-consumption-view.entity';
import { MinStockAlert } from './entities/min-stock-alert.entity';
import { DelayedTask } from './entities/delayed-task.entity';

// DTOs
import { ProductDetailResponseDto } from './dto/product-detail-response.dto';
import { MaterialConsumptionViewResponseDto } from './dto/material-consumption-view-response.dto';
import { MinStockAlertResponseDto } from './dto/min-stock-alert-response.dto';
import { DelayedTaskResponseDto } from './dto/delayed-task-response.dto';

/**
 * Servicio para acceder a las vistas de base de datos
 * Proporciona métodos para consultar información agregada y analítica
 * del sistema TailorFlow
 */
@Injectable()
export class DatabaseViewsService {

  constructor(
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>,

    @InjectRepository(MaterialConsumptionView)
    private materialConsumptionRepository: Repository<MaterialConsumptionView>,

    @InjectRepository(MinStockAlert)
    private minStockAlertRepository: Repository<MinStockAlert>,

    @InjectRepository(DelayedTask)
    private delayedTaskRepository: Repository<DelayedTask>,
  ) {}

  /**
   * Obtiene todos los detalles de productos desde la vista VW_DETALLE_PRODUCTO
   * @returns Array de ProductDetailResponseDto con información completa de productos
   */
  async getAllProductDetails(): Promise<ProductDetailResponseDto[]> {
    const productDetails = await this.productDetailRepository.find();

    if (!productDetails || productDetails.length === 0) {
      throw new NotFoundException('No se encontraron detalles de productos');
    }

    return productDetails.map(detail =>
      plainToInstance(ProductDetailResponseDto, detail, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene los detalles de un producto específico por su ID
   * @param idProducto ID del producto a consultar
   * @returns ProductDetailResponseDto con la información del producto
   */
  async getProductDetailById(idProducto: number): Promise<ProductDetailResponseDto[]> {
    const productDetails = await this.productDetailRepository.find({
      where: { id_producto: idProducto }
    });

    if (!productDetails || productDetails.length === 0) {
      throw new NotFoundException(`No se encontraron detalles para el producto con ID ${idProducto}`);
    }

    return productDetails.map(detail =>
      plainToInstance(ProductDetailResponseDto, detail, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene el consumo de materiales desde la vista VW_CONSUMO_MATERIALES
   * @returns Array de MaterialConsumptionViewResponseDto con información agregada de consumo
   */
  async getMaterialConsumption(): Promise<MaterialConsumptionViewResponseDto[]> {
    const consumptions = await this.materialConsumptionRepository.find();

    if (!consumptions || consumptions.length === 0) {
      throw new NotFoundException('No se encontró información de consumo de materiales');
    }

    return consumptions.map(consumption =>
      plainToInstance(MaterialConsumptionViewResponseDto, consumption, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene el consumo de materiales filtrado por área
   * @param area Nombre del área a filtrar
   * @returns Array de MaterialConsumptionViewResponseDto filtrados por área
   */
  async getMaterialConsumptionByArea(area: string): Promise<MaterialConsumptionViewResponseDto[]> {
    const consumptions = await this.materialConsumptionRepository.find({
      where: { area }
    });

    if (!consumptions || consumptions.length === 0) {
      throw new NotFoundException(`No se encontró información de consumo de materiales para el área ${area}`);
    }

    return consumptions.map(consumption =>
      plainToInstance(MaterialConsumptionViewResponseDto, consumption, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene las alertas de stock mínimo desde la vista VW_ALERTA_STOCK_MINIMO
   * @returns Array de MinStockAlertResponseDto con materiales en o por debajo del stock mínimo
   */
  async getMinStockAlerts(): Promise<MinStockAlertResponseDto[]> {
    const alerts = await this.minStockAlertRepository.find();

    if (!alerts || alerts.length === 0) {
      // En este caso no lanzamos excepción porque no tener alertas es una buena señal
      return [];
    }

    return alerts.map(alert =>
      plainToInstance(MinStockAlertResponseDto, alert, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene las alertas de stock mínimo filtradas por área
   * @param area Nombre del área a filtrar
   * @returns Array de MinStockAlertResponseDto filtrados por área
   */
  async getMinStockAlertsByArea(area: string): Promise<MinStockAlertResponseDto[]> {
    const alerts = await this.minStockAlertRepository.find({
      where: { area_asociada: area }
    });

    if (!alerts || alerts.length === 0) {
      // En este caso no lanzamos excepción porque no tener alertas es una buena señal
      return [];
    }

    return alerts.map(alert =>
      plainToInstance(MinStockAlertResponseDto, alert, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene las tareas atrasadas/en proceso desde la vista VW_TAREAS_ATRASADAS
   * @returns Array de DelayedTaskResponseDto con tareas actualmente en proceso
   */
  async getDelayedTasks(): Promise<DelayedTaskResponseDto[]> {
    const tasks = await this.delayedTaskRepository.find();

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No se encontraron tareas en proceso');
    }

    return tasks.map(task =>
      plainToInstance(DelayedTaskResponseDto, task, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene las tareas atrasadas/en proceso filtradas por área
   * @param area Nombre del área de producción a filtrar
   * @returns Array de DelayedTaskResponseDto filtrados por área
   */
  async getDelayedTasksByArea(area: string): Promise<DelayedTaskResponseDto[]> {
    const tasks = await this.delayedTaskRepository.find({
      where: { area_produccion: area }
    });

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException(`No se encontraron tareas en proceso para el área ${area}`);
    }

    return tasks.map(task =>
      plainToInstance(DelayedTaskResponseDto, task, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene las tareas atrasadas/en proceso filtradas por empleado
   * @param empleado Nombre del empleado asignado a filtrar
   * @returns Array de DelayedTaskResponseDto filtrados por empleado
   */
  async getDelayedTasksByEmployee(empleado: string): Promise<DelayedTaskResponseDto[]> {
    const tasks = await this.delayedTaskRepository.find({
      where: { empleado_asignado: empleado }
    });

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException(`No se encontraron tareas en proceso para el empleado ${empleado}`);
    }

    return tasks.map(task =>
      plainToInstance(DelayedTaskResponseDto, task, {
        excludeExtraneousValues: true
      })
    );
  }
}
