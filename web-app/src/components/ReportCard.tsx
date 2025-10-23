'use client'

import { useState } from 'react'
import { MapPin, Clock, DollarSign, Eye, MessageCircle, Share2, Heart } from 'lucide-react'

interface ReportCardProps {
  report: {
    id: number
    title: string
    description: string
    bounty: number
    latitude: number
    longitude: number
    radius: number
    createdAt?: string
    status?: 'lost' | 'found' | 'pending'
    imageUrl?: string
  }
  onViewDetails?: (report: any) => void
  onClaimBounty?: (report: any) => void
}

export default function ReportCard({ report, onViewDetails, onClaimBounty }: ReportCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isShared, setIsShared] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost': return 'status-lost'
      case 'found': return 'status-found'
      case 'pending': return 'status-pending'
      default: return 'status-lost'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="report-card group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`${getStatusColor(report.status || 'lost')}`}>
              {report.status === 'lost' ? 'Lost' : report.status === 'found' ? 'Found' : 'Pending'}
            </span>
            {report.createdAt && (
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(report.createdAt)}
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {report.title}
          </h3>
          <p className="text-gray-600 line-clamp-2">{report.description}</p>
        </div>
        
        {/* Image placeholder */}
        {report.imageUrl ? (
          <div className="w-20 h-20 rounded-xl overflow-hidden ml-4">
            <img 
              src={report.imageUrl} 
              alt={report.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center ml-4">
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
        )}
      </div>

      {/* Location Info */}
      <div className="flex items-center text-gray-600 mb-4">
        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
        <span className="text-sm">
          {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
        </span>
        <span className="mx-2">•</span>
        <span className="text-sm">Radius: {report.radius}m</span>
      </div>

      {/* Bounty */}
      {report.bounty > 0 && (
        <div className="flex items-center justify-between mb-4">
          <div className="bounty-badge">
            <DollarSign className="inline h-4 w-4 mr-1" />
            ${report.bounty} Reward
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
              isLiked 
                ? 'text-red-600 bg-red-50' 
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">12</span>
          </button>
          
          <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">3</span>
          </button>
          
          <button
            onClick={() => setIsShared(!isShared)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
              isShared 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(report)}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">View</span>
            </button>
          )}
          
          {onClaimBounty && report.bounty > 0 && (
            <button
              onClick={() => onClaimBounty(report)}
              className="btn-success text-sm px-4 py-2"
            >
              Claim
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
