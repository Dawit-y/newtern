"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

// Regular SignOut Button
export function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/");
            },
            onError: (error) => {
              console.error("Sign out error:", error);
            },
          },
        });
      }}
    >
      Sign Out
    </Button>
  );
}

// Dropdown version
export function SignOutDropdownItem() {
  const router = useRouter();

  return (
    <DropdownMenuItem
      onClick={async () => {
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/");
            },
            onError: (error) => {
              console.error("Sign out error:", error);
            },
          },
        });
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </DropdownMenuItem>
  );
}
