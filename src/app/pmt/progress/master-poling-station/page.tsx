'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import DataTable from '@/components/tables/DataTable';
import Pagination from '@/components/ui/Pagination';
import { Search, RefreshCw, Download, MapPin } from 'lucide-react';

interface PolingStationData {
  id: number;
  pcCode: string;
  acCode: string;
  acName: string;
  pollingStationNo: string;
  pollingStationName: string;
  gpsLng: string;
  gpsLat: string;
  gps: string;
}

const MasterPolingStationPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    pollingStationName: '',
    pollingStationNo: '',
    acCode: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Generate comprehensive mock data for poling stations
  const generatePolingStationData = (): PolingStationData[] => {
    const data: PolingStationData[] = [];
    const acNames = [
      'Valmiki Nagar', 'Ramnagar (SC)', 'Narkatiaganj', 'Bagaha', 'Lauriya',
      'Nautan', 'Chanpatia', 'Bettiah', 'Sikta', 'Raxaul', 'Sugauli', 'Motihari',
      'Madhuban', 'Pipra', 'Govindganj', 'Kesaria', 'Kalyanpur', 'Harsidhi (SC)',
      'Dhaka', 'Chiraia', 'Sheohar', 'Riga', 'Bajpatti', 'Bathnaha (SC)', 'Parihar',
      'Sursand', 'Runnisaidpur', 'Sitamarhi', 'Harlakhi', 'Belsand', 'Benipatti',
      'Bisfi', 'Babubarhi', 'Madhubani', 'Rajnagar (SC)', 'Jhanjharpur', 'Phulparas',
      'Laukaha', 'Nirmali', 'Pipra', 'Supaul', 'Chhatapur', 'Narpatganj', 'Forbesganj',
      'Araria', 'Jokihat', 'Sikti', 'Bahadurganj', 'Thakurganj', 'Kishanganj', 'Kochadhaman',
      'Amour', 'Baisi', 'Banmankhi (SC)', 'Dhamdaha', 'Purnia', 'Rupauli', 'Darbhanga Rural',
      'Darbhanga', 'Hayaghat', 'Benipur', 'Alamnagar', 'Bihariganj', 'Singheshwar (SC)',
      'Madhepura', 'Sonbarsha (SC)', 'Saharsa', 'Simri Bakhtiarpur', 'Mahishi', 'Kusheshwar Asthan (SC)',
      'Keoti', 'Aurai', 'Minapur', 'Gaighat', 'Gaura Bauram', 'Bochaha (SC)', 'Sakra (SC)',
      'Kurhani', 'Muzaffarpur', 'Kanti', 'Baruraj', 'Paroo', 'Sahebganj', 'Baikunthpur',
      'Barauli', 'Gopalganj', 'Kuchaikote', 'Bhorey (SC)', 'Hathua', 'Siwan', 'Ziradei',
      'Raghunathpur', 'Darauli (SC)', 'Goriakothi', 'Maharajganj', 'Chapra', 'Manjhi',
      'Ekma', 'Taraiya', 'Marhaura', 'Parsa', 'Sonepur', 'Hajipur', 'Lalganj', 'Vaishali',
      'Raghopur', 'Mahnar', 'Mahua', 'Patepur (SC)', 'Ujiarpur', 'Samastipur', 'Warisnagar',
      'Kalyanpur (SC)', 'Sarairanjan', 'Morwa', 'Mohiuddinnagar', 'Bibhutipur', 'Cheria Bariarpur',
      'Teghra', 'Begusarai', 'Matihani', 'Sahebpur Kamal', 'Bakhri (SC)', 'Alauli (SC)',
      'Beldaur', 'Parbatta', 'Bihpur', 'Gopalpur', 'Pirpainti (SC)', 'Kahalgaon', 'Nathnagar',
      'Banka', 'Amarpur', 'Dhauraiya (SC)', 'Belhar', 'Bikram', 'Sultanganj', 'Jamalpur',
      'Tarapur', 'Munger', 'Jamui', 'Sikandra (SC)', 'Jhajha', 'Chakai', 'Nawada', 'Hisua',
      'Rajauli (SC)', 'Warsaliganj', 'Gobindpur', 'Arwal', 'Kurtha', 'Jahanabad', 'Ghosi',
      'Makhadumapur (SC)', 'Obra', 'Nabinagar', 'Kutumba (SC)', 'Sherghati', 'Imamganj (SC)',
      'Barachatti (SC)', 'Bodh Gaya (SC)', 'Gaya Town', 'Tikari', 'Belaganj', 'Wazirganj',
      'Atri', 'Aurangabad', 'Rafiganj', 'Gurua', 'Dinara', 'Buxar', 'Dumraon', 'Rajpur (SC)',
      'Ramgarh', 'Mohania (SC)', 'Bhabua', 'Chainpur', 'Chenari (SC)', 'Sasaram', 'Nokha',
      'Kargahar', 'Karakat', 'Dehri', 'Tilouthu', 'Nawada', 'Rajauli (SC)', 'Warsaliganj',
      'Gobindpur', 'Arwal', 'Kurtha', 'Jahanabad', 'Ghosi', 'Makhadumapur (SC)', 'Obra',
      'Nabinagar', 'Kutumba (SC)', 'Sherghati', 'Imamganj (SC)', 'Barachatti (SC)', 'Bodh Gaya (SC)',
      'Gaya Town', 'Tikari', 'Belaganj', 'Wazirganj', 'Atri', 'Aurangabad', 'Rafiganj', 'Gurua'
    ];

    const stationTypes = [
      'Prathamik Vidyalay', 'Utkramit Madhya Vidyalay', 'Krishchan Mishan Skul', 'Panchayat Bhavan',
      'High School', 'Middle School', 'Primary School', 'Government School', 'Municipal School',
      'Community Center', 'Village Office', 'Block Office', 'District Office'
    ];

    const locations = [
      'Godar', 'Malakauli', 'Matiariya', 'Amahat', 'Bairiyakala', 'Khajuriya', 'Pacharukha',
      'Jarar', 'Bhadachhi', 'Jimari', 'Nautanava', 'Semara', 'Panchangva', 'Pachaganva',
      'Nayagonv', 'Nayagaon', 'Goyati', 'Naraval', 'Vijay Nagar', 'Sharanarthi', 'Uttari Bhag',
      'Dakshini Bhag', 'Purbi Bhag', 'Paschimi Bhag', 'Paschim Bhag', 'Purva Bhag'
    ];

    for (let i = 1; i <= 5832; i++) {
      const acIndex = Math.floor(Math.random() * acNames.length);
      const stationType = stationTypes[Math.floor(Math.random() * stationTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      // Generate realistic GPS coordinates for Bihar
      const lat = 24.0 + Math.random() * 7.0; // Bihar latitude range
      const lng = 83.0 + Math.random() * 6.0; // Bihar longitude range
      
      data.push({
        id: i,
        pcCode: '1',
        acCode: (acIndex + 1).toString(),
        acName: acNames[acIndex],
        pollingStationNo: `${acIndex + 1}_${Math.floor(Math.random() * 200) + 1}`,
        pollingStationName: `${Math.floor(Math.random() * 200) + 1}. ${stationType} ${location}`,
        gpsLng: lng.toFixed(8),
        gpsLat: lat.toFixed(8),
        gps: `${lat.toFixed(8)} ${lng.toFixed(8)}`
      });
    }
    
    return data;
  };

  const allPolingStationData = generatePolingStationData();
  
  // Filter data based on search criteria
  const filteredData = allPolingStationData.filter(item => {
    const matchesName = !filters.pollingStationName || 
      item.pollingStationName.toLowerCase().includes(filters.pollingStationName.toLowerCase());
    const matchesCode = !filters.pollingStationNo || 
      item.pollingStationNo.toLowerCase().includes(filters.pollingStationNo.toLowerCase());
    const matchesAC = !filters.acCode || 
      item.acCode.toLowerCase().includes(filters.acCode.toLowerCase());
    
    return matchesName && matchesCode && matchesAC;
  });

  // Paginate the filtered data
  const itemsPerPage = 20;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCurrentPage(1); // Reset to first page after search
    }, 1000);
  };

  const handleDownload = () => {
    // Download filtered data, not just paginated data
    const csvContent = [
      ['#', 'Pc Code', 'Ac Code', 'AC Name', 'Polling Station No', 'Polling Station Name', 'Gps Lng', 'Gps Lat', 'Gps'],
      ...filteredData.map((item, index) => [
        index + 1,
        item.pcCode,
        item.acCode,
        item.acName,
        item.pollingStationNo,
        item.pollingStationName,
        item.gpsLng,
        item.gpsLat,
        item.gps
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'master-poling-station.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleGPSMap = (acCode: string, psCode: string) => {
    // Implement GPS map logic
    console.log('Opening GPS map for AC:', acCode, 'PS:', psCode);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const columns = [
    {
      key: 'id' as keyof PolingStationData,
      label: '#',
      sortable: true
    },
    {
      key: 'pcCode' as keyof PolingStationData,
      label: 'Pc Code',
      sortable: true
    },
    {
      key: 'acCode' as keyof PolingStationData,
      label: 'Ac Code',
      sortable: true
    },
    {
      key: 'acName' as keyof PolingStationData,
      label: 'AC Name',
      sortable: true
    },
    {
      key: 'pollingStationNo' as keyof PolingStationData,
      label: 'Polling Station No',
      sortable: true
    },
    {
      key: 'pollingStationName' as keyof PolingStationData,
      label: 'Polling Station Name',
      sortable: true
    },
    {
      key: 'gpsLng' as keyof PolingStationData,
      label: 'Gps Lng',
      sortable: true
    },
    {
      key: 'gpsLat' as keyof PolingStationData,
      label: 'Gps Lat',
      sortable: true
    },
    {
      key: 'gps' as keyof PolingStationData,
      label: 'Gps',
      sortable: true
    },
    {
      key: 'acCode' as keyof PolingStationData,
      label: 'Actions',
      sortable: false,
      render: (value: string, row: PolingStationData) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleGPSMap(row.acCode, row.pollingStationNo)}
          className="p-1"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                List of Master Poling Station
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage polling station data and GPS coordinates
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleSearch}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <Card className="mb-6">
          <div>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Poling Station Name
                  </label>
                  <Input
                    placeholder="Search By Poling Station Name"
                    value={filters.pollingStationName}
                    onChange={(e) => handleFilterChange('pollingStationName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Poling Station Code
                  </label>
                  <Input
                    placeholder="Search By Poling Station Code"
                    value={filters.pollingStationNo}
                    onChange={(e) => handleFilterChange('pollingStationNo', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AC Code
                  </label>
                  <Input
                    placeholder="Search By AC Code"
                    value={filters.acCode}
                    onChange={(e) => handleFilterChange('acCode', e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    loading={loading}
                    className="w-full"
                    onClick={handleSearch}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Poling Station List Table */}
        <Card>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                List of Master Poling Station
              </h2>
              <Button
                variant="primary"
                onClick={handleDownload}
              >
                Download PS List
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredData.length)}</span> of <span className="font-semibold">{filteredData.length}</span> items.
              </p>
            </div>

            <DataTable
              data={paginatedData}
              columns={columns}
              loading={loading}
              className="w-full"
              searchable={false}
              pagination={false}
            />

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showFirstLast
                showPrevNext
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MasterPolingStationPage;
