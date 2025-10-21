'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin } from 'lucide-react'

// Google Maps type declarations
declare global {
  interface Window {
    google: {
      maps: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Map: new (element: HTMLElement, options: { center: { lat: number; lng: number }; zoom: number }) => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Marker: new (options: { position: { lat: number; lng: number }; map: any; title: string }) => any
      }
    }
  }
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

interface MapProps {
  reports: Report[]
  onReportClick: (report: Report) => void
}

export function Map({ reports, onReportClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null)

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

  const updateMarkers = useCallback(() => {
    if (map && reports.length > 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      markersRef.current = newMarkers
    }
  }, [map, reports, onReportClick])

  useEffect(() => {
    updateMarkers()
  }, [updateMarkers])

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
