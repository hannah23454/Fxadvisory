"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const hash = window.location.hash;
        if (!hash) {
          router.push("/login");
          return;
        }

        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (!access_token) {
          router.push("/login");
          return;
        }

        // Set session
        await supabase.auth.setSession({
          access_token,
          refresh_token: refresh_token || "",
        });

        // Get session safely
        const sessionResponse = await supabase.auth.getSession();
        let session = null;

        // Type narrowing
        if ("data" in sessionResponse) {
          session = sessionResponse.data.session;
        }

        if (!session) {
          router.push("/login");
          return;
        }

        // Fetch role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        const role = profile?.role || "user";

        router.push(role === "admin" ? "/dashboard/admin" : "/dashboard/user");
      } catch (err) {
        console.error("Error in auth callback:", err);
        router.push("/login");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Processing login...
    </div>
  );
}
