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

interface ClusterMapProps {
  locations: MapLocation[];
  center?: [number, number];
  zoom?: number;
  height?: number;
  className?: string;
  clusterRadius?: number;
}

export default function ClusterMap({
  locations,
  center = [25.5941, 85.1376], // Patna coordinates
  zoom = 10,
  height = 400,
  className = '',
  clusterRadius = 50
}: ClusterMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [clusters, setClusters] = useState<Array<{
    center: [number, number];
    locations: MapLocation[];
    count: number;
  }>>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (locations.length === 0) return;

    // Simple clustering algorithm
    const clustered: Array<{
      center: [number, number];
      locations: MapLocation[];
      count: number;
    }> = [];

    locations.forEach(location => {
      let addedToCluster = false;

      // Check if location can be added to existing cluster
      for (let i = 0; i < clustered.length; i++) {
        const cluster = clustered[i];
        const distance = Math.sqrt(
          Math.pow(location.lat - cluster.center[0], 2) + 
          Math.pow(location.lng - cluster.center[1], 2)
        );

        if (distance < clusterRadius / 111000) { // Convert meters to degrees (rough approximation)
          cluster.locations.push(location);
          cluster.count++;
          // Update cluster center
          cluster.center[0] = cluster.locations.reduce((sum, loc) => sum + loc.lat, 0) / cluster.locations.length;
          cluster.center[1] = cluster.locations.reduce((sum, loc) => sum + loc.lng, 0) / cluster.locations.length;
          addedToCluster = true;
          break;
        }
      }

      // Create new cluster if not added to existing one
      if (!addedToCluster) {
        clustered.push({
          center: [location.lat, location.lng],
          locations: [location],
          count: 1
        });
      }
    });

    setClusters(clustered);
  }, [locations, clusterRadius]);

  if (!isClient) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`} style={{ height: `${height}px` }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Cluster Map...</p>
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
          
          {clusters.map((cluster, index) => (
            <Marker
              key={index}
              position={cluster.center}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Cluster {index + 1}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Locations: {cluster.count}
                  </p>
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    {cluster.locations.map((location, locIndex) => (
                      <div key={locIndex} className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        • {location.name}
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
