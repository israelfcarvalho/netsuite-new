import { Module } from '@nestjs/common'

import { CostTypeController } from './cost-type.controller'
import { CostTypeService } from './cost-type.service'
import { CostCodeModule } from '../cost-code/cost-code.module'

@Module({
  imports: [CostCodeModule], // Import CostCodeModule to use its service
  controllers: [CostTypeController],
  providers: [CostTypeService],
})
export class CostTypeModule {}
