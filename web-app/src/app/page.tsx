'use client'

import { useState, useEffect } from 'react'
import { Map } from '../components/Map'
import { CreateReportModal } from '../components/CreateReportModal'
import { BountyClaimModal } from '../components/BountyClaimModal'
import HeroSection from '../components/HeroSection'
import ReportCard from '../components/ReportCard'
import { userApi } from '../lib/api'

import { MapPin, Search, TrendingUp, Users, Award } from 'lucide-react'

interface User {
  user_id: number
  user_name: string
}

interface Report {
  id: number
  title: string
  description: string
  bounty: number
  latitude: number
  longitude: number
  radius: number
}

export default function Home() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)

  // Mock user data to avoid 401 authentication errors
  const [user] = useState<User>({ user_id: 1, user_name: "Test User" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await userApi.getAllLostReports();
        const data = response.data;
        if (data && Array.isArray(data)) {
          const reportsData = data.map((report) => ({
            id: report.lost_report_id,
            title: report.title || 'Untitled',
            latitude: report.latitude ? parseFloat(report.latitude) : 0,
            longitude: report.longitude ? parseFloat(report.longitude) : 0,
            description: report.description || '',
            bounty: report.bounty || 0,
            radius: report.radius || 100,
          }));
          setReports(reportsData);
        } else {
          setReports([]);
        }
        setLoading(false);
      } catch (error: unknown) {
        console.error('❌ Error fetching reports:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          code: (error as { code?: string }).code,
          response: (error as { response?: { data?: unknown; status?: number } }).response?.data,
          status: (error as { response?: { status?: number } }).response?.status,
          config: (error as { config?: { url?: string } }).config?.url
        });
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleReportClick = (report: Report) => {
    setSelectedReport(report)
  }

  const handleClaimBounty = (report: Report) => {
    setSelectedReport(report)
    setShowClaimModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">10K+ Users</h3>
            <p className="text-gray-600">Active community members</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">2.5K+ Found</h3>
            <p className="text-gray-600">Items successfully reunited</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">95% Success</h3>
            <p className="text-gray-600">Rate of successful matches</p>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Reports</h2>
            <button className="btn-primary">
              <Search className="h-5 w-5 mr-2" />
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.slice(0, 6).map((report) => (
              <ReportCard
                key={report.id}
                report={{
                  ...report,
                  status: 'lost',
                  createdAt: new Date().toISOString()
                }}
                onViewDetails={handleReportClick}
                onClaimBounty={handleClaimBounty}
              />
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Live Map</h2>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-gray-600">{reports.length} active reports</span>
            </div>
          </div>
          
          <div className="map-container h-96">
            <Map
              reports={reports}
              onReportClick={handleReportClick}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateReportModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={async () => {
          setShowCreateModal(false)
          // Refresh reports after creating a new one
          try {
            const response = await userApi.getAllLostReports();
            const data = response.data;
            if (Array.isArray(data)) {
              const reportsData = data.map((report) => ({
                id: report.lost_report_id,
                title: report.title || 'Untitled',
                latitude: report.latitude ? parseFloat(report.latitude) : 0,
                longitude: report.longitude ? parseFloat(report.longitude) : 0,
                description: report.description || '',
                bounty: report.bounty || 0,
                radius: report.radius || 100,
              }));
              setReports(reportsData);
            }
          } catch (error) {
            console.error('Error refreshing reports:', error);
          }
        }}
        user={user}
      />

      <BountyClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onSuccess={() => {
          setShowClaimModal(false)
          alert('Bounty claim submitted! The item owner will be notified.')
        }}
        report={selectedReport}
        user={user}
      />
    </div>
  )
}