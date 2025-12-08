'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import { Search, X } from 'lucide-react';

interface SearchFilters {
  teleform_user_id: string;
  name: string;
  mobile_number: string;
  status: string;
  telecaller: string;
  ac_code: string;
  permission: string;
  telecalling_group_id: string;
}

interface TelecallerOption {
  value: string;
  label: string;
  user_id: number;
  name: string;
  mobile_number: string;
}

interface TelecallingGroup {
  id: number;
  name: string;
}

interface TelecallerSearchFiltersProps {
  searchFilters: SearchFilters;
  onFilterChange: (field: keyof SearchFilters, value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onClear: () => void;
  acOptions: Array<{ value: string; label: string }>;
  telecallerOptions: TelecallerOption[];
  telecallingGroups: TelecallingGroup[];
  statusOptions: Array<{ value: string; label: string }>;
  permissionOptions: Array<{ value: string; label: string }>;
  loading: boolean;
  groupsLoading: boolean;
  onTelecallerSelect?: (selectedValue: string, options: TelecallerOption[]) => void;
}

const TelecallerSearchFilters: React.FC<TelecallerSearchFiltersProps> = ({
  searchFilters,
  onFilterChange,
  onSearch,
  onClear,
  acOptions,
  telecallerOptions,
  telecallingGroups,
  statusOptions,
  permissionOptions,
  loading,
  groupsLoading,
  onTelecallerSelect,
}) => {
  return (
    <Card className="">
      <form onSubmit={onSearch}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
          <div className="lg:col-span-1">
            <SelectDropdown
              options={acOptions}
              value={searchFilters.ac_code}
              onChange={(value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value as string;
                onFilterChange('ac_code', selectedValue);
              }}
              className="w-full"
              placeholder="Select AC"
              searchable
              clearable
            />
          </div>
          <div className="lg:col-span-1">
            <SelectDropdown
              options={telecallerOptions}
              value={searchFilters.telecaller}
              onChange={(value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value as string;
                onFilterChange('telecaller', selectedValue);
                if (onTelecallerSelect) {
                  onTelecallerSelect(selectedValue, telecallerOptions);
                }
              }}
              className="w-full"
              placeholder="Select Telecaller"
              searchable
              clearable
            />
          </div>
          <div className="lg:col-span-1">
            <SelectDropdown
              options={statusOptions}
              value={searchFilters.status}
              onChange={(value) => onFilterChange('status', Array.isArray(value) ? value[0] : value as string)}
              className="w-full"
              placeholder="Telecaller Status"
            />
          </div>
          {/* <div className="lg:col-span-1">
            <SelectDropdown
              options={permissionOptions}
              value={searchFilters.permission}
              onChange={(value) => onFilterChange('permission', Array.isArray(value) ? value[0] : value as string)}
              className="w-full"
              placeholder="User Type"
            />
          </div> */}
          <div className="lg:col-span-1">
            <SelectDropdown
              options={[
                { value: '', label: 'All Groups' },
                ...telecallingGroups.map(group => ({
                  value: group.id.toString(),
                  label: group.name,
                }))
              ]}
              value={searchFilters.telecalling_group_id}
              onChange={(value) => onFilterChange('telecalling_group_id', Array.isArray(value) ? value[0] : value as string)}
              className="w-full"
              placeholder="Telecalling Group"
              disabled={groupsLoading}
            />
          </div>
          <div className="lg:col-span-1">
            <Button type="submit" disabled={loading} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          <div className="lg:col-span-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClear}
              disabled={loading}
              className="w-full bg-gray-500 text-white hover:bg-gray-600 border-gray-500"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default TelecallerSearchFilters;

