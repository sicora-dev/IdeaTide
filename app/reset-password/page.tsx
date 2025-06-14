import { AuthLayout } from "@/components/auth/shared/AuthLayout";
import { ResetPasswordForm } from "@/components/auth/reset-password/ResetPasswordForm";

export default async function RecoveryPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}