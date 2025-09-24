import { useState, useCallback, useRef } from 'react';

export interface ModalState {
  isOpen: boolean;
  data?: any;
}

export interface UseModalReturn {
  isOpen: boolean;
  data: any;
  open: (data?: any) => void;
  close: () => void;
  toggle: () => void;
}

export function useModal(initialState: boolean = false): UseModalReturn {
  const [state, setState] = useState<ModalState>({
    isOpen: initialState,
    data: undefined,
  });

  const open = useCallback((data?: any) => {
    setState({ isOpen: true, data });
  }, []);

  const close = useCallback(() => {
    setState({ isOpen: false, data: undefined });
  }, []);

  const toggle = useCallback(() => {
    setState(prev => ({ 
      isOpen: !prev.isOpen, 
      data: prev.isOpen ? undefined : prev.data 
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    data: state.data,
    open,
    close,
    toggle,
  };
}

export interface UseConfirmationModalReturn {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
  show: (config: {
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => void;
  hide: () => void;
}

export function useConfirmationModal(): UseConfirmationModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'danger' | 'warning' | 'info' | 'success'>('danger');
  const [confirmText, setConfirmText] = useState('Confirm');
  const [cancelText, setCancelText] = useState('Cancel');
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

  const show = useCallback((config: {
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => {
    setTitle(config.title);
    setMessage(config.message);
    setType(config.type || 'danger');
    setConfirmText(config.confirmText || 'Confirm');
    setCancelText(config.cancelText || 'Cancel');
    setOnConfirm(() => config.onConfirm);
    setIsOpen(true);
  }, []);

  const hide = useCallback(() => {
    setIsOpen(false);
    setTitle('');
    setMessage('');
    setType('danger');
    setConfirmText('Confirm');
    setCancelText('Cancel');
    setOnConfirm(null);
  }, []);

  return {
    isOpen,
    title,
    message,
    type,
    confirmText,
    cancelText,
    onConfirm,
    show,
    hide,
  };
}

export interface UseDrawerReturn {
  isOpen: boolean;
  data: any;
  open: (data?: any) => void;
  close: () => void;
  toggle: () => void;
}

export function useDrawer(initialState: boolean = false): UseDrawerReturn {
  const [state, setState] = useState<ModalState>({
    isOpen: initialState,
    data: undefined,
  });

  const open = useCallback((data?: any) => {
    setState({ isOpen: true, data });
  }, []);

  const close = useCallback(() => {
    setState({ isOpen: false, data: undefined });
  }, []);

  const toggle = useCallback(() => {
    setState(prev => ({ 
      isOpen: !prev.isOpen, 
      data: prev.isOpen ? undefined : prev.data 
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    data: state.data,
    open,
    close,
    toggle,
  };
}

export interface UseModalStackReturn {
  modals: Array<{
    id: string;
    component: React.ComponentType<any>;
    props: any;
  }>;
  open: (component: React.ComponentType<any>, props: any) => string;
  close: (id: string) => void;
  closeAll: () => void;
  closeTop: () => void;
}

export function useModalStack(): UseModalStackReturn {
  const [modals, setModals] = useState<Array<{
    id: string;
    component: React.ComponentType<any>;
    props: any;
  }>>([]);

  const open = useCallback((component: React.ComponentType<any>, props: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    setModals(prev => [...prev, { id, component, props }]);
    return id;
  }, []);

  const close = useCallback((id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  }, []);

  const closeAll = useCallback(() => {
    setModals([]);
  }, []);

  const closeTop = useCallback(() => {
    setModals(prev => prev.slice(0, -1));
  }, []);

  return {
    modals,
    open,
    close,
    closeAll,
    closeTop,
  };
}
