import { Module } from '@nestjs/common'

import { DivisionController } from './division.controller'
import { DivisionService } from './division.service'

@Module({
  controllers: [DivisionController],
  providers: [DivisionService],
  exports: [DivisionService], // Export the service so other modules can use it
})
export class DivisionModule {}
