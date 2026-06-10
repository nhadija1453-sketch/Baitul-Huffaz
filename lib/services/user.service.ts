import { query, queryOne } from '@/lib/db/client';
import crypto from 'crypto';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  nis: string | null;
  nip: string | null;
  role: 'SANTRI' | 'MUSYRIF' | 'ADMIN';
  kelas_id: string | null;
  kelas_nama: string | null;
  kelas_level: number | null;
  avatar_url: string | null;
  is_active: boolean;
  target_hafalan: number;
  created_at: string;
  updated_at: string;
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  return queryOne<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
}

export async function getUserById(id: string): Promise<UserRow | null> {
  return queryOne<UserRow>('SELECT * FROM users WHERE id = $1', [id]);
}

export async function createUser(data: {
  email: string;
  password: string;
  full_name: string;
  role: 'SANTRI' | 'MUSYRIF' | 'ADMIN';
  nis?: string | null;
  nip?: string | null;
  kelas_id?: string | null;
  target_hafalan?: number;
}): Promise<UserRow> {
  const password_hash = hashPassword(data.password);
  const sql = `
    INSERT INTO users (email, password_hash, full_name, role, nis, nip, kelas_id, target_hafalan)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  return queryOne<UserRow>(sql, [
    data.email, password_hash, data.full_name, data.role,
    data.nis ?? null, data.nip ?? null,
    data.kelas_id ?? null, data.target_hafalan ?? 30
  ]) as Promise<UserRow>;
}

export async function getAllUsersByRole(role: string): Promise<UserRow[]> {
  const sql = `
    SELECT u.*, k.nama as kelas_nama, k.level as kelas_level
    FROM users u
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE u.role = $1 AND u.is_active = true
    ORDER BY u.full_name ASC
  `;
  return query<UserRow>(sql, [role]);
}

export async function getUsersByKelas(kelasId: string): Promise<UserRow[]> {
  const sql = `
    SELECT u.*, k.nama as kelas_nama, k.level as kelas_level
    FROM users u
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE u.kelas_id = $1 AND u.role = 'SANTRI' AND u.is_active = true
    ORDER BY u.full_name ASC
  `;
  return query<UserRow>(sql, [kelasId]);
}

export async function updateUser(id: string, data: {
  full_name?: string;
  email?: string;
  nis?: string | null;
  nip?: string | null;
  kelas_id?: string | null;
  is_active?: boolean;
  target_hafalan?: number;
  password?: string;
}): Promise<UserRow | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    if (key === 'password') {
      fields.push(`password_hash = $${paramIndex}`);
      values.push(hashPassword(value as string));
      paramIndex++;
    } else if (key !== 'id') {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`;
  return queryOne<UserRow>(sql, values);
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await query<{ id: string }>('UPDATE users SET is_active = false WHERE id = $1 RETURNING id', [id]);
  return result.length > 0;
}
