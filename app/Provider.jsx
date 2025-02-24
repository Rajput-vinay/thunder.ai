"use client";

import { MessageContext } from "../context/MessageContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { userDetailsContext } from "../context/userDetailsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { SidebarProvider } from "../components/ui/sidebar";
import { api } from "../convex/_generated/api";
import Header from "../custom/Header";
import { AppSidebar } from "../custom/AppSideBar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ActionContext } from "../context/ActionContext";
import { useRouter } from "next/navigation";

export function Provider({ children }) {
  const [messages, setMessages] = useState();
  const [userDetails, setUserDetails] = useState();
  const convex = useConvex();
  const [action, setAction] = useState();
  const router = useRouter();

  useEffect(() => {
    IsAutheicated();
  }, [router,convex]);

  const IsAutheicated = async () => {
    if (typeof window !== undefined) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        router.push("/");
        return;
      }

      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });
      setUserDetails(result);
      console.log("result", result);
    }
  };

  return (
    <div>
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
    </div>
  );
}
