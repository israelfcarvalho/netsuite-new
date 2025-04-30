import { Injectable } from '@nestjs/common'

import { CropPlanApiResponse, CropPlanLine } from './crop-plan.types'
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
      divisions.slice(0, 1).map(async (division: Division) => {
        // Get cost codes for this division
        const { data: costCodes } = await this.costCodeService.getCostCodes(division.id)
        if (!costCodes.length) {
          return {
            id: division.id,
            name: division.name,
            unitCost: 0,
            initialCost: 0,
            currentPlannedCost: 0,
            projectedCost: 0,
            children: [],
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
                unitCost: 0,
                initialCost: 0,
                currentPlannedCost: 0,
                projectedCost: 0,
                children: [],
              }
            }

            // Create cost type nodes
            const costTypeNodes = costTypes.map((costType: CostType) => ({
              id: costType.id,
              name: costType.name,
              unitCost: Math.random() * 100,
              initialCost: Math.random() * 100,
              currentPlannedCost: Math.random() * 120,
              projectedCost: Math.random() * 150,
              children: [],
            }))

            // Calculate cost code values from its cost types
            const costCodeNode: CropPlanLine = {
              id: costCode.id,
              name: costCode.name,
              unitCost: costTypeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.unitCost, 0),
              initialCost: costTypeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.initialCost, 0),
              currentPlannedCost: costTypeNodes.reduce(
                (sum: number, node: CropPlanLine) => sum + node.currentPlannedCost,
                0
              ),
              projectedCost: costTypeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.projectedCost, 0),
              children: costTypeNodes,
            }

            return costCodeNode
          })
        )

        // Calculate division values from its cost codes
        const divisionNode: CropPlanLine = {
          id: division.id,
          name: division.name,
          unitCost: costCodeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.unitCost, 0),
          initialCost: costCodeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.initialCost, 0),
          currentPlannedCost: costCodeNodes.reduce(
            (sum: number, node: CropPlanLine) => sum + node.currentPlannedCost,
            0
          ),
          projectedCost: costCodeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.projectedCost, 0),
          children: costCodeNodes,
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
        message: 'TypeError: Cannot read property \'sort\' of undefined [at orderByAcresAscending (/SuiteScripts/projects/js_ag_solution/js_ag_service/js-ag-crop-plan.service.js:109:24)]',
        data: [],
      }
    }

    if(cropPlanId == 1){
      return
    }

    console.log('Starting update with 5 second delay...')
    await new Promise(resolve => setTimeout(resolve, 5000))
    console.log('Delay completed, updating data...')

    this.mockDataStore[cropPlanId] = lines
    return {
      status: 200,
      message: 'Success',
      data: lines,
    }
  }

  async getCropPlanLinesByRanch(cropPlanId?: number): Promise<CropPlanApiResponse> {
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

    // Create ranch nodes as the first level
    const ranchNodes = [
      {
        id: 'ranch1',
        name: 'Ranch 1',
        unitCost: 0,
        initialCost: 0,
        currentPlannedCost: 0,
        projectedCost: 0,
        children: [],
      },
      {
        id: 'ranch2',
        name: 'Ranch 2',
        unitCost: 0,
        initialCost: 0,
        currentPlannedCost: 0,
        projectedCost: 0,
        children: [],
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
      ranchNodes.map(async (ranch) => {
        // For each ranch, build the division hierarchy
        const divisionNodes = await Promise.all(
          divisions.slice(0, 1).map(async (division: Division) => {
            // Get cost codes for this division
            const { data: costCodes } = await this.costCodeService.getCostCodes(division.id)
            if (!costCodes.length) {
              return {
                id: division.id,
                name: division.name,
                unitCost: 0,
                initialCost: 0,
                currentPlannedCost: 0,
                projectedCost: 0,
                children: [],
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
                    unitCost: 0,
                    initialCost: 0,
                    currentPlannedCost: 0,
                    projectedCost: 0,
                    children: [],
                  }
                }

                // Create cost type nodes
                const costTypeNodes = costTypes.map((costType: CostType) => ({
                  id: costType.id,
                  name: costType.name,
                  unitCost: Math.random() * 100,
                  initialCost: Math.random() * 100,
                  currentPlannedCost: Math.random() * 120,
                  projectedCost: Math.random() * 150,
                  children: [],
                }))

                // Calculate cost code values from its cost types
                const costCodeNode: CropPlanLine = {
                  id: costCode.id,
                  name: costCode.name,
                  unitCost: costTypeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.unitCost, 0),
                  initialCost: costTypeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.initialCost, 0),
                  currentPlannedCost: costTypeNodes.reduce(
                    (sum: number, node: CropPlanLine) => sum + node.currentPlannedCost,
                    0
                  ),
                  projectedCost: costTypeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.projectedCost, 0),
                  children: costTypeNodes,
                }

                return costCodeNode
              })
            )

            // Calculate division values from its cost codes
            const divisionNode: CropPlanLine = {
              id: division.id,
              name: division.name,
              unitCost: costCodeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.unitCost, 0),
              initialCost: costCodeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.initialCost, 0),
              currentPlannedCost: costCodeNodes.reduce(
                (sum: number, node: CropPlanLine) => sum + node.currentPlannedCost,
                0
              ),
              projectedCost: costCodeNodes.reduce((sum: number, node: CropPlanLine) => sum + node.projectedCost, 0),
              children: costCodeNodes,
            }

            return divisionNode
          })
        )

        // Calculate ranch values from its divisions
        const ranchNode: CropPlanLine = {
          id: ranch.id,
          name: ranch.name,
          unitCost: divisionNodes.reduce((sum: number, node: CropPlanLine) => sum + node.unitCost, 0),
          initialCost: divisionNodes.reduce((sum: number, node: CropPlanLine) => sum + node.initialCost, 0),
          currentPlannedCost: divisionNodes.reduce(
            (sum: number, node: CropPlanLine) => sum + node.currentPlannedCost,
            0
          ),
          projectedCost: divisionNodes.reduce((sum: number, node: CropPlanLine) => sum + node.projectedCost, 0),
          children: divisionNodes,
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

  async updateCropPlanLinesByRanch(cropPlanId: number, lines: CropPlanLine[]): Promise<CropPlanApiResponse | undefined> {
    if (!cropPlanId) {
      return {
        status: 400,
        message: 'Crop Plan ID is required',
        data: [],
      }
    }

    console.log('Starting ranch update with 5 second delay...')
    await new Promise(resolve => setTimeout(resolve, 5000))
    console.log('Delay completed, updating ranch data...')

    this.mockDataStore[cropPlanId] = lines
    return {
      status: 200,
      message: 'Success',
      data: lines,
    }
  }
}
