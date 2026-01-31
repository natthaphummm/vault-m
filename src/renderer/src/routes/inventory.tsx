import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { toast } from 'react-toastify'

import InventoryGrid from '@/components/common/inventory-grid'
import InventorySearchSection from '@/components/common/inventory-search-bar'
import InventoryFormItem from '@renderer/components/common/inventory-form-item'
import InventoryFilterDialog from '@/components/common/inventory-filter-dialog'

import type { Item, InventoryItem, ItemForm } from '@renderer/types'
import { INITIAL_ITEMS, INITIAL_INVENTORY } from '@renderer/data'

export const Route = createFileRoute('/inventory')({
  component: Inventory
})

function Inventory() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS)
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  const uniqueItemCategories = useMemo(
    () => ['All', ...Array.from(new Set(items.map((i) => i.category || 'General')))],
    [items]
  )

  const handleSaveItem = (formData: ItemForm) => {
    const newItem: Item = {
      id: editingItem?.id || Date.now(),
      name: formData.name,
      price: formData.price,
      category: formData.category,
      image: formData.image
    }

    if (editingItem) {
      setItems((prev) => prev.map((i) => (i.id === newItem.id ? newItem : i)))
      toast.success('Item updated')
    } else {
      setItems((prev) => [...prev, newItem])
      toast.success('Item created')
    }
    setEditingItem(null)
  }

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

      <div className="flex flex-row justify-between items-center mb-6 gap-2">
        <InventorySearchSection />
        <InventoryFilterDialog uniqueItemCategories={uniqueItemCategories} />
        <InventoryFormItem
          item={editingItem}
          setEditingItem={() => {
            setEditingItem(null)
          }}
          onSave={handleSaveItem}
        />
      </div>

      <InventoryGrid
        items={items}
        inventory={inventory}
        onUpdateAmount={handleUpdateAmount}
        onEdit={(item) => {
          setEditingItem(item)
        }}
        onDelete={handleDeleteItem}
      />
    </div>
  )
}
