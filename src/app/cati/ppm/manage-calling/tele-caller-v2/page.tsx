'use client';

import React from 'react';
import { FluidContainer } from '@/components/ui/Container';
import TelecallerList from '@/components/telecaller/TelecallerList';

const TeleUserInfoPage: React.FC = () => {
  return (
    <FluidContainer>
      <TelecallerList 
        showHeader={true}
        showSearchFilters={true}
        showTitle={true}
        itemsPerPage={30}
      />
    </FluidContainer>
  );
};

export default TeleUserInfoPage;
