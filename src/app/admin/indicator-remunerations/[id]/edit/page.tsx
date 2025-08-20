// Server Component: Edit Indicator Remuneration
import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { UserRole } from "@/generated/prisma";
import IndicatorRemunerationForm from "../../IndicatorRemunerationForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getRemuneration(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/indicator-remunerations/${id}`, {
    // Server fetch; avoid caching to reflect latest values
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load remuneration ${id}`);
  const data = await res.json();
  return data.remuneration as any;
}

export default async function EditIndicatorRemunerationPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== UserRole.admin) {
    redirect("/unauthorized");
  }

  const remuneration = await getRemuneration(params.id).catch(() => null);
  if (!remuneration) return notFound();

  const initialValues = {
    facilityTypeId: String(remuneration.facility_type_remuneration?.facility_type_id ?? ""),
    indicator_id: String(remuneration.indicator_id ?? ""),
    base_amount: remuneration.base_amount != null ? String(remuneration.base_amount) : "",
    conditional_amount: remuneration.conditional_amount != null ? String(remuneration.conditional_amount) : "",
    condition_type: remuneration.condition_type ?? "",
  } as const;

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Indicator Remuneration</h1>
        <Button asChild variant="outline">
          <Link href="/admin/indicator-remunerations">Back</Link>
        </Button>
      </div>
      <IndicatorRemunerationForm mode="edit" id={Number(params.id)} initialValues={initialValues} />
    </div>
  );
}
