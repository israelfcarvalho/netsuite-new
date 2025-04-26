import { Module } from '@nestjs/common'

import { CostCodeController } from './cost-code.controller'
import { CostCodeService } from './cost-code.service'
import { DivisionModule } from '../division/division.module'

@Module({
  imports: [DivisionModule], // Import DivisionModule to use its service
  controllers: [CostCodeController],
  providers: [CostCodeService],
  exports: [CostCodeService],
})
export class CostCodeModule {}
