'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MapPin, Clock, DollarSign, Edit, Trash2, Eye, Share2 } from 'lucide-react'

export default function MyItemsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const items = [
    {
      id: 1,
      name: 'iPhone 13 Pro',
      description: 'Lost my iPhone 13 Pro in a black case. Last seen near the coffee shop downtown.',
      category: 'Electronics',
      status: 'active',
      bounty: 200,
      location: 'Central Park, NYC',
      dateCreated: '2024-01-20',
      dateFound: null,
      imageUrl: null,
      reports: 3,
      views: 45
    },
    {
      id: 2,
      name: 'AirPods Pro',
      description: 'Lost my AirPods Pro in a white case. They have a small scratch on the left earbud.',
      category: 'Electronics',
      status: 'found',
      bounty: 100,
      location: 'Times Square, NYC',
      dateCreated: '2024-01-15',
      dateFound: '2024-01-18',
      imageUrl: null,
      reports: 1,
      views: 23
    },
    {
      id: 3,
      name: 'Black Leather Wallet',
      description: 'Found a black leather wallet with some cash and cards. Looking for the owner.',
      category: 'Accessories',
      status: 'pending',
      bounty: 0,
      location: 'Brooklyn Bridge, NYC',
      dateCreated: '2024-01-10',
      dateFound: null,
      imageUrl: null,
      reports: 0,
      views: 12
    }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'active', label: 'Active' },
    { value: 'found', label: 'Found' },
    { value: 'pending', label: 'Pending' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'found': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'found': return 'Found'
      case 'pending': return 'Pending'
      default: return 'Unknown'
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Items</h1>
            <p className="text-xl text-gray-600">Manage your lost and found items</p>
          </div>
          <button className="btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            Add New Item
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search your items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">{items.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-3xl font-bold text-gray-900">
                  {items.filter(item => item.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Found</p>
                <p className="text-3xl font-bold text-gray-900">
                  {items.filter(item => item.status === 'found').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Rewards</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${items.reduce((sum, item) => sum + item.bounty, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {filteredItems.length} items found
            </h2>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Try adjusting your search criteria' : 'Start by adding your first item'}
              </p>
              <button className="btn-primary">
                <Plus className="h-5 w-5 mr-2" />
                Add New Item
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            }>
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                        <span className="text-sm text-gray-500">{item.category}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                    </div>
                    
                    {/* Image placeholder */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center ml-4">
                      <MapPin className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  {/* Location and Date */}
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">{item.location}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{new Date(item.dateCreated).toLocaleDateString()}</span>
                  </div>

                  {/* Bounty */}
                  {item.bounty > 0 && (
                    <div className="flex items-center justify-between mb-4">
                      <div className="bounty-badge">
                        <DollarSign className="inline h-4 w-4 mr-1" />
                        ${item.bounty} Reward
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <span>{item.views} views</span>
                    <span>{item.reports} reports</span>
                    {item.dateFound && (
                      <span className="text-green-600">Found on {new Date(item.dateFound).toLocaleDateString()}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">View</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-300">
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
