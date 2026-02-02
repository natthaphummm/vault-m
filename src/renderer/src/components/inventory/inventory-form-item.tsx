import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { useEffect } from 'react'
import { useInventoryStore } from '@/store/useInventoryStore'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

import { ItemFormSchema } from '@/types'
import type { ItemForm } from '@/types'

export default function InventoryFormItem({
  onOpenChange,
  onSave
}: {
  onOpenChange: (open: boolean) => void
  onSave: (values: ItemForm) => void
}) {
  const { editingItem, isDialogOpen } = useInventoryStore()

  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      name: editingItem?.name || '',
      price: editingItem?.price || 0,
      amount: editingItem?.amount || 0,
      category: editingItem?.category || '',
      image: editingItem?.image || ''
    },
    validators: {
      onSubmit: ItemFormSchema
    },
    onSubmit: async ({ value }) => {
      onSave(value)
      form.reset()
    }
  })

  // Reset form when item changes or dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      form.reset({
        name: editingItem?.name || '',
        price: editingItem?.price || 0,
        amount: editingItem?.amount || 0,
        category: editingItem?.category || '',
        image: editingItem?.image || ''
      })
    }
  }, [editingItem, isDialogOpen])

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingItem ? t('inventory.form-item.title-edit') : t('inventory.form-item.title-new')}
          </DialogTitle>
        </DialogHeader>
        <form
          id="create-item-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('inventory.form-item.label-name')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder={t('inventory.form-item.label-name')}
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.Field
              name="price"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('inventory.form-item.label-price')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      aria-invalid={isInvalid}
                      placeholder={t('inventory.form-item.label-price')}
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.Field
              name="amount"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('inventory.form-item.label-amount')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      aria-invalid={isInvalid}
                      placeholder={t('inventory.form-item.label-amount')}
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.Field
              name="category"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('inventory.form-item.label-category')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder={t('inventory.form-item.label-category')}
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.Field
              name="image"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('inventory.form-item.label-image')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder={t('inventory.form-item.label-image')}
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('inventory.form-item.button-cancel')}
            </Button>
            <Button type="submit" form="create-item-form">
              {t('inventory.form-item.button-save')}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
