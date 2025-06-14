import { AuthLayout } from "@/components/auth/shared/AuthLayout";
import { SignInForm } from "@/components/auth/signin/SignInForm";


export default async function SignInPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}