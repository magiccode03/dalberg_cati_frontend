'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api-service';

// Dynamically import ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function BasicDemographicsPage() {
  // API data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainApiData, setMainApiData] = useState<any>(null); // Main dashboard data for charts and navigation tiles
  const [acApiData, setAcApiData] = useState<any>(null); // AC-specific data for table
  const [pcApiData, setPcApiData] = useState<any>(null); // PC-specific data for table
  const [districtApiData, setDistrictApiData] = useState<any>(null); // District-specific data for table
  const [zoneApiData, setZoneApiData] = useState<any>(null); // Zone-specific data for table
  const [selectedProgressType, setSelectedProgressType] = useState<number>(4); // Default to AC (4)
  const [selectedEntity, setSelectedEntity] = useState<any>(null); // Selected entity for drill-down
  const [drillDownData, setDrillDownData] = useState<any>(null); // Drill-down data with charts

  // Filter state
  const [filters, setFilters] = useState({
    acNameCode: '',
    gender: '',
    locality: '',
    religion: '',
    socialCategory: '',
    age: ''
  });

  // Fetch main dashboard data (for charts and navigation tiles)
  const fetchMainDemographicsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getBasicDemographics(); // No progress_type
      
      if (response.success && response.data) {
        setMainApiData(response.data);
      } else {
        setError('Failed to fetch main demographics data');
      }
    } catch (err: any) {
      console.error('Error fetching main demographics data:', err);
      setError(err.message || 'An error occurred while fetching main data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch AC-specific data (for table)
  const fetchACDemographicsData = async (filterParams?: any) => {
    try {
      const response = await apiService.getBasicDemographics(4, filterParams); // progress_type=4
      
      if (response.success && response.data) {
        setAcApiData(response.data);
      } else {
        console.error('Failed to fetch AC demographics data');
      }
    } catch (err: any) {
      console.error('Error fetching AC demographics data:', err);
    }
  };

  // Fetch PC-specific data (for table)
  const fetchPCDemographicsData = async (filterParams?: any) => {
    try {
      const response = await apiService.getBasicDemographics(1, filterParams); // progress_type=1
      
      if (response.success && response.data) {
        setPcApiData(response.data);
      } else {
        console.error('Failed to fetch PC demographics data');
      }
    } catch (err: any) {
      console.error('Error fetching PC demographics data:', err);
    }
  };

  // Fetch District-specific data (for table)
  const fetchDistrictDemographicsData = async (filterParams?: any) => {
    try {
      const response = await apiService.getBasicDemographics(2, filterParams); // progress_type=2
      
      if (response.success && response.data) {
        setDistrictApiData(response.data);
      } else {
        console.error('Failed to fetch District demographics data');
      }
    } catch (err: any) {
      console.error('Error fetching District demographics data:', err);
    }
  };

  // Fetch Zone-specific data (for table)
  const fetchZoneDemographicsData = async (filterParams?: any) => {
    try {
      const response = await apiService.getBasicDemographics(3, filterParams); // progress_type=3
      
      if (response.success && response.data) {
        setZoneApiData(response.data);
      } else {
        console.error('Failed to fetch Zone demographics data');
      }
    } catch (err: any) {
      console.error('Error fetching Zone demographics data:', err);
    }
  };

  // Fetch drill-down data for specific entity
  const fetchDrillDownData = async (progressType: number, progressSubType: number) => {
    try {
      const response = await apiService.getBasicDemographics(progressType, { progress_sub_type: progressSubType });
      
      if (response.success && response.data) {
        setDrillDownData(response.data);
      } else {
        console.error('Failed to fetch drill-down data');
      }
    } catch (err: any) {
      console.error('Error fetching drill-down data:', err);
    }
  };

  useEffect(() => {
    // Load main dashboard data and AC data on page load
    fetchMainDemographicsData();
    fetchACDemographicsData();
  }, []);

  // Debounced filter effect - trigger API calls when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filterParams = buildFilterParams();
      
      // Fetch data based on selected progress type with filters
      if (selectedProgressType === 4) {
        fetchACDemographicsData(filterParams);
      } else if (selectedProgressType === 1) {
        fetchPCDemographicsData(filterParams);
      } else if (selectedProgressType === 2) {
        fetchDistrictDemographicsData(filterParams);
      } else if (selectedProgressType === 3) {
        fetchZoneDemographicsData(filterParams);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, selectedProgressType]);

  const handleProgressTypeChange = (progressType: number) => {
    setSelectedProgressType(progressType);
    
    // Clear drill-down state when switching progress types
    setSelectedEntity(null);
    setDrillDownData(null);
    
    // Clear all filters when switching progress types
    setFilters({
      acNameCode: '',
      gender: '',
      locality: '',
      religion: '',
      socialCategory: '',
      age: ''
    });
    
    // Fetch appropriate data based on progress type
    if (progressType === 4) {
      fetchACDemographicsData();
      setPcApiData(null); // Clear PC data
      setDistrictApiData(null); // Clear District data
      setZoneApiData(null); // Clear Zone data
    } else if (progressType === 1) {
      fetchPCDemographicsData();
      setAcApiData(null); // Clear AC data
      setDistrictApiData(null); // Clear District data
      setZoneApiData(null); // Clear Zone data
    } else if (progressType === 2) {
      fetchDistrictDemographicsData();
      setAcApiData(null); // Clear AC data
      setPcApiData(null); // Clear PC data
      setZoneApiData(null); // Clear Zone data
    } else if (progressType === 3) {
      fetchZoneDemographicsData();
      setAcApiData(null); // Clear AC data
      setPcApiData(null); // Clear PC data
      setDistrictApiData(null); // Clear District data
    } else {
      setAcApiData(null); // Clear AC data when other progress types are selected
      setPcApiData(null); // Clear PC data when other progress types are selected
      setDistrictApiData(null); // Clear District data when other progress types are selected
      setZoneApiData(null); // Clear Zone data when other progress types are selected
    }
  };

  // Build filter parameters for API
  const buildFilterParams = () => {
    const params: any = {};
    
    if (filters.acNameCode) {
      params.psu_code = filters.acNameCode;
    }
    if (filters.gender) {
      params.gender_met = filters.gender;
    }
    if (filters.locality) {
      params.locality_met = filters.locality;
    }
    if (filters.religion) {
      params.religion_met = filters.religion;
    }
    if (filters.socialCategory) {
      params.social_category_met = filters.socialCategory;
    }
    if (filters.age) {
      params.age_met = filters.age;
    }
    
    return params;
  };

  const handleFilterChange = (field: string, value: string | string[]) => {
    const finalValue = Array.isArray(value) ? value[0] : value;
    setFilters(prev => ({ ...prev, [field]: finalValue }));
  };

  // Handle entity click for drill-down
  const handleEntityClick = (entity: any) => {
    setSelectedEntity(entity);
    
    // Determine the code based on progress type
    let progressSubType;
    if (selectedProgressType === 4) {
      progressSubType = entity.ac_code;
    } else if (selectedProgressType === 1) {
      progressSubType = entity.pc_code;
    } else if (selectedProgressType === 2) {
      progressSubType = entity.district_code;
    } else if (selectedProgressType === 3) {
      progressSubType = entity.region_code;
    }
    
    if (progressSubType) {
      fetchDrillDownData(selectedProgressType, progressSubType);
    }
  };

  // Handle back to table view
  const handleBackToTable = () => {
    setSelectedEntity(null);
    setDrillDownData(null);
  };

  // Generate drill-down chart options
  const getDrillDownGenderChartOptions = () => {
    if (!drillDownData?.sub_model) return {};
    
    const data = drillDownData.sub_model;
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '0%',
        right: '0%',
        top: '15%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        data: ['Universal Coverage', 'Baseline Coverage'],
        top: '5%'
      },
      xAxis: {
        type: 'category',
        data: ['Male', 'Female'],
        axisLabel: {
          show: true,
          interval: 0,
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          show: true,
          formatter: '{value}%',
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      series: [
        {
          name: 'Universal Coverage',
          type: 'bar',
          data: [data.male || 0, data.female || 0],
          itemStyle: { color: 'rgba(158, 159, 163, 0.5)' },
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            fontWeight: 'bold'
          }
        },
        {
          name: 'Baseline Coverage',
          type: 'bar',
          data: [
            { value: data.male_achievement || 0, itemStyle: { color: '#2da9d9' } },
            { value: data.female_achievement || 0, itemStyle: { color: '#b73377' } }
          ],
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            fontWeight: 'bold'
          }
        }
      ]
    };
  };

  const getDrillDownLocalityChartOptions = () => {
    if (!drillDownData?.sub_model) return {};
    
    const data = drillDownData.sub_model;
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '0%',
        right: '0%',
        top: '15%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        data: ['Universal Coverage', 'Baseline Coverage'],
        top: '5%'
      },
      xAxis: {
        type: 'category',
        data: ['Urban', 'Rural'],
        axisLabel: {
          show: true,
          interval: 0,
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          show: true,
          formatter: '{value}%',
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      series: [
        {
          name: 'Universal Coverage',
          type: 'bar',
          data: [data.urban || 0, data.rural || 0],
          itemStyle: { color: 'rgba(158, 159, 163, 0.5)' },
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            fontWeight: 'bold'
          }
        },
        {
          name: 'Baseline Coverage',
          type: 'bar',
          data: [
            { value: data.urban_achievement || 0, itemStyle: { color: 'yellow' } },
            { value: data.rural_achievement || 0, itemStyle: { color: 'green' } }
          ],
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            fontWeight: 'bold'
          }
        }
      ]
    };
  };

  const getDrillDownSocialCategoryChartOptions = () => {
    if (!drillDownData?.sub_model) return {};
    
    const data = drillDownData.sub_model;
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '0%',
        right: '0%',
        top: '15%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        data: ['Universal Coverage', 'Baseline Coverage'],
        top: '5%'
      },
      xAxis: {
        type: 'category',
        data: ['General+OBC+EBC', 'SC', 'ST'],
        axisLabel: {
          show: true,
          interval: 0,
          rotate: 0,
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          show: true,
          formatter: '{value}%',
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      series: [
        {
          name: 'Universal Coverage',
          type: 'bar',
          data: [
            (data.general || 0) + (data.general_obc || 0),
            data.sc || 0,
            data.st || 0
          ],
          itemStyle: { color: 'rgba(158, 159, 163, 0.5)' },
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            fontWeight: 'bold'
          }
        },
        {
          name: 'Baseline Coverage',
          type: 'bar',
          data: [
            { value: data.general_obc_achievement || 0, itemStyle: { color: '#FF9800' } },
            { value: data.sc_achievement || 0, itemStyle: { color: '#4CAF50' } },
            { value: data.st_achievement || 0, itemStyle: { color: '#3F51B5' } }
          ],
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            fontWeight: 'bold'
          }
        }
      ]
    };
  };

  const getDrillDownAgeChartOptions = () => {
    if (!drillDownData?.sub_model) return {};
    
    const data = drillDownData.sub_model;
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '0%',
        right: '0%',
        top: '15%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        data: ['Universal Coverage', 'Baseline Coverage'],
        top: '5%'
      },
      xAxis: {
        type: 'category',
        data: ['18-24 Years', '25-34 Years', '35-50 Years', '50+ Years'],
        axisLabel: {
          show: true,
          interval: 0,
          rotate: 0,
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          show: true,
          formatter: '{value}%',
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      series: [
        {
          name: 'Universal Coverage',
          type: 'bar',
          data: [
            data.age_18_24 || 0,
            data.age_25_34 || 0,
            data.age_35_50 || 0,
            data.age_50_above || 0
          ],
          itemStyle: { color: 'rgba(158, 159, 163, 0.5)' },
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            fontWeight: 'bold'
          }
        },
        {
          name: 'Baseline Coverage',
          type: 'bar',
          data: [
            { value: data.age_18_24_achievement || 0, itemStyle: { color: '#4CAF50' } },
            { value: data.age_25_34_achievement || 0, itemStyle: { color: '#2196F3' } },
            { value: data.age_35_50_achievement || 0, itemStyle: { color: '#FF9800' } },
            { value: data.age_50_above_achievement || 0, itemStyle: { color: '#9C27B0' } }
          ],
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            fontWeight: 'bold'
          }
        }
      ]
    };
  };

  const getDrillDownReligionChartOptions = () => {
    if (!drillDownData?.sub_model) return {};
    
    const data = drillDownData.sub_model;
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '0%',
        right: '0%',
        top: '15%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        data: ['Universal Coverage', 'Baseline Coverage'],
        top: '5%'
      },
      xAxis: {
        type: 'category',
        data: ['Hindu', 'Muslim', 'Others'],
        axisLabel: {
          show: true,
          interval: 0,
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          show: true,
          formatter: '{value}%',
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      series: [
        {
          name: 'Universal Coverage',
          type: 'bar',
          data: [
            data.hindu || 0,
            data.muslim || 0,
            (data.christian || 0) + (data.religion_others || 0)
          ],
          itemStyle: { color: 'rgba(158, 159, 163, 0.5)' },
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            fontWeight: 'bold'
          }
        },
        {
          name: 'Baseline Coverage',
          type: 'bar',
          data: [
            { value: data.hindu_achievement || 0, itemStyle: { color: 'orange' } },
            { value: data.muslim_achievement || 0, itemStyle: { color: 'green' } },
            { value: (data.religion_others_achievement || 0), itemStyle: { color: 'grey' } }
          ],
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            fontWeight: 'bold'
          }
        }
      ]
    };
  };


  // Filter options
  const getGenderOptions = () => {
    const baseLabel = selectedProgressType === 1 ? 'PCs' : 
                     selectedProgressType === 2 ? 'Districts' : 
                     selectedProgressType === 3 ? 'Zones' : 'ACs';
    return [
      { value: '', label: `All ${baseLabel}` },
      { value: '1', label: `${baseLabel} with Low Female Coverage` },
      { value: '2', label: `${baseLabel} with High Female Coverage` },
      { value: '3', label: `${baseLabel} with Balanced Gender Coverage` }
  ];
  };

  const getLocalityOptions = () => {
    const baseLabel = selectedProgressType === 1 ? 'PCs' : 
                     selectedProgressType === 2 ? 'Districts' : 
                     selectedProgressType === 3 ? 'Zones' : 'ACs';
    return [
      { value: '', label: `All ${baseLabel}` },
      { value: '1', label: `${baseLabel} with Low Urban Coverage` },
      { value: '2', label: `${baseLabel} with High Urban Coverage` },
      { value: '3', label: `${baseLabel} with Balanced Locality Coverage` }
  ];
  };

  const getReligionOptions = () => {
    const baseLabel = selectedProgressType === 1 ? 'PCs' : 
                     selectedProgressType === 2 ? 'Districts' : 
                     selectedProgressType === 3 ? 'Zones' : 'ACs';
    return [
      { value: '', label: `All ${baseLabel}` },
      { value: '1', label: `${baseLabel} with Low Muslim Coverage` }
  ];
  };

  const getSocialCategoryOptions = () => {
    const baseLabel = selectedProgressType === 1 ? 'PCs' : 
                     selectedProgressType === 2 ? 'Districts' : 
                     selectedProgressType === 3 ? 'Zones' : 'ACs';
    return [
      { value: '', label: `All ${baseLabel}` },
      { value: '1', label: `${baseLabel} with Low G+O+E Coverage` },
      { value: '2', label: `${baseLabel} with Low SC Coverage` },
      { value: '3', label: `${baseLabel} with Low ST Coverage` }
  ];
  };

  const getAgeOptions = () => {
    const baseLabel = selectedProgressType === 1 ? 'PCs' : 
                     selectedProgressType === 2 ? 'Districts' : 
                     selectedProgressType === 3 ? 'Zones' : 'ACs';
    return [
      { value: '', label: `All ${baseLabel}` },
      { value: '1', label: `${baseLabel} with Low 18-24 years Coverage` },
      { value: '2', label: `${baseLabel} with Low 25-34 years Coverage` },
      { value: '3', label: `${baseLabel} with Low 35-50 years Coverage` },
      { value: '4', label: `${baseLabel} with Low 50+ years Coverage` }
  ];
  };

  // Gender Coverage Chart
  const genderChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '0%',
      right: '0%',
      top: '15%',
      bottom: '5%',
      containLabel: true
    },
    legend: {
      data: ['Universal Coverage', 'Baseline Coverage'],
      top: '5%',
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
      xAxis: {
        type: 'category',
        data: ['Male', 'Female'],
        axisLabel: {
          show: true,
          interval: 0,
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          show: true,
          formatter: '{value}%',
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [
          parseFloat(mainApiData?.demographic_charts?.gender_coverage?.male || '0'),
          parseFloat(mainApiData?.demographic_charts?.gender_coverage?.female || '0')
        ],
        itemStyle: {
          color: 'rgba(158, 159, 163, 0.5)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      },
      {
        name: 'Baseline Coverage',
        type: 'bar',
        data: [
          { value: parseFloat(mainApiData?.demographic_charts?.gender_coverage?.male_achievement || '0'), itemStyle: { color: '#2da9d9' } },
          { value: parseFloat(mainApiData?.demographic_charts?.gender_coverage?.female_achievement || '0'), itemStyle: { color: '#b73377' } }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      }
    ]
  };

  // Locality Coverage Chart
  const localityChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '0%',
      right: '0%',
      top: '15%',
      bottom: '5%',
      containLabel: true
    },
    legend: {
      data: ['Universal Coverage', 'Baseline Coverage'],
      top: '5%',
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    xAxis: {
      type: 'category',
      data: ['Urban', 'Rural'],
      axisLabel: {
        show: true,
        interval: 0,
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        show: true,
        formatter: '{value}%',
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [
          parseFloat(mainApiData?.demographic_charts?.locality_coverage?.urban || '0'),
          parseFloat(mainApiData?.demographic_charts?.locality_coverage?.rural || '0')
        ],
        itemStyle: {
          color: 'rgba(158, 159, 163, 0.5)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      },
      {
        name: 'Baseline Coverage',
        type: 'bar',
        data: [
          { value: parseFloat(mainApiData?.demographic_charts?.locality_coverage?.urban_achievement || '0'), itemStyle: { color: 'yellow' } },
          { value: parseFloat(mainApiData?.demographic_charts?.locality_coverage?.rural_achievement || '0'), itemStyle: { color: 'green' } }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      }
    ]
  };

  // Social Category Coverage Chart
  const socialCategoryChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '0%',
      right: '0%',
      top: '15%',
      bottom: '5%',
      containLabel: true
    },
    legend: {
      data: ['Universal Coverage', 'Baseline Coverage'],
      top: '5%',
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    xAxis: {
      type: 'category',
      data: ['General+OBC+EBC', 'SC', 'ST'],
      axisLabel: {
        show: true,
        interval: 0,
        rotate: 0,
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        show: true,
        formatter: '{value}%',
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [
          parseFloat(mainApiData?.demographic_charts?.social_category_coverage?.general_obc_achievement || '0'),
          parseFloat(mainApiData?.demographic_charts?.social_category_coverage?.sc || '0'),
          parseFloat(mainApiData?.demographic_charts?.social_category_coverage?.st || '0')
        ],
        itemStyle: {
          color: 'rgba(158, 159, 163, 0.5)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      },
      {
        name: 'Baseline Coverage',
        type: 'bar',
        data: [
          { value: parseFloat(mainApiData?.demographic_charts?.social_category_coverage?.general_obc_achievement || '0'), itemStyle: { color: '#FF9800' } },
          { value: parseFloat(mainApiData?.demographic_charts?.social_category_coverage?.sc_achievement || '0'), itemStyle: { color: '#4CAF50' } },
          { value: parseFloat(mainApiData?.demographic_charts?.social_category_coverage?.st_achievement || '0'), itemStyle: { color: '#3F51B5' } }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      }
    ]
  };

  // Age Coverage Chart
  const ageChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '0%',
      right: '0%',
      top: '15%',
      bottom: '5%',
      containLabel: true
    },
    legend: {
      data: ['Universal Coverage', 'Baseline Coverage'],
      top: '5%',
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    xAxis: {
      type: 'category',
      data: ['18-24 Years', '25-34 Years', '35-50 Years', '50+ Years'],
      axisLabel: {
        show: true,
        interval: 0,
        rotate: 0,
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        show: true,
        formatter: '{value}%',
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [
          parseFloat(mainApiData?.demographic_charts?.age_coverage?.age_18_24 || '0'),
          parseFloat(mainApiData?.demographic_charts?.age_coverage?.age_25_34 || '0'),
          parseFloat(mainApiData?.demographic_charts?.age_coverage?.age_35_50 || '0'),
          parseFloat(mainApiData?.demographic_charts?.age_coverage?.age_50_above || '0')
        ],
        itemStyle: {
          color: 'rgba(158, 159, 163, 0.5)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      },
      {
        name: 'Baseline Coverage',
        type: 'bar',
        data: [
          { value: parseFloat(mainApiData?.demographic_charts?.age_coverage?.age_18_24_achievement || '0'), itemStyle: { color: '#4CAF50' } },
          { value: parseFloat(mainApiData?.demographic_charts?.age_coverage?.age_25_34_achievement || '0'), itemStyle: { color: '#2196F3' } },
          { value: parseFloat(mainApiData?.demographic_charts?.age_coverage?.age_35_50_achievement || '0'), itemStyle: { color: '#FF9800' } },
          { value: parseFloat(mainApiData?.demographic_charts?.age_coverage?.age_50_above_achievement || '0'), itemStyle: { color: '#9C27B0' } }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      }
    ]
  };

  // Religion Coverage Chart
  const religionChartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '0%',
      right: '0%',
      top: '15%',
      bottom: '5%',
      containLabel: true
    },
    legend: {
      data: ['Universal Coverage', 'Baseline Coverage'],
      top: '5%',
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    xAxis: {
      type: 'category',
      data: ['Hindu', 'Muslim', 'Others'],
      axisLabel: {
        show: true,
        interval: 0,
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        show: true,
        formatter: '{value}%',
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    series: [
      {
        name: 'Universal Coverage',
        type: 'bar',
        data: [
          parseFloat(mainApiData?.demographic_charts?.religion_coverage?.hindu || '0'),
          parseFloat(mainApiData?.demographic_charts?.religion_coverage?.muslim || '0'),
          parseFloat(mainApiData?.demographic_charts?.religion_coverage?.christian || '0') + parseFloat(mainApiData?.demographic_charts?.religion_coverage?.other || '0')
        ],
        itemStyle: {
          color: 'rgba(158, 159, 163, 0.5)'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      },
      {
        name: 'Baseline Coverage',
        type: 'bar',
        data: [
          { value: parseFloat(mainApiData?.demographic_charts?.religion_coverage?.hindu_achievement || '0'), itemStyle: { color: 'orange' } },
          { value: parseFloat(mainApiData?.demographic_charts?.religion_coverage?.muslim_achievement || '0'), itemStyle: { color: 'green' } },
          { value: parseFloat(mainApiData?.demographic_charts?.religion_coverage?.christian_achievement || '0') + parseFloat(mainApiData?.demographic_charts?.religion_coverage?.other_achievement || '0'), itemStyle: { color: 'grey' } }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          fontWeight: 'bold'
        }
      }
    ]
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading demographics data...</Text>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <Text className="text-red-600 mb-4">{error}</Text>
          </Card>
        </div>
      </div>
    );
  }

  // No data state
  if (!mainApiData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <Text className="text-gray-600">No data available</Text>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Page Title */}
      <div className="mb-8">
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">Demographic</Heading>
      </div>

        {/* First Row - 3 Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Gender Coverage */}
          <Card className="p-6">
            <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Gender Coverage
            </Heading>
            <ReactECharts 
              option={genderChartOptions} 
              style={{ height: '400px', width: '100%' }} 
              opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
            />
          </Card>

          {/* Locality Coverage */}
          <Card className="p-6">
            <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Locality Coverage
            </Heading>
            <ReactECharts 
              option={localityChartOptions} 
              style={{ height: '400px', width: '100%' }} 
              opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
            />
          </Card>

          {/* Social Category Coverage */}
          <Card className="p-6">
            <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Social Category Coverage
            </Heading>
            <ReactECharts 
              option={socialCategoryChartOptions} 
              style={{ height: '400px', width: '100%' }} 
              opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
            />
          </Card>
        </div>

        {/* Second Row - 2 Charts (50%-50%) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Age Coverage */}
          <Card className="p-6">
            <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Age Coverage
            </Heading>
            <ReactECharts 
              option={ageChartOptions} 
              style={{ height: '400px', width: '100%' }} 
              opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
            />
          </Card>

          {/* Religion Coverage */}
          <Card className="p-6">
            <Heading level={4} align="center" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Religion Coverage
            </Heading>
            <ReactECharts 
              option={religionChartOptions} 
              style={{ height: '400px', width: '100%' }} 
              opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
            />
          </Card>
        </div>

        {/* Third Row - Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* ACs Card */}
          <div 
            className={`transition-all duration-200 rounded-lg shadow-md cursor-pointer ${
              selectedProgressType === 4 
                ? 'bg-green-600' 
                : 'bg-green-500 bg-opacity-50 hover:bg-opacity-100'
            }`}
            onClick={() => handleProgressTypeChange(4)}
          >
            <div className="p-4 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">ACs</h2>
              <h4 className="text-white text-2xl font-semibold">{mainApiData?.navigation_tiles?.total_ac_count || 0}</h4>
            </div>
          </div>
          {/* PCs Card */}
          <div 
            className={`transition-all duration-200 rounded-lg shadow-md cursor-pointer ${
              selectedProgressType === 1 
                ? 'bg-green-600' 
                : 'bg-green-500 bg-opacity-50 hover:bg-opacity-100'
            }`}
            onClick={() => handleProgressTypeChange(1)}
          >
            <div className="p-4 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">PCs</h2>
              <h4 className="text-white text-2xl font-semibold">{mainApiData?.navigation_tiles?.total_pc_count || 0}</h4>
            </div>
          </div>

          {/* Districts Card */}
          <div 
            className={`transition-all duration-200 rounded-lg shadow-md cursor-pointer ${
              selectedProgressType === 2 
                ? 'bg-green-600' 
                : 'bg-green-500 bg-opacity-50 hover:bg-opacity-100'
            }`}
            onClick={() => handleProgressTypeChange(2)}
          >
            <div className="p-4 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">Districts</h2>
              <h4 className="text-white text-2xl font-semibold">{mainApiData?.navigation_tiles?.total_district_count || 0}</h4>
            </div>
          </div>

          {/* Zones Card */}
          <div 
            className={`transition-all duration-200 rounded-lg shadow-md cursor-pointer ${
              selectedProgressType === 3 
                ? 'bg-green-600' 
                : 'bg-green-500 bg-opacity-50 hover:bg-opacity-100'
            }`}
            onClick={() => handleProgressTypeChange(3)}
          >
            <div className="p-4 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">Zones</h2>
              <h4 className="text-white text-2xl font-semibold">{mainApiData?.navigation_tiles?.total_zone_count || 0}</h4>
            </div>
          </div>
        </div>

        {/* Fourth Row - Filter Card */}
        <Card className="mt-6">
          <div className="p-6">
            <div className="mb-4">
              <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </Heading>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Universal Search - Name/Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search by Name/Code
                </label>
                <Input
                  type="text"
                  placeholder="Search by AC/PC/District/Zone name or code"
                  value={filters.acNameCode}
                  onChange={(e) => handleFilterChange('acNameCode', e.target.value)}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <SelectDropdown
                  options={getGenderOptions()}
                  value={filters.gender}
                  onChange={(value) => handleFilterChange('gender', value)}
                  placeholder={selectedProgressType === 1 ? 'All PCs' : 
                              selectedProgressType === 2 ? 'All Districts' : 
                              selectedProgressType === 3 ? 'All Zones' : 'All ACs'}
                />
              </div>

              {/* Locality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Locality
                </label>
                <SelectDropdown
                  options={getLocalityOptions()}
                  value={filters.locality}
                  onChange={(value) => handleFilterChange('locality', value)}
                  placeholder={selectedProgressType === 1 ? 'All PCs' : 
                              selectedProgressType === 2 ? 'All Districts' : 
                              selectedProgressType === 3 ? 'All Zones' : 'All ACs'}
                />
              </div>

              {/* Religion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Religion
                </label>
                <SelectDropdown
                  options={getReligionOptions()}
                  value={filters.religion}
                  onChange={(value) => handleFilterChange('religion', value)}
                  placeholder={selectedProgressType === 1 ? 'All PCs' : 
                              selectedProgressType === 2 ? 'All Districts' : 
                              selectedProgressType === 3 ? 'All Zones' : 'All ACs'}
                />
              </div>

              {/* Social Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Social Category
                </label>
                <SelectDropdown
                  options={getSocialCategoryOptions()}
                  value={filters.socialCategory}
                  onChange={(value) => handleFilterChange('socialCategory', value)}
                  placeholder={selectedProgressType === 1 ? 'All PCs' : 
                              selectedProgressType === 2 ? 'All Districts' : 
                              selectedProgressType === 3 ? 'All Zones' : 'All ACs'}
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age
                </label>
                <SelectDropdown
                  options={getAgeOptions()}
                  value={filters.age}
                  onChange={(value) => handleFilterChange('age', value)}
                  placeholder={selectedProgressType === 1 ? 'All PCs' : 
                              selectedProgressType === 2 ? 'All Districts' : 
                              selectedProgressType === 3 ? 'All Zones' : 'All ACs'}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Fifth Row - Data Table (Show when AC, PC, District, or Zone is selected and no entity is selected for drill-down) */}
        {(selectedProgressType === 4 || selectedProgressType === 1 || selectedProgressType === 2 || selectedProgressType === 3) && !selectedEntity && (
          <Card className="mt-6">
            <div className="p-6">
              <Heading level={3} className="text-xl font-semibold mb-4">
                {selectedProgressType === 1 ? 'PC Wise Demographics Data' : 
                 selectedProgressType === 2 ? 'District Wise Demographics Data' : 
                 selectedProgressType === 3 ? 'Zone Wise Demographics Data' :
                 'AC Wise Demographics Data'}
              </Heading>
              
              {/* Filter Description */}
              {((selectedProgressType === 4 && acApiData?.filter_description) || 
                (selectedProgressType === 1 && pcApiData?.filter_description) ||
                (selectedProgressType === 2 && districtApiData?.filter_description) ||
                (selectedProgressType === 3 && zoneApiData?.filter_description)) && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <Text className="text-blue-800 font-medium">
                      Filter Applied: {(selectedProgressType === 4 ? acApiData?.filter_description : 
                                      selectedProgressType === 1 ? pcApiData?.filter_description :
                                      selectedProgressType === 2 ? districtApiData?.filter_description :
                                      zoneApiData?.filter_description)}
                    </Text>
                  </div>
                </div>
              )}
              
              {((selectedProgressType === 4 && acApiData?.data_provider && acApiData.data_provider.length > 0) || 
                (selectedProgressType === 1 && pcApiData?.data_provider && pcApiData.data_provider.length > 0) ||
                (selectedProgressType === 2 && districtApiData?.data_provider && districtApiData.data_provider.length > 0) ||
                (selectedProgressType === 3 && zoneApiData?.data_provider && zoneApiData.data_provider.length > 0)) ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th rowSpan={2} className="border border-gray-300 p-3 text-left font-semibold" style={{width: '12%'}}>
                          {selectedProgressType === 1 ? 'PC Name' : 
                           selectedProgressType === 2 ? 'District Name' : 
                           selectedProgressType === 3 ? 'Zone Name' :
                           'AC Name'}
                        </th>
                        <th rowSpan={2} className="border border-gray-300 p-3 text-center font-semibold" style={{width: '10%'}}>Sample</th>
                        <th rowSpan={2} className="border border-gray-300 p-3 text-center font-semibold" style={{width: '10%'}}></th>
                        <th colSpan={2} className="border border-gray-300 p-3 text-center font-semibold" style={{width: '10%'}}>Gender</th>
                        <th colSpan={4} className="border border-gray-300 p-3 text-center font-semibold" style={{width: '10%'}}>Age</th>
                        <th colSpan={2} className="border border-gray-300 p-3 text-center font-semibold" style={{width: '10%'}}>Locality</th>
                        <th colSpan={3} className="border border-gray-300 p-3 text-center font-semibold" style={{width: '10%'}}>Social Category</th>
                        <th colSpan={3} className="border border-gray-300 p-3 text-center font-semibold" style={{width: '10%'}}>Religion</th>
                      </tr>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>Male</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>Female</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>18-24</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>25-34</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>35-50</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>50+</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>Urban</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>Rural</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>G+O+E</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>SC</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>ST</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>Hindu</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>Muslim</th>
                        <th className="border border-gray-300 p-2 text-center font-medium" style={{width: '6%'}}>Others</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedProgressType === 4 ? acApiData.data_provider : 
                        selectedProgressType === 1 ? pcApiData.data_provider : 
                        selectedProgressType === 2 ? districtApiData.data_provider :
                        zoneApiData.data_provider).map((item: any, index: number) => (
                        <React.Fragment key={selectedProgressType === 4 ? item.ac_code : 
                                          selectedProgressType === 1 ? item.pc_code : 
                                          selectedProgressType === 2 ? item.district_code :
                                          item.region_code || index}>
                          {/* Population % Row */}
                          <tr className="hover:bg-gray-50">
                            <td rowSpan={3} className="border border-gray-300 p-3 font-medium text-blue-600 cursor-pointer hover:bg-blue-50 hover:text-blue-800 transition-colors duration-200" onClick={() => handleEntityClick(item)}>
                              {selectedProgressType === 4 ? `${item.ac_code} - ${item.ac_name}` : 
                               selectedProgressType === 1 ? `${item.pc_code} - ${item.pc_name}` :
                               selectedProgressType === 2 ? `${item.district_code} - ${item.district_name}` :
                               `${item.region_code} - ${item.region_name}`}
                            </td>
                            <td rowSpan={3} className="border border-gray-300 p-3 text-center">
                              {item.valid_underqc_achived || 0}/{item.sample_target || 0}
                            </td>
                            <td className="border border-gray-300 p-3 text-center">Population %</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.male || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.female || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.age_18_24 || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.age_25_34 || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.age_35_50 || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.age_50_above || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.urban || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.rural || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round((item.demographics?.general || 0) + (item.demographics?.obc || 0))}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.sc || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.st || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.hindu || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.muslim || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round((item.demographics?.christian || 0) + (item.demographics?.religion_others || 0))}%</td>
                          </tr>

                          {/* Achievement % Row */}
                          <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-3 text-center">Achievement %</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.male_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.female_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.age_18_24_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.age_25_34_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.age_35_50_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.age_50_above_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.urban_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.rural_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.general_obc_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.sc_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.st_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.hindu_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round(item.demographics?.muslim_achievement || 0)}%</td>
                            <td className="border border-gray-300 p-3 text-center">{Math.round((item.demographics?.christian_achievement || 0) + (item.demographics?.religion_others_achievement || 0))}%</td>
                          </tr>

                          {/* Difference Row */}
                          <tr className="hover:bg-gray-50 border-b-2 border-black">
                            <td className="border border-gray-300 p-3 text-center">Difference</td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.male_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.male_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.male_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.female_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.female_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.female_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.age_18_24_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.age_18_24_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.age_18_24_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.age_25_34_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.age_25_34_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.age_25_34_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.age_35_50_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.age_35_50_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.age_35_50_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.age_50_above_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.age_50_above_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.age_50_above_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.urban_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.urban_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.urban_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.rural_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.rural_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.rural_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.general_obc_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.general_obc_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.general_obc_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.sc_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.sc_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.sc_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.st_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.st_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.st_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.hindu_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.hindu_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.hindu_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                ((item.demographics?.muslim_difference || 0) > 0 ? 'bg-green-100 text-green-800' : 
                                 (item.demographics?.muslim_difference || 0) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round(item.demographics?.muslim_difference || 0) : 'NA'}
                            </td>
                            <td className={`border border-gray-300 p-3 text-center ${
                              (item.valid_underqc_achived || 0) > 0 ? 
                                (((item.demographics?.christian_difference || 0) + (item.demographics?.religion_others_difference || 0)) > 0 ? 'bg-green-100 text-green-800' : 
                                 ((item.demographics?.christian_difference || 0) + (item.demographics?.religion_others_difference || 0)) < 0 ? 'bg-red-100 text-red-800' : '') : ''
                            }`}>
                              {(item.valid_underqc_achived || 0) > 0 ? Math.round((item.demographics?.christian_difference || 0) + (item.demographics?.religion_others_difference || 0)) : 'NA'}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No {selectedProgressType === 1 ? 'PC' : 
                        selectedProgressType === 2 ? 'District' : 
                        selectedProgressType === 3 ? 'Zone' : 'AC'} demographic data available</p>
                  <p className="text-sm mt-2">Data provider array is empty or missing</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Drill-down View - Show when entity is selected */}
        {selectedEntity && drillDownData && (
          <Card className="mt-6">
            <div className="p-6">
              {/* Header with back button */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Heading level={3} className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedProgressType === 4 ? 'AC Progress' : 
                     selectedProgressType === 1 ? 'PC Progress' : 
                     selectedProgressType === 2 ? 'District Progress' : 'Zone Progress'} - ({selectedEntity.ac_code || selectedEntity.pc_code || selectedEntity.district_code || selectedEntity.region_code}) {selectedEntity.ac_name || selectedEntity.pc_name || selectedEntity.district_name || selectedEntity.region_name}
                  </Heading>
                </div>
                <button
                  onClick={handleBackToTable}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                >
                  Back to Table
                </button>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Gender Coverage */}
                <Card className="p-0 border border-black">
                  <Heading level={3} align="center" className="mb-0">
                    Gender Coverage
                  </Heading>
                  <ReactECharts 
                    option={getDrillDownGenderChartOptions()} 
                    style={{ height: '400px', width: '100%' }} 
                    opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
                  />
                </Card>

                {/* Locality Coverage */}
                <Card className="p-0 border border-black">
                  <Heading level={3} align="center" className="mb-0">
                    Locality Coverage
                  </Heading>
                  <ReactECharts 
                    option={getDrillDownLocalityChartOptions()} 
                    style={{ height: '400px', width: '100%' }} 
                    opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
                  />
                </Card>

                {/* Social Category Coverage */}
                <Card className="p-0 border border-black">
                  <Heading level={3} align="center" className="mb-0">
                    Social Category Coverage
                  </Heading>
                  <ReactECharts 
                    option={getDrillDownSocialCategoryChartOptions()} 
                    style={{ height: '400px', width: '100%' }} 
                    opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
                  />
                </Card>
              </div>

              {/* Second Row - 2 Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age Coverage */}
                <Card className="p-0 border border-black">
                  <Heading level={3} align="center" className="mb-0">
                    Age Coverage
                  </Heading>
                  <ReactECharts 
                    option={getDrillDownAgeChartOptions()} 
                    style={{ height: '400px', width: '100%' }} 
                    opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
                  />
                </Card>

                {/* Religion Coverage */}
                <Card className="p-0 border border-black">
                  <Heading level={3} align="center" className="mb-0">
                    Religion Coverage
                  </Heading>
                  <ReactECharts 
                    option={getDrillDownReligionChartOptions()} 
                    style={{ height: '400px', width: '100%' }} 
                    opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
                  />
                </Card>
              </div>
            </div>
          </Card>
        )}
    </div>
  );
}