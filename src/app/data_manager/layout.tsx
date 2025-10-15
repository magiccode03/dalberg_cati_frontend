'use client';

import React from 'react';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

interface DataManagerLayoutProps {
  children: React.ReactNode;
}

const DataManagerLayout: React.FC<DataManagerLayoutProps> = ({ children }) => {
  return (
    <ConditionalLayout>
      {children}
    </ConditionalLayout>
  );
};

export default DataManagerLayout;
