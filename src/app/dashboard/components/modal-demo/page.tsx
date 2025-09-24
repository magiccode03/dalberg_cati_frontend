'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Settings, User, FileText, AlertTriangle } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import FormModal from '@/components/ui/FormModal';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { useModal, useConfirmationModal, useDrawer } from '@/hooks/useModal';

const breadcrumbItems = [
  { label: 'Components', href: '/dashboard/components' },
  { label: 'Modal Demo', active: true }
];

// Form schemas
const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.string().min(1, 'Please select a role'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

const settingsFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    errorMap: () => ({ message: 'Please select a valid theme' })
  }),
  notifications: z.boolean(),
  autoSave: z.boolean(),
  language: z.string().min(1, 'Please select a language'),
});

type UserForm = z.infer<typeof userFormSchema>;
type SettingsForm = z.infer<typeof settingsFormSchema>;

export default function ModalDemoPage() {
  // Modal states
  const basicModal = useModal();
  const userModal = useModal();
  const settingsModal = useModal();
  const confirmationModal = useConfirmationModal();
  const leftDrawer = useDrawer();
  const rightDrawer = useDrawer();
  const topDrawer = useDrawer();
  const bottomDrawer = useDrawer();

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // User form
  const userForm = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      bio: '',
    },
  });

  // Settings form
  const settingsForm = useForm<SettingsForm>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      theme: 'light',
      notifications: true,
      autoSave: true,
      language: 'en',
    },
  });

  // Sample data
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'pmt' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'qc' },
  ];

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'pmt', label: 'PMT Manager' },
    { value: 'qc', label: 'QC Manager' },
    { value: 'quality-analyst', label: 'Quality Analyst' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
  ];

  // Handlers
  const handleUserSubmit = async (data: UserForm) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('User submitted:', data);
      setSubmitSuccess('User saved successfully!');
      userModal.close();
      userForm.reset();
    } catch (error) {
      setSubmitError('Failed to save user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettingsSubmit = async (data: SettingsForm) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Settings submitted:', data);
      setSubmitSuccess('Settings saved successfully!');
      settingsModal.close();
    } catch (error) {
      setSubmitError('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (userId: number) => {
    confirmationModal.show({
      title: 'Delete User',
      message: `Are you sure you want to delete user #${userId}? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        console.log('User deleted:', userId);
        confirmationModal.hide();
      },
    });
  };

  const handleBulkAction = () => {
    confirmationModal.show({
      title: 'Bulk Action',
      message: 'Are you sure you want to perform this action on all selected items?',
      type: 'warning',
      confirmText: 'Proceed',
      cancelText: 'Cancel',
      onConfirm: () => {
        console.log('Bulk action performed');
        confirmationModal.hide();
      },
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modal Components Demo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive demonstration of modal, confirmation, form, and drawer components
          </p>
        </div>

        {/* Basic Modals */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Modals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={() => basicModal.open()}>
              <Plus className="h-4 w-4 mr-2" />
              Basic Modal
            </Button>
            <Button variant="outline" onClick={() => userModal.open()}>
              <User className="h-4 w-4 mr-2" />
              User Form
            </Button>
            <Button variant="outline" onClick={() => settingsModal.open()}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" onClick={() => handleBulkAction()}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Confirmation
            </Button>
          </div>
        </div>

        {/* Drawers */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Drawers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => leftDrawer.open()}>
              Left Drawer
            </Button>
            <Button variant="outline" onClick={() => rightDrawer.open()}>
              Right Drawer
            </Button>
            <Button variant="outline" onClick={() => topDrawer.open()}>
              Top Drawer
            </Button>
            <Button variant="outline" onClick={() => bottomDrawer.open()}>
              Bottom Drawer
            </Button>
          </div>
        </div>

        {/* Data Table with Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data Table with Modal Actions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.role}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => userModal.open(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        
        {/* Basic Modal */}
        <Modal
          isOpen={basicModal.isOpen}
          onClose={basicModal.close}
          title="Basic Modal"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              This is a basic modal with some content. You can put any content here.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Features:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Responsive design</li>
                <li>• Keyboard navigation (ESC to close)</li>
                <li>• Focus management</li>
                <li>• Click outside to close</li>
                <li>• Multiple sizes</li>
              </ul>
            </div>
          </div>
        </Modal>

        {/* User Form Modal */}
        <FormModal
          isOpen={userModal.isOpen}
          onClose={userModal.close}
          onSubmit={handleUserSubmit}
          form={userForm}
          title="User Form"
          size="lg"
          loading={isSubmitting}
          successMessage={submitSuccess}
          errorMessage={submitError}
          onClearSuccess={() => setSubmitSuccess(null)}
          onClearError={() => setSubmitError(null)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <Input
                {...userForm.register('name')}
                placeholder="Enter name"
                error={userForm.formState.errors.name?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <Input
                type="email"
                {...userForm.register('email')}
                placeholder="Enter email"
                error={userForm.formState.errors.email?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role *
              </label>
              <SelectDropdown
                options={roleOptions}
                value={userForm.watch('role')}
                onChange={(value) => userForm.setValue('role', value as string)}
                placeholder="Select role"
                error={userForm.formState.errors.role?.message}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <Textarea
                {...userForm.register('bio')}
                placeholder="Enter bio"
                rows={3}
                error={userForm.formState.errors.bio?.message}
              />
            </div>
          </div>
        </FormModal>

        {/* Settings Modal */}
        <FormModal
          isOpen={settingsModal.isOpen}
          onClose={settingsModal.close}
          onSubmit={handleSettingsSubmit}
          form={settingsForm}
          title="Settings"
          size="md"
          loading={isSubmitting}
          successMessage={submitSuccess}
          errorMessage={submitError}
          onClearSuccess={() => setSubmitSuccess(null)}
          onClearError={() => setSubmitError(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <SelectDropdown
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' },
                ]}
                value={settingsForm.watch('theme')}
                onChange={(value) => settingsForm.setValue('theme', value as any)}
                placeholder="Select theme"
                error={settingsForm.formState.errors.theme?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <SelectDropdown
                options={languageOptions}
                value={settingsForm.watch('language')}
                onChange={(value) => settingsForm.setValue('language', value as string)}
                placeholder="Select language"
                error={settingsForm.formState.errors.language?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...settingsForm.register('notifications')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Enable notifications
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...settingsForm.register('autoSave')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-save changes
                </span>
              </label>
            </div>
          </div>
        </FormModal>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={confirmationModal.hide}
          onConfirm={confirmationModal.onConfirm || (() => {})}
          title={confirmationModal.title}
          message={confirmationModal.message}
          type={confirmationModal.type}
          confirmText={confirmationModal.confirmText}
          cancelText={confirmationModal.cancelText}
        />

        {/* Drawers */}
        
        {/* Left Drawer */}
        <Drawer
          isOpen={leftDrawer.isOpen}
          onClose={leftDrawer.close}
          title="Left Drawer"
          position="left"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              This is a left drawer. Perfect for navigation or secondary content.
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </Drawer>

        {/* Right Drawer */}
        <Drawer
          isOpen={rightDrawer.isOpen}
          onClose={rightDrawer.close}
          title="Right Drawer"
          position="right"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              This is a right drawer. Great for forms and detailed content.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quick Note
                </label>
                <Textarea
                  placeholder="Enter your note here..."
                  rows={4}
                />
              </div>
              <Button className="w-full">
                Save Note
              </Button>
            </div>
          </div>
        </Drawer>

        {/* Top Drawer */}
        <Drawer
          isOpen={topDrawer.isOpen}
          onClose={topDrawer.close}
          title="Top Drawer"
          position="top"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              This is a top drawer. Useful for notifications or quick actions.
            </p>
            <div className="flex space-x-2">
              <Button size="sm">Action 1</Button>
              <Button size="sm" variant="outline">Action 2</Button>
            </div>
          </div>
        </Drawer>

        {/* Bottom Drawer */}
        <Drawer
          isOpen={bottomDrawer.isOpen}
          onClose={bottomDrawer.close}
          title="Bottom Drawer"
          position="bottom"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              This is a bottom drawer. Perfect for mobile interfaces.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline">Option 1</Button>
              <Button variant="outline">Option 2</Button>
              <Button variant="outline">Option 3</Button>
              <Button variant="outline">Option 4</Button>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
}
