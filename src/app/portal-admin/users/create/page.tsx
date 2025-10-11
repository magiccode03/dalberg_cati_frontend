'use client';

import CreateUser from '@/components/management/CreateUser';

export default function CreateUserPage() {
  return (
    <CreateUser
      title="Create New User"
      description="Add a new user to the portal"
      backUrl="/portal-admin/users"
      userType="users"
    />
  );
}
