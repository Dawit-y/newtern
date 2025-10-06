"use client";

import { useSession } from "@/lib/auth-client";
import { api } from "@/trpc/react";

export function useProfile() {
  const { data: session, isPending: isSessionLoading } = useSession();

  const { data: profile, isPending: isProfileLoading } =
    api.profiles.getCurrentProfile.useQuery(undefined, {
      enabled: !!session?.user?.id,
      staleTime: 5 * 60 * 1000, 
    });

  return {
    user: session?.user ?? null,
    profile: profile ?? null,
    isLoading: isSessionLoading || isProfileLoading,
    isAuthenticated: !!session?.user,
  };
}

// Specific hooks for different profile types
export function useOrganizationProfile() {
  const { profile, isLoading, isAuthenticated } = useProfile();

  return {
    organizationProfile: profile?.type === "organization" ? profile : null,
    organizationId: profile?.type === "organization" ? profile.id : null,
    isLoading,
    isAuthenticated,
  };
}

export function useInternProfile() {
  const { profile, isLoading, isAuthenticated } = useProfile();

  return {
    internProfile: profile?.type === "intern" ? profile : null,
    internId: profile?.type === "intern" ? profile.id : null,
    isLoading,
    isAuthenticated,
  };
}

// Hook to get profile ID based on user role
export function useProfileId() {
  const { user, profile, isLoading, isAuthenticated } = useProfile();

  const getProfileId = () => {
    if (!profile) return null;
    return profile.id;
  };

  return {
    profileId: getProfileId(),
    user,
    profile,
    isLoading,
    isAuthenticated,
    isOrganization: profile?.type === "organization",
    isIntern: profile?.type === "intern",
  };
}
