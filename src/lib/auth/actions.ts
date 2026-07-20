"use server";

import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

const loginSchema = z.object({
  username: z.string().trim().min(2),
  password: z.string().min(8),
});

export type LoginState = { error: string };

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Revisa el usuario y la contraseña." };
  }

  const [user] = await getDb()
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.username, parsed.data.username.toLowerCase()))
    .limit(1);

  if (!user || !(await compare(parsed.data.password, user.passwordHash))) {
    return { error: "Credenciales incorrectas." };
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export type PasswordState = { error: string; success: string };

export async function changePasswordAction(
  _previousState: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const currentUser = await requireUser();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");

  if (newPassword.length < 12) {
    return { error: "La nueva contraseña debe tener al menos 12 caracteres.", success: "" };
  }
  if (newPassword !== confirmation) {
    return { error: "Las dos contraseñas nuevas no coinciden.", success: "" };
  }

  const [account] = await getDb()
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, currentUser.id))
    .limit(1);

  if (!account || !(await compare(currentPassword, account.passwordHash))) {
    return { error: "La contraseña actual no es correcta.", success: "" };
  }

  await getDb()
    .update(users)
    .set({ passwordHash: await hash(newPassword, 12), updatedAt: new Date() })
    .where(eq(users.id, currentUser.id));

  return { error: "", success: "Contraseña actualizada correctamente." };
}
