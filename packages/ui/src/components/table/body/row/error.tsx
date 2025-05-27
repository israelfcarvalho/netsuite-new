import { useTableContext } from '../../../context'

export function TableBodyRowError() {
  const { error } = useTableContext()

  return (
    <div role="row" className="flex items-center justify-center w-full">
      <p className="text-neutral-100 bg-danger-40 p-2 text-center">{error}</p>
    </div>
  )
}
