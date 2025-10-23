'use client'

import { useState } from 'react'
import { User, Settings, Bell, Shield, MapPin, Clock, DollarSign, Edit, Camera, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: null,
    joinDate: '2024-01-15',
    stats: {
      reportsSubmitted: 12,
      itemsFound: 8,
      rewardsEarned: 450,
      successRate: 95
    }
  }

  const recentActivity = [
    {
      id: 1,
      type: 'report',
      title: 'iPhone 13 Pro',
      status: 'active',
      date: '2024-01-20',
      bounty: 200
    },
    {
      id: 2,
      type: 'claim',
      title: 'Black Wallet',
      status: 'completed',
      date: '2024-01-18',
      bounty: 50
    },
    {
      id: 3,
      type: 'report',
      title: 'AirPods Pro',
      status: 'found',
      date: '2024-01-15',
      bounty: 100
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'reports', label: 'My Reports', icon: MapPin },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-white" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-500">
                  <Camera className="h-4 w-4 text-blue-600" />
                </button>
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <p className="text-gray-500 text-sm">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-300"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Reports Submitted</p>
                        <p className="text-3xl font-bold text-gray-900">{user.stats.reportsSubmitted}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Items Found</p>
                        <p className="text-3xl font-bold text-gray-900">{user.stats.itemsFound}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Rewards Earned</p>
                        <p className="text-3xl font-bold text-gray-900">${user.stats.rewardsEarned}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Success Rate</p>
                        <p className="text-3xl font-bold text-gray-900">{user.stats.successRate}%</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Bell className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            activity.status === 'active' ? 'bg-blue-500' :
                            activity.status === 'completed' ? 'bg-green-500' :
                            'bg-yellow-500'
                          }`} />
                          <div>
                            <p className="font-semibold text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600 capitalize">{activity.type} • {activity.date}</p>
                          </div>
                        </div>
                        {activity.bounty > 0 && (
                          <div className="text-right">
                            <p className="font-semibold text-green-600">+${activity.bounty}</p>
                            <p className="text-sm text-gray-600">Reward</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">My Reports</h3>
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No reports yet</h4>
                  <p className="text-gray-600 mb-6">Start by reporting a lost or found item</p>
                  <button className="btn-primary">Create Report</button>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Activity History</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'report' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {activity.type === 'report' ? (
                          <MapPin className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Shield className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">
                          {activity.type === 'report' ? 'Reported' : 'Claimed'} on {activity.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          activity.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.status}
                        </span>
                        {activity.bounty > 0 && (
                          <p className="text-sm text-green-600 mt-1">+${activity.bounty}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      className="input-field"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="input-field"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={user.phone}
                      className="input-field"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div>
                      <h4 className="font-semibold text-gray-900">Notifications</h4>
                      <p className="text-sm text-gray-600">Manage your notification preferences</p>
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-300">
                      <Bell className="h-4 w-4" />
                      <span>Configure</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
