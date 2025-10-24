import { Controller, Get, Param, Patch, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user/get-user.decorator';
import { TasksService } from './tasks.service';
import { Employee } from '../employees/entities/employee.entity';
import { BaseApplicationResponseDto } from 'src/common/dto/base-application-response.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {

    constructor(private readonly tasksService: TasksService) { }

    //Para admin
    @Get()
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async findAll(): Promise<BaseApplicationResponseDto<TaskResponseDto[]>> {
        const tasks = await this.tasksService.findAll();
        return {
            statusCode: 200,
            message: 'Tareas obtenidas correctamente',
            data: tasks
        };
    }

    @Get('assigned')
    @UseGuards(RolesGuard)
    @Roles('ESQUELETERIA', 'CORTE', 'TAPICERO', 'COSTURERO', 'PINTOR')
    async getAssignedTasks(@GetUser() user: Employee): Promise<BaseApplicationResponseDto<TaskResponseDto[]>> {
        const tasks = await this.tasksService.findAssignedTasks(user.id_employee);
        return {
            statusCode: 200,
            message: 'Tareas asignadas obtenidas correctamente',
            data: tasks
        };
    }



    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('ESQUELETERIA', 'CORTE', 'TAPICERO', 'COSTURERO', 'PINTOR')
    async findById(@Param('id') id: string): Promise<BaseApplicationResponseDto<TaskResponseDto>> {
        const task = await this.tasksService.findById(+id);
        return {
            statusCode: 200,
            message: 'Tarea obtenida correctamente',
            data: task
        };
    }

    @Patch(':id/start')
    @UseGuards(RolesGuard)
    @Roles('ESQUELETERIA', 'CORTE', 'TAPICERO', 'COSTURERO', 'PINTOR')
    async startTask(@Param('id') idTask: string, @GetUser() user: Employee): Promise<BaseApplicationResponseDto<TaskResponseDto>> {
        const updatedTask = await this.tasksService.startTask(+idTask, user.id_employee);
        return {
            statusCode: 201,
            message: 'Tarea marcada como "En Proceso" y fecha de inicio registrada',
            data: updatedTask
        };
    }

    @Patch(':id/complete')
    @UseGuards(RolesGuard)
    @Roles('ESQUELETERIA', 'CORTE', 'TAPICERO', 'COSTURERO', 'PINTOR')
    async completeTask(@Param('id') idTask: string, @GetUser() user: Employee): Promise<BaseApplicationResponseDto<TaskResponseDto>> {
        const updatedTask = await this.tasksService.completeTask(+idTask, user.id_employee);
        return {
            statusCode: 201,
            message: 'Tarea completada exitosamente y fecha de fin registrada',
            data: updatedTask
        };
    }

}