'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import { Search, MapPin, Calendar, Smartphone, FileText, Loader2, XCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

// Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface GPSData {
  server_id: number;
  gps: string;
  status: number;
  app_instance_id: number;
  start_time: string;
}

interface PollingStationData {
  ps_code: string;
  accode: number;
  total_interview: number;
  polling_station_name: string;
  polling_station_lat: string;
  polling_station_lng: string;
  ac_name: string;
  ps_photos: number;
}

interface QCPageData {
  gps_all: GPSData[];
  searchModel: {
    ac_code: number;
    user_id: number;
    interview_date: string;
    device_id: string;
  };
  total_interview: number;
  enumeratorprogress: {
    user_id: number;
    interview_date: string;
    device_id: string;
    total_interview: number;
    gps_qc: number;
    gpsqcstatus: string;
  };
  pscodes: PollingStationData[];
}

export default function GPSQCQCPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const qcId = params.qc_id as string;

  // Get query parameters
  const acCode = searchParams.get('ac_code') || '';
  const userId = searchParams.get('user_id') || '';
  const interviewDate = searchParams.get('interview_date') || '';
  const deviceId = searchParams.get('device_id') || '';

  const [filters, setFilters] = useState({
    ps_code: '',
    status: '',
  });

  const [data, setData] = useState<QCPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qcUserData, setQcUserData] = useState<any>(null);

  // Map states
  const [map, setMap] = useState<any>(null);
  const [wbData, setWbData] = useState<any>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [interviewMarkers, setInterviewMarkers] = useState<any[]>([]);
  const [pollingStationMarkers, setPollingStationMarkers] = useState<any[]>([]);

  // Use Google Maps hook
  const { isLoaded: isGoogleMapsLoaded, loadError: googleMapsError } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['geometry']
  });

  // Load QC user data and fetch page data
  useEffect(() => {
    const savedData = localStorage.getItem('qc_user_data');
    
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setQcUserData(userData);
        
        if (userData.qc_id.toString() !== qcId) {
          setError('QC User ID mismatch. Please login again.');
          return;
        }
        
        fetchQCPageData();
      } catch (err) {
        console.error('Error parsing QC data:', err);
        setError('Invalid QC user data. Please login again.');
      }
    } else {
      setError('No QC user data found. Please login first.');
    }
  }, [qcId, acCode, userId, interviewDate, deviceId]);

  // Load West Bengal GeoJSON data
  useEffect(() => {
    const loadWBData = async () => {
      try {
        const response = await fetch('/api/capi/json/wb.json');
        if (!response.ok) {
          throw new Error('Failed to load West Bengal data');
        }
        const geoData = await response.json();
        setWbData(geoData);
      } catch (err) {
        console.error('Error loading WB data:', err);
      }
    };

    loadWBData();
  }, []);

  // Fetch QC page data
  const fetchQCPageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      if (!acCode || !userId || !interviewDate || !deviceId) {
        setError('Missing required parameters');
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const apiUrl = `${apiBaseUrl}/api/qc/qcchecking/gps-qc/qcpage?ac_code=${acCode}&user_id=${userId}&interview_date=${interviewDate}&device_id=${deviceId}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData.success && responseData.data) {
        setData(responseData.data);
      } else {
        setError(responseData.message || 'Failed to fetch GPS QC data');
      }
    } catch (err: any) {
      console.error('Error fetching QC page data:', err);
      setError(err.message || 'Failed to fetch GPS QC data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Interface for interview details response
  interface InterviewDetails {
    server_id: number;
    interviewer_id: string;
    interview_date: string;
    ac_code: number;
    ac_name: string;
    district_name: string;
    ps_code: string;
    polling_station_name: string;
    status: number;
    gps: string;
    gps_lat: string;
    gps_lng: number;
    statusvalue?: string;
    status_reason_reject?: number | string;
    audio_duration?: number;
    total_duration?: number;
    distancefrompolingstation?: number;
    audio?: number;
    qc_recheck_audio_value?: number;
  }

  // Fetch detailed interview data for InfoWindow
  const fetchInterviewDetails = async (serverId: number): Promise<InterviewDetails | null> => {
    try {
      const token = localStorage.getItem('accessToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Build URL with qc_id parameter
      let apiUrl = `${apiBaseUrl}/api/qc/qcchecking/gps-qc/changestatus?server_id=${serverId}`;
      if (qcId) {
        apiUrl += `&qc_id=${qcId}`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData.success && responseData.data) {
        return responseData.data;
      } else {
        throw new Error(responseData.message || 'Failed to fetch interview details');
      }
    } catch (err) {
      console.error('Error fetching interview details:', err);
      return null;
    }
  };

  // Get status text with rejection reasons (matching PHP getStatusvalue method)
  const getStatusText = (details: InterviewDetails): string => {
    // If statusvalue is provided by API, use it directly (backend already computed it correctly)
    if (details.statusvalue) {
      return details.statusvalue;
    }

    // If status is not set, return empty string
    if (details.status === undefined || details.status === null) {
      return '';
    }

    const status = typeof details.status === 'string' ? parseInt(details.status) : details.status;
    const statusList: { [key: number]: string } = {
      0: 'Terminated',
      10: 'Vaild',
      20: 'Rejected',
      30: 'GPS Check Pending',
      40: 'Under QC',
      50: 'GPS Check Passed',
      60: 'QC Completed',
      70: 'Under RE-QC',
      80: 'RE-QC Completed',
      90: 'Remove From QC'
    };

    let baseStatus = statusList[status] || '';
    let extra = '';

    // IMPORTANT: Rejection reasons are ONLY added for status 20, 60, or 80
    // For status 30 (GPS Check Pending), no rejection reason should be shown
    if (status === 20 || status === 60 || status === 80) {
      const rejectReason = details.status_reason_reject 
        ? (typeof details.status_reason_reject === 'string' ? parseInt(details.status_reason_reject) : details.status_reason_reject)
        : null;

      if (rejectReason === 21) {
        const duration = details.audio_duration || details.total_duration || 0;
        extra = ` (Short Interview - ${duration} sec)`;
      } else if (rejectReason === 22) {
        extra = ' (Duplicate Mobile)';
      } else if (rejectReason === 61) {
        extra = ' (No response (ringing not attended/out of network, switched off etc))';
      } else if (rejectReason === 26) {
        extra = ' (GPS out of range)';
      } else if (rejectReason === 27) {
        extra = ' (GPS out of range- bulk)';
      } else if (rejectReason === 31) {
        if (details.audio === 0) {
          extra = ' (Wrong Number/No Audio)';
        } else {
          extra = ' (Wrong Number)';
        }
      } else if (rejectReason === 32) {
        extra = ' (Wrong Name)';
      } else if (rejectReason === 33 || rejectReason === 34 || rejectReason === 35 || rejectReason === 63) {
        extra = ' (NO_INTERVIEW)';
      } else if (rejectReason === 62) {
        extra = ' (Refused)';
      } else if (rejectReason === 39) {
        extra = ' (N+W+RTA)';
      } else if (rejectReason === 24) {
        extra = ' (No Audio)';
      } else if (rejectReason === 25 || rejectReason === 36) {
        
        if (details.qc_recheck_audio_value) {
          extra = ' (Audio Re-QC Reject)';
        } else {
          extra = ' (Audio reject)';
        }
      } else if (rejectReason === 50) {
        const distance = details.distancefrompolingstation || 0;
        extra = ` (Out of Range from PS - ${distance} M)`;
      } else if (rejectReason === 51) {
        extra = ' (Rejection due to more than 50% cancellation)';
      }
    }

    return baseStatus + extra;
  };

  // Build HTML table from interview details (matching PHP reference)
  const buildInterviewTableHTML = (details: InterviewDetails): string => {
    // Format interview date
    const interviewDate = details.interview_date 
      ? new Date(details.interview_date).toISOString().split('T')[0]
      : '-';
    
    const statusText = getStatusText(details);
    const gpsCoords = details.gps || `${details.gps_lat},${details.gps_lng}`;
    
    // Create rows matching PHP structure
    const rows = [
      { label: 'Server ID', value: details.server_id },
      { label: 'Interviewer ID', value: details.interviewer_id || '' },
      { label: 'Interviewer Date', value: interviewDate },
      { label: 'AC Code', value: details.ac_code || '' },
      { label: 'AC Name', value: details.ac_name || '' },
      { label: 'District Name', value: details.district_name || '' },
      { label: 'PS Name', value: details.polling_station_name ? `${details.polling_station_name} (${details.ps_code})` : details.ps_code || '' },
      { label: 'Interview Status', value: statusText },
      { label: 'View on Google Map', value: `<a target='_blank' href='http://maps.google.com/?q=${gpsCoords}&z=10' style="color: #007bff; text-decoration: underline;">${gpsCoords}</a>` }
    ];
    
    return `
      <tbody>
        ${rows.map((row, index) => {
          const isLast = index === rows.length - 1;
          // Alternating colors: even index = white, odd index = light blue (#e3f2fd)
          const bgColor = index % 2 === 0 ? '#ffffff' : '#e3f2fd';
          const borderBottom = isLast ? '' : 'border-bottom: 1px solid #ddd;';
          
          return `
            <tr>
              <th style="padding: 8px 12px; text-align: left; font-weight: bold; background-color: #f8f9fa; width: 40%; ${borderBottom} color: black;">${row.label}</th>
              <td style="padding: 8px 12px; text-align: left; background-color: ${bgColor}; ${borderBottom} color: black;">${row.value}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    `;
  };

  // Add GPS markers to map (only one InfoWindow open at a time)
  const addGPSMarkers = useCallback((mapInstance: any, gpsData: GPSData[]) => {
    const bounds = new window.google.maps.LatLngBounds();
    const newMarkers: any[] = [];
    // Keep a single InfoWindow instance
    let singleInfoWindow: any = (window as any)._singleInfoWindow;
    if (!singleInfoWindow) {
      singleInfoWindow = new window.google.maps.InfoWindow();
      (window as any)._singleInfoWindow = singleInfoWindow;
    }

    gpsData.forEach((item, index) => {
      if (!item.gps || !item.gps.trim()) return;

      const gpsParts = item.gps.trim().split(',');
      if (gpsParts.length < 2) return;

      const lat = parseFloat(gpsParts[0]);
      const lng = parseFloat(gpsParts[1]);

      if (isNaN(lat) || isNaN(lng)) return;

      const position = new window.google.maps.LatLng(lat, lng);
      bounds.extend(position);

      // Determine marker icon based on status
      let iconUrl = '';
      if (item.status === 30) {
        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
      } else if (item.status === 10 || item.status === 40 || item.status === 50 || item.status === 60) {
        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      } else if (item.status === 20 || item.status === 11 || item.status === 12) {
        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
      } else {
        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      }

      const marker = new window.google.maps.Marker({
        position: position,
        map: mapInstance,
        title: `${item.start_time}`,
        icon: iconUrl,
      });

      // Add click event - fetch detailed data and show InfoWindow
      marker.addListener('click', async () => {
        // Close any open InfoWindow
        singleInfoWindow.close();
        singleInfoWindow.setContent('<div style="padding: 20px; text-align: center; color: black;">Loading...</div>');
        singleInfoWindow.setPosition(position);
        singleInfoWindow.open(mapInstance, marker);

        // Fetch detailed interview data
        try {
          const interviewDetails = await fetchInterviewDetails(item.server_id);
          
          if (!interviewDetails) {
            singleInfoWindow.setContent('<div style="padding: 20px; color: red;">Error loading interview details</div>');
            return;
          }
          
          // Build table HTML from JSON data
          const tableContent = buildInterviewTableHTML(interviewDetails);
          
          // Create a styled InfoWindow content matching the image layout
          const styledContent = `
            <div style="min-width: 400px; max-width: 500px; font-family: Arial, sans-serif; color: black; background-color: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
              <div style="background-color: transparent; color: black; padding: 12px 16px; font-size: 18px; font-weight: bold; border-bottom: 1px solid #dee2e6;">
                GPS QC
              </div>
              <div style="padding: 0; background-color: white;">
                <div class="table-responsive" style="overflow-x: auto;">
                  <table class="table-primary table table-striped table-bordered" style="width: 100%; border-collapse: collapse; color: black; margin: 0; border: 1px solid #dee2e6;">
                    ${tableContent}
                  </table>
                </div>
                ${interviewDetails.status === 30 ? `
                  <div style="padding: 12px 16px; border-top: 1px solid #dee2e6;">
                    <div id="interview_status_${interviewDetails.server_id}" class="text-danger" style="color: #dc3545; margin-bottom: 8px; display: none;"></div>
                    <button 
                      id="chnagestatus_rejectinterview_${interviewDetails.server_id}" 
                      class="btn btn-info" 
                      style="background-color: #17a2b8; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: normal;"
                    >
                      Reject Interview
                    </button>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
          
          singleInfoWindow.setContent(styledContent);
          
          // After setting content, attach event listeners for reject button if status is 30
          if (interviewDetails.status === 30) {
            setTimeout(() => {
              const rejectButton = document.getElementById(`chnagestatus_rejectinterview_${interviewDetails.server_id}`);
              
              if (rejectButton) {
                rejectButton.addEventListener('click', async () => {
                  const token = localStorage.getItem('accessToken');
                  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
                  
                  try {
                    const response = await fetch(`${apiBaseUrl}/api/qc/qcchecking/gps-qc/reject?server_id=${interviewDetails.server_id}`, {
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ server_id: interviewDetails.server_id })
                    });
                    
                    if (response.ok) {
                      const result = await response.text();
                      const statusDiv = document.getElementById(`interview_status_${interviewDetails.server_id}`);
                      
                      if (statusDiv) {
                        statusDiv.innerHTML = result;
                        statusDiv.style.display = 'block';
                      }
                      if (rejectButton) {
                        (rejectButton as HTMLElement).style.display = 'none';
                      }
                      // Reload page after 5 seconds
                      setTimeout(() => {
                        window.location.reload();
                      }, 5000);
                    }
                  } catch (err) {
                    console.error('Error rejecting interview:', err);
                  }
                });
              }
            }, 100);
          }
        } catch (err) {
          singleInfoWindow.setContent('<div style="padding: 20px; color: red;">Error loading interview details</div>');
        }
      });

      newMarkers.push(marker);
    });

    setInterviewMarkers(newMarkers);

    if (newMarkers.length > 0) {
      mapInstance.fitBounds(bounds);
    }
  }, []);

  // Add polling station markers
  const addPollingStationMarkers = useCallback((mapInstance: any, pscodes: PollingStationData[]) => {
    const bounds = new window.google.maps.LatLngBounds();
    const newMarkers: any[] = [];

    pscodes.forEach((ps) => {
      if (!ps.polling_station_lat || !ps.polling_station_lng) return;

      const lat = parseFloat(ps.polling_station_lat);
      const lng = parseFloat(ps.polling_station_lng);

      if (isNaN(lat) || isNaN(lng)) return;

      const position = new window.google.maps.LatLng(lat, lng);
      bounds.extend(position);

      // Create polling station marker
      const marker = new window.google.maps.Marker({
        position: position,
        map: mapInstance,
        title: ps.polling_station_name,
        icon: "http://maps.gstatic.com/mapfiles/ms2/micons/pink-pushpin.png",
      });

      // Create circle around polling station
      const psCircle = new window.google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: mapInstance,
        center: position,
        radius: 100, // 100 meters radius
      });

      // Add click event
      marker.addListener('click', () => {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="margin: 0 0 10px 0; color: #2563eb;">${ps.polling_station_name}</h3>
              <p style="margin: 5px 0;"><strong>PS Code:</strong> ${ps.ps_code}</p>
              <p style="margin: 5px 0;"><strong>AC:</strong> ${ps.ac_name} (${ps.accode})</p>
              <p style="margin: 5px 0;"><strong>Total Interviews:</strong> ${ps.total_interview}</p>
            </div>
          `,
          position: position
        });
        infoWindow.open(mapInstance, marker);
      });

      newMarkers.push(marker);
      newMarkers.push(psCircle);
    });

    setPollingStationMarkers(newMarkers);
  }, []);

  // Initialize Google Maps with wb.json data (following test-map pattern)
  useEffect(() => {
    if (!isGoogleMapsLoaded || !wbData || !data) return;

    const initializeMap = () => {
      const mapElement = document.getElementById('map_canvas');
      if (!mapElement) return;

      try {
        // West Bengal center coordinates (from test-map)
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

        // Add GeoJSON data (West Bengal boundaries)
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

        // Add click event listener for boundaries (optional, from test-map)
        mapInstance.data.addListener('click', (event: any) => {
          const feature = event.feature;
          const acCode = feature.getProperty('AC_CODE');
          const acName = feature.getProperty('AC_NAME');
          const district = feature.getProperty('DISTRICT');

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 10px 0; color: #2563eb;">AC ${acCode}</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${acName}</p>
                <p style="margin: 5px 0;"><strong>District:</strong> ${district}</p>
              </div>
            `,
            position: event.latLng
          });

          infoWindow.open(mapInstance);
        });

        // Add hover effects (from test-map)
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

        // Clear existing markers first
        if (interviewMarkers.length > 0) {
          interviewMarkers.forEach(marker => {
            if (marker && marker.setMap) {
              marker.setMap(null);
            }
          });
        }
        if (pollingStationMarkers.length > 0) {
          pollingStationMarkers.forEach(marker => {
            if (marker && marker.setMap) {
              marker.setMap(null);
            }
          });
        }
        setInterviewMarkers([]);
        setPollingStationMarkers([]);

        // Filter GPS data based on filters
        let filteredGPSData = data.gps_all;
        if (filters.status) {
          filteredGPSData = filteredGPSData.filter(item => item.status.toString() === filters.status);
        }

        // Filter PS codes based on filters
        let filteredPSCodes = data.pscodes;
        if (filters.ps_code) {
          filteredPSCodes = filteredPSCodes.filter(ps => ps.ps_code === filters.ps_code);
        }

        // Add GPS markers
        addGPSMarkers(mapInstance, filteredGPSData);
        
        // Add polling station markers
        addPollingStationMarkers(mapInstance, filteredPSCodes);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGoogleMapsLoaded, wbData, data, filters]);

  const handleFilterChange = (field: string, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Refetch data with filters
    fetchQCPageData();
  };

  const handleRejectAll = async () => {
    if (!data) return;
    
    if (!confirm('Are you sure to Reject All Interview?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      const url = data.searchModel.ac_code && filters.ps_code
        ? `${apiBaseUrl}/api/qc/qcchecking/gps-qc/rejectall?ac_code=${data.searchModel.ac_code}&user_id=${data.searchModel.user_id}&interview_date=${data.searchModel.interview_date}&device_id=${data.searchModel.device_id}&ps_code=${filters.ps_code}`
        : `${apiBaseUrl}/api/qc/qcchecking/gps-qc/rejectall?ac_code=${data.searchModel.ac_code}&user_id=${data.searchModel.user_id}&interview_date=${data.searchModel.interview_date}&device_id=${data.searchModel.device_id}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh data
        fetchQCPageData();
      }
    } catch (err) {
      console.error('Error rejecting all:', err);
    }
  };

  const handlePassToNextStage = async () => {
    if (!data) return;
    
    if (!confirm('Are you sure to Pass All Interview for Next Stage?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const url = `${apiBaseUrl}/api/qc/qcchecking/gps-qc/passtonextstage?ac_code=${data.searchModel.ac_code}&user_id=${data.searchModel.user_id}&interview_date=${data.searchModel.interview_date}&device_id=${data.searchModel.device_id}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh data
        fetchQCPageData();
      }
    } catch (err) {
      console.error('Error passing to next stage:', err);
    }
  };

  const handleViewPSPhotos = (psCode: string) => {
    if (!data) return;
    // Open PS photos in a new window or modal
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    const url = `${apiBaseUrl}/qc/qcchecking/gps/psphotos?user_id=${data.searchModel.user_id}&interview_date=${data.searchModel.interview_date}&device_id=${data.searchModel.device_id}&ps_code=${psCode}`;
    window.open(url, '_blank');
  };

  // Generate PS code options
  const psCodeOptions = data?.pscodes
    ? data.pscodes.map(ps => ({
        value: ps.ps_code,
        label: `${ps.ps_code} - ${ps.polling_station_name}`
      }))
    : [];

  // Status options
  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: '10', label: 'Valid' },
    { value: '20', label: 'Rejected' },
    { value: '30', label: 'GPS Check Pending' },
    { value: '40', label: 'Pending' },
  ];

  if (loading) {
    return (
      <Container maxWidth="full">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <Text className="ml-2 text-gray-600">Loading GPS QC data...</Text>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="full">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Heading level={4} className="text-lg font-semibold text-red-600 mb-2">
                  Error
                </Heading>
                <Text className="text-gray-600">{error}</Text>
              </div>
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
              >
                Go Back
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    );
  }

  if (!data) {
    return null;
  }

  const acName = data.pscodes.length > 0 ? data.pscodes[0].ac_name : '';

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Header */}
        <div className="mb-6">
          <Heading level={1} className="text-2xl font-semibold text-gray-900 dark:text-white">
            GPS QC {acName ? `- ${acName}` : ''}
          </Heading>
        </div>

        {/* Search Filters */}
        <Card className="mb-6">
          <div className="p-4">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    All PS
                  </label>
                  <SelectDropdown
                    options={[
                      { value: '', label: 'All PS' },
                      ...psCodeOptions
                    ]}
                    value={filters.ps_code}
                    onChange={(value) => handleFilterChange('ps_code', Array.isArray(value) ? value[0] || '' : value)}
                    placeholder="All PS"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Status
                  </label>
                  <SelectDropdown
                    options={statusOptions}
                    value={filters.status}
                    onChange={(value) => handleFilterChange('status', Array.isArray(value) ? value[0] || '' : value)}
                    placeholder="Select Status"
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    onClick={handleSearch}
                    className="flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Enumerator ID</Text>
                <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                  {data.searchModel.user_id}
                </Heading>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Interview Date</Text>
                <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                  {data.searchModel.interview_date}
                </Heading>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Device ID</Text>
                <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white font-mono text-sm">
                  {data.searchModel.device_id}
                </Heading>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Interview</Text>
                <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                  {data.total_interview}
                </Heading>
              </div>
            </div>
          </Card>
        </div>

        {/* Polling Station Coverage Table */}
        <Card className="mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Polling Station Coverage
            </Heading>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <Table striped bordered hover className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">AC Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">AC Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">PS Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">Polling Station Name</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">Total Interview</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">Total PS Photos</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">PS Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pscodes.map((ps, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{ps.accode}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{ps.ac_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{ps.ps_code}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{ps.polling_station_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-center">{ps.total_interview}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-center">{ps.ps_photos}</td>
                      <td className="px-4 py-3 text-center">
                        {ps.ps_photos > 0 ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPSPhotos(ps.ps_code)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            View PS Photos
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Card>

        {/* GPS Map */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                GPS Map
              </Heading>
              <div className="flex flex-wrap items-center gap-4">
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <img src="http://maps.google.com/mapfiles/ms/icons/orange-dot.png" alt="GPS Check Pending" className="w-4 h-4" />
                    GPS Check Pending
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" alt="Valid/QC Pending" className="w-4 h-4" />
                    Valid/QC Pending
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="Rejected" className="w-4 h-4" />
                    Rejected
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="Invalid" className="w-4 h-4" />
                    Invalid
                  </span>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRejectAll}
                  >
                    {filters.ps_code 
                      ? `Reject All Interview In ${data.pscodes.find(ps => ps.ps_code === filters.ps_code)?.polling_station_name || filters.ps_code}`
                      : 'Reject All'
                    }
                  </Button>
                  {!filters.ps_code && (
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                      onClick={handlePassToNextStage}
                    >
                      Pass to Next Stage
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="relative" style={{ height: '800px', minHeight: '800px' }}>
              <div 
                id="map_canvas" 
                className="w-full h-full rounded-lg border-2 border-gray-300 dark:border-gray-600"
              />
              {mapLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      {!isGoogleMapsLoaded ? 'Loading Google Maps...' : !wbData ? 'Loading map data...' : 'Initializing map...'}
                    </Text>
                  </div>
                </div>
              )}
              {(googleMapsError || mapError) && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-center p-4">
                    <Text className="text-sm text-red-600 dark:text-red-400 mb-2">
                      ❌ Google Maps Error: {googleMapsError || mapError}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}

