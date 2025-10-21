'use client'

import { useState } from 'react'
import { X, DollarSign, MessageSquare, User } from 'lucide-react'
import { userApi } from '../lib/api'

interface User {
  user_id: number
  user_name: string
}

interface Report {
  id: number
  title: string
  description: string
  bounty: number
}

interface BountyClaimModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  report: Report | null
  user: User | null
}

export function BountyClaimModal({ isOpen, onClose, onSuccess, report, user }: BountyClaimModalProps) {
  const [claimMessage, setClaimMessage] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!claimMessage.trim()) {
      alert('Please provide details about how you found the item')
      return
    }

    if (!contactInfo.trim()) {
      alert('Please provide your contact information')
      return
    }

    setLoading(true)
    try {
      if (!report?.id || !user?.user_id) {
        throw new Error('Missing required data for bounty claim')
      }

      await userApi.createBountyClaim({
        report_id: report.id,
        finder_id: user.user_id,
        claim_message: claimMessage,
        contact_info: contactInfo,
      })
      
      onSuccess()
    } catch (error) {
      console.error('Failed to submit claim:', error)
      alert('Failed to submit claim. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !report) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Claim Bounty</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Bounty Amount */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${report.bounty}
            </div>
            <p className="text-sm text-gray-600">Bounty Reward</p>
          </div>

          {/* Item Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-sm text-gray-600">{report.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Claim Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                How did you find this item?
              </label>
              <textarea
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Describe where and how you found the item..."
                required
              />
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Your Contact Information
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Phone number or email"
                required
              />
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    The item owner will be notified and can verify your claim.
                    If approved, you&apos;ll receive the bounty payment.
                  </p>
                </div>
              </div>
            </div>

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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <DollarSign className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
