import { useTranslation } from 'react-i18next'
import { Filter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useInvFilterStore } from '@/store/useInvFilterStore'

export default function InventoryFilterDialog({
  uniqueItemCategories
}: {
  uniqueItemCategories: string[]
}) {
  const { t } = useTranslation()
  const {
    filterCategory,
    setFilterCategory,
    filterInStock,
    setFilterInStock,
    showAmount,
    setShowAmount,
    showPrice,
    setShowPrice,
    showTotalValue,
    setShowTotalValue
  } = useInvFilterStore()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter size={16} className="mr-2" />
          <span className="hidden sm:inline">{t('inventory.filter.button-filter')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('inventory.filter.dialog-title')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('inventory.filter.category-title')}
            </Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {uniqueItemCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('inventory.filter.filter-title')}
            </Label>
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
              <Label htmlFor="in-stock" className="text-sm font-medium cursor-pointer">
                {t('inventory.filter.filter-in-stock')}
              </Label>
              <Switch id="in-stock" checked={filterInStock} onCheckedChange={setFilterInStock} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('inventory.filter.card-display-title')}
            </Label>
            <div className="grid gap-2">
              {[
                {
                  label: t('inventory.filter.card-display-amount'),
                  state: showAmount,
                  set: setShowAmount,
                  id: 'show-amount'
                },
                {
                  label: t('inventory.filter.card-display-price'),
                  state: showPrice,
                  set: setShowPrice,
                  id: 'show-price'
                },
                {
                  label: t('inventory.filter.card-display-total-value'),
                  state: showTotalValue,
                  set: setShowTotalValue,
                  id: 'show-total'
                }
              ].map((opt) => (
                <div
                  key={opt.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Label htmlFor={opt.id} className="text-sm font-medium cursor-pointer flex-1">
                    {opt.label}
                  </Label>
                  <Checkbox
                    id={opt.id}
                    checked={opt.state}
                    onCheckedChange={(checked) => opt.set(checked as boolean)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
