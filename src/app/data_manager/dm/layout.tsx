'use client';

import React from 'react';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

interface DataManagerDmLayoutProps {
  children: React.ReactNode;
}

const DataManagerDmLayout: React.FC<DataManagerDmLayoutProps> = ({ children }) => {
  return (
    <ConditionalLayout>
      {children}
    </ConditionalLayout>
  );
};

export default DataManagerDmLayout;
