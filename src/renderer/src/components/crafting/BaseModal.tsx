import React from 'react'
import { X } from 'lucide-react'

export const BaseModal = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  maxWidth = 'max-w-md'
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  maxWidth?: string
}) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`bg-white border border-gray-200 w-full ${maxWidth} rounded-2xl shadow-2xl relative my-8 overflow-hidden transform transition-all`}
      >
        <div className="p-6 pb-4 mb-0 flex justify-between items-center border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
            <span className="text-blue-600">{icon}</span>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
