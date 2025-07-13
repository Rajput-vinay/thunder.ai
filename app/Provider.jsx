"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useConvex } from "convex/react";
import { userDetailsContext } from "../context/userDetailsContext";
import { MessageContext } from "../context/MessageContext";
import { ActionContext } from "../context/ActionContext";
import { SidebarProvider } from "../components/ui/sidebar";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "../custom/Header";
import { AppSidebar } from "../custom/AppSideBar";
import { api } from "../convex/_generated/api";

export function Provider({ children }) {
  const [userDetails, setUserDetails] = useState();
  const [messages, setMessages] = useState();
  const [action, setAction] = useState();
  const convex = useConvex();
  const router = useRouter();

  // Load user from localStorage on app start
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserDetails(JSON.parse(storedUser));
      } else {
        router.push("/");
      }
    }
  }, [router]);

  // Optional: verify fresh user data from backend if needed
  useEffect(() => {
    async function fetchUser() {
      if (userDetails?.email) {
        const freshUser = await convex.query(api.users.GetUser, {
          email: userDetails.email,
        });
        if (freshUser) {
          setUserDetails(freshUser);
        }
      }
    }
    fetchUser();
  }, [convex, userDetails?.email]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
        <userDetailsContext.Provider value={{ userDetails, setUserDetails }}>
          <MessageContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{ action, setAction }}>
              <NextThemesProvider attribute="class" defaultTheme="dark">
                <Header />
                <SidebarProvider defaultOpen={false} className="flex justify-center">
                  <AppSidebar />
                  {children}
                </SidebarProvider>
              </NextThemesProvider>
            </ActionContext.Provider>
          </MessageContext.Provider>
        </userDetailsContext.Provider>
      </PayPalScriptProvider>
    </GoogleOAuthProvider>
  );
}
