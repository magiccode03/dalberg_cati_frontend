'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Loader2, Search, X, Download } from 'lucide-react';
import apiClient from '@/lib/api-client';
import FormattedNumber from '@/components/ui/FormattedNumber';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

// Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface AssignedACData {
  id: number;
  qcId: number;
  qcUserName: string;
  acCode: number;
  acName: string;
  qcPending: number;
  qcCompleted: number;
  qcTotal: number;
  rowspan?: number;
  isFirstRow?: boolean;
  isSummaryRow?: boolean;
}

interface QCUserAssignment {
  qc_id: number;
  qc_user_name: string;
  qc_total: number;
  qc_pending: number;
  qc_completed: number;
  assignments: Array<{
    ac_code: number;
    ac_name: string;
    qc_pending: number;
    qc_completed: number;
    qc_total: number;
  }>;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

interface APIResponse {
  success: boolean;
  data?: QCUserAssignment[];
  pagination?: PaginationInfo;
  error?: string;
  message?: string;
  timestamp: string;
}

interface FilterOptions {
  acCodes: Array<{ value: string; label: string }>;
  pollingStations: Array<{ value: string; label: string }>;
}

export default function AssignedACPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [assignedACData, setAssignedACData] = useState<AssignedACData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
  // Filter states
  const [selectedACCode, setSelectedACCode] = useState<string>('');
  const [selectedPollingStation, setSelectedPollingStation] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    acCodes: [],
    pollingStations: []
  });
  const [filtersLoading, setFiltersLoading] = useState(false);
  
  // Refs to prevent multiple simultaneous API calls
  const fetchDataRef = useRef(false);
  const fetchFiltersRef = useRef(false);

  // Map states
  const [map, setMap] = useState<any>(null);
  const [wbData, setWbData] = useState<any>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [pollingStationMarkers, setPollingStationMarkers] = useState<any[]>([]);
  const [pendingPollingStations, setPendingPollingStations] = useState<any[]>([]);
  const [allPollingStations, setAllPollingStations] = useState<any[]>([]);
  const [allPollingStationsLoaded, setAllPollingStationsLoaded] = useState(false);
  const [interviewMarkers, setInterviewMarkers] = useState<any[]>([]);
  const [allInterviews, setAllInterviews] = useState<any[]>([]);
  const [allInterviewsLoaded, setAllInterviewsLoaded] = useState(false);
  const [interviewsLoading, setInterviewsLoading] = useState(false);
  
  // Marker visibility states
  const [showPollingStations, setShowPollingStations] = useState(true);
  const [showValidInterviews, setShowValidInterviews] = useState(true);
  const [showRejectedInterviews, setShowRejectedInterviews] = useState(true);
  const [showPendingInterviews, setShowPendingInterviews] = useState(true);
  const [showInvalidInterviews, setShowInvalidInterviews] = useState(true);

  // Use Google Maps hook with API key from environment
  const { isLoaded: isGoogleMapsLoaded, loadError: googleMapsError } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['geometry']
  });

  // Load West Bengal GeoJSON data
  useEffect(() => {
    const loadWBData = async () => {
      try {
        console.log('Loading West Bengal GeoJSON data...');
        const response = await fetch('/api/capi/json/wb.json');
        if (!response.ok) {
          throw new Error('Failed to load West Bengal data');
        }
        const data = await response.json();
        console.log('West Bengal data loaded successfully:', data.features?.length, 'features');
        setWbData(data);
      } catch (err) {
        console.error('Error loading WB data:', err);
      }
    };

    loadWBData();
  }, []);

  // Initialize Google Maps with wb.json data
  useEffect(() => {
    if (!isGoogleMapsLoaded || !wbData) return;

    const initializeMap = () => {
      const mapElement = document.getElementById('map_canvas');
      if (!mapElement) return;

      try {
        // West Bengal center coordinates
        const westBengalCenter = { lat: 23.6850, lng: 87.6850 };
        
        const mapOptions = {
          zoom: 7,
          center: westBengalCenter,
          scaleControl: true,
          mapTypeId: 'satellite',
          tilt: 45
        };

        // Display a map on the page
        const mapInstance = new window.google.maps.Map(mapElement, mapOptions);
        setMap(mapInstance);

        // Add GeoJSON data
        console.log('Adding West Bengal boundaries to map...');
        mapInstance.data.addGeoJson(wbData);
        
        // Style the features
        mapInstance.data.setStyle({
          fillColor: '#000000',
          fillOpacity: 0.1,
          strokeColor: '#000000',
          strokeWeight: 2,
          strokeOpacity: 0.8
        });

        // Add click event listener
        mapInstance.data.addListener('click', (event: any) => {
          const feature = event.feature;
          const acCode = feature.getProperty('AC_CODE');
          const acName = feature.getProperty('AC_NAME');
          const district = feature.getProperty('DISTRICT');
          const parliament = feature.getProperty('PARLIAMENT');

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 10px 0; color: #2563eb;">AC ${acCode}</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${acName}</p>
                <p style="margin: 5px 0;"><strong>District:</strong> ${district}</p>
                <p style="margin: 5px 0;"><strong>Parliament:</strong> ${parliament}</p>
              </div>
            `,
            position: event.latLng
          });

          infoWindow.open(mapInstance);
        });

        // Add hover effects
        mapInstance.data.addListener('mouseover', (event: any) => {
          mapInstance.data.overrideStyle(event.feature, {
            fillColor: '#000000',
            fillOpacity: 0.3,
            strokeColor: '#000000',
            strokeWeight: 3
          });
        });

        mapInstance.data.addListener('mouseout', (event: any) => {
          mapInstance.data.revertStyle();
        });

        console.log('Google Maps initialized successfully with West Bengal boundaries');
        setMapLoading(false);
        setMapError(null);
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
        setMapError('Failed to initialize Google Maps. Please check your internet connection.');
        setMapLoading(false);
      }
    };

    initializeMap();
  }, [isGoogleMapsLoaded, wbData]);

  // Add timeout for Google Maps loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mapLoading && !isGoogleMapsLoaded) {
        setMapError('Google Maps is taking too long to load. Please check your internet connection.');
        setMapLoading(false);
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timeout);
  }, [mapLoading, isGoogleMapsLoaded]);


  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    if (fetchFiltersRef.current) return; // Prevent multiple simultaneous calls
    fetchFiltersRef.current = true;
    
    setFiltersLoading(true);
    try {
      // Fetch AC Codes from master AC list (single call with limit)
      const acResponse = await apiClient.get('/dashboard/master-ac-index/list?limit=300');
      const acData = acResponse.data;
      
      let acCodes: Array<{ value: string; label: string }> = [];
      if (acData.success && acData.data?.master_acs) {
        acCodes = acData.data.master_acs.map((ac: any) => ({
          value: ac.ac_code.toString(),
          label: `${ac.ac_name} (${ac.ac_code})`
        }));
      }
      
      setFilterOptions(prev => ({
        ...prev,
        acCodes
      }));
    } catch (err) {
      console.error('Error fetching filter options:', err);
      // Set empty options on error
      setFilterOptions(prev => ({
        ...prev,
        acCodes: []
      }));
    } finally {
      setFiltersLoading(false);
      fetchFiltersRef.current = false; // Reset the flag
    }
  }, []); // Empty dependency array since this should only run once

  // Load all polling stations initially
  const loadAllPollingStations = useCallback(async () => {
    if (allPollingStationsLoaded) return; // Don't load again if already loaded
    
    try {
      console.log('Loading all polling stations...');
      const response = await apiClient.get('/dashboard/master-polling-station/list?limit=15000', {
        timeout: 60000 // 60 seconds timeout
      });
      const data = response.data;
      
      if (data.success && data.data?.polling_stations) {
        setAllPollingStations(data.data.polling_stations);
        setAllPollingStationsLoaded(true);
        console.log(`Loaded ${data.data.polling_stations.length} polling stations`);
        
        // Add all polling stations to map initially
        addPollingStationMarkers(data.data.polling_stations);
      }
    } catch (err) {
      console.error('Error loading all polling stations:', err);
    }
  }, [allPollingStationsLoaded]);


  // Toggle polling station markers visibility
  const togglePollingStationMarkers = useCallback(() => {
    if (!map || pollingStationMarkers.length === 0) return;
    
    pollingStationMarkers.forEach(marker => {
      if (showPollingStations) {
        marker.setMap(map);
      } else {
        marker.setMap(null);
      }
    });
  }, [map, pollingStationMarkers, showPollingStations]);

  // Toggle interview markers visibility
  const toggleInterviewMarkers = useCallback(() => {
    if (!map || interviewMarkers.length === 0) return;
    
    interviewMarkers.forEach(marker => {
      const shouldShow = 
        (marker.interviewStatus === 10 && showValidInterviews) ||
        (marker.interviewStatus === 20 && showRejectedInterviews) ||
        (marker.interviewStatus === 40 && showPendingInterviews) ||
        (marker.interviewStatus !== 10 && marker.interviewStatus !== 20 && marker.interviewStatus !== 40 && showInvalidInterviews);
      
      if (shouldShow) {
        marker.setMap(map);
      } else {
        marker.setMap(null);
      }
    });
  }, [map, interviewMarkers, showValidInterviews, showRejectedInterviews, showPendingInterviews, showInvalidInterviews]);

  // Add polling station markers to map
  const addPollingStationMarkers = useCallback((pollingStations: any[]) => {
    console.log('addPollingStationMarkers called with:', pollingStations.length, 'stations');
    console.log('Map available:', !!map);
    console.log('Current polling station markers on map:', pollingStationMarkers.length);
    
    if (!map) {
      console.log('Map not available, storing polling stations for later');
      // Store polling stations to add when map is ready
      setPendingPollingStations(pollingStations);
      return;
    }
    
    if (!pollingStations.length) {
      console.log('No polling stations to display');
      return;
    }

    // Clear existing polling station markers
    pollingStationMarkers.forEach(marker => {
      marker.setMap(null);
    });
    setPollingStationMarkers([]);

    const bounds = new window.google.maps.LatLngBounds();
    const newMarkers: any[] = [];
    let validCoordinatesCount = 0;

    pollingStations.forEach((station: any, index: number) => {
      console.log(`Processing station ${index + 1}:`, {
        polling_station_no: station.polling_station_no,
        gps: station.gps,
        gps_lat: station.gps_lat,
        gps_lng: station.gps_lng
      });

      // Parse GPS coordinates from the gps field
      let lat = 0, lng = 0;
      
      if (station.gps && station.gps.trim()) {
        const gpsParts = station.gps.trim().split(' ');
        if (gpsParts.length >= 2) {
          lat = parseFloat(gpsParts[0]);
          lng = parseFloat(gpsParts[1]);
          console.log(`Parsed GPS from gps field: lat=${lat}, lng=${lng}`);
        }
      } else if (station.gps_lat && station.gps_lng) {
        lat = parseFloat(station.gps_lat);
        lng = parseFloat(station.gps_lng);
        console.log(`Parsed GPS from lat/lng fields: lat=${lat}, lng=${lng}`);
      }

      // Only add marker if we have valid coordinates
      if (lat !== 0 && lng !== 0 && !isNaN(lat) && !isNaN(lng)) {
        console.log(`Creating marker for station ${station.polling_station_no} at lat=${lat}, lng=${lng}`);
        const position = new window.google.maps.LatLng(lat, lng);
        bounds.extend(position);

        // Create marker
        const marker = new window.google.maps.Marker({
          position: position,
          map: map,
          title: `${station.polling_station_no} : ${station.polling_station_name}`,
          icon: "http://maps.gstatic.com/mapfiles/ms2/micons/pink-pushpin.png",
        });

        // Create circle around marker
        const psCircle = new window.google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: map,
          center: position,
          radius: 0, // No radius for now, just the marker
        });

        // Add click event for marker
        marker.addListener('click', () => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #2563eb;">${station.polling_station_no}</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${station.polling_station_name}</p>
                <p style="margin: 5px 0;"><strong>AC:</strong> ${station.ac_name} (${station.ac_code})</p>
                <p style="margin: 5px 0;"><strong>District:</strong> ${station.district_name}</p>
                <p style="margin: 5px 0;"><strong>Zone:</strong> ${station.zone_name}</p>
                <p style="margin: 5px 0;"><strong>Agency:</strong> ${station.agency_name}</p>
              </div>
            `,
            position: position
          });
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
        newMarkers.push(psCircle);
        validCoordinatesCount++;
      } else {
        console.log(`Skipping station ${station.polling_station_no} - invalid coordinates: lat=${lat}, lng=${lng}`);
      }
    });

    setPollingStationMarkers(newMarkers);

    // Fit bounds to show all polling stations
    if (newMarkers.length > 0) {
      map.fitBounds(bounds);
      console.log(`Map bounds fitted to show ${validCoordinatesCount} polling stations`);
    }

    console.log(`Added ${validCoordinatesCount} polling station markers to map (${newMarkers.length} total objects)`);
    console.log('New markers array:', newMarkers.length);
    console.log('Valid coordinates count:', validCoordinatesCount);
  }, [map, pollingStationMarkers]);

  // Add interview markers to map
  const addInterviewMarkers = useCallback((interviews: any[]) => {
    console.log('addInterviewMarkers called with:', interviews.length, 'interviews');
    console.log('Map available:', !!map);
    console.log('Current interview markers on map:', interviewMarkers.length);
    
    if (!map) {
      console.log('Map not available for interview markers');
      return;
    }
    
    if (!interviews.length) {
      console.log('No interviews to display - clearing existing markers');
      // Clear existing interview markers
      interviewMarkers.forEach(marker => {
        marker.setMap(null);
      });
      setInterviewMarkers([]);
      return;
    }

    // Clear existing interview markers
    interviewMarkers.forEach(marker => {
      marker.setMap(null);
    });
    setInterviewMarkers([]);

    const bounds = new window.google.maps.LatLngBounds();
    const newMarkers: any[] = [];
    let validCoordinatesCount = 0;

    interviews.forEach((interview: any, index: number) => {
      if (index < 3) { // Log first 3 interviews for debugging
        console.log(`Processing interview ${index + 1}:`, {
          server_id: interview.server_id,
          gps: interview.gps,
          status: interview.status,
          gps_qc_status: interview.gps_qc_status,
          full_interview: interview
        });
      }

      // Parse GPS coordinates from the gps field
      let lat = 0, lng = 0;
      
      if (interview.gps && interview.gps.trim()) {
        const gpsParts = interview.gps.trim().split(',');
        console.log(`GPS string: "${interview.gps}", split parts:`, gpsParts);
        if (gpsParts.length >= 2) {
          lat = parseFloat(gpsParts[0]);
          lng = parseFloat(gpsParts[1]);
          console.log(`Parsed GPS from interview: lat=${lat}, lng=${lng}`);
        } else {
          console.log(`Invalid GPS format for interview ${interview.server_id}: "${interview.gps}"`);
        }
      } else {
        console.log(`No GPS data for interview ${interview.server_id}`);
      }

      // Only add marker if we have valid coordinates
      if (lat !== 0 && lng !== 0 && !isNaN(lat) && !isNaN(lng)) {
        console.log(`Creating interview marker for server_id ${interview.server_id} at lat=${lat}, lng=${lng}`);
        const position = new window.google.maps.LatLng(lat, lng);
        bounds.extend(position);

        // Determine marker icon based on status and gps_qc_status
        let iconUrl = '';
        if (interview.status === 10) {
          iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
        } else if (interview.status === 20) {
          iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
        } else if (interview.status === 40 && (interview.gps_qc_status === 3 || interview.gps_qc_status === 0 || interview.gps_qc_status === null)) {
          iconUrl = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
        } else {
          // Default icon for other cases
          iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        }
        
        console.log(`Interview ${interview.server_id}: status=${interview.status}, gps_qc_status=${interview.gps_qc_status}, icon=${iconUrl}`);

        // Create marker
        const marker = new window.google.maps.Marker({
          position: position,
          map: map,
          title: `Interview ${interview.server_id} - ${interview.polling_station_name}`,
          icon: iconUrl,
        });
        
        // Store interview status for filtering
        marker.interviewStatus = interview.status;

        // Add click event for marker
        marker.addListener('click', () => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; min-width: 350px; color: black; font-family: Arial, sans-serif;">
                <table style="width: 100%; border-collapse: collapse; color: black;">
                  <tbody>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="padding: 8px 12px; text-align: left; font-weight: bold; background-color: #f8f9fa; width: 40%;">Server ID</td>
                      <td style="padding: 8px 12px; text-align: left;">${interview.server_id}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="padding: 8px 12px; text-align: left; font-weight: bold; background-color: #f8f9fa;">Interviewer ID</td>
                      <td style="padding: 8px 12px; text-align: left;">${interview.interviewer_id}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="padding: 8px 12px; text-align: left; font-weight: bold; background-color: #f8f9fa;">Enumerator ID</td>
                      <td style="padding: 8px 12px; text-align: left;">${interview.interviewer_id}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="padding: 8px 12px; text-align: left; font-weight: bold; background-color: #f8f9fa;">Interview Date</td>
                      <td style="padding: 8px 12px; text-align: left;">${new Date(interview.interview_date).toLocaleDateString()}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="padding: 8px 12px; text-align: left; font-weight: bold; background-color: #f8f9fa;">AC Code</td>
                      <td style="padding: 8px 12px; text-align: left;">${interview.ac_code}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="padding: 8px 12px; text-align: left; font-weight: bold; background-color: #f8f9fa;">AC Name</td>
                      <td style="padding: 8px 12px; text-align: left;">${interview.ac_name}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="padding: 8px 12px; text-align: left; font-weight: bold; background-color: #f8f9fa;">District Name</td>
                      <td style="padding: 8px 12px; text-align: left;">${interview.district_name}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="padding: 8px 12px; text-align: left; font-weight: bold; background-color: #f8f9fa;">PS Name</td>
                      <td style="padding: 8px 12px; text-align: left;">${interview.polling_station_name}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="padding: 8px 12px; text-align: left; font-weight: bold; background-color: #f8f9fa;">Interview Status</td>
                      <td style="padding: 8px 12px; text-align: left;">${getStatusText(interview.status, interview.audio_qc_status)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 12px; text-align: left; font-weight: bold; background-color: #f8f9fa;">View on Google Map</td>
                      <td style="padding: 8px 12px; text-align: left;"><a target="_blank" href="http://maps.google.com/?q=${lat},${lng}&z=10" tabindex="0" style="color: #007bff; text-decoration: none;">${lat},${lng}</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `,
            position: position
          });
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
        validCoordinatesCount++;
      } else {
        console.log(`Skipping interview ${interview.server_id} - invalid coordinates: lat=${lat}, lng=${lng}`);
      }
    });

    setInterviewMarkers(newMarkers);

    // Fit bounds to show all interview markers
    if (newMarkers.length > 0) {
      map.fitBounds(bounds);
      console.log(`Map bounds fitted to show ${validCoordinatesCount} interview markers`);
    }

    console.log(`Added ${validCoordinatesCount} interview markers to map`);
    console.log('New interview markers array:', newMarkers.length);
    console.log('Valid interview coordinates count:', validCoordinatesCount);
    
    // Add a test marker to verify marker creation works
    if (newMarkers.length === 0 && interviews.length > 0) {
      console.log('No markers created, adding test marker at West Bengal center');
      const testPosition = new window.google.maps.LatLng(23.6850, 87.6850);
      const testMarker = new window.google.maps.Marker({
        position: testPosition,
        map: map,
        title: 'Test Interview Marker',
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      });
      newMarkers.push(testMarker);
      setInterviewMarkers(newMarkers);
      console.log('Test marker added');
    }
  }, [map, interviewMarkers]);

  // Load all interviews initially
  const loadAllInterviews = useCallback(async () => {
    if (allInterviewsLoaded || interviewsLoading) return; // Don't load again if already loaded or loading
    
    setInterviewsLoading(true);
    try {
      console.log('Loading all interviews...');
      const response = await apiClient.get('/interview?limit=15000&master_ac=1&master_polling_station=1&columns=interview.server_id,interview.gps,interview.interviewer_id,interview.interview_date,interview.ac_code,master_ac.ac_name,master_ac.district_name,master_polling_station.polling_station_name,interview.status,interview.audio_qc_status,interview.gps_qc_status', {
        timeout: 160000 // 60 seconds timeout
      });
      const data = response.data;
      
      console.log('Interview API Response:', data);
      console.log('Interview data:', data.data);
      
      if (data.success && data.data && Array.isArray(data.data)) {
        setAllInterviews(data.data);
        setAllInterviewsLoaded(true);
        console.log(`Loaded ${data.data.length} interviews`);
        
        // Add all interview markers to map initially
        console.log('Calling addInterviewMarkers with:', data.data.length, 'interviews');
        addInterviewMarkers(data.data);
      } else {
        console.log('No interview data found in response');
      }
    } catch (err: any) {
      console.error('Error loading all interviews:', err);
      if (err.code === 'ECONNABORTED') {
        console.log('Interview API timeout - retrying with smaller limit...');
        try {
          const retryResponse = await apiClient.get('/interview?limit=5000&master_ac=1&master_polling_station=1&columns=interview.server_id,interview.gps,interview.interviewer_id,interview.interview_date,interview.ac_code,master_ac.ac_name,master_ac.district_name,master_polling_station.polling_station_name,interview.status,interview.audio_qc_status,interview.gps_qc_status', {
            timeout: 130000 // 30 seconds timeout for retry
          });
          const retryData = retryResponse.data;
          if (retryData.success && retryData.data && Array.isArray(retryData.data)) {
            setAllInterviews(retryData.data);
            setAllInterviewsLoaded(true);
            console.log(`Loaded ${retryData.data.length} interviews (retry with smaller limit)`);
            addInterviewMarkers(retryData.data);
          }
        } catch (retryErr) {
          console.error('Retry also failed:', retryErr);
        }
      }
    } finally {
      setInterviewsLoading(false);
    }
  }, [allInterviewsLoaded, interviewsLoading, addInterviewMarkers]);

  // Helper function to get status text
  const getStatusText = (status: number, audio_qc_status: number) => {
    if (status === 10) return 'Valid';
    if (status === 20) {
      if (audio_qc_status === 2) return 'Rejected (Audio reject)';
      return 'Rejected';
    }
    if (status === 40) return 'Pending';
    return 'Invalid';
  };

  // Add pending polling stations when map becomes available
  useEffect(() => {
    if (map && pendingPollingStations.length > 0) {
      console.log('Map is now available, adding pending polling stations:', pendingPollingStations.length);
      addPollingStationMarkers(pendingPollingStations);
      setPendingPollingStations([]); // Clear pending stations
    }
  }, [map, pendingPollingStations, addPollingStationMarkers]);

  // Load all polling stations when map is ready
  useEffect(() => {
    if (map && !allPollingStationsLoaded) {
      console.log('Map is ready, loading all polling stations...');
      loadAllPollingStations();
    }
  }, [map, allPollingStationsLoaded, loadAllPollingStations]);

  // Load all interviews when map is ready AND polling stations are loaded
  useEffect(() => {
    if (map && !allInterviewsLoaded && allPollingStationsLoaded) {
      console.log('Map is ready and polling stations loaded, loading all interviews...');
      loadAllInterviews();
    }
  }, [map, allInterviewsLoaded, allPollingStationsLoaded, loadAllInterviews]);

  // Toggle polling station markers when visibility changes
  useEffect(() => {
    if (map && pollingStationMarkers.length > 0) {
      togglePollingStationMarkers();
    }
  }, [showPollingStations, map, pollingStationMarkers, togglePollingStationMarkers]);

  // Toggle interview markers when visibility changes
  useEffect(() => {
    if (map && interviewMarkers.length > 0) {
      toggleInterviewMarkers();
    }
  }, [showValidInterviews, showRejectedInterviews, showPendingInterviews, showInvalidInterviews, map, interviewMarkers, toggleInterviewMarkers]);

  // Fetch polling stations by AC Code
  const fetchPollingStationsByAC = useCallback(async (acCode: string) => {
    try {
      console.log('Fetching polling stations for AC Code:', acCode);
      const response = await apiClient.get(`/dashboard/master-polling-station/list?ac_code=${acCode}&limit=1000`);
      const data = response.data;
      
      if (data.success && data.data?.polling_stations && data.data.polling_stations.length > 0) {
        console.log(`Found ${data.data.polling_stations.length} polling stations for AC ${acCode}`);
        
        // Update dropdown options
        const pollingStations: Array<{ value: string; label: string }> = data.data.polling_stations.map((station: any) => ({
          value: station.polling_station_id?.toString() || station.id?.toString() || '',
          label: `${station.polling_station_name || station.name || 'Unknown'} (${station.polling_station_id || station.id || ''})`
        }));
        
        setFilterOptions(prev => ({
          ...prev,
          pollingStations
        }));
        
        // Add polling station markers to map
        addPollingStationMarkers(data.data.polling_stations);
      } else {
        console.log(`No polling stations found for AC ${acCode}`);
        // Clear polling station dropdown and remove markers
        setFilterOptions(prev => ({
          ...prev,
          pollingStations: []
        }));
        addPollingStationMarkers([]);
      }
    } catch (err) {
      console.error('Error fetching polling stations by AC:', err);
    }
  }, [addPollingStationMarkers]);

  // Fetch interviews by AC Code
  const fetchInterviewsByAC = useCallback(async (acCode: string) => {
    try {
      console.log('Fetching interviews for AC Code:', acCode);
      const response = await apiClient.get(`/interview?ac_code=${acCode}&limit=5000&master_ac=1&master_polling_station=1&columns=interview.server_id,interview.gps,interview.interviewer_id,interview.interview_date,interview.ac_code,master_ac.ac_name,master_ac.district_name,master_polling_station.polling_station_name,interview.status,interview.audio_qc_status,interview.gps_qc_status`, {
        timeout: 60000
      });
      const data = response.data;
      
      if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
        console.log(`Found ${data.data.length} interviews for AC ${acCode}`);
        addInterviewMarkers(data.data);
      } else {
        console.log(`No interviews found for AC ${acCode}`);
        // Remove interview markers
        addInterviewMarkers([]);
      }
    } catch (err) {
      console.error('Error fetching interviews by AC:', err);
    }
  }, [addInterviewMarkers]);

  // Filter polling stations and interviews based on selected AC Code (API calls)
  const filterPollingStationsByAC = useCallback((acCode: string) => {
    if (!acCode) {
      setFilterOptions(prev => ({
        ...prev,
        pollingStations: []
      }));
      // Show all polling stations and interviews on map
      addPollingStationMarkers(allPollingStations);
      addInterviewMarkers(allInterviews);
      return;
    }

    console.log('Filtering by AC Code:', acCode);
    
    // Fetch polling stations and interviews for this AC
    fetchPollingStationsByAC(acCode);
    fetchInterviewsByAC(acCode);
  }, [allPollingStations, allInterviews, addPollingStationMarkers, addInterviewMarkers, fetchPollingStationsByAC, fetchInterviewsByAC]);

  // Helper function to transform API data to UI format with rowspan support
  const transformAPIData = (apiData: QCUserAssignment[]): AssignedACData[] => {
    const transformedData: AssignedACData[] = [];
    let id = 1;

    apiData.forEach((qcUser) => {
      if (qcUser.assignments && Array.isArray(qcUser.assignments)) {
        const assignmentCount = qcUser.assignments.length;
        
        qcUser.assignments.forEach((assignment, index) => {
          transformedData.push({
            id: id++,
            qcId: qcUser.qc_id,
            qcUserName: qcUser.qc_user_name,
            acCode: assignment.ac_code,
            acName: assignment.ac_name,
            qcPending: assignment.qc_pending,
            qcCompleted: assignment.qc_completed,
            qcTotal: assignment.qc_total,
            rowspan: index === 0 ? assignmentCount+1 : 0, // Only first row gets rowspan
            isFirstRow: index === 0 // Mark first row for QC ID and Name
          });
        });

        // Add summary row for each QC user
        transformedData.push({
          id: id++,
          qcId: qcUser.qc_id,
          qcUserName: qcUser.qc_user_name,
          acCode: 0, // Special code for summary row
          acName: 'TOTAL',
          qcPending: qcUser.qc_pending,
          qcCompleted: qcUser.qc_completed,
          qcTotal: qcUser.qc_total,
          rowspan: 0,
          isFirstRow: false,
          isSummaryRow: true // Mark as summary row
        });
      }
    });

    return transformedData;
  };

  // Fetch data from API - REMOVED as requested
  const fetchAssignedACData = useCallback(async () => {
    // API call removed as requested
    setLoading(false);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchAssignedACData();
  }, [fetchAssignedACData]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    console.log('Clear filters clicked');
    
    setSelectedACCode('');
    setSelectedPollingStation('');
    setCurrentPage(1);
    
    // Clear polling station dropdown options
    setFilterOptions(prev => ({
      ...prev,
      pollingStations: []
    }));
    
    // Clear existing markers first
    console.log('Clearing existing markers...');
    addPollingStationMarkers([]);
    addInterviewMarkers([]);
    
    // Reload all data
    console.log('Reloading all data...');
    if (allPollingStations.length > 0) {
      console.log('Adding all polling stations to map:', allPollingStations.length);
      addPollingStationMarkers(allPollingStations);
    }
    
    if (allInterviews.length > 0) {
      console.log('Adding all interviews to map:', allInterviews.length);
      addInterviewMarkers(allInterviews);
    }
    
    setPendingPollingStations([]);
    fetchAssignedACData();
  }, [fetchAssignedACData, allPollingStations, allInterviews, addPollingStationMarkers, addInterviewMarkers]);

  // Handle AC Code change
  const handleACCodeChange = useCallback((value: string) => {
    setSelectedACCode(value);
    setSelectedPollingStation(''); // Clear polling station when AC changes
    
    if (value) {
      filterPollingStationsByAC(value);
    } else {
      // Show all polling stations when no AC is selected
      filterPollingStationsByAC('');
    }
  }, [filterPollingStationsByAC]);

  // Download all data as CSV - REMOVED as requested
  const downloadAllData = async () => {
    // Download functionality removed as requested
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchAssignedACData();
  }, [fetchAssignedACData]);

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // Calculate display range for current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = assignedACData;

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              GPS QC
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>


        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Heading level={4} className="text-lg font-semibold text-red-600 mb-2">
                    Error Loading Data
                  </Heading>
                  <Text className="text-gray-600">{error}</Text>
                </div>
                <Button
                  onClick={fetchAssignedACData}
                  variant="outline"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* AC Code Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  AC Code
                </label>
                <SelectDropdown
                  options={filterOptions.acCodes}
                  value={selectedACCode}
                  onChange={(value) => handleACCodeChange(Array.isArray(value) ? value[0] || '' : value)}
                  placeholder="Select AC Code"
                  searchable
                />
              </div>

              {/* Polling Station Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Polling Station
                </label>
                <SelectDropdown
                  options={filterOptions.pollingStations}
                  value={selectedPollingStation}
                  onChange={(value) => setSelectedPollingStation(Array.isArray(value) ? value[0] || '' : value)}
                  placeholder="Select Polling Station"
                  searchable
                  disabled={!selectedACCode}
                />
              </div>

              {/* Filter Actions */}
              <div className="flex space-x-2">
                <Button
                  onClick={handleFilterChange}
                  className="flex items-center space-x-2"
                  disabled={loading}
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="flex items-center space-x-2"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Assigned AC Table */}
        <Card className="">
          <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                GPS
                </Heading>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <img src="http://maps.google.com/mapfiles/ms/icons/orange-dot.png" alt="GPS Check Pending" className="w-4 h-4 mr-1" />
                  GPS Check Pending
                  <input 
                    type="checkbox" 
                    checked={showPendingInterviews} 
                    onChange={(e) => {
                      setShowPendingInterviews(e.target.checked);
                    }}
                    className="ml-2"
                  />
                </span>
                <span>|</span>
                <span className="flex items-center">
                  <img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" alt="Valid/QC Pending" className="w-4 h-4 mr-1" />
                  Valid/QC Pending
                  <input 
                    type="checkbox" 
                    checked={showValidInterviews} 
                    onChange={(e) => {
                      setShowValidInterviews(e.target.checked);
                    }}
                    className="ml-2"
                  />
                </span>
                <span>|</span>
                <span className="flex items-center">
                  <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="Rejected" className="w-4 h-4 mr-1" />
                  Rejected
                  <input 
                    type="checkbox" 
                    checked={showRejectedInterviews} 
                    onChange={(e) => {
                      setShowRejectedInterviews(e.target.checked);
                    }}
                    className="ml-2"
                  />
                </span>
                <span>|</span>
                <span className="flex items-center">
                  <img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="Invalid" className="w-4 h-4 mr-1" />
                  Invalid
                  <input 
                    type="checkbox" 
                    checked={showInvalidInterviews} 
                    onChange={(e) => {
                      setShowInvalidInterviews(e.target.checked);
                    }}
                    className="ml-2"
                  />
                </span>
                <span>|</span>
                <span className="flex items-center">
                  <img src="http://maps.gstatic.com/mapfiles/ms2/micons/pink-pushpin.png" alt="Polling Station" className="w-4 h-4 mr-1" />
                  Polling Station
                  <input 
                    type="checkbox" 
                    checked={showPollingStations} 
                    onChange={(e) => {
                      setShowPollingStations(e.target.checked);
                    }}
                    className="ml-2"
                  />
                </span>
              </div>
            </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <Text className="ml-2 text-gray-600">Loading assigned AC data...</Text>
                </div>
              ) : (
                <React.Fragment>
              <div className="overflow-x-auto">
                <div className="relative">
                  <div 
                    id="map_canvas" 
                    className="w-full rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-gray-100 dark:bg-gray-700"
                    style={{ height: '660px', minHeight: '660px' }}
                  />
                  {mapLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          {!isGoogleMapsLoaded ? 'Loading Google Maps...' : !wbData ? 'Loading West Bengal data...' : 'Initializing map...'}
                        </Text>
                        {!isGoogleMapsLoaded && (
                          <Text className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                            ⚠️ Internet connection required for Google Maps
                          </Text>
                        )}
                      </div>
                    </div>
                  )}
                  {(googleMapsError || mapError) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-center p-4">
                        <Text className="text-sm text-red-600 dark:text-red-400 mb-2">
                          ❌ Google Maps Error: {googleMapsError || mapError}
                        </Text>
                        <Text className="text-xs text-gray-600 dark:text-gray-400">
                          Please check your internet connection and try refreshing the page.
                        </Text>
                        <Button 
                          onClick={() => window.location.reload()} 
                          variant="outline" 
                          size="sm" 
                          className="mt-3"
                        >
                          Refresh Page
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              </React.Fragment>
              )}
          </Card>
      </Container>
    </div>
  );
}
