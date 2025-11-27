export function searchEngine<T extends object>(values: T[], searchKey: (keyof T)[], search: string) {
  const [...searchParams] = search.toLowerCase().trim().split(' ')

  return values.filter((value) => {
    return searchParams.every((searchParam) => {
      return searchKey.find((key) => {
        const fieldToSearch = value[key]

        if (typeof fieldToSearch === 'string') {
          return fieldToSearch.toLowerCase().includes(searchParam)
        }
      })
    })
  })
}
