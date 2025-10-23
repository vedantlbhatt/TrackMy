'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, MapPin, DollarSign, Plus } from 'lucide-react'
import { userApi } from '../lib/api'
import { PaymentModal } from './PaymentModal'

interface User {
  user_id: number
  user_name: string
}

interface Item {
  item_id: number
  name: string
}

interface CreateReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  user: User | null
}

export function CreateReportModal({ isOpen, onClose, onSuccess, user }: CreateReportModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bounty: '',
    radius: 50,
    visibility: 'Public',
  })
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [createdReportId, setCreatedReportId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchUserItems = useCallback(async () => {
    if (!user?.user_id) return

    try {
      const response = await userApi.getItemsByUser(user.user_id)
      setItems(response.data)
    } catch (error) {
      console.error('Failed to fetch items:', error)
    }
  }, [user?.user_id])

  useEffect(() => {
    if (isOpen && user) {
      fetchUserItems()
      getCurrentLocation()
    }
  }, [isOpen, user, fetchUserItems])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) {
        throw new Error('User not found')
      }

      const bountyAmount = parseFloat(formData.bounty) || 0

      const reportData = {
        user_id: user.user_id,
        item_id: selectedItemId || 1, // Use selected item or default to 1
        title: formData.title,
        description: formData.description,
        longitude: location?.lng || 0,
        latitude: location?.lat || 0,
        radius: formData.radius,
        bounty: bountyAmount,
      }

      const response = await userApi.createLostReport(reportData)
      setCreatedReportId(response.data.lost_report_id)

      if (bountyAmount > 0) {
        setShowPaymentModal(true)
      } else {
        onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Failed to create report:', error)
      alert('Failed to create report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    onSuccess()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Report Lost Item</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Item Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Item
              </label>
              <select
                value={selectedItemId || ''}
                onChange={(e) => setSelectedItemId(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose an item...</option>
                {items.map((item) => (
                  <option key={item.item_id} value={item.item_id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the lost item"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Detailed description of the lost item"
                required
              />
            </div>

            {/* Bounty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Bounty Amount (Optional)
              </label>
              <input
                type="number"
                value={formData.bounty}
                onChange={(e) => setFormData({ ...formData, bounty: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                Reward amount for returning this item
              </p>
            </div>

            {/* Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Radius: {formData.radius}m
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={formData.radius}
                onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Location */}
            {location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Creating...' : 'Create Report'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        bountyAmount={parseFloat(formData.bounty) || 0}
        reportId={createdReportId}
      />
    </>
  )
}
