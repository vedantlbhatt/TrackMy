'use client'

import { MapPin, DollarSign, Clock } from 'lucide-react'

interface Report {
  id: number
  title: string
  description: string
  bounty: number
  latitude: number
  longitude: number
  radius: number
}

interface ReportListProps {
  reports: Report[]
  onReportClick: (report: Report) => void
  onClaimBounty: (report: Report) => void
  selectedReport: Report | null
}

export function ReportList({ reports, onReportClick, onClaimBounty, selectedReport }: ReportListProps) {
  return (
    <div className="max-h-96 overflow-y-auto">
      {reports.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No lost items found</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {reports.map((report, index) => (
            <div
              key={`report-${report.id}-${index}`}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedReport?.id === report.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => onReportClick(report)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {report.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {report.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Radius: {report.radius}m</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Recent</span>
                    </div>
                  </div>
                </div>
                
                {report.bounty > 0 && (
                  <div className="ml-4 flex flex-col items-end">
                    <div className="flex items-center text-green-600 font-semibold text-sm">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {report.bounty}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onClaimBounty(report)
                      }}
                      className="mt-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                    >
                      Claim
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
