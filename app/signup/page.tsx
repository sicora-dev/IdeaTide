import { AuthLayout } from "@/components/auth/shared/AuthLayout";
import { SignUpForm } from "@/components/auth/signup/SignUpForm";


export default async function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}