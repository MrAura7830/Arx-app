"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../../components/ui/button";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
      if (result.error) {
        setError(result.error.message);
      } else {
        // Signup successful - user needs to confirm email
        setMessage("✅ Registration successful! Please check your email and click the confirmation link to activate your account.");
        setEmail("");
        setPassword("");
      }
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        setError(result.error.message);
      } else {
        setMessage("✅ Logged in successfully!");
        // Redirect to home page after successful login
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            className="border rounded-md px-4 py-2 text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded-md px-4 py-2 text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">
            {isSignUp ? "Sign Up" : "Log In"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsSignUp((v) => !v)}
          >
            {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
          </button>
        </div>
        {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
        {message && <div className="text-green-600 mt-2 text-center">{message}</div>}
      </div>
    </div>
  );
}
