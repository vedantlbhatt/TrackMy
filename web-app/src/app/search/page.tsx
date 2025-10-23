'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Clock, DollarSign, Grid, List } from 'lucide-react'
import ReportCard from '@/components/ReportCard'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    bounty: 'all',
    dateRange: 'all'
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const categories = [
    'Electronics', 'Clothing', 'Accessories', 'Documents', 
    'Keys', 'Jewelry', 'Sports', 'Books', 'Other'
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'lost', label: 'Lost Items' },
    { value: 'found', label: 'Found Items' },
    { value: 'pending', label: 'Pending' }
  ]

  const bountyOptions = [
    { value: 'all', label: 'Any Reward' },
    { value: 'yes', label: 'With Reward' },
    { value: 'no', label: 'No Reward' }
  ]

  const dateRangeOptions = [
    { value: 'all', label: 'Any Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ]

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        title: 'iPhone 13 Pro',
        description: 'Lost my iPhone 13 Pro in a black case. Last seen near the coffee shop downtown.',
        bounty: 200,
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 100,
        status: 'lost',
        createdAt: '2024-01-15T10:30:00Z',
        imageUrl: null
      },
      {
        id: 2,
        title: 'Black Leather Wallet',
        description: 'Found a black leather wallet with some cash and cards. Looking for the owner.',
        bounty: 0,
        latitude: 40.7589,
        longitude: -73.9851,
        radius: 50,
        status: 'found',
        createdAt: '2024-01-14T15:45:00Z',
        imageUrl: null
      },
      {
        id: 3,
        title: 'AirPods Pro',
        description: 'Lost my AirPods Pro in a white case. They have a small scratch on the left earbud.',
        bounty: 100,
        latitude: 40.7505,
        longitude: -73.9934,
        radius: 150,
        status: 'lost',
        createdAt: '2024-01-13T09:20:00Z',
        imageUrl: null
      }
    ]
    
    setTimeout(() => {
      setReports(mockReports)
      setLoading(false)
    }, 1000)
  }, [])

  const handleViewDetails = (report: any) => {
    console.log('View details for:', report)
  }

  const handleClaimBounty = (report: any) => {
    console.log('Claim bounty for:', report)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Search Items</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for lost or found items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="input-field"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filters.bounty}
              onChange={(e) => setFilters({...filters, bounty: e.target.value})}
              className="input-field"
            >
              {bountyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="input-field"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner"></div>
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {reports.length} items found
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Near you</span>
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            }>
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onViewDetails={handleViewDetails}
                  onClaimBounty={handleClaimBounty}
                />
              ))}
            </div>

            {reports.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button className="btn-primary">
                  Report a Lost Item
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
