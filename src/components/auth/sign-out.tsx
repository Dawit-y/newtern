"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export default function SignOut() {
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
            }
          },
        });
      }}
    >
      Sign Out
    </Button>
  );
}
