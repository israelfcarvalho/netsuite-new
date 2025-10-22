import { Injectable } from '@nestjs/common'

import { DivisionApiResponse, Division } from './division.types'

@Injectable()
export class DivisionService {
  private mockData: Division[] = [
    {
      id: '1',
      name: 'Division 1',
    },
    {
      id: '2',
      name: 'Division 2',
    },
    {
      id: '3',
      name: 'Division 3',
    },
    {
      id: '4',
      name: 'Division 4',
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
