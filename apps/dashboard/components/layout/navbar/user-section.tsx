"use client";

import React from "react";
import Link from "next/link";
import { Avatar, Button, cn } from "@nuge/ui";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@nuge/api";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";

const getUserDisplayName = (params: {
  profile: { full_name?: string | null } | null;
  user: { email?: string | null } | null;
}) => {
  const { profile, user } = params;
  if (profile?.full_name) return profile.full_name;
  if (user?.email) return user.email.split("@")[0];
  return "User";
};

export const NavbarUserSection = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  const router = useRouter();
  const { user, profile, signOut } = useAuthContext();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/login")}
          className="group h-12 px-6 rounded-full text-md font-medium border-2 border-[#0D101A] transition-all duration-300 hover:bg-[#0D101A] hover:text-background hover:shadow-lg hover:shadow-[#0D101A]/20 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-[#0D101A] focus-visible:ring-offset-2"
        >
          <span className="text-[#0D101A] transition-colors duration-300 group-hover:text-background">
            Get Started
          </span>
        </Button>
      </div>
    );
  }

  const displayName = getUserDisplayName({ profile, user });

  return (
    <NavbarUserMenu
      displayName={displayName}
      profile={profile}
      user={user}
      onSignOut={signOut}
    />
  );
};

interface NavbarUserMenuProps {
  displayName: string;
  profile: { full_name?: string | null; avatar_url?: string | null } | null;
  user: { email?: string | null } | null;
  onSignOut: () => void | Promise<void>;
}

export const NavbarUserMenu = ({
  displayName,
  profile,
  user,
  onSignOut,
}: NavbarUserMenuProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const userTriggerRef = React.useRef<HTMLButtonElement>(null);
  const userMenuTimeoutRef = React.useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  const handleUserMenuEnter = () => {
    if (userMenuTimeoutRef.current) {
      clearTimeout(userMenuTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        userTriggerRef.current &&
        !userTriggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={userTriggerRef}
        onMouseEnter={handleUserMenuEnter}
        onMouseLeave={handleUserMenuLeave}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-full border-2 border-[#0D101A] bg-background transition-all duration-300 hover:bg-[#0D101A]/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D101A] focus-visible:ring-offset-2",
          isOpen && "bg-[#0D101A]/5 shadow-md"
        )}
      >
        <Avatar
          avatarUrl={profile?.avatar_url ?? undefined}
          fullName={profile?.full_name ?? undefined}
          email={user?.email ?? undefined}
          size={32}
          backgroundColor="#0D101A"
          textColor="#F2F2F2"
        />
        <span className="text-sm font-medium text-[#0D101A] hidden sm:block">
          {displayName}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#0D101A] transition-transform duration-300 hidden sm:block",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* User Menu Dropdown */}
      <div
        ref={userMenuRef}
        onMouseEnter={handleUserMenuEnter}
        onMouseLeave={handleUserMenuLeave}
        className={cn(
          "absolute top-full right-0 mt-2 w-64 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl shadow-black/10 overflow-hidden transition-all duration-300 ease-out z-50",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="p-2">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0D101A] truncate">
                  {displayName}
                </p>
                {user?.email && (
                  <p className="text-xs text-[#0D101A]/60 truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#0D101A] hover:bg-[#0D101A]/5 rounded-lg transition-colors duration-200 group"
            >
              <User className="w-4 h-4 text-[#0D101A]/60 group-hover:text-[#0D101A]" />
              <span>Profile</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#0D101A] hover:bg-[#0D101A]/5 rounded-lg transition-colors duration-200 group"
            >
              <Settings className="w-4 h-4 text-[#0D101A]/60 group-hover:text-[#0D101A]" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-border/50">
            <button
              onClick={async () => {
                try {
                  setIsSigningOut(true);
                  setIsOpen(false);
                  await onSignOut();
                  // Redirect to login page after successful sign out
                  router.push("/login");
                } catch (error) {
                  console.error("Failed to sign out:", error);
                  setIsSigningOut(false);
                  // Optionally show an error toast/notification here
                }
              }}
              disabled={isSigningOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#0D101A] hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4 text-[#0D101A]/60 group-hover:text-red-600" />
              <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
