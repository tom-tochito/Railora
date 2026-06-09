import { cookies } from "next/headers";
import { users } from "@/lib/data/seed";
import type { Role, User } from "@/lib/domain/types";

const COOKIE_NAME = "railora_demo_role";

export async function getCurrentUser(): Promise<User> {
  const cookieStore = await cookies();
  const role = cookieStore.get(COOKIE_NAME)?.value as Role | undefined;

  return users.find((user) => user.role === role) ?? users[0];
}

export async function setDemoRole(role: Role) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearDemoRole() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
