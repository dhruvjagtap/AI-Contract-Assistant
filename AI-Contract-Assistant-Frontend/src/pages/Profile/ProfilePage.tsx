import { useEffect, useState } from "react";

import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

import { LogOut } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import { apiFetch } from "@/lib/api";
import { documentService } from "@/services/documentService";

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [documentCount, setDocumentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [userData, documents] = await Promise.all([
          apiFetch<UserProfile>("/auth/me"),
          documentService.list(),
        ]);

        setUser(userData);
        setDocumentCount(documents.length);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const initials =
    user?.full_name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="max-w-2xl animate-fade-in">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
          Profile
        </h1>

        <p className="mt-1 text-sm text-ink-500">
          Loading your account details...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl animate-fade-in">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
          Profile
        </h1>

        <p className="mt-1 text-sm text-ink-500">
          Unable to load your account details.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
        Profile
      </h1>

      <p className="mt-1 text-sm text-ink-500">
        Your account details and activity.
      </p>

      <Card className="mt-6 flex items-center gap-4 p-5">
        <Avatar initials={initials} className="h-14 w-14 text-base" />

        <div>
          <p className="text-base font-semibold text-ink-900">
            {user.full_name}
          </p>

          <p className="text-sm text-ink-500">{user.email}</p>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card className="p-5">
          <p className="text-sm text-ink-500">Documents reviewed</p>

          <p className="mt-2 text-2xl font-semibold text-ink-900">
            {documentCount}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-ink-500">Questions asked</p>

          <p className="mt-2 text-2xl font-semibold text-ink-900">—</p>

          <p className="mt-1 text-xs text-ink-400">History not tracked yet</p>
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink-900">{user.full_name}</p>

            <p className="text-xs text-ink-500">{user.email}</p>
          </div>

          <Button variant="secondary" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </Card>
    </div>
  );
}
