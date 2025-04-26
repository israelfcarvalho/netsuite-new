export const environments = {
  path_home: '/',
  isProduction: process.env.NODE_ENV === 'production',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
    cropPlan: {
      route: process.env.NEXT_PUBLIC_API_CROP_PLAN_ROUTE ?? '',
      script: process.env.NEXT_PUBLIC_API_CROP_PLAN_SCRIPT_ID ?? '',
      deploy: process.env.NEXT_PUBLIC_API_CROP_PLAN_DEPLOY_ID ?? '',
    },
    division: {
      route: process.env.NEXT_PUBLIC_API_DIVISION_ROUTE ?? '',
      script: process.env.NEXT_PUBLIC_API_DIVISION_SCRIPT_ID ?? '',
      deploy: process.env.NEXT_PUBLIC_API_DIVISION_DEPLOY_ID ?? '',
    },
    costCode: {
      route: process.env.NEXT_PUBLIC_API_COST_CODE_ROUTE ?? '',
      script: process.env.NEXT_PUBLIC_API_COST_CODE_SCRIPT_ID ?? '',
      deploy: process.env.NEXT_PUBLIC_API_COST_CODE_DEPLOY_ID ?? '',
    },
    costType: {
      route: process.env.NEXT_PUBLIC_API_COST_TYPE_ROUTE ?? '',
      script: process.env.NEXT_PUBLIC_API_COST_TYPE_SCRIPT_ID ?? '',
      deploy: process.env.NEXT_PUBLIC_API_COST_TYPE_DEPLOY_ID ?? '',
    },
  },
} as const
