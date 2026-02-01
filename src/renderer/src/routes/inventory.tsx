import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

import InventoryGrid from '@/components/common/inventory-grid'
import InventorySearchSection from '@/components/common/inventory-search-bar'
import InventoryFormItem from '@renderer/components/common/inventory-form-item'
import InventoryFilterDialog from '@/components/common/inventory-filter-dialog'

import type { Item, ItemForm } from '@renderer/types'

export const Route = createFileRoute('/inventory')({
  component: Inventory
})

function Inventory() {
  const queryClient = useQueryClient()
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { t } = useTranslation()

  const { data: items = [] } = useQuery({
    queryKey: ['items'],
    queryFn: async () => await window.api.getItems()
  })

  const { data: inventory = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => await window.api.getInventory()
  })

  const uniqueItemCategories = useMemo(
    () => ['All', ...Array.from(new Set(items.map((i) => i.category || 'General')))],
    [items]
  )

  const saveItemMutation = useMutation({
    mutationFn: (item: Item) => window.api.saveItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success(editingItem ? 'Item updated' : 'Item created')
      setEditingItem(null)
      setIsDialogOpen(false)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to save item')
    }
  })

  const deleteItemMutation = useMutation({
    mutationFn: (id: number) => window.api.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      toast.success('Item deleted')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to delete item')
    }
  })

  const updateInventoryMutation = useMutation({
    mutationFn: ({ itemId, amount }: { itemId: number; amount: number }) =>
      window.api.updateInventory(itemId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to update inventory')
    }
  })

  const handleSaveItem = (formData: ItemForm) => {
    const newItem: Item = {
      id: editingItem?.id || Date.now(),
      name: formData.name,
      price: formData.price,
      category: formData.category,
      image: formData.image
    }
    saveItemMutation.mutate(newItem)
  }

  const handleDeleteItem = (id: number) => {
    if (confirm('Delete this item? Inventory data will be lost.')) {
      deleteItemMutation.mutate(id)
    }
  }

  const handleUpdateAmount = (itemId: number, newAmount: number) => {
    updateInventoryMutation.mutate({ itemId, amount: newAmount })
  }

  return (
    <div className="w-full">
      <div className="px-4 md:px-6 pt-4 md:pt-6">
        <h1 className="mb-4 scroll-m-20 text-2xl font-extrabold tracking-tight text-balance">
          Inventory
        </h1>

        <div className="flex flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <InventorySearchSection />
          <InventoryFilterDialog uniqueItemCategories={uniqueItemCategories} />
          <Button
            onClick={() => {
              setEditingItem(null)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t('inventory.form-item.title-new')}</span>
          </Button>

          <InventoryFormItem
            item={editingItem}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSave={handleSaveItem}
          />
        </div>
      </div>

      <InventoryGrid
        items={items}
        inventory={inventory}
        onUpdateAmount={handleUpdateAmount}
        onEdit={(item) => {
          setEditingItem(item)
          setIsDialogOpen(true)
        }}
        onDelete={handleDeleteItem}
      />
    </div>
  )
}
