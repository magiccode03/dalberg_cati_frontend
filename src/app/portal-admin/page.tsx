'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Users, UserPlus, List, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PortalAdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const navigationCards = [
    {
      title: 'User Management',
      description: 'Manage portal users and their access',
      icon: Users,
      href: '/portal-admin/users',
      color: 'blue',
    },
    {
      title: 'Create User',
      description: 'Add a new user to the portal',
      icon: UserPlus,
      href: '/portal-admin/users/create',
      color: 'green',
    },
    {
      title: 'Enumerator Management',
      description: 'Manage field enumerators',
      icon: List,
      href: '/portal-admin/enumerators',
      color: 'purple',
    },
    {
      title: 'Create Enumerator',
      description: 'Add a new field enumerator',
      icon: UserPlus,
      href: '/portal-admin/enumerators/create',
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  if (user?.role !== 'portal_admin') {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You do not have permission to access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Portal Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.firstName}! Manage your portal users and enumerators.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {navigationCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(card.href)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {card.description}
              </p>
              <Button
                onClick={() => router.push(card.href)}
                className="w-full"
                variant="outline"
              >
                Access
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
