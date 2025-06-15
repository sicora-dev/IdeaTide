import { AuthLayout } from '@/components/auth/shared/AuthLayout';
import { ResetPasswordForm } from '@/components/auth/reset-password/ResetPasswordForm';
import { Suspense } from 'react';

export default async function RecoveryPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </Suspense>
  );
}
