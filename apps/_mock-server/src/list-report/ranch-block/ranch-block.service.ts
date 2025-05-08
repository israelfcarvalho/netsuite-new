import { Injectable } from '@nestjs/common'

import { RanchBlockApiResponse, RanchBlock } from './ranch-block.types'

@Injectable()
export class RanchBlockService {
  private mockData: RanchBlock[] = [
    { id: '9', name: 'Ranch', parent: '', netsuiteLink: '/app/common/custom/custrecordentry.nl?rectype=422&id=9' },
    { id: '101', name: 'Second Ranch', parent: '', netsuiteLink: '/app/common/custom/custrecordentry.nl?rectype=422&id=101' },
    { id: '31', name: 'Third Ranch', parent: '', netsuiteLink: '/app/common/custom/custrecordentry.nl?rectype=422&id=31' },
    { id: '10', name: 'Ranch : Field A', parent: { id: '9', name: 'Ranch' }, netsuiteLink: '/app/common/custom/custrecordentry.nl?rectype=422&id=10' },
    { id: '27', name: 'Ranch : Field B', parent: { id: '9', name: 'Ranch' }, netsuiteLink: '/app/common/custom/custrecordentry.nl?rectype=422&id=27' },
    { id: '28', name: 'Ranch : Field C', parent: { id: '9', name: 'Ranch' }, netsuiteLink: '/app/common/custom/custrecordentry.nl?rectype=422&id=28' },
    { id: '102', name: 'Second Ranch : Field A', parent: { id: '101', name: 'Second Ranch' }, netsuiteLink: '/app/common/custom/custrecordentry.nl?rectype=422&id=102' },
    { id: '103', name: 'Second Ranch : Field B', parent: { id: '101', name: 'Second Ranch' }, netsuiteLink: '/app/common/custom/custrecordentry.nl?rectype=422&id=103' },
  ]

  async getRanchBlocks(parentId?: string): Promise<RanchBlockApiResponse> {
    const data = parentId
      ? this.mockData.filter((block) => typeof block.parent === 'object' && block.parent.id === parentId)
      : this.mockData.filter((block) => !block.parent)
    return {
      status: 200,
      message: 'Success',
      data,
    }
  }
} 