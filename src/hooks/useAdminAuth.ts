import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

type AppRole = "user" | "partner_admin" | "super_admin";

interface AdminAuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  role: AppRole | null;
  error: string | null;
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isLoading: true,
    isAdmin: false,
    role: null,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          if (isMounted) {
            setState({
              user: null,
              isLoading: false,
              isAdmin: false,
              role: null,
              error: "Ошибка проверки авторизации",
            });
          }
          return;
        }

        if (!session?.user) {
          if (isMounted) {
            setState({
              user: null,
              isLoading: false,
              isAdmin: false,
              role: null,
              error: null,
            });
          }
          return;
        }

        // Check user roles
        const { data: roles, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        if (rolesError) {
          console.error("Error fetching roles");
          if (isMounted) {
            setState({
              user: session.user,
              isLoading: false,
              isAdmin: false,
              role: null,
              error: "Ошибка проверки прав доступа",
            });
          }
          return;
        }

        const adminRoles: AppRole[] = ["partner_admin", "super_admin"];
        const userRole = roles?.find((r) => adminRoles.includes(r.role as AppRole))?.role as AppRole | undefined;
        const isAdmin = !!userRole;

        if (isMounted) {
          setState({
            user: session.user,
            isLoading: false,
            isAdmin,
            role: userRole || "user",
            error: null,
          });
        }
      } catch (err) {
        console.error("Auth check error");
        if (isMounted) {
          setState({
            user: null,
            isLoading: false,
            isAdmin: false,
            role: null,
            error: "Непредвиденная ошибка",
          });
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isMounted) {
          if (!session) {
            setState({
              user: null,
              isLoading: false,
              isAdmin: false,
              role: null,
              error: null,
            });
          } else {
            // Defer role check to avoid deadlock
            setTimeout(() => {
              checkAuth();
            }, 0);
          }
        }
      }
    );

    // Initial check
    checkAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
