'use client'

import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api'
import React, { useCallback, useState, CSSProperties } from 'react'

interface MapContainerStyleProps {
  width?: string
  height?: string
}

interface GeoLocation {
  lat: number
  lng: number
}

interface CircleConfig {
  center?: GeoLocation
  radius: number
  fillColor?: string
  strokeColor?: string
  strokeWeight?: number
  fillOpacity?: number
}

interface MapsComponentProps {
  initialCenter?: GeoLocation
  initialMarker?: GeoLocation
  containerStyle?: MapContainerStyleProps
  zoom?: number
  onMarkerChange?: (location: GeoLocation) => void
  markers?: GeoLocation[]
  circles?: CircleConfig[]
  onMapLoad?: (map: google.maps.Map) => void
  mapId?: string
}

const DEFAULT_CENTER: GeoLocation = {
  lat: -25.432120740315266,
  lng: -49.31332254701506,
}

const DEFAULT_CONTAINER_STYLE: CSSProperties = {
  width: '360px',
  height: '400px',
}

export default function MapsComponent({
  initialCenter = DEFAULT_CENTER,
  initialMarker = initialCenter,
  containerStyle,
  zoom = 15,
  onMarkerChange,
  markers = [],
  circles = [],
  onMapLoad,
  mapId = 'google-map-script',
}: MapsComponentProps) {
  const [pointA, setPointA] = useState<GeoLocation>(initialMarker)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const { isLoaded } = useJsApiLoader({
    id: mapId,
    googleMapsApiKey: apiKey,
  })

  const mergedContainerStyle: CSSProperties = {
    ...DEFAULT_CONTAINER_STYLE,
    ...containerStyle,
  }

  const handleMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance)
      onMapLoad?.(mapInstance)
    },
    [onMapLoad]
  )

  const handleMapUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const newLocation: GeoLocation = {
        lat: e.latLng?.lat() ?? 0,
        lng: e.latLng?.lng() ?? 0,
      }
      setPointA(newLocation)
      onMarkerChange?.(newLocation)
    },
    [onMarkerChange]
  )

  if (!isLoaded) {
    return <div>Carregando mapa...</div>
  }

  const allMarkers = [...markers, pointA]

  const circlesWithDefaults = circles.map((circle) => ({
    center: circle.center || pointA,
    radius: circle.radius,
    fillColor: circle.fillColor || '#FF0000',
    strokeColor: circle.strokeColor || '#FF0000',
    strokeWeight: circle.strokeWeight ?? 2,
    fillOpacity: circle.fillOpacity ?? 0.2,
  }))

  return (
    <GoogleMap
      mapContainerStyle={mergedContainerStyle}
      center={initialCenter}
      zoom={zoom}
      onLoad={handleMapLoad}
      onUnmount={handleMapUnmount}
      onClick={handleMapClick}
    >
      {allMarkers.map((marker, index) => (
        <Marker key={`marker-${index}`} position={marker} title={`Marcador ${index + 1}`} />
      ))}
      {circlesWithDefaults.map((circle, index) => (
        <Circle
          key={`circle-${index}`}
          center={circle.center}
          radius={circle.radius}
          options={{
            fillColor: circle.fillColor,
            strokeColor: circle.strokeColor,
            strokeWeight: circle.strokeWeight,
            fillOpacity: circle.fillOpacity,
          }}
        />
      ))}
    </GoogleMap>
  )
}
