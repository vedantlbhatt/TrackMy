'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

interface Report {
  id: number
  title: string
  description: string
  bounty: number
  latitude: number
  longitude: number
  radius: number
}

interface MapProps {
  reports: Report[]
  onReportClick: (report: Report) => void
  selectedReport: Report | null
}

export function Map({ reports, onReportClick, selectedReport }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    if (!apiKey || apiKey === 'your_google_maps_key_here') {
      return
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      if (mapRef.current) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 13,
        })
        setMap(mapInstance)
      }
      return
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      return
    }

    // Simple script loading
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      if (mapRef.current) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 13,
        })
        setMap(mapInstance)
      }
    }
    
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (map && reports.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null))
      
      const newMarkers: any[] = []
      
      reports.forEach((report) => {
        const marker = new window.google.maps.Marker({
          position: { lat: report.latitude, lng: report.longitude },
          map: map,
          title: report.title,
        })

        marker.addListener('click', () => {
          onReportClick(report)
        })

        newMarkers.push(marker)
      })
      
      setMarkers(newMarkers)
    }
  }, [map, reports, onReportClick])

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Map Placeholder when no API key */}
      {(!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'your_google_maps_key_here') ? (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-600 font-medium">Map Placeholder</p>
            <p className="text-sm text-gray-500">Add Google Maps API key to see interactive map</p>
          </div>
        </div>
      ) : null}
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">With Bounty</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">No Bounty</span>
          </div>
        </div>
      </div>
    </div>
  )
}
