'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapLocation } from '@/types';
import 'leaflet/dist/leaflet.css';

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });

interface GPSMapProps {
  locations: MapLocation[];
  center?: [number, number];
  zoom?: number;
  height?: number;
  className?: string;
  showHeatmap?: boolean;
  showClusters?: boolean;
}

export default function GPSMap({
  locations,
  center = [25.5941, 85.1376], // Patna coordinates
  zoom = 10,
  height = 400,
  className = '',
  showHeatmap = false,
  showClusters = false
}: GPSMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`} style={{ height: `${height}px` }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div style={{ height: `${height}px`, width: '100%' }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {locations.map((location, index) => (
            <Marker
              key={location.id || index}
              position={[location.lat, location.lng]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {location.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Latitude: {location.lat.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Longitude: {location.lng.toFixed(6)}
                  </p>
                  {location.data && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <p>Status: {location.data.status || 'Unknown'}</p>
                      {location.data.count && (
                        <p>Count: {location.data.count}</p>
                      )}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
