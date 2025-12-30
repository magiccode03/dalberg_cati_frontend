'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import GPSMap from '@/components/maps/GPSMap';
import HeatmapMap from '@/components/maps/HeatmapMap';
import ClusterMap from '@/components/maps/ClusterMap';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MapLocation } from '@/types';

export default function GPSPage() {
  const [mapType, setMapType] = useState<'gps' | 'heatmap' | 'cluster'>('gps');

  const breadcrumbItems = [
    { label: 'QC Manager', href: '/dashboard/qc' },
    { label: 'GPS Map', active: true }
  ];

  // Mock GPS locations data
  const gpsLocations: MapLocation[] = [
    {
      id: '1',
      lat: 25.5941,
      lng: 85.1376,
      name: 'Patna Center',
      data: { status: 'Active', count: 150 }
    },
    {
      id: '2',
      lat: 26.1209,
      lng: 85.3647,
      name: 'Muzaffarpur Center',
      data: { status: 'Active', count: 120 }
    },
    {
      id: '3',
      lat: 24.7969,
      lng: 85.0000,
      name: 'Gaya Center',
      data: { status: 'Inactive', count: 80 }
    },
    {
      id: '4',
      lat: 25.3176,
      lng: 82.9739,
      name: 'Varanasi Center',
      data: { status: 'Active', count: 200 }
    },
    {
      id: '5',
      lat: 25.4358,
      lng: 85.7000,
      name: 'Darbhanga Center',
      data: { status: 'Active', count: 90 }
    },
    {
      id: '6',
      lat: 25.1960,
      lng: 85.5219,
      name: 'Bhagalpur Center',
      data: { status: 'Active', count: 110 }
    },
    {
      id: '7',
      lat: 25.0112,
      lng: 85.1648,
      name: 'Nalanda Center',
      data: { status: 'Inactive', count: 60 }
    },
    {
      id: '8',
      lat: 24.6637,
      lng: 84.0633,
      name: 'Aurangabad Center',
      data: { status: 'Active', count: 75 }
    }
  ];

  const renderMap = () => {
    switch (mapType) {
      case 'gps':
        return (
          <GPSMap
            locations={gpsLocations}
            center={[25.5941, 85.1376]}
            zoom={8}
            height={500}
          />
        );
      case 'heatmap':
        return (
          <HeatmapMap
            locations={gpsLocations}
            center={[25.5941, 85.1376]}
            zoom={8}
            height={500}
            intensityField="count"
          />
        );
      case 'cluster':
        return (
          <ClusterMap
            locations={gpsLocations}
            center={[25.5941, 85.1376]}
            zoom={8}
            height={500}
            clusterRadius={100000}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GPS Map</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track field staff locations and GPS data
          </p>
        </div>
      </div>

      {/* Map Type Selector */}
      <Card>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Map Type:</span>
          <div className="flex space-x-2">
            <Button
              variant={mapType === 'gps' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setMapType('gps')}
            >
              GPS Points
            </Button>
            <Button
              variant={mapType === 'heatmap' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setMapType('heatmap')}
            >
              Heatmap
            </Button>
            <Button
              variant={mapType === 'cluster' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setMapType('cluster')}
            >
              Clusters
            </Button>
          </div>
        </div>
      </Card>

      {/* Map Container */}
      {renderMap()}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {gpsLocations.length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Locations</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              {gpsLocations.filter(loc => loc.data?.status === 'Active').length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Centers</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {gpsLocations.filter(loc => loc.data?.status === 'Inactive').length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Inactive Centers</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {gpsLocations.reduce((sum, loc) => sum + (loc.data?.count || 0), 0)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Count</p>
          </div>
        </Card>
      </div>

      {/* Location List */}
      <Card title="Location Details">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Coordinates</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Count</th>
              </tr>
            </thead>
            <tbody>
              {gpsLocations.map((location) => (
                <tr key={location.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {location.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      location.data?.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {location.data?.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {location.data?.count || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
