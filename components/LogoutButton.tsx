"use client";

import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    destroyCookie(null, "token", { path: "/" }); // Hapus cookie token
    router.push("/login"); // Redirect ke login
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
}
