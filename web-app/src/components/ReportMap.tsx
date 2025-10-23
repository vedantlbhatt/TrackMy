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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Circle: new (options: { center: { lat: number; lng: number }; radius: number; map: any; fillColor: string; fillOpacity: number; strokeColor: string; strokeOpacity: number }) => any
      }
    }
  }
}

interface ReportMapProps {
  latitude: number
  longitude: number
  radius: number
  onLocationChange: (lat: number, lng: number) => void
  onRadiusChange: (radius: number) => void
}

export function ReportMap({ latitude, longitude, radius, onLocationChange, onRadiusChange }: ReportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [marker, setMarker] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [circle, setCircle] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pulseCircles, setPulseCircles] = useState<any[]>([])
  const [isMapReady, setIsMapReady] = useState(false)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey || apiKey === 'your_google_maps_key_here') {
      return
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap()
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
      initializeMap()
    }

    script.onerror = () => {
      console.error('Failed to load Google Maps API. Please check your API key and ensure Maps JavaScript API is enabled.')
    }

    document.head.appendChild(script)
  }, [])

  const initializeMap = useCallback(() => {
    if (mapRef.current && window.google && window.google.maps) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude || 37.7749, lng: longitude || -122.4194 },
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      })
      
      setMap(mapInstance)
      setIsMapReady(true)

      // Add click listener
      mapInstance.addListener('click', (event: any) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        onLocationChange(lat, lng)
      })
    }
  }, [latitude, longitude, onLocationChange])

  // Update marker and circle when location changes
  useEffect(() => {
    if (map && isMapReady && (latitude !== 0 || longitude !== 0)) {
      // Remove existing marker, circle, and pulse circles
      if (marker) marker.setMap(null)
      if (circle) circle.setMap(null)
      pulseCircles.forEach(pulseCircle => pulseCircle.setMap(null))

      // Create new marker
      const newMarker = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Selected Location',
        draggable: true,
      })

      // Create clean, minimal radius circle
      const newCircle = new window.google.maps.Circle({
        center: { lat: latitude, lng: longitude },
        radius: radius,
        map: map,
        fillColor: '#007AFF',
        fillOpacity: 0.08,
        strokeColor: '#007AFF',
        strokeOpacity: 0.4,
        strokeWeight: 2,
        clickable: false,
        zIndex: 1,
      })

      // Create subtle outer ring for depth
      const newPulseCircles = []
      const outerRing = new window.google.maps.Circle({
        center: { lat: latitude, lng: longitude },
        radius: radius,
        map: map,
        fillColor: '#007AFF',
        fillOpacity: 0.03,
        strokeColor: '#007AFF',
        strokeOpacity: 0.2,
        strokeWeight: 1,
        clickable: false,
        zIndex: 0,
      })
      newPulseCircles.push(outerRing)

      setMarker(newMarker)
      setCircle(newCircle)
      setPulseCircles(newPulseCircles)

      // Add drag listener to marker
      newMarker.addListener('drag', (event: any) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        onLocationChange(lat, lng)
      })
    }
  }, [map, isMapReady, latitude, longitude, radius, onLocationChange])

  // Update circle when radius changes
  useEffect(() => {
    if (circle && radius > 0) {
      circle.setRadius(radius)
      // Update pulse circles radius too
      pulseCircles.forEach(pulseCircle => {
        pulseCircle.setRadius(radius)
      })
    }
  }, [circle, radius, pulseCircles])

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
            <p className="text-gray-600 font-medium">Interactive Map</p>
            <p className="text-sm text-gray-500">Add Google Maps API key to see interactive map</p>
          </div>
        </div>
      ) : null}
      
      {/* Map Instructions */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <div className="flex items-center mb-2">
          <MapPin className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Click to Select Location</span>
        </div>
        <p className="text-xs text-gray-600">
          Click anywhere on the map to set the location for your report. You can also drag the marker to adjust.
        </p>
      </div>

      {/* Location Info */}
      {(latitude !== 0 || longitude !== 0) && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <div className="text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600">Latitude:</span>
              <span className="font-mono text-gray-900">{latitude.toFixed(6)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Longitude:</span>
              <span className="font-mono text-gray-900">{longitude.toFixed(6)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
