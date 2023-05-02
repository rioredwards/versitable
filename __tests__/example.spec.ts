import { getStringUsers } from "../mocks/faker";
import { versitable } from "../src";

const users = getStringUsers(5);

/* Versitable */
describe("versitable.create should", () => {
  it("create a string[][]", () => {
    versitable.create(users);
    console.log("users: ", users);
  });
});
