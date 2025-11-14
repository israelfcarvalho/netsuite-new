import { Injectable } from '@nestjs/common'

import { CostTypeApiResponse, CostType } from './cost-type.types'
import { CostCodeService } from '../cost-code/cost-code.service'

@Injectable()
export class CostTypeService {
  constructor(private readonly costCodeService: CostCodeService) {}

  private mockDataStore: Record<string, CostType[]> = {
    '1': [
      {
        id: '1',
        name: 'Cost Type 1',
        costCodeId: '1',
      },
      {
        id: '2',
        name: 'Cost Type 2',
        costCodeId: '1',
      },
      {
        id: '3',
        name: 'Cost Type 3',
        costCodeId: '1',
      },
      {
        id: '4',
        name: 'Cost Type 4',
        costCodeId: '1',
      },
    ],
    '2': [
      {
        id: '3',
        name: 'Cost Type 3',
        costCodeId: '2',
      },
      {
        id: '4',
        name: 'Cost Type 4',
        costCodeId: '2',
      },
    ],
    '3': [
      {
        id: '5',
        name: 'Cost Type 5',
        costCodeId: '3',
      },
      {
        id: '6',
        name: 'Cost Type 6',
        costCodeId: '3',
      },
    ],
    '4': [
      {
        id: '7',
        name: 'Cost Type 7',
        costCodeId: '4',
      },
      {
        id: '8',
        name: 'Cost Type 8',
        costCodeId: '4',
      },
    ],
    '5': [
      {
        id: '9',
        name: 'Cost Type 9',
        costCodeId: '5',
      },
      {
        id: '10',
        name: 'Cost Type 10',
        costCodeId: '5',
      },
    ],
    '6': [
      {
        id: '11',
        name: 'Cost Type 11',
        costCodeId: '6',
      },
      {
        id: '12',
        name: 'Cost Type 12',
        costCodeId: '6',
      },
    ],
    '7': [
      {
        id: '13',
        name: 'Cost Type 13',
        costCodeId: '7',
      },
      {
        id: '14',
        name: 'Cost Type 14',
        costCodeId: '7',
      },
    ],
    '8': [
      {
        id: '15',
        name: 'Cost Type 15',
        costCodeId: '8',
      },
      {
        id: '16',
        name: 'Cost Type 16',
        costCodeId: '8',
      },
    ],
  }

  async getCostTypes(costCodeId: string): Promise<CostTypeApiResponse> {
    if (!costCodeId) {
      return {
        status: 400,
        message: 'Cost Code ID is required',
        data: [],
      }
    }

    const costCode = this.costCodeService.getCostCodeById(costCodeId)
    if (!costCode) {
      return {
        status: 404,
        message: `Cost code ${costCodeId} not found`,
        data: [],
      }
    }

    const data = this.mockDataStore[costCodeId]
    if (!data) {
      return {
        status: 404,
        message: `Cost types for cost code ${costCodeId} not found`,
        data: [],
      }
    }

    return {
      status: 200,
      message: 'Success',
      data,
    }
  }
}
