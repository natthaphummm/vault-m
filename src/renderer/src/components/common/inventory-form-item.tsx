import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { Plus } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

import { ItemFormSchema } from '@/types'
import type { Item, ItemForm } from '@/types'

export default function InventoryFormItem({
  item,
  setEditingItem,
  onSave
}: {
  item: Item | null
  setEditingItem: (item: Item | null) => void
  onSave: (values: ItemForm) => void
}) {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      name: item?.name || '',
      price: item?.price || 0,
      category: item?.category || '',
      image: item?.image || ''
    },
    validators: {
      onSubmit: ItemFormSchema
    },
    onSubmit: async ({ value }) => {
      onSave(value)
      form.reset()
    }
  })

  return (
    <Dialog>
      <DialogTrigger>
        <Button onClick={() => setEditingItem}>
          <Plus size={16} />
          <span className="hidden sm:inline">{t('inventory.form-item.title-new')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {item ? t('inventory.form-item.title-edit') : t('inventory.form-item.title-new')}
          </DialogTitle>
        </DialogHeader>
        <form
          id="create-item-form"
          onSubmit={(e) => {
            e.preventDefault()
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
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              {t('inventory.form-item.button-reset')}
            </Button>
            <DialogClose asChild>
              <Button type="submit" form="create-item-form">
                {t('inventory.form-item.button-save')}
              </Button>
            </DialogClose>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
