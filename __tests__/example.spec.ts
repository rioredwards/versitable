import { getStringUsers } from "../__mocks__/faker";
import { versitable } from "../src";

const users = getStringUsers(5);

const invalidTableArgs = [
  "any" as any,
  1,
  ["one", "two", "three"],
  undefined,
  null,
  { "I am": "an object" },
  [["sub-arrays"], ["with", "different", "lengths"]],
];

describe("versitable.create", () => {
  it("should create a string[][]", () => {
    const table = versitable.create(users);
    expect(table).toBeInstanceOf(Array);
    expect(table[0]).toBeInstanceOf(Array);
    expect(typeof table[0][0]).toBe("string");
  });

  it("should error if not passed a table with type: string[][]", () => {
    for (const arg of invalidTableArgs) {
      expect(() => versitable.create(arg)).toThrowError();
    }
  });
});
