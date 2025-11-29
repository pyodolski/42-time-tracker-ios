"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaClock, FaCalendar, FaUser } from "react-icons/fa";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { path: "/dashboard", icon: FaHome, label: "홈" },
    { path: "/timer", icon: FaClock, label: "출퇴근" },
    { path: "/schedule", icon: FaCalendar, label: "스케줄" },
    { path: "/profile", icon: FaUser, label: "프로필" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon
                className={`text-xl mb-1 ${active ? "text-blue-600" : ""}`}
              />
              <span className={`text-xs ${active ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
