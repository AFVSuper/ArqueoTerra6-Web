import { describe, expect, it } from "vitest";
import { canDeleteContent, canManageUsers, canPublishContent } from "@/lib/permissions";

describe("matriz de permisos", () => {
  it("reserva la publicación para revisores y superadmins", () => {
    expect(canPublishContent("EDITOR")).toBe(false);
    expect(canPublishContent("REVIEWER")).toBe(true);
    expect(canPublishContent("SUPERADMIN")).toBe(true);
  });

  it("reserva usuarios al superadmin", () => {
    expect(canManageUsers("REVIEWER")).toBe(false);
    expect(canManageUsers("SUPERADMIN")).toBe(true);
  });

  it("permite eliminar al editor, no al revisor", () => {
    expect(canDeleteContent("EDITOR")).toBe(true);
    expect(canDeleteContent("REVIEWER")).toBe(false);
  });
});
