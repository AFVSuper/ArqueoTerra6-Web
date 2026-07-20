import type { RoleCode } from "@/lib/db/schema";

export function canEditContent(role: RoleCode) {
  return ["SUPERADMIN", "EDITOR", "REVIEWER"].includes(role);
}

export function canPublishContent(role: RoleCode) {
  return role === "SUPERADMIN" || role === "REVIEWER";
}

export function canDeleteContent(role: RoleCode) {
  return role === "SUPERADMIN" || role === "EDITOR";
}

export function canManageUsers(role: RoleCode) {
  return role === "SUPERADMIN";
}

export function roleLabel(role: RoleCode) {
  return {
    SUPERADMIN: "Superadmin",
    EDITOR: "Editor",
    REVIEWER: "Revisor",
  }[role];
}
