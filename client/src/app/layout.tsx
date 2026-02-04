import { FC, ReactNode } from "react";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "My Portfolio",
  description: "This is my personal portfolio website",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
        {/* react-toastify */}
        <ToastContainer position="top-center" autoClose={3000} />
        {/* react-hot-toast */}
        <Toaster position="top-center" />
      </body>
    </html>
  );
};

export default RootLayout;
