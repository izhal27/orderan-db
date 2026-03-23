import { isContain } from "./common";

describe("isContain", () => {
  it("matches whole word case-insensitively", () => {
    expect(isContain("admin operator", "ADMIN")).toBe(true);
    expect(isContain("administrasi", "admin")).toBe(false);
    expect(isContain("super admin", "admin")).toBe(true);
  });
});
