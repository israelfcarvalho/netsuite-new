import { Module } from '@nestjs/common'

import { RanchBlockController } from './ranch-block.controller'
import { RanchBlockService } from './ranch-block.service'

@Module({
  controllers: [RanchBlockController],
  providers: [RanchBlockService],
})
export class RanchBlockModule {} 