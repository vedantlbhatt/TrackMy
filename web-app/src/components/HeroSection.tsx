'use client'

import { useState } from 'react'
import { Search, MapPin, Clock, Shield, Users, Award } from 'lucide-react'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { icon: Users, label: 'Active Users', value: '10K+' },
    { icon: MapPin, label: 'Items Found', value: '2.5K+' },
    { icon: Award, label: 'Success Rate', value: '95%' },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%230ea5e9" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <div className="animate-fadeInUp">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Never Lose Anything
              <span className="block text-gradient">Ever Again</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              TrackMy connects lost items with their owners through our advanced location-based 
              matching system. Join thousands who have successfully reunited with their belongings.
            </p>
          </div>

          {/* Search Bar */}
          <div className="animate-fadeInUp max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for lost items (e.g., 'iPhone', 'wallet', 'keys')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg bg-white/80 backdrop-blur-sm"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                Search
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="animate-fadeInUp flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="btn-primary text-lg px-8 py-4">
              <MapPin className="inline h-5 w-5 mr-2" />
              Report Lost Item
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              <Shield className="inline h-5 w-5 mr-2" />
              Found Something?
            </button>
          </div>

          {/* Stats */}
          <div className="animate-fadeInUp grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-200/30 rounded-full blur-xl animate-pulse delay-2000"></div>
    </div>
  )
}
