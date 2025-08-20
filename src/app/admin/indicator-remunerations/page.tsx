// Server Component: Admin Indicator Remunerations List Page
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { UserRole } from "@/generated/prisma";
import IndicatorRemunerationListClient from "./IndicatorRemunerationListClient";

export default async function IndicatorRemunerationsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== UserRole.admin) {
    redirect("/unauthorized");
  }
  return <IndicatorRemunerationListClient />;
}
