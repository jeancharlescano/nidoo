"use client";
import { ChartColumnIncreasing, Home, Settings, Timeline } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-2 left-2 right-2 h-20 bg-white  flex items-center rounded-full">
      <ul className="grid grid-cols-4 w-full h-full">
        <li>
          <Link
            href="/dashboard"
            className={`flex h-full flex-col items-center justify-center ${
              pathname.startsWith("/dashboard")
                ? "text-[#4F8A69]"
                : "text-gray-400"
            }`}
          >
            <Home size={18} />
            <span className="text-xs">Accueil</span>
          </Link>
        </li>
        <li>
          <Link
            href="/history"
            className={`flex h-full flex-col items-center justify-center ${
              pathname.startsWith("/history")
                ? "text-[#4F8A69]"
                : "text-gray-400"
            }`}
          >
            <Timeline size={18} />
            <span className="text-xs">Historique</span>
          </Link>
        </li>
        <li>
          <Link
            href="/statistics"
            className={`flex h-full flex-col items-center justify-center ${
              pathname.startsWith("/statistics")
                ? "text-[#4F8A69]"
                : "text-gray-400"
            }`}
          >
            <ChartColumnIncreasing size={18} />
            <span className="text-xs">Statistique</span>
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className={`flex h-full flex-col items-center justify-center ${
              pathname.startsWith("/settings")
                ? "text-[#4F8A69]"
                : "text-gray-400"
            }`}
          >
            <Settings size={18} />
            <span className="text-xs">Réglages</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
