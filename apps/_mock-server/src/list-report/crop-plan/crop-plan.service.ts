import { Injectable } from '@nestjs/common'

import {
  CropPlanApiResponse,
  CropPlanLine,
  GetCropPlanLinesHistoryResponse,
  CropPlanLineHistoryItem,
} from './crop-plan.types'
import { CostCodeService } from '../cost-code/cost-code.service'
import { CostCode } from '../cost-code/cost-code.types'
import { CostTypeService } from '../cost-type/cost-type.service'
import { CostType } from '../cost-type/cost-type.types'
import { DivisionService } from '../division/division.service'
import { Division } from '../division/division.types'

@Injectable()
export class CropPlanService {
  constructor(
    private readonly divisionService: DivisionService,
    private readonly costCodeService: CostCodeService,
    private readonly costTypeService: CostTypeService
  ) {}

  private mockDataStore: Record<number, CropPlanLine[]> = {}
  private mockCostTypeData: Record<number, Record<string, Omit<CropPlanLine, 'children'>>> = {}

  async getCropPlanLines(cropPlanId?: number): Promise<CropPlanApiResponse> {
    if (cropPlanId === undefined) {
      return {
        status: 400,
        message: 'Crop Plan ID is required',
        data: [],
      }
    }

    // If we already have data for this crop plan, return it
    if (this.mockDataStore[cropPlanId]) {
      return {
        status: 200,
        message: 'Success',
        data: this.mockDataStore[cropPlanId],
      }
    }

    // Get all divisions
    const { data: divisions } = await this.divisionService.getDivisions()
    if (!divisions.length) {
      return {
        status: 404,
        message: 'No divisions found',
        data: [],
      }
    }

    // Build the crop plan hierarchy
    const cropPlanLines: CropPlanLine[] = await Promise.all(
      divisions.slice(0, 2).map<Promise<CropPlanLine>>(async (division: Division) => {
        // Get cost codes for this division
        const { data: costCodes } = await this.costCodeService.getCostCodes(division.id)
        if (!costCodes.length) {
          return {
            id: division.id,
            name: division.name,
            originalEstimate: 0,
            originalEstimatePerAcre: 0,
            currentEstimate: 0,
            currentEstimatePerAcre: 0,
            projectedEstimate: 0,
            children: [],
            committedCost: 0,
            committedCostPerAcre: 0,
            actualCost: 0,
            actualCostPerAcre: 0,
            totalAcres: 0,
            unitCost: 0,
          }
        }

        // Get cost types for each cost code
        const costCodeNodes = await Promise.all(
          costCodes.slice(0, 1).map(async (costCode: CostCode) => {
            const { data: costTypes } = await this.costTypeService.getCostTypes(costCode.id)
            if (!costTypes.length) {
              return {
                id: costCode.id,
                name: costCode.name,
                originalEstimate: 0,
                originalEstimatePerAcre: 0,
                currentEstimate: 0,
                currentEstimatePerAcre: 0,
                projectedEstimate: 0,
                children: [],
                committedCost: 0,
                committedCostPerAcre: 0,
                actualCost: 0,
                actualCostPerAcre: 0,
                unitCost: 0,
                totalAcres: 0,
              }
            }

            // Create cost type nodes
            const costTypeNodes = costTypes.map((costType: CostType) => {
              const totalAcres = (Math.floor(Math.random() * 10) % 3) + 1
              const committedCost = Math.floor(Math.random() * 80000) + 40000
              const actualCost = Math.floor(Math.random() * 70000) + 35000
              return {
                id: costType.id,
                lineId: costType.id,
                name: costType.name,
                originalEstimate: Math.floor(Math.random() * 100000) + 50000,
                originalEstimatePerAcre: Math.floor(Math.random() * 1000) + 500,
                currentEstimate: Math.floor(Math.random() * 120000) + 60000,
                currentEstimatePerAcre: Math.floor(Math.random() * 1000) + 500,
                projectedEstimate: Math.floor(Math.random() * 110000) + 55000,
                committedCost,
                committedCostPerAcre: 0,
                actualCost,
                actualCostPerAcre: 0,
                unitCost: Math.floor(Math.random() * 100) + 50,
                totalAcres,
              }
            })

            this.mockCostTypeData[cropPlanId] = this.mockCostTypeData[cropPlanId] ?? {}

            costTypeNodes.forEach((costType) => {
              this.mockCostTypeData[cropPlanId]![costType.id] = costType
            })

            // Calculate cost code values from its cost types
            const costCodeCommittedCost = costTypeNodes.reduce(
              (sum: number, node: CropPlanLine) => sum + node.committedCost,
              0
            )
            const costCodeActualCost = costTypeNodes.reduce(
              (sum: number, node: CropPlanLine) => sum + node.actualCost,
              0
            )
            const costCodeTotalAcres = costTypeNodes.reduce(
              (sum: number, node: CropPlanLine) => sum + node.totalAcres,
              0
            )
            const costCodeNode: CropPlanLine = {
              id: costCode.id,
              name: costCode.name,
              originalEstimate: 0,
              originalEstimatePerAcre: 0,
              currentEstimate: 0,
              currentEstimatePerAcre: 0,
              projectedEstimate: 0,
              children: costTypeNodes,
              committedCost: costCodeCommittedCost,
              committedCostPerAcre: 0,
              actualCost: costCodeActualCost,
              actualCostPerAcre: 0,
              unitCost: 0,
              totalAcres: costCodeTotalAcres,
            }

            return costCodeNode
          })
        )

        // Calculate division values from its cost codes
        const divisionCommittedCost = costCodeNodes.reduce(
          (sum: number, node: CropPlanLine) => sum + node.committedCost,
          0
        )
        const divisionActualCost = costCodeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.actualCost, 0)
        const divisionTotalAcres = costCodeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.totalAcres, 0)
        const divisionNode: CropPlanLine = {
          id: division.id,
          name: division.name,
          originalEstimate: 0,
          originalEstimatePerAcre: 0,
          currentEstimate: 0,
          currentEstimatePerAcre: 0,
          projectedEstimate: 0,
          children: costCodeNodes,
          committedCost: divisionCommittedCost,
          committedCostPerAcre: 0,
          actualCost: divisionActualCost,
          actualCostPerAcre: 0,
          unitCost: 0,
          totalAcres: divisionTotalAcres,
          wipInput: 999999,
        }

        return divisionNode
      })
    )

    // Store the generated data
    this.mockDataStore[cropPlanId] = cropPlanLines

    return {
      status: 200,
      message: 'Success',
      data: cropPlanLines,
    }
  }

  async updateCropPlanLines(cropPlanId: number, lines: CropPlanLine[]): Promise<CropPlanApiResponse | undefined> {
    if (!cropPlanId) {
      return {
        status: 400,
        message:
          "TypeError: Cannot read property 'sort' of undefined [at orderByAcresAscending (/SuiteScripts/projects/js_ag_solution/js_ag_service/js-ag-crop-plan.service.js:109:24)]",
        data: [],
      }
    }

    if (cropPlanId == 1) {
      return
    }

    console.log('Starting update with 5 second delay...')
    await new Promise((resolve) => setTimeout(resolve, 5000))
    console.log('Delay completed, updating data...')

    this.mockDataStore[cropPlanId] = lines
    return {
      status: 200,
      message: 'Success',
      data: lines,
    }
  }

  async getCropPlanLinesByRanch(cropPlanId?: number, block?: string): Promise<CropPlanApiResponse> {
    if (cropPlanId === undefined) {
      return {
        status: 400,
        message: 'Crop Plan ID is required',
        data: [],
      }
    }

    // If we already have data for this crop plan, return it
    if (this.mockDataStore[cropPlanId] && !block) {
      return {
        status: 200,
        message: 'Success',
        data: this.mockDataStore[cropPlanId],
      }
    }

    // Create ranch nodes as the first level
    const ranchNodes = [
      {
        id: '9',
        name: 'Ranch',
        originalEstimate: 0,
        originalEstimatePerAcre: 0,
        currentEstimate: 0,
        projectedEstimate: 0,
        children: [],
        committedCost: 0,
        actualCost: 0,
        wipBalance: 0,
      },
      {
        id: '10',
        name: 'Ranch : Field A',
        originalEstimate: 0,
        originalEstimatePerAcre: 0,
        currentEstimate: 0,
        projectedEstimate: 0,
        children: [],
        committedCost: 0,
        actualCost: 0,
        wipBalance: 0,
      },
      {
        id: '27',
        name: 'Ranch : Field B',
        originalEstimate: 0,
        originalEstimatePerAcre: 0,
        currentEstimate: 0,
        projectedEstimate: 0,
        children: [],
        committedCost: 0,
        actualCost: 0,
        wipBalance: 0,
      },
      {
        id: '28',
        name: 'Ranch : Field C',
        originalEstimate: 0,
        originalEstimatePerAcre: 0,
        currentEstimate: 0,
        projectedEstimate: 0,
        children: [],
        committedCost: 0,
        actualCost: 0,
        wipBalance: 0,
      },
    ]

    // Get all divisions
    const { data: divisions } = await this.divisionService.getDivisions()
    if (!divisions.length) {
      return {
        status: 404,
        message: 'No divisions found',
        data: [],
      }
    }

    // Build the crop plan hierarchy with ranch as first level
    const cropPlanLines: CropPlanLine[] = await Promise.all(
      ranchNodes
        .filter((ranch) => (block ? ranch.id === block : true))
        .map(async (ranch) => {
          // For each ranch, build the division hierarchy
          const divisionNodes = await Promise.all(
            divisions.slice(0, 1).map<Promise<CropPlanLine>>(async (division: Division) => {
              // Get cost codes for this division
              const { data: costCodes } = await this.costCodeService.getCostCodes(division.id)
              if (!costCodes.length) {
                return {
                  id: division.id,
                  name: division.name,
                  originalEstimate: 0,
                  originalEstimatePerAcre: 0,
                  currentEstimate: 0,
                  currentEstimatePerAcre: 0,
                  projectedEstimate: 0,
                  children: [],
                  committedCost: 0,
                  committedCostPerAcre: 0,
                  actualCost: 0,
                  actualCostPerAcre: 0,
                  unitCost: 0,
                  totalAcres: 0,
                  wipBalance: 0,
                }
              }

              // Get cost types for each cost code
              const costCodeNodes = await Promise.all(
                costCodes.slice(0, 1).map<Promise<CropPlanLine>>(async (costCode: CostCode) => {
                  const { data: costTypes } = await this.costTypeService.getCostTypes(costCode.id)
                  if (!costTypes.length) {
                    return {
                      id: costCode.id,
                      name: costCode.name,
                      originalEstimate: 0,
                      originalEstimatePerAcre: 0,
                      currentEstimate: 0,
                      currentEstimatePerAcre: 0,
                      projectedEstimate: 0,
                      children: [],
                      committedCost: 0,
                      committedCostPerAcre: 0,
                      actualCost: 0,
                      actualCostPerAcre: 0,
                      unitCost: 0,
                      totalAcres: 0,
                      wipBalance: 0,
                    }
                  }

                  // Create cost type nodes
                  const costTypeNodes = costTypes.map<CropPlanLine>((costType: CostType) => {
                    const totalAcres = (Math.floor(Math.random() * 10) % 3) + 1
                    const committedCost = Math.floor(Math.random() * 80000) + 40000
                    const actualCost = Math.floor(Math.random() * 70000) + 35000
                    return {
                      id: costType.id,
                      lineId: costType.id,
                      name: costType.name,
                      originalEstimate: Math.floor(Math.random() * 100000) + 50000,
                      originalEstimatePerAcre: Math.floor(Math.random() * 1000) + 500,
                      currentEstimate: Math.floor(Math.random() * 120000) + 60000,
                      currentEstimatePerAcre: Math.floor(Math.random() * 1000) + 500,
                      projectedEstimate: Math.floor(Math.random() * 110000) + 55000,
                      committedCost,
                      committedCostPerAcre: 0,
                      actualCost,
                      actualCostPerAcre: 0,
                      unitCost: 0,
                      totalAcres,
                    }
                  })

                  // Calculate cost code values from its cost types
                  const costCodeCommittedCost = costTypeNodes.reduce(
                    (sum: number, node: CropPlanLine) => sum + node.committedCost,
                    0
                  )
                  const costCodeActualCost = costTypeNodes.reduce(
                    (sum: number, node: CropPlanLine) => sum + node.actualCost,
                    0
                  )
                  const costCodeTotalAcres = costTypeNodes.reduce(
                    (sum: number, node: CropPlanLine) => sum + node.totalAcres,
                    0
                  )
                  const costCodeNode: CropPlanLine = {
                    id: costCode.id,
                    name: costCode.name,
                    originalEstimate: 0,
                    originalEstimatePerAcre: 0,
                    currentEstimate: 0,
                    currentEstimatePerAcre: 0,
                    projectedEstimate: 0,
                    children: costTypeNodes,
                    committedCost: costCodeCommittedCost,
                    committedCostPerAcre: 0,
                    actualCost: costCodeActualCost,
                    actualCostPerAcre: 0,
                    unitCost: 0,
                    totalAcres: costCodeTotalAcres,
                  }

                  return costCodeNode
                })
              )

              // Calculate division values from its cost codes
              const divisionCommittedCost = costCodeNodes.reduce(
                (sum: number, node: CropPlanLine) => sum + node.committedCost,
                0
              )
              const divisionActualCost = costCodeNodes.reduce(
                (sum: number, node: CropPlanLine) => sum + node.actualCost,
                0
              )
              const divisionTotalAcres = costCodeNodes.reduce(
                (sum: number, node: CropPlanLine) => sum + node.totalAcres,
                0
              )
              const divisionNode: CropPlanLine = {
                id: division.id,
                name: division.name,
                originalEstimate: 0,
                originalEstimatePerAcre: 0,
                currentEstimate: 0,
                currentEstimatePerAcre: 0,
                projectedEstimate: 0,
                children: costCodeNodes,
                committedCost: divisionCommittedCost,
                committedCostPerAcre: 0,
                actualCost: divisionActualCost,
                actualCostPerAcre: 0,
                unitCost: 0,
                totalAcres: divisionTotalAcres,
              }

              return divisionNode
            })
          )

          // Calculate ranch values from its divisions
          const ranchCommittedCost = divisionNodes.reduce(
            (sum: number, node: CropPlanLine) => sum + node.committedCost,
            0
          )
          const ranchActualCost = divisionNodes.reduce((sum: number, node: CropPlanLine) => sum + node.actualCost, 0)
          const ranchTotalAcres = divisionNodes.reduce((sum: number, node: CropPlanLine) => sum + node.totalAcres, 0)
          const ranchNode: CropPlanLine = {
            id: ranch.id,
            name: ranch.name,
            originalEstimate: 0,
            originalEstimatePerAcre: 0,
            currentEstimate: 0,
            currentEstimatePerAcre: 0,
            projectedEstimate: 0,
            children: divisionNodes,
            committedCost: ranchCommittedCost,
            committedCostPerAcre: 0,
            actualCost: ranchActualCost,
            actualCostPerAcre: 0,
            unitCost: 0,
            wipBalance: 999999,
            totalAcres: ranchTotalAcres,
          }

          return ranchNode
        })
    )

    // Store the generated data
    this.mockDataStore[cropPlanId] = cropPlanLines

    return {
      status: 200,
      message: 'Success',
      data: cropPlanLines,
    }
  }

  async updateCropPlanLinesByRanch(
    cropPlanId: number,
    lines: CropPlanLine[]
  ): Promise<CropPlanApiResponse | undefined> {
    if (!cropPlanId) {
      return {
        status: 400,
        message: 'Crop Plan ID is required',
        data: [],
      }
    }

    console.log('Starting ranch update with 5 second delay...')
    await new Promise((resolve) => setTimeout(resolve, 5000))
    console.log('Delay completed, updating ranch data...')

    this.mockDataStore[cropPlanId] = lines
    return {
      status: 200,
      message: 'Success',
      data: lines,
    }
  }

  async getCropPlanLinesHistory(cropPlanId?: number, lineId?: number): Promise<GetCropPlanLinesHistoryResponse> {
    if (cropPlanId === undefined) {
      throw new Error('Crop Plan ID is required')
    }

    if (lineId === undefined) {
      throw new Error('Cost Type ID is required')
    }

    // Select a random field name or use the first one
    const costType = this.mockCostTypeData[cropPlanId]?.[lineId]

    const fieldNames = [
      'originalEstimate',
      'originalEstimatePerAcre',
      'currentEstimate',
      'currentEstimatePerAcre',
      'projectedEstimate',
    ] satisfies CropPlanLineHistoryItem['name'][]

    // Generate mock history entries
    const historyData = fieldNames.map((fieldName) => {
      const currentValue = costType?.[fieldName] ?? NaN
      const previousValue = Math.floor(Math.random() * 100000) + 50000
      return {
        [fieldName]: [
          {
            currentValue,
            previousValue,
            comment: 'Second budget adjustment',
            date: new Date(Date.now()).toISOString(),
          },
          {
            currentValue: previousValue,
            previousValue: Math.floor(Math.random() * 100000) + 50000,
            comment: 'First budget adjustment',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          },
        ],
      }
    })

    let history: GetCropPlanLinesHistoryResponse['history'] = {}

    historyData.forEach((item) => {
      Object.entries(item).forEach(([fieldName, data]) => {
        const key = fieldName as CropPlanLineHistoryItem['name']

        history = {
          ...history,
          [key]: {
            id: lineId?.toString() ?? '1',
            user: 'John Doe',
            name: fieldName,
            data,
          },
        }
      })
    })

    return {
      history,
    }
  }
}
