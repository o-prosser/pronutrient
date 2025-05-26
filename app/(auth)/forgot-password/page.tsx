import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Calorie Tracker</h1>
          <p className="mt-2 text-sm text-gray-600">
            Reset your password to continue tracking
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
