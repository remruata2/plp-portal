// Server Component: Edit Indicator Remuneration
import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { UserRole } from "@/types/user";
import IndicatorRemunerationForm from "../../IndicatorRemunerationForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";

async function getRemuneration(id: string) {
	const numericId = Number(id);
	if (!Number.isFinite(numericId)) return null;
	const item = await prisma.indicator_remuneration.findUnique({
		where: { id: numericId },
		include: {
			indicator: { select: { id: true, name: true, code: true } },
			facility_type_remuneration: {
				select: {
					id: true,
					facility_type_id: true,
					facility_type: {
						select: { id: true, name: true, display_name: true },
					},
				},
			},
		},
	});
	return item as any;
}

export default async function EditIndicatorRemunerationPage(props: {
	params: Promise<{ id: string }>;
}) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user || session.user.role !== UserRole.admin) {
		redirect("/unauthorized");
	}

	const { id } = await props.params;
	const remuneration = await getRemuneration(id).catch(() => null);
	if (!remuneration) return notFound();

	const initialValues = {
		facilityTypeId: String(
			remuneration.facility_type_remuneration?.facility_type_id ?? ""
		),
		indicator_id: String(remuneration.indicator_id ?? ""),
		base_amount:
			remuneration.base_amount != null ? String(remuneration.base_amount) : "",
		conditional_amount:
			remuneration.conditional_amount != null
				? String(remuneration.conditional_amount)
				: "",
		condition_type: remuneration.condition_type ?? "",
		condition_1_amount:
			remuneration.condition_1_amount != null
				? String(remuneration.condition_1_amount)
				: "",
		condition_2_amount:
			remuneration.condition_2_amount != null
				? String(remuneration.condition_2_amount)
				: "",
		condition_3_amount:
			remuneration.condition_3_amount != null
				? String(remuneration.condition_3_amount)
				: "",
		condition_4_amount:
			remuneration.condition_4_amount != null
				? String(remuneration.condition_4_amount)
				: "",
		condition_config: remuneration.condition_config ?? null,
	} as const;

	return (
		<div className="min-h-screen bg-gray-50 p-4 space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Edit Indicator Remuneration</h1>
				<Button asChild variant="outline">
					<Link href="/admin/indicator-remunerations">Back</Link>
				</Button>
			</div>
			<IndicatorRemunerationForm
				mode="edit"
				id={Number(id)}
				initialValues={initialValues}
			/>
		</div>
	);
}
