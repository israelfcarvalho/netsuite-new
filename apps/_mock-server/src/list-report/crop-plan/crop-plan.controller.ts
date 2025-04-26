import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CropPlanService } from './crop-plan.service'
import { CropPlanApiResponse, CropPlanQueryParams } from './crop-plan.types'

@ApiTags('List Report - Crop Plan')
@Controller('')
export class CropPlanController {
  constructor(private readonly cropPlanService: CropPlanService) {}

  @Get()
  @ApiOperation({ summary: 'Get crop plan lines hierarchy' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getCropPlanLines(@Query() query: CropPlanQueryParams): Promise<CropPlanApiResponse> {
    const { script, deploy, action, cropPlanId } = query

    if (!script || !deploy) {
      return {
        status: 400,
        message: 'Script and deploy parameters are required',
        data: [],
      }
    }

    if (action !== 'get-lines-hierarchy') {
      return {
        status: 400,
        message: 'Invalid action. Expected: get-lines-hierarchy',
        data: [],
      }
    }

    return this.cropPlanService.getCropPlanLines(cropPlanId)
  }
}
