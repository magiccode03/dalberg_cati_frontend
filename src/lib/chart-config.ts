// Chart color palettes
export const chartColors = {
  primary: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'],
  pastel: ['#A5B4FC', '#6EE7B7', '#FDE68A', '#FCA5A5', '#C4B5FD', '#67E8F9', '#BEF264', '#FDBA74'],
  vibrant: ['#1E40AF', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2', '#65A30D', '#EA580C'],
  monochrome: ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6', '#F9FAFB']
};

// Default chart options
export const defaultChartOptions = {
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'Inter, sans-serif'
  },
  animation: true,
  animationDuration: 1000,
  animationEasing: 'cubicOut'
};

// Responsive chart options
export const responsiveChartOptions = {
  media: [
    {
      query: {
        maxWidth: 768
      },
      option: {
        legend: {
          orient: 'horizontal',
          bottom: '5%'
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '20%',
          top: '10%'
        }
      }
    }
  ]
};

// Chart theme configurations
export const chartThemes = {
  light: {
    backgroundColor: '#ffffff',
    textStyle: {
      color: '#374151'
    },
    title: {
      textStyle: {
        color: '#111827'
      }
    },
    legend: {
      textStyle: {
        color: '#6B7280'
      }
    }
  },
  dark: {
    backgroundColor: '#1F2937',
    textStyle: {
      color: '#F9FAFB'
    },
    title: {
      textStyle: {
        color: '#FFFFFF'
      }
    },
    legend: {
      textStyle: {
        color: '#D1D5DB'
      }
    }
  }
};

// Utility functions
export const getChartColors = (count: number, palette: keyof typeof chartColors = 'primary') => {
  const colors = chartColors[palette];
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
};

export const formatNumber = (value: number, decimals: number = 0): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(decimals) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(decimals) + 'K';
  }
  return value.toFixed(decimals);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return (value * 100).toFixed(decimals) + '%';
};
