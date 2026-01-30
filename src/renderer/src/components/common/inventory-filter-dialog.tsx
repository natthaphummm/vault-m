import { Filter, CheckSquare, Square, Layers } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export default function InventoryFilterDialog({
  filterCategory,
  setFilterCategory,
  uniqueItemCategories,
  filterInStock,
  setFilterInStock,
  showAmount,
  setShowAmount,
  showPrice,
  setShowPrice,
  showTotalValue,
  setShowTotalValue
}: {
  filterCategory: string
  setFilterCategory: (category: string) => void
  uniqueItemCategories: string[]
  filterInStock: boolean
  setFilterInStock: (inStock: boolean) => void
  showAmount: boolean
  setShowAmount: (show: boolean) => void
  showPrice: boolean
  setShowPrice: (show: boolean) => void
  showTotalValue: boolean
  setShowTotalValue: (show: boolean) => void
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button onClick={() => {}}>
          <Filter size={16} />
          <span className="hidden sm:inline">Options</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Options</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</h4>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-700 text-sm p-2.5 rounded-lg appearance-none focus:border-blue-500 focus:outline-none"
              >
                {uniqueItemCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Layers size={16} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filters</h4>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
              <span className="text-gray-700 text-sm font-medium">In Stock Only</span>
              <button
                onClick={() => setFilterInStock(!filterInStock)}
                className={`w-11 h-6 rounded-full relative transition-colors ${filterInStock ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${filterInStock ? 'left-6' : 'left-1'}`}
                ></div>
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Card Display
            </h4>
            {[
              { label: 'Show Amount', state: showAmount, set: setShowAmount },
              { label: 'Show Unit Price', state: showPrice, set: setShowPrice },
              { label: 'Show Total Value', state: showTotalValue, set: setShowTotalValue }
            ].map((opt, i) => (
              <div
                key={i}
                onClick={() => opt.set(!opt.state)}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${opt.state ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
              >
                <span
                  className={`text-sm font-medium ${opt.state ? 'text-blue-700' : 'text-gray-600'}`}
                >
                  {opt.label}
                </span>
                {opt.state ? (
                  <CheckSquare size={18} className="text-blue-600" />
                ) : (
                  <Square size={18} className="text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
