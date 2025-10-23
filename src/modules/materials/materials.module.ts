import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { MaterialConsumption } from './entities/material-consumption.entity';
import { AreasModule } from '../areas/areas.module';

@Module({
  imports:[TypeOrmModule.forFeature([Material, MaterialConsumption]), AreasModule],
  providers: [MaterialsService],
  controllers: [MaterialsController]
})
export class MaterialsModule {}
