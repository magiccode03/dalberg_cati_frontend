'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useModal, useConfirmationModal, useDrawer, useModalStack } from '@/hooks/useModal';

interface ModalContextType {
  // Basic modals
  basicModal: ReturnType<typeof useModal>;
  userModal: ReturnType<typeof useModal>;
  settingsModal: ReturnType<typeof useModal>;
  
  // Confirmation modal
  confirmationModal: ReturnType<typeof useConfirmationModal>;
  
  // Drawers
  leftDrawer: ReturnType<typeof useDrawer>;
  rightDrawer: ReturnType<typeof useDrawer>;
  topDrawer: ReturnType<typeof useDrawer>;
  bottomDrawer: ReturnType<typeof useDrawer>;
  
  // Modal stack
  modalStack: ReturnType<typeof useModalStack>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export default function ModalProvider({ children }: ModalProviderProps) {
  // Basic modals
  const basicModal = useModal();
  const userModal = useModal();
  const settingsModal = useModal();
  
  // Confirmation modal
  const confirmationModal = useConfirmationModal();
  
  // Drawers
  const leftDrawer = useDrawer();
  const rightDrawer = useDrawer();
  const topDrawer = useDrawer();
  const bottomDrawer = useDrawer();
  
  // Modal stack
  const modalStack = useModalStack();

  const value: ModalContextType = {
    basicModal,
    userModal,
    settingsModal,
    confirmationModal,
    leftDrawer,
    rightDrawer,
    topDrawer,
    bottomDrawer,
    modalStack,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}
