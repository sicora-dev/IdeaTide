import { AuthLayout } from "@/components/auth/shared/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password/ForgotPasswordForm";

export default async function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}