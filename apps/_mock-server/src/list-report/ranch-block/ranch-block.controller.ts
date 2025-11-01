import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RanchBlockService } from './ranch-block.service'
import { RanchBlockApiResponse, RanchBlockQueryParams } from './ranch-block.types'

@ApiTags('List Report - Ranch/Block')
@Controller('')
export class RanchBlockController {
  constructor(private readonly ranchBlockService: RanchBlockService) {}

  @Get()
  @ApiOperation({ summary: 'Get ranch/blocks (dynamic filter)' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getRanchBlocks(@Query() query: RanchBlockQueryParams): Promise<RanchBlockApiResponse> {
    const { script, deploy, parentId } = query

    if (!script || !deploy) {
      return {
        status: 400,
        message: 'Script and deploy parameters are required',
        data: [],
      }
    }

    return this.ranchBlockService.getRanchBlocks(parentId)
  }
}
