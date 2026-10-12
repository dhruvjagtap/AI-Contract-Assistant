import { NavLink } from "react-router-dom";
import { LayoutGrid, FileText, MessageSquare, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export function Sidebar({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate?: () => void;
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 mt-16 w-[260px] shrink-0 border-r border-ink-200 bg-white transition-transform md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <nav className="flex h-full flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
              )
            }
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
