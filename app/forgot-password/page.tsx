import { AuthLayout } from '@/components/auth/shared/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/forgot-password/ForgotPasswordForm';
import { Suspense } from 'react';

export default async function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </Suspense>
  );
}
