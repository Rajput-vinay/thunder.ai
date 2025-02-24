
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";
import { Provider } from "./Provider";
import { Toaster } from "../components/ui/sonner"
import Header from "../custom/Header";

export const metadata = {
  title: "tunder.ai",
  description: "Generated your app within a second",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
        <Provider>
        <Toaster />
        {/* <Header /> */}
        {children}
        </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
