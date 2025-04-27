'use client'

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import React from 'react'

const containerStyle = {
  width: '360px',
  height: '400px',
}

const center = {
  lat: -3.745,
  lng: -38.523,
}

export default function MapsComponent() {
  const [pointA, setPointA] = React.useState<google.maps.LatLngLiteral>({
    lat: -3.745,
    lng: -38.523,
  })

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD7WMJmCOIN-FB4ULdV24fudC1z-y8JEQ4',
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          onClick={(e) => setPointA({ lat: e.latLng?.lat(), lng: e.latLng?.lng() })}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Marker position={pointA} />
        </GoogleMap>
      ) : (
        <></>
      )}
    </>
  )
}
