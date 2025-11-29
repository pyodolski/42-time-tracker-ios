"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return pathname === path ? "bg-blue-700" : "";
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex-shrink-0 font-bold text-xl tracking-wide"
            >
              TimeTracker
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium mx-1 hover:bg-blue-700 ${isActive(
                    "/dashboard"
                  )}`}
                >
                  대시보드
                </Link>
                <Link
                  href="/timer"
                  className={`px-3 py-2 rounded-md text-sm font-medium mx-1 hover:bg-blue-700 ${isActive(
                    "/timer"
                  )}`}
                >
                  출퇴근 기록
                </Link>
                <Link
                  href="/schedule"
                  className={`px-3 py-2 rounded-md text-sm font-medium mx-1 hover:bg-blue-700 ${isActive(
                    "/schedule"
                  )}`}
                >
                  근무 계획
                </Link>
                <Link
                  href="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium mx-1 hover:bg-blue-700 ${isActive(
                    "/profile"
                  )}`}
                >
                  프로필
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium mx-1 hover:bg-blue-700"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`px-3 py-2 rounded-md text-sm font-medium mx-1 hover:bg-blue-700 ${isActive(
                  "/login"
                )}`}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
