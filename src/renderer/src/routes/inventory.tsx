import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import InventoryGrid from '@renderer/components/common/InventoryGrid'
import type { Item, InventoryItem } from '@renderer/types'
import { INITIAL_ITEMS, INITIAL_INVENTORY } from '@renderer/data'

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
      // showNotification('Item deleted', 'success')
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
