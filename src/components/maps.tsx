'use client'

import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api'
import { useTheme } from 'next-themes'
import { useCallback, useState, CSSProperties, useEffect } from 'react'

interface MapContainerStyleProps {
  width?: string
  height?: string
}

export interface GeoLocation {
  lat: number
  lng: number
}

interface GeoLocationProps {
  lat: number | null | undefined
  lng: number | null | undefined
}

const toGeoLocation = (loc?: GeoLocationProps | GeoLocation | null): GeoLocation | null => {
  if (!loc || loc.lat == null || loc.lng == null) return null
  return { lat: Number(loc.lat), lng: Number(loc.lng) }
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
  initialCenter?: GeoLocationProps
  initialMarker?: GeoLocationProps
  containerStyle?: MapContainerStyleProps
  zoom?: number
  onMarkerChange?: (location: GeoLocation) => void
  markers?: GeoLocation[]
  circles?: CircleConfig[]
  onMapLoad?: (map: google.maps.Map) => void
  mapId?: string
  isMarkerLocked?: boolean
}

const DEFAULT_CENTER: GeoLocation = {
  lat: -25.432120740315266,
  lng: -49.31332254701506,
}

const DEFAULT_CONTAINER_STYLE: CSSProperties = {
  width: '100%',
  height: '100%',
}

export default function Maps({
  initialCenter,
  initialMarker,
  containerStyle,
  zoom = 12,
  onMarkerChange,
  markers = [],
  circles = [],
  onMapLoad,
  mapId = 'google-map-script',
  isMarkerLocked = false,
}: MapsComponentProps) {
  const initialCenterValue = toGeoLocation(initialCenter) || DEFAULT_CENTER
  const initialMarkerValue =
    toGeoLocation(initialMarker) || toGeoLocation(initialCenter) || DEFAULT_CENTER

  const [center, setCenter] = useState<GeoLocation>(initialCenterValue)
  const [pointA, setPointA] = useState<GeoLocation>(initialMarkerValue)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const { theme } = useTheme()

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  useEffect(() => {
    if (!initialCenter && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation: GeoLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCenter(userLocation)
          if (!initialMarker) {
            setPointA(userLocation)
          }
        },
        (error) => {
          console.warn('Erro ao obter localização:', error)
        }
      )
    }
  }, [initialCenter, initialMarker])

  useEffect(() => {
    const nextCenter = toGeoLocation(initialCenter)
    if (nextCenter) {
      setCenter(nextCenter)
      if (!toGeoLocation(initialMarker)) {
        setPointA(nextCenter)
      }
    }
  }, [initialCenter, initialMarker])

  useEffect(() => {
    const nextMarker = toGeoLocation(initialMarker)
    if (nextMarker) {
      setPointA(nextMarker)
      setCenter(nextMarker)
    }
  }, [initialMarker])

  const { isLoaded } = useJsApiLoader({
    id: mapId,
    googleMapsApiKey: apiKey,
    language: 'pt-BR',
    region: 'BR',
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
      if (isMarkerLocked) return
      const newLocation: GeoLocation = {
        lat: e.latLng?.lat() ?? 0,
        lng: e.latLng?.lng() ?? 0,
      }
      setPointA(newLocation)
      onMarkerChange?.(newLocation)
    },
    [onMarkerChange, isMarkerLocked]
  )

  if (!isLoaded) {
    return <></>
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

  const mapOptions: google.maps.MapOptions = {
    streetViewControl: false,
    zoomControl: false,
    panControl: false,
    scaleControl: false,
    rotateControl: false,
    cameraControl: false,
    styles:
      theme === 'dark'
        ? [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#263c3f' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#6b9080' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#38414e' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#212a37' }],
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9ca5b3' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#746855' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#1f2835' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#f3751ff' }],
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ color: '#2f3948' }],
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#17263c' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#515c6d' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#17263c' }],
            },
          ]
        : undefined,
  }

  return (
    <GoogleMap
      mapContainerStyle={mergedContainerStyle}
      center={center}
      zoom={zoom}
      onLoad={handleMapLoad}
      onUnmount={handleMapUnmount}
      onClick={handleMapClick}
      options={mapOptions}
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
