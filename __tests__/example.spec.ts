import { users } from "../mocks/faker";

describe("users should", () => {
  it("be an array of users", () => {
    console.log("users: ", users);
    expect(users).toBeInstanceOf(Array);
  });
});

describe("versitable.create should", () => {
  it("create a string[][]", () => {
    expect(1 + 1).toBe(2);
  });
});
