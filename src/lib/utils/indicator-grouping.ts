export interface FieldMapping {
	formFieldName: string;
	databaseFieldId: number;
	fieldType: string;
	description: string;
	displayOrder?: number;
	parentFieldId?: number | null;
	parentFieldCode?: string | null;
	showOnValue?: string | null;
	parentFieldId2?: number | null;
	parentFieldCode2?: string | null;
	showOnValue2?: string | null;
	group?: {
		id: number;
		code: string;
		name: string;
		sortOrder: number;
		description?: string | null;
		parentFieldId?: number | null;
		parentFieldCode?: string | null;
		showOnValue?: string | null;
		parentFieldId2?: number | null;
		parentFieldCode2?: string | null;
		showOnValue2?: string | null;
	} | null;
}

export interface IndicatorGroup {
	indicatorCode: string;
	indicatorName: string;
	fields: FieldMapping[];
	sortOrder?: number;
	parentFieldId?: number | null;
	parentFieldCode?: string | null;
	showOnValue?: string | null;
	parentFieldId2?: number | null;
	parentFieldCode2?: string | null;
	showOnValue2?: string | null;
	conditions?: string;
	source_of_verification?: string;
	target_formula?: string;
	target_value?: string;
}

/**
 * Dynamically groups fields by indicators based 100% on database indicator_group relations.
 * Uses indicator_group.sort_order from DB as the single source of truth.
 */
export function groupFieldsByIndicators(
	mappings: FieldMapping[]
): IndicatorGroup[] {
	const groups: Record<string, IndicatorGroup> = {};

	mappings.forEach((mapping) => {
		let code = "OTHER";
		let name = "Other Fields";
		let sortOrder = 9999;

		if (mapping.group) {
			code = mapping.group.code;
			name = mapping.group.name;
			sortOrder = typeof mapping.group.sortOrder === "number" ? mapping.group.sortOrder : 9999;
		}

		if (!groups[code]) {
			groups[code] = {
				indicatorCode: code,
				indicatorName: name,
				fields: [],
				sortOrder: sortOrder,
				parentFieldId: mapping.group?.parentFieldId ?? null,
				parentFieldCode: mapping.group?.parentFieldCode ?? null,
				showOnValue: mapping.group?.showOnValue ?? null,
				parentFieldId2: mapping.group?.parentFieldId2 ?? null,
				parentFieldCode2: mapping.group?.parentFieldCode2 ?? null,
				showOnValue2: mapping.group?.showOnValue2 ?? null,
			};
		}

		groups[code].fields.push(mapping);
	});

	// Sort fields within each group by displayOrder if available
	Object.values(groups).forEach((group) => {
		group.fields.sort((a, b) => {
			if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
				return a.displayOrder - b.displayOrder;
			}
			return 0;
		});
	});

	// Sort groups 100% dynamically based on database sortOrder
	return Object.values(groups).sort((a, b) => {
		const orderA = typeof a.sortOrder === "number" ? a.sortOrder : 9999;
		const orderB = typeof b.sortOrder === "number" ? b.sortOrder : 9999;

		if (orderA !== orderB) {
			return orderA - orderB;
		}

		return a.indicatorCode.localeCompare(b.indicatorCode);
	});
}
