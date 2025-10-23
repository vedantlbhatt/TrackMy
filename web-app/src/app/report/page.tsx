'use client'

import { useState } from 'react'
import { MapPin, Camera, DollarSign, AlertCircle, CheckCircle, Upload } from 'lucide-react'
import { ReportMap } from '../../components/ReportMap'
import { userApi } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'

export default function ReportPage() {
  const { user } = useAuth()
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    latitude: 0,
    longitude: 0,
    radius: 100,
    bounty: 0,
    contactInfo: '',
    images: [] as File[]
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedReportId, setSubmittedReportId] = useState<number | null>(null)

  const categories = [
    'Electronics', 'Clothing', 'Accessories', 'Documents', 
    'Keys', 'Jewelry', 'Sports', 'Books', 'Other'
  ]

  const steps = [
    { number: 1, title: 'Type', description: 'Lost or Found' },
    { number: 2, title: 'Details', description: 'Item Information' },
    { number: 3, title: 'Location', description: 'Where it happened' },
    { number: 4, title: 'Reward', description: 'Optional bounty' },
    { number: 5, title: 'Review', description: 'Confirm details' }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError('You must be logged in to submit a report')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // For now, use a default user_id since we're using Supabase auth
      // In a real app, you'd need to map Supabase user to your backend user
      const userId = 1 // This should be mapped from Supabase user
      
      const reportData = {
        user_id: userId,
        item_id: 1, // Default item ID for now
        title: formData.title,
        description: formData.description,
        longitude: formData.longitude,
        latitude: formData.latitude,
        radius: formData.radius,
        bounty: formData.bounty,
      }

      let response;
      if (reportType === 'lost') {
        response = await userApi.createLostReport(reportData)
      } else {
        response = await userApi.createFoundReport({
          founder_id: userId,
          item_id: 1,
          title: formData.title,
          description: formData.description,
          longitude: formData.longitude,
          latitude: formData.latitude,
          radius: formData.radius,
        })
      }

      // Success - show success state
      setSubmittedReportId(response.data.lost_report_id || response.data.found_report_id)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to submit report:', error)
      setSubmitError('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      latitude: 0,
      longitude: 0,
      radius: 100,
      bounty: 0,
      contactInfo: '',
      images: []
    })
    setCurrentStep(1)
    setIsSubmitted(false)
    setSubmittedReportId(null)
    setSubmitError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success State */}
        {isSubmitted && (
          <div className="text-center mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Report Submitted Successfully!
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Your {reportType} item report has been submitted and is now live on the platform.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Report ID:</span>
                  <span className="text-gray-900 font-mono">#{submittedReportId}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reportType === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {reportType === 'lost' ? 'Lost Item' : 'Found Item'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Title:</span>
                  <span className="text-gray-900">{formData.title}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="btn-primary"
                >
                  Submit Another Report
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-secondary"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        {!isSubmitted && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {reportType === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
            </h1>
            <p className="text-xl text-gray-600">
              Help us connect items with their owners
            </p>
          </div>
        )}

        {/* Progress Steps */}
        {!isSubmitted && (
          <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{step.number}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Form Content */}
        {!isSubmitted && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Report Type */}
          {currentStep === 1 && (
            <div className="animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What happened?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setReportType('lost')}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                    reportType === 'lost'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">I Lost Something</h3>
                    <p className="text-gray-600">Report an item you've lost and want to find</p>
                  </div>
                </button>

                <button
                  onClick={() => setReportType('found')}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                    reportType === 'found'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">I Found Something</h3>
                    <p className="text-gray-600">Report an item you found and want to return</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Item Details */}
          {currentStep === 2 && (
            <div className="animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Item Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., iPhone 13 Pro, Black Leather Wallet"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the item in detail..."
                    rows={4}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category.toLowerCase()}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="btn-primary cursor-pointer inline-block mt-4">
                      Choose Files
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Where did this happen? *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Central Park, New York"
                    className="input-field"
                    required
                  />
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-900">Select Location on Map</h3>
                  </div>
                  <div className="h-96 rounded-lg overflow-hidden">
                    <ReportMap 
                      latitude={formData.latitude}
                      longitude={formData.longitude}
                      radius={formData.radius}
                      onLocationChange={(lat, lng) => {
                        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))
                      }}
                      onRadiusChange={(newRadius) => {
                        setFormData(prev => ({ ...prev, radius: newRadius }))
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Search Radius: {formData.radius}m
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={formData.radius}
                        onChange={(e) => {
                          const newRadius = parseInt(e.target.value)
                          handleInputChange('radius', newRadius)
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #007AFF 0%, #007AFF ${((formData.radius - 10) / (1000 - 10)) * 100}%, #e5e7eb ${((formData.radius - 10) / (1000 - 10)) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10m</span>
                        <span>500m</span>
                        <span>1000m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Reward */}
          {currentStep === 4 && (
            <div className="animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reward (Optional)</h2>
              <div className="space-y-6">
                <div className="bg-yellow-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <DollarSign className="h-5 w-5 text-yellow-600 mr-2" />
                    <h3 className="font-semibold text-yellow-900">Bounty Amount</h3>
                  </div>
                  <p className="text-yellow-800 mb-4">
                    Offering a reward increases the chances of finding your item
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-900">$</span>
                    <input
                      type="number"
                      value={formData.bounty}
                      onChange={(e) => handleInputChange('bounty', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="text-3xl font-bold border-none bg-transparent w-32"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Information *
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                    placeholder="Phone number or email"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Report</h2>
              
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-800">{submitError}</span>
                  </div>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reportType === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {reportType === 'lost' ? 'Lost Item' : 'Found Item'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Title:</span>
                  <span className="text-gray-900">{formData.title || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="text-gray-900 capitalize">{formData.category || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="text-gray-900">{formData.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Reward:</span>
                  <span className="text-gray-900">${formData.bounty || 0}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center space-x-4">
              {currentStep < 5 ? (
                <button onClick={nextStep} className="btn-primary">
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
