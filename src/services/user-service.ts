import { db } from "@/lib/db";
import { UserRole } from "@/generated/prisma";
import { hash } from "bcryptjs";

/**
 * Get all users from the database
 */
export async function getAllUsers() {
	return await db.user.findMany({
		select: {
			id: true,
			username: true,
			role: true,
			is_active: true,
			email: true,
			created_at: true,
		},
		orderBy: {
			created_at: "desc",
		},
	});
}

/**
 * Get a user by ID
 */
export async function getUserById(id: number) {
	return await db.user.findUnique({
		where: { id },
		select: {
			id: true,
			username: true,
			role: true,
			is_active: true,
			facility_id: true,
			last_login: true,
			created_at: true,
		},
	});
}

/**
 * Create a new user
 */
export async function createUser(data: {
	username: string;
	password: string;
	role: UserRole;
	is_active?: boolean;
	facility_id?: string;
}) {
	const { username, password, role, is_active = true, facility_id } = data;

	// Hash the password
	const password_hash = await hash(password, 10);

	return await db.user.create({
		data: {
			username,
			password_hash,
			role,
			is_active,
			facility_id: facility_id ?? null,
		},
		select: {
			id: true,
			username: true,
			role: true,
			is_active: true,
			facility_id: true,
			created_at: true,
		},
	});
}

/**
 * Update a user
 */
export async function updateUser(
	id: number,
	data: {
		username?: string;
		password?: string;
		role?: UserRole;
		is_active?: boolean;
		facility_id?: string | null;
	}
) {
	const { username, password, role, is_active, facility_id } = data;

	// Prepare update data
	const updateData: any = {};

	if (username !== undefined) {
		updateData.username = username;
	}

	if (password !== undefined) {
		updateData.password_hash = await hash(password, 10);
	}

	if (role !== undefined) {
		updateData.role = role;
	}

	if (is_active !== undefined) {
		updateData.is_active = is_active;
	}

	if (facility_id !== undefined) {
		updateData.facility_id = facility_id;
	}

	return await db.user.update({
		where: { id },
		data: updateData,
		select: {
			id: true,
			username: true,
			role: true,
			is_active: true,
			facility_id: true,
			last_login: true,
			created_at: true,
		},
	});
}

/**
 * Delete a user
 */
export async function deleteUser(id: number) {
	return await db.user.delete({
		where: { id },
	});
}
