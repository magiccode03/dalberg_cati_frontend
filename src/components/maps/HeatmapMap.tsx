'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapLocation } from '@/types';
import 'leaflet/dist/leaflet.css';

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface HeatmapMapProps {
  locations: MapLocation[];
  center?: [number, number];
  zoom?: number;
  height?: number;
  className?: string;
  intensityField?: string;
}

export default function HeatmapMap({
  locations,
  center = [25.5941, 85.1376], // Patna coordinates
  zoom = 10,
  height = 400,
  className = '',
  intensityField = 'count'
}: HeatmapMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate max intensity for normalization
  const maxIntensity = Math.max(...locations.map(loc => 
    loc.data?.[intensityField] || 1
  ));

  const getIntensity = (location: MapLocation) => {
    const value = location.data?.[intensityField] || 1;
    return Math.min(value / maxIntensity, 1);
  };

  const getColor = (intensity: number) => {
    if (intensity > 0.8) return '#DC2626'; // Red
    if (intensity > 0.6) return '#F59E0B'; // Orange
    if (intensity > 0.4) return '#10B981'; // Green
    if (intensity > 0.2) return '#3B82F6'; // Blue
    return '#6B7280'; // Gray
  };

  const getRadius = (intensity: number) => {
    return Math.max(5, intensity * 20);
  };

  if (!isClient) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`} style={{ height: `${height}px` }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Heatmap...</p>
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
          
          {locations.map((location, index) => {
            const intensity = getIntensity(location);
            const color = getColor(intensity);
            const radius = getRadius(intensity);
            
            return (
              <CircleMarker
                key={location.id || index}
                center={[location.lat, location.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  color: color,
                  weight: 2,
                  opacity: 0.8,
                  fillOpacity: 0.6
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Intensity: {intensity.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Value: {location.data?.[intensityField] || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Lat: {location.lat.toFixed(6)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Lng: {location.lng.toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
