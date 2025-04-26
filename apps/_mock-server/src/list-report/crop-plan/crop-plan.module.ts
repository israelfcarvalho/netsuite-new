import { Module } from '@nestjs/common'

import { CropPlanController } from './crop-plan.controller'
import { CropPlanService } from './crop-plan.service'
import { CostCodeModule } from '../cost-code/cost-code.module'
import { CostCodeService } from '../cost-code/cost-code.service'
import { CostTypeModule } from '../cost-type/cost-type.module'
import { CostTypeService } from '../cost-type/cost-type.service'
import { DivisionModule } from '../division/division.module'
import { DivisionService } from '../division/division.service'

@Module({
  imports: [DivisionModule, CostCodeModule, CostTypeModule],
  controllers: [CropPlanController],
  providers: [CropPlanService, DivisionService, CostCodeService, CostTypeService],
})
export class CropPlanModule {}
