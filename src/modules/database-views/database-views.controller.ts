import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DatabaseViewsService } from './database-views.service';
import { BaseApplicationResponseDto } from 'src/common/dto/base-application-response.dto';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';

// DTOs
import { ProductDetailResponseDto } from './dto/product-detail-response.dto';
import { MaterialConsumptionViewResponseDto } from './dto/material-consumption-view-response.dto';
import { MinStockAlertResponseDto } from './dto/min-stock-alert-response.dto';
import { DelayedTaskResponseDto } from './dto/delayed-task-response.dto';

/**
 * Controlador para acceder a las vistas de base de datos
 * Todos los endpoints están protegidos y requieren autenticación JWT + rol ADMIN
 */
@Controller('database-views')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class DatabaseViewsController {

  constructor(private readonly databaseViewsService: DatabaseViewsService) {}

  // =========================================================================
  // ENDPOINTS PARA VW_DETALLE_PRODUCTO
  // =========================================================================

  /**
   * GET /database-views/product-details
   * Obtiene todos los detalles de productos
   * @returns Lista completa de detalles de productos
   */
  @Get('product-details')
  async getAllProductDetails(): Promise<BaseApplicationResponseDto<ProductDetailResponseDto[]>> {
    const productDetails = await this.databaseViewsService.getAllProductDetails();
    return {
      statusCode: 200,
      message: 'Detalles de productos obtenidos correctamente',
      data: productDetails
    };
  }

  /**
   * GET /database-views/product-details/:id
   * Obtiene los detalles de un producto específico por su ID
   * @param id ID del producto
   * @returns Detalles del producto solicitado
   */
  @Get('product-details/:id')
  async getProductDetailById(@Param('id') id: string): Promise<BaseApplicationResponseDto<ProductDetailResponseDto[]>> {
    const productDetails = await this.databaseViewsService.getProductDetailById(+id);
    return {
      statusCode: 200,
      message: `Detalles del producto ${id} obtenidos correctamente`,
      data: productDetails
    };
  }

  // =========================================================================
  // ENDPOINTS PARA VW_CONSUMO_MATERIALES
  // =========================================================================

  /**
   * GET /database-views/material-consumption
   * Obtiene el consumo agregado de materiales por área
   * @returns Lista de consumo de materiales
   */
  @Get('material-consumption')
  async getMaterialConsumption(): Promise<BaseApplicationResponseDto<MaterialConsumptionViewResponseDto[]>> {
    const consumption = await this.databaseViewsService.getMaterialConsumption();
    return {
      statusCode: 200,
      message: 'Consumo de materiales obtenido correctamente',
      data: consumption
    };
  }

  /**
   * GET /database-views/material-consumption/area/:area
   * Obtiene el consumo de materiales filtrado por área
   * @param area Nombre del área
   * @returns Lista de consumo de materiales del área especificada
   */
  @Get('material-consumption/area/:area')
  async getMaterialConsumptionByArea(@Param('area') area: string): Promise<BaseApplicationResponseDto<MaterialConsumptionViewResponseDto[]>> {
    const consumption = await this.databaseViewsService.getMaterialConsumptionByArea(area);
    return {
      statusCode: 200,
      message: `Consumo de materiales del área ${area} obtenido correctamente`,
      data: consumption
    };
  }

  // =========================================================================
  // ENDPOINTS PARA VW_ALERTA_STOCK_MINIMO
  // =========================================================================

  /**
   * GET /database-views/stock-alerts
   * Obtiene las alertas de materiales en o por debajo del stock mínimo
   * @returns Lista de alertas de stock mínimo
   */
  @Get('stock-alerts')
  async getMinStockAlerts(): Promise<BaseApplicationResponseDto<MinStockAlertResponseDto[]>> {
    const alerts = await this.databaseViewsService.getMinStockAlerts();
    return {
      statusCode: 200,
      message: alerts.length > 0
        ? `Se encontraron ${alerts.length} alertas de stock mínimo`
        : 'No hay alertas de stock mínimo en este momento',
      data: alerts
    };
  }

  /**
   * GET /database-views/stock-alerts/area/:area
   * Obtiene las alertas de stock mínimo filtradas por área
   * @param area Nombre del área
   * @returns Lista de alertas de stock mínimo del área especificada
   */
  @Get('stock-alerts/area/:area')
  async getMinStockAlertsByArea(@Param('area') area: string): Promise<BaseApplicationResponseDto<MinStockAlertResponseDto[]>> {
    const alerts = await this.databaseViewsService.getMinStockAlertsByArea(area);
    return {
      statusCode: 200,
      message: alerts.length > 0
        ? `Se encontraron ${alerts.length} alertas de stock mínimo para el área ${area}`
        : `No hay alertas de stock mínimo para el área ${area} en este momento`,
      data: alerts
    };
  }

  // =========================================================================
  // ENDPOINTS PARA VW_TAREAS_ATRASADAS
  // =========================================================================

  /**
   * GET /database-views/delayed-tasks
   * Obtiene todas las tareas que están actualmente en proceso
   * @returns Lista de tareas en proceso con días transcurridos
   */
  @Get('delayed-tasks')
  async getDelayedTasks(): Promise<BaseApplicationResponseDto<DelayedTaskResponseDto[]>> {
    const tasks = await this.databaseViewsService.getDelayedTasks();
    return {
      statusCode: 200,
      message: 'Tareas en proceso obtenidas correctamente',
      data: tasks
    };
  }

  /**
   * GET /database-views/delayed-tasks/area/:area
   * Obtiene las tareas en proceso filtradas por área de producción
   * @param area Nombre del área de producción
   * @returns Lista de tareas en proceso del área especificada
   */
  @Get('delayed-tasks/area/:area')
  async getDelayedTasksByArea(@Param('area') area: string): Promise<BaseApplicationResponseDto<DelayedTaskResponseDto[]>> {
    const tasks = await this.databaseViewsService.getDelayedTasksByArea(area);
    return {
      statusCode: 200,
      message: `Tareas en proceso del área ${area} obtenidas correctamente`,
      data: tasks
    };
  }

  /**
   * GET /database-views/delayed-tasks/employee/:employee
   * Obtiene las tareas en proceso filtradas por empleado asignado
   * @param employee Nombre del empleado
   * @returns Lista de tareas en proceso del empleado especificado
   */
  @Get('delayed-tasks/employee/:employee')
  async getDelayedTasksByEmployee(@Param('employee') employee: string): Promise<BaseApplicationResponseDto<DelayedTaskResponseDto[]>> {
    const tasks = await this.databaseViewsService.getDelayedTasksByEmployee(employee);
    return {
      statusCode: 200,
      message: `Tareas en proceso del empleado ${employee} obtenidas correctamente`,
      data: tasks
    };
  }
}
