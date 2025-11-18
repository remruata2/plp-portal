// Re-export UserRole from Prisma to maintain backward compatibility
import { user_role } from '@/generated/prisma';

// Create UserRole type alias for backward compatibility
export type UserRole = typeof user_role[keyof typeof user_role];

// Export the enum object as well for value access
export const UserRole = user_role;

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
