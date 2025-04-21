export const environments = {
  path_home: process.env.NEXT_PUBLIC_HOME_PATH ?? '',
  isProduction: process.env.NODE_ENV === 'production',
}
