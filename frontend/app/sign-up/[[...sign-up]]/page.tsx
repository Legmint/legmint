import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Start building with Legmint
          </h1>
          <p className="mt-2 text-gray-600">
            Create your account and access professional legal templates
          </p>
        </div>

        <SignUp
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
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/dashboard"
        />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
