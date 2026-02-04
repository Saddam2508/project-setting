import { useEffect, useState, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import type { RootState, AppDispatch } from "@/store";
import { fetchAdminProfile } from "@/features/admin/adminSlice";

interface AdminAuthWrapperProps {
  children: ReactNode;
}

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { admin, loading } = useSelector((state: RootState) => state.admin);
  const [checkedAuth, setCheckedAuth] = useState(false);

  // ✅ প্রথমে প্রোফাইল চেক
  useEffect(() => {
    if (
      !admin &&
      pathname.startsWith("/admin") &&
      pathname !== "/admin/login"
    ) {
      dispatch(fetchAdminProfile()).finally(() => setCheckedAuth(true));
    } else {
      setCheckedAuth(true);
    }
  }, [admin, pathname, dispatch]);

  // ✅ যদি এডমিন না থাকে → লগিন পেজে পাঠাবে
  useEffect(() => {
    if (
      checkedAuth &&
      !admin &&
      pathname.startsWith("/admin") &&
      pathname !== "/admin/login"
    ) {
      router.push("/admin/login");
    }
  }, [checkedAuth, admin, pathname, router]);

  // ✅ যদি এডমিন থাকে এবং লগিন পেজে ঢুকতে চায় → ড্যাশবোর্ডে পাঠাবে
  useEffect(() => {
    if (checkedAuth && admin && pathname === "/admin/login") {
      router.push("/admin/dashboard");
    }
  }, [checkedAuth, admin, pathname, router]);

  if (!checkedAuth || loading) return null;

  return <>{children}</>;
}
