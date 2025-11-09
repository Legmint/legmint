import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back to Legmint
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to access your legal templates
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-gray-200 rounded-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
              formButtonPrimary:
                "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold",
              footerActionLink: "text-indigo-600 hover:text-indigo-700",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
        />

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a
            href="/sign-up"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Sign up for free
          </a>
        </p>
      </div>
    </div>
  );
}
