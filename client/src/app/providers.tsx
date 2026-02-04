"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamic import for AdminAuthWrapper, SSR disabled
const AdminAuthWrapper = dynamic(
  () =>
    import("@/components/adminUI/adminAuth").then(
      (mod) => mod.AdminAuthWrapper
    ),
  { ssr: false }
);

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AdminAuthWrapper>
        {children}
        {/* react-toastify */}
        <ToastContainer position="top-center" autoClose={3000} />
        {/* react-hot-toast */}
        <Toaster position="top-center" />
      </AdminAuthWrapper>
    </Provider>
  );
}
