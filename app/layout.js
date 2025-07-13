
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";
import { Provider } from "./Provider";
import { Toaster } from "../components/ui/sonner"
import Header from "../custom/Header";

export const metadata = {
  title: "thunder.ai",
  description: "Generated your app within a second",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        
        <ConvexClientProvider>
        <Provider>
        <Toaster  position="top-right" />
        {/* <Header /> */}
        {children}
        </Provider>
        </ConvexClientProvider>
       
      </body>
    </html>
  );
}
