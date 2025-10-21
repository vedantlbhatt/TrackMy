'use client'

import { useState } from 'react'
import { X, CreditCard, DollarSign } from 'lucide-react'
import { userApi } from '../lib/api'
import stripePromise from '../lib/stripe'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  bountyAmount: number
  reportId: number | null
}

export function PaymentModal({ isOpen, onClose, onSuccess, bountyAmount, reportId }: PaymentModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    if (!email.trim()) {
      alert('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      // Create payment intent
      const response = await userApi.createPaymentIntent({
        amount: bountyAmount,
        currency: 'usd',
        email,
        ...(reportId && { report_id: reportId }),
      })

      // Initialize Stripe
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      // Present payment sheet
      const { error } = await stripe.confirmPayment({
        clientSecret: response.data.client_secret,
        confirmParams: {
          return_url: window.location.origin,
        },
      })

      if (error) {
        alert(`Payment failed: ${error.message}`)
      } else {
        alert('Payment processed successfully!')
        onSuccess()
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Secure Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pay ${bountyAmount} bounty
            </h3>
            <p className="text-sm text-gray-600">
              This payment will be held in escrow until the item is returned
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center text-sm text-gray-600">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <DollarSign className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Processing...' : `Pay $${bountyAmount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
