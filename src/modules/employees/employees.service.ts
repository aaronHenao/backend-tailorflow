import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee, States } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import * as bcrypt from 'bcrypt';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpdateEmployeeResponseDto } from './dto/update-employee-response.dto';

@Injectable()
export class EmployeesService {

    constructor(
        @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
        private readonly rolesService: RolesService
    ){}

    async findAll(): Promise<EmployeeResponseDto[]>{
        const employees = await this.employeeRepository.find({relations: ['role']});

        if(!employees || employees.length === 0){
            throw new NotFoundException('Aún no hay trabajadores en el sistema')
        }
        return employees.map(employee => plainToInstance(EmployeeResponseDto, employee, { excludeExtraneousValues: true }))
    }

    async findByCc(cc: string): Promise<EmployeeResponseDto>{
        const employee = await this.employeeRepository.findOneBy({cc: cc});
        
        if(!employee){
            throw new NotFoundException('El trabajador no existe');
        }

        return plainToInstance(EmployeeResponseDto, employee, {excludeExtraneousValues: true})
    }

    async createEmployee(createEmployee: CreateEmployeeDto): Promise<EmployeeResponseDto>{
        const existingEmployee = await this.employeeRepository.findOneBy({cc: createEmployee.cc});

        if(existingEmployee){
            throw new BadRequestException('El trabajador ya existe')
        }

        const existingRole = await this.rolesService.findById(createEmployee.id_role);

        if(!existingRole){
            throw new NotFoundException('El rol no exite')
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createEmployee.password, saltRounds);
        const newEmployee = this.employeeRepository.create({...createEmployee, password: hashedPassword, state: States.ACTIVE, role: existingRole});
        const savedEmployee = await this.employeeRepository.save(newEmployee);
        return plainToInstance(EmployeeResponseDto, savedEmployee, {excludeExtraneousValues: true})
    }

    async updateEmployee(id: number, updateEmployee: UpdateEmployeeDto): Promise<UpdateEmployeeResponseDto>{
        const employee = await this.employeeRepository.preload({ id_employee: id, ...updateEmployee });

        if (!employee) {
            throw new NotFoundException('El trabajador no existe en el sistema');
        }


        if (updateEmployee.password) {
            const saltRounds = 10;
            employee.password = await bcrypt.hash(updateEmployee.password, saltRounds);
        }

        const savedEmployee = await this.employeeRepository.save(employee);
        return plainToInstance(UpdateEmployeeResponseDto, savedEmployee, {excludeExtraneousValues: true,});
    }

    async deleteEmployee(id: number): Promise<EmployeeResponseDto>{
        const existingEmployee = await this.employeeRepository.findOneBy({id_employee: id});

        if(!existingEmployee){
            throw new NotFoundException('El trabajador no existe')
        }

        await this.employeeRepository.remove(existingEmployee);
        return plainToInstance(EmployeeResponseDto, existingEmployee, {excludeExtraneousValues: true})
    }

}
