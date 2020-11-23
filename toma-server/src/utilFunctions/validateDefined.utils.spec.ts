import { validateDefined } from "./validateDefined.util";

describe("validateDefined", () => {
  it("if data is defined, resolve", () => {
    const data = { a: 1, b: 2 };
    expect(() => validateDefined(data)).not.toThrow();
  });
  it("if data is nullish, throw error", () => {
    expect(() => validateDefined(null)).toThrow();
    expect(() => validateDefined(undefined)).toThrow();
  });
  it("if data is not nullish falsy values (ex. 0, ''), should resolve", () => {
    expect(() => validateDefined(0)).not.toThrow();
    expect(() => validateDefined("")).not.toThrow();
    expect(() => validateDefined("")).not.toThrow();
  });
});
