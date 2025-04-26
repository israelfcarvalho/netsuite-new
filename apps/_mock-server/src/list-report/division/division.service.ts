import { Injectable } from '@nestjs/common'

import { DivisionApiResponse, Division } from './division.types'

@Injectable()
export class DivisionService {
  private mockData: Division[] = [
    {
      id: '1',
      name: 'Division 1',
      costCodes: ['1', '2'],
    },
    {
      id: '2',
      name: 'Division 2',
      costCodes: ['3', '4'],
    },
    {
      id: '3',
      name: 'Division 3',
      costCodes: ['5', '6'],
    },
    {
      id: '4',
      name: 'Division 4',
      costCodes: ['7', '8'],
    },
  ]

  async getDivisions(): Promise<DivisionApiResponse> {
    return {
      status: 200,
      message: 'Success',
      data: this.mockData,
    }
  }

  getDivisionById(id: string): Division | undefined {
    return this.mockData.find((division) => division.id === id)
  }
}
