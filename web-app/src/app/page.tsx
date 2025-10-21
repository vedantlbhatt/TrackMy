'use client'

import { useState, useEffect } from 'react'
import { Map } from '../components/Map'
import { ReportList } from '../components/ReportList'
import { CreateReportModal } from '../components/CreateReportModal'
import { BountyClaimModal } from '../components/BountyClaimModal'
import { userApi } from '../lib/api'

import { MapPin, Plus } from 'lucide-react'

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
      if (!selectedReport) {
        try {
          console.log('Fetching reports...');
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
          }
          setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
          console.error('Error fetching reports:', error);
          setLoading(false); // Set loading to false even if there's an error
        }
      }
    };
    fetchReports();
  }, [selectedReport]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">TrackMy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Report Lost Item
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-96">
              <Map
                reports={reports}
                onReportClick={handleReportClick}
              />
            </div>
          </div>

          {/* Reports List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Lost Items</h2>
                <p className="text-sm text-gray-600">Click on a report to view details</p>
              </div>
              <ReportList
                reports={reports}
                onReportClick={handleReportClick}
                onClaimBounty={handleClaimBounty}
                selectedReport={selectedReport}
              />
            </div>
          </div>
        </div>

        {/* Selected Report Details */}
        {selectedReport && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900">{selectedReport.title}</h3>
            <p className="text-gray-600 mt-2">{selectedReport.description}</p>
            {selectedReport.bounty > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-green-600">
                  Bounty: ${selectedReport.bounty}
                </span>
                <button
                  onClick={() => handleClaimBounty(selectedReport)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Claim Bounty
                </button>
              </div>
            )}
          </div>
        )}
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