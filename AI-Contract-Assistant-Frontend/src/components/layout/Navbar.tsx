import { useEffect, useState } from "react";
import { Bell, FileStack, Menu } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Tooltip } from "@/components/ui/Tooltip";

import { apiFetch } from "@/lib/api";

interface CurrentUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    apiFetch<CurrentUser>("/auth/me")
      .then(setUser)
      .catch((error) => {
        console.error("Failed to load current user:", error);
      });
  }, []);

  const initials =
    user?.full_name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "";

  console.log("NAVBAR USER:", user);
  console.log("NAVBAR INITIALS:", initials);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-ink-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900">
            <FileStack className="h-4 w-4 text-white" />
          </div>

          <span className="hidden text-[15px] font-semibold tracking-tight text-ink-900 sm:block">
            AI Contract Assistant
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content="Notifications">
          <button
            className="relative rounded-md p-2 text-ink-500 hover:bg-ink-100"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />

            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
          </button>
        </Tooltip>

        <div className="mx-1 h-6 w-px bg-ink-200" />

        <Tooltip content={user?.full_name ?? "Profile"}>
          <button aria-label="Profile menu">
            <Avatar initials={initials} />
          </button>
        </Tooltip>
      </div>
    </header>
  );
}
