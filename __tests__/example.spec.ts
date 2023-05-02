import { getStringUsers } from "../__mocks__/faker";
import { versitable } from "../src";

const users = getStringUsers(5);

/* Versitable */
describe("versitable.create should", () => {
  it("create a string[][]", () => {
    const table = versitable.create(users);
    expect(table).toBeInstanceOf(Array);
    expect(table[0]).toBeInstanceOf(Array);
    expect(typeof table[0][0]).toBe("string");
  });
});
