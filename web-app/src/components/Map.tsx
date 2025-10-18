'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, DollarSign } from 'lucide-react'

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
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  useEffect(() => {
    const initMap = async () => {
      const { Loader } = await import('@googlemaps/js-api-loader')
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
        libraries: ['places', 'geometry'],
      })

      try {
        const google = await loader.load()
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 37.7749, lng: -122.4194 }, // San Francisco default
            zoom: 13,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          })
          
          setMap(mapInstance)
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    initMap()
  }, [])

  useEffect(() => {
    if (map && reports.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null))
      
      const newMarkers: google.maps.Marker[] = []
      
      reports.forEach((report) => {
        const marker = new google.maps.Marker({
          position: { lat: report.latitude, lng: report.longitude },
          map: map,
          title: report.title,
          icon: {
            url: report.bounty > 0 
              ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#10B981" stroke="#fff" stroke-width="2"/>
                  <text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$</text>
                </svg>
              `)
              : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#fff" stroke-width="2"/>
                  <text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">!</text>
                </svg>
              `),
            scaledSize: new google.maps.Size(40, 40),
          },
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
