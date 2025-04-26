import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CostCodeService } from './cost-code.service'
import { CostCodeApiResponse, CostCodeQueryParams } from './cost-code.types'

@ApiTags('List Report - Cost Code')
@Controller('')
export class CostCodeController {
  constructor(private readonly costCodeService: CostCodeService) {}

  @Get()
  @ApiOperation({ summary: 'Get cost codes by division' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getCostCodes(@Query() query: CostCodeQueryParams): Promise<CostCodeApiResponse> {
    const { script, deploy, divisionId } = query

    if (!script || !deploy) {
      return {
        status: 400,
        message: 'Script and deploy parameters are required',
        data: [],
      }
    }

    return this.costCodeService.getCostCodes(divisionId)
  }
}
