import { FranchiseSeeker, User } from '../types';

/**
 * Single source of truth helper to resolve a seeker's profile photo.
 * Ensures 100% visual and data consistency across SeekerProfile,
 * BrandSmartMatchPage, SeekerListing, SeekerDetails, SearchSeekers, CRM, etc.
 */
export function getSeekerAvatarUrl(seeker?: Partial<FranchiseSeeker | User> | null): string | undefined {
  if (!seeker) return undefined;
  const avatar = (
    seeker.avatar ||
    (seeker as any)?.seekerData?.avatar ||
    (seeker as any)?.profilePhoto ||
    (seeker as any)?.photoURL ||
    undefined
  );
  return avatar && typeof avatar === 'string' && avatar.trim() ? avatar.trim() : undefined;
}

/**
 * Helper to compute clean, balanced initials for a seeker when no photo is available.
 */
export function getSeekerInitials(name?: string): string {
  if (!name || !name.trim()) return 'S';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
