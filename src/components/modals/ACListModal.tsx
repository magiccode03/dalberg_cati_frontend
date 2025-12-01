'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { BarChart3, MapPin } from 'lucide-react';

interface ACData {
    ac_code: number;
    ac_name: string;
    total_interviews: number;
    total_assigned: number;
    total_not_assigned: number;
    total_pass: number;
    total_fail: number;
    total_pending: number;
}

interface ACListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ACListModal: React.FC<ACListModalProps> = ({ isOpen, onClose }) => {
    const [allAcData, setAllAcData] = useState<ACData[]>([]);
    const [acList, setAcList] = useState<ACData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        const fetchAcList = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                if (!token) {
                    setError('Authentication required');
                    setLoading(false);
                    return;
                }

                const url = `${apiUrl}/api/cati/qc/ac-list?limit=500&sort_by=ac_code&sort_order=ASC`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    const data = Array.isArray(result.data) ? result.data : (result.data?.data ?? []);
                    const normalized: ACData[] = data.map((item: any) => ({
                        ac_code: item.ac_code,
                        ac_name: item.ac_name,
                        total_interviews: item.total_interviews || 0,
                        total_assigned: item.total_assigned || 0,
                        total_not_assigned: item.total_not_assigned || 0,
                        total_pass: item.total_pass || 0,
                        total_fail: item.total_fail || 0,
                        total_pending: item.total_pending || 0,
                    }));
                    setAllAcData(normalized);
                    setAcList(normalized);
                } else {
                    setError(result.message || 'Failed to fetch AC list');
                }
            } catch (err: any) {
                console.error('Error fetching AC list:', err);
                setError(err?.message || 'Failed to fetch AC list');
            } finally {
                setLoading(false);
            }
        };

        fetchAcList();
    }, [isOpen]);

    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            if (!searchTerm.trim()) {
                setAcList(allAcData);
                return;
            }
            const s = searchTerm.trim().toLowerCase();
            const filtered = allAcData.filter(ac => {
                if (!isNaN(Number(searchTerm))) {
                    return ac.ac_code.toString().includes(searchTerm);
                }
                return ac.ac_name.toLowerCase().includes(s) || ac.ac_code.toString().includes(searchTerm);
            });
            setAcList(filtered);
        }, 300);

        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, [searchTerm, allAcData]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assembly Constituencies" size="lg" className="max-h-[85vh]">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Search Assembly Constituency
                    </label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="text"
                            placeholder="Search by AC Code or AC Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                        <Button variant="outline" onClick={() => { setSearchTerm(''); setAcList(allAcData); }} size="sm">Clear</Button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Type to search by AC code or name
                    </p>
                </div>
                {/* AC List with Lazy Loading */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total ACs:
                        <span className="ml-2 text-xs text-gray-500">{acList.length}</span>
                    </label>
                </div>

                {loading ? (
                    <div className="py-4 flex justify-center"><LoadingSpinner size="lg" /></div>
                ) : error ? (
                    <div className="text-center text-red-600 py-4"><Text>{error}</Text></div>
                ) : (
                    <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-gray-100 dark:border-gray-700">
                        <ul className="divide-y divide-gray-100">
                            {acList.map(ac => (
                                <li key={ac.ac_code} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="text-gray-400"><MapPin className="h-4 w-4" /></div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{ac.ac_name}</div>
                                            <div className="text-xs text-gray-500">#{ac.ac_code}</div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 text-right text-xs text-gray-500">
                                        <div className="text-muted">Available</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{ac.total_not_assigned ?? 0}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ACListModal;
