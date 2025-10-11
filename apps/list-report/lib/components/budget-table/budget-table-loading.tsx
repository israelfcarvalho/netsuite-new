import Image from 'next/image'

export const BudgetTableLoading = () => {
  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8">
          <Image src="/assets/images/jsbos-logo.jpeg" alt="spinner" width={32} height={32} />
        </div>
        <p className="text-lg font-medium">Saving changes...</p>
      </div>
    </div>
  )
}
