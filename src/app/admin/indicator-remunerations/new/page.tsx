// Server Component: Create Indicator Remuneration
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { UserRole } from "@/generated/prisma";
import IndicatorRemunerationForm from "../IndicatorRemunerationForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function NewIndicatorRemunerationPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== UserRole.admin) {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Indicator Remuneration</h1>
        <Button asChild variant="outline">
          <Link href="/admin/indicator-remunerations">Back</Link>
        </Button>
      </div>
      <IndicatorRemunerationForm mode="create" />
    </div>
  );
}
