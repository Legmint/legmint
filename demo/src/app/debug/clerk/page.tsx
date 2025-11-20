"use client";

export default function ClerkDebugPage() {
  return (
    <div style={{ padding: 24, fontFamily: "monospace", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>🔍 Clerk Environment Debug</h1>

      <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, marginBottom: 12 }}>
        <strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong>{" "}
        <span style={{ color: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "green" : "red" }}>
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "✅ SET" : "❌ MISSING"}
        </span>
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
          <div style={{ marginTop: 8, fontSize: 12 }}>
            Value: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 20)}...
          </div>
        )}
      </div>

      <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, marginBottom: 12 }}>
        <strong>NEXT_PUBLIC_CLERK_SIGN_IN_URL:</strong>{" "}
        {process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "(not set, defaulting to /sign-in)"}
      </div>

      <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, marginBottom: 12 }}>
        <strong>NEXT_PUBLIC_CLERK_SIGN_UP_URL:</strong>{" "}
        {process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "(not set, defaulting to /sign-up)"}
      </div>

      <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, marginBottom: 12 }}>
        <strong>NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:</strong>{" "}
        {process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "(not set)"}
      </div>

      <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, marginBottom: 12 }}>
        <strong>NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:</strong>{" "}
        {process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "(not set)"}
      </div>

      <div style={{ marginTop: 24, padding: 16, background: "#e3f2fd", borderRadius: 8 }}>
        <strong>ℹ️ Info:</strong> This page helps verify Clerk environment variables are properly configured in production.
        <br /><br />
        <strong>Expected:</strong>
        <ul style={{ marginTop: 8 }}>
          <li>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY should be SET</li>
          <li>It should start with pk_live_ for production or pk_test_ for development</li>
        </ul>
      </div>

      <div style={{ marginTop: 24 }}>
        <a href="/sign-up" style={{ color: "#4f46e5", textDecoration: "underline" }}>
          → Go to Sign Up page
        </a>
        {" | "}
        <a href="/sign-in" style={{ color: "#4f46e5", textDecoration: "underline" }}>
          → Go to Sign In page
        </a>
        {" | "}
        <a href="/" style={{ color: "#4f46e5", textDecoration: "underline" }}>
          → Go to Home
        </a>
      </div>
    </div>
  );
}
