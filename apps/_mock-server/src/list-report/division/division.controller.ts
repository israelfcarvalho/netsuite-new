import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { DivisionService } from './division.service'
import { DivisionApiResponse, DivisionQueryParams } from './division.types'

@ApiTags('List Report - Division')
@Controller('')
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all divisions' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getDivisions(@Query() query: DivisionQueryParams): Promise<DivisionApiResponse> {
    const { script, deploy } = query

    if (!script || !deploy) {
      return {
        status: 400,
        message: 'Script and deploy parameters are required',
        data: [],
      }
    }

    return this.divisionService.getDivisions()
  }
}
