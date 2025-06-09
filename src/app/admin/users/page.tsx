// This is now a Server Component
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import { UserRole } from '@/generated/prisma'; // For role comparison
import { getAllUsers } from '@/services/user-service';
import UserListClient, { UserListData } from './UserListClient';


export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is an admin
  if (!session || !session.user || session.user.role !== UserRole.admin) {
    // Redirect to login page or an unauthorized page
    // If you want to redirect to login with a callback URL:
    // const callbackUrl = encodeURIComponent('/admin/users');
    // redirect(`/login?callbackUrl=${callbackUrl}`);
    redirect('/unauthorized'); // Or your preferred unauthorized page
  }

  let users: UserListData[] = [];
  let error: string | null = null;

  try {
    // Fetch users on the server
    const rawUsers = await getAllUsers();
    // Dates might need to be stringified for client component props if not already serializable
    users = rawUsers.map(user => ({
      ...user,
      last_login: user.last_login ? new Date(user.last_login).toISOString() : null,
      created_at: user.created_at ? new Date(user.created_at).toISOString() : null,
    })) as UserListData[];

  } catch (err) {
    console.error('Failed to fetch users on server:', err);
    error = 'Failed to load users. Please try again later.';
  }

  // Pass the fetched users and error state to the client component
  return (
    <UserListClient initialUsers={users} initialError={error} />
  );
}
