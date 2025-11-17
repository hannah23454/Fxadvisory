"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  // 1️⃣ Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        const role = profile?.role || "user";
        router.push(role === "admin" ? "/dashboard/admin" : "/dashboard/user");
      }
    };
    checkSession();
  }, [router]);

  // 2️⃣ Handle login form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.session) {
        // Logged in successfully
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .maybeSingle();

        const role = profile?.role || "user";
        router.push(role === "admin" ? "/dashboard/admin" : "/dashboard/user");
      } else {
        // No session → email confirmation required
        setError(
          "Check your email to confirm login before accessing the dashboard."
        );
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="py-20 px-6">
        <div className="max-w-md mx-auto">
          <Card className="bg-white border border-[#DCE5E1] p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#12261F] mb-2">Welcome Back</h1>
              <p className="text-[#4A5A55]">Access your FX hedge dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              <div>
                <label className="block text-sm font-medium text-[#12261F] mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#BD6908]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#12261F] mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#BD6908]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#BD6908] hover:bg-[#a35a07] text-white font-bold py-3"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-[#4A5A55]">
                Don't have an account?{" "}
                <a href="/register" className="text-[#BD6908] hover:underline font-medium">
                  Sign up here
                </a>
              </p>
            </div>
          </Card>
        </div>
      </section>
      <Footer />
    </main>
  );
}
