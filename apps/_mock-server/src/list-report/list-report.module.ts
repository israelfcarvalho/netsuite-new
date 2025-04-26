import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'

import { CostCodeModule } from './cost-code/cost-code.module'
import { CostTypeModule } from './cost-type/cost-type.module'
import { CropPlanModule } from './crop-plan/crop-plan.module'
import { DivisionModule } from './division/division.module'

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'list-report',
        children: [
          { path: 'crop-plan', module: CropPlanModule },
          { path: 'cost-code', module: CostCodeModule },
          { path: 'cost-type', module: CostTypeModule },
          { path: 'division', module: DivisionModule },
        ],
      },
    ]),
    CropPlanModule,
    CostCodeModule,
    CostTypeModule,
    DivisionModule,
  ],
})
export class ListReportModule {}
