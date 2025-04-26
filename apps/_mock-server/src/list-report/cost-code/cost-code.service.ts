import { Injectable } from '@nestjs/common'

import { CostCodeApiResponse, CostCode } from './cost-code.types'
import { DivisionService } from '../division/division.service'

@Injectable()
export class CostCodeService {
  constructor(private readonly divisionService: DivisionService) {}

  private mockDataStore: Record<string, CostCode[]> = {
    '1': [
      {
        id: '1',
        name: 'Cost Code 1',
        cost_code: 'CC001',
        costTypes: ['1', '2'],
      },
      {
        id: '2',
        name: 'Cost Code 2',
        cost_code: 'CC002',
        costTypes: ['3', '4'],
      },
    ],
    '2': [
      {
        id: '3',
        name: 'Cost Code 3',
        cost_code: 'CC003',
        costTypes: ['5', '6'],
      },
      {
        id: '4',
        name: 'Cost Code 4',
        cost_code: 'CC004',
        costTypes: ['7', '8'],
      },
    ],
    '3': [
      {
        id: '5',
        name: 'Cost Code 5',
        cost_code: 'CC005',
        costTypes: ['9', '10'],
      },
      {
        id: '6',
        name: 'Cost Code 6',
        cost_code: 'CC006',
        costTypes: ['11', '12'],
      },
    ],
    '4': [
      {
        id: '7',
        name: 'Cost Code 7',
        cost_code: 'CC007',
        costTypes: ['13', '14'],
      },
      {
        id: '8',
        name: 'Cost Code 8',
        cost_code: 'CC008',
        costTypes: ['15', '16'],
      },
    ],
  }

  async getCostCodes(divisionId?: string): Promise<CostCodeApiResponse> {
    if (!divisionId) {
      return {
        status: 400,
        message: 'Division ID is required',
        data: [],
      }
    }

    const division = this.divisionService.getDivisionById(divisionId)
    if (!division) {
      return {
        status: 404,
        message: `Division ${divisionId} not found`,
        data: [],
      }
    }

    const data = this.mockDataStore[divisionId]
    if (!data) {
      return {
        status: 404,
        message: `Cost codes for division ${divisionId} not found`,
        data: [],
      }
    }

    return {
      status: 200,
      message: 'Success',
      data,
    }
  }

  getCostCodeById(id: string): CostCode | undefined {
    for (const costCodes of Object.values(this.mockDataStore)) {
      const costCode = costCodes.find((cc) => cc.id === id)
      if (costCode) return costCode
    }
    return undefined
  }
}
