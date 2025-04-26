import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CostTypeService } from './cost-type.service'
import { CostTypeApiResponse, CostTypeQueryParams } from './cost-type.types'

@ApiTags('List Report - Cost Type')
@Controller('')
export class CostTypeController {
  constructor(private readonly costTypeService: CostTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get cost types by cost code' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getCostTypes(@Query() query: CostTypeQueryParams): Promise<CostTypeApiResponse> {
    const { script, deploy, costCodeId } = query

    if (!script || !deploy) {
      return {
        status: 400,
        message: 'Script and deploy parameters are required',
        data: [],
      }
    }

    if (!costCodeId) {
      return {
        status: 400,
        message: 'Cost Code ID is required',
        data: [],
      }
    }

    return this.costTypeService.getCostTypes(costCodeId)
  }
}
