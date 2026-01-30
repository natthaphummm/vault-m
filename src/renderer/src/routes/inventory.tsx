import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'react-toastify'

import InventoryGrid from '@renderer/components/common/InventoryGrid'
import type { Item, InventoryItem } from '@renderer/types'
import { INITIAL_ITEMS, INITIAL_INVENTORY } from '@renderer/data'
import { Search, Filter, Plus } from 'lucide-react'

export const Route = createFileRoute('/inventory')({
  component: Inventory
})

function Inventory() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS)
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterInStock, setFilterInStock] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')
  const [showAmount, setShowAmount] = useState(true)
  const [showPrice, setShowPrice] = useState(true)
  const [showTotalValue, setShowTotalValue] = useState(true)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)

  const handleDeleteItem = (id: number) => {
    if (confirm('Delete this item? Inventory data will be lost.')) {
      setItems((prev) => prev.filter((i) => i.id !== id))
      setInventory((prev) => prev.filter((i) => i.itemId !== id))
      toast.success('Item deleted')
    }
  }

  const handleUpdateAmount = (itemId: number, newAmount: number) => {
    if (newAmount <= 0) {
      setInventory((prev) => prev.filter((i) => i.itemId !== itemId))
    } else {
      setInventory((prev) => {
        const exists = prev.find((i) => i.itemId === itemId)
        return exists
          ? prev.map((i) => (i.itemId === itemId ? { ...i, amount: newAmount } : i))
          : [...prev, { itemId, amount: newAmount }]
      })
    }
  }

  return (
    <div className="p-2">
      <h1 className="mb-4 scroll-m-20 text-2xl font-extrabold tracking-tight text-balance">
        Inventory
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={`Search ...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Options</span>
          </button>
          <button
            onClick={() => {
              setEditingItem(null)
              setIsItemModalOpen(true)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
          >
            <Plus size={16} /> New Item
          </button>
        </div>
      </div>

      <InventoryGrid
        items={items}
        inventory={inventory}
        searchQuery={searchQuery}
        filterInStock={filterInStock}
        filterCategory={filterCategory}
        showAmount={showAmount}
        showPrice={showPrice}
        showTotalValue={showTotalValue}
        onUpdateAmount={handleUpdateAmount}
        onEdit={(item) => {
          setEditingItem(item)
          setIsItemModalOpen(true)
        }}
        onDelete={handleDeleteItem}
      />
    </div>
  )
}
