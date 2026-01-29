import { useMemo } from 'react'
import { Trash2, HelpCircle, Edit } from 'lucide-react'

import type { Item, InventoryItem } from '@renderer/types'

export default function InventoryGrid({
  items,
  inventory,
  searchQuery,
  filterInStock,
  filterCategory,
  showAmount,
  showPrice,
  showTotalValue,
  onUpdateAmount,
  onEdit,
  onDelete
}: {
  items: Item[]
  inventory: InventoryItem[]
  searchQuery: string
  filterInStock: boolean
  filterCategory: string
  showAmount: boolean
  showPrice: boolean
  showTotalValue: boolean
  onUpdateAmount: (id: number, amt: number) => void
  onEdit: (item: Item) => void
  onDelete: (id: number) => void
}) {
  const displayData = useMemo(() => {
    return items
      .map((item) => {
        const inv = inventory.find((i) => i.itemId === item.id)
        return { ...item, amount: inv ? inv.amount : 0 }
      })
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesInStock = filterInStock ? item.amount > 0 : true
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory
        return matchesSearch && matchesInStock && matchesCategory
      })
  }, [items, inventory, searchQuery, filterInStock, filterCategory])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
      {displayData.map((item) => (
        <div
          key={item.id}
          className={`group relative aspect-square bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col
                ${item.amount === 0 ? 'opacity-60 grayscale' : ''}`}
        >
          {/* Image Area */}
          <div className="flex-1 flex items-center justify-center p-6 relative z-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <HelpCircle size={48} className="text-gray-300" />
            )}
          </div>

          {/* Top Right Badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10 pointer-events-none">
            {showAmount && (
              <div className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                x{item.amount.toLocaleString()}
              </div>
            )}
            {showPrice && (
              <div className="bg-white text-green-600 text-[10px] font-bold px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                ${item.price.toLocaleString()}
              </div>
            )}
            {showTotalValue && (
              <div className="bg-white text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                Σ ${(item.price * item.amount).toLocaleString()}
              </div>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <div className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wide">
              {item.category.substring(0, 8)}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute inset-x-0 bottom-0 p-3 z-10 bg-white border-t border-gray-100">
            <div className="font-bold text-gray-800 text-sm truncate text-center">{item.name}</div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 shadow-md">
              <button
                onClick={() => onUpdateAmount(item.id, item.amount - 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 font-bold transition-colors text-lg"
              >
                -
              </button>
              <span className="w-10 text-center text-sm font-bold text-gray-800">
                {item.amount}
              </span>
              <button
                onClick={() => onUpdateAmount(item.id, item.amount + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 font-bold transition-colors text-lg"
              >
                +
              </button>
            </div>
            {showAmount || showPrice || showTotalValue ? null : (
              <div className="text-[10px] text-gray-500 font-mono flex flex-col items-center">
                <span className="text-green-600">${item.price.toLocaleString()}</span>
                <span>x{item.amount}</span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="p-2 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-gray-500 rounded-lg transition-all shadow-sm"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-500 rounded-lg transition-all shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
      {displayData.length === 0 && (
        <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          No items found
        </div>
      )}
    </div>
  )
}
