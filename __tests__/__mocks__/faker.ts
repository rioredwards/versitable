import { faker } from "@faker-js/faker";
import type { SexType } from "@faker-js/faker";

type SubscriptionTier = "free" | "basic" | "business";

export interface User {
  _id: string;
  emoji: string;
  emojis: string;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  sex: SexType;
  subscriptionTier: SubscriptionTier;
}

export class User implements User {
  _id: string;
  avatar: string;
  emoji: string;
  emojis: string;
  email: string;
  firstName: string;
  lastName: string;
  sex: SexType;
  subscriptionTier: SubscriptionTier;

  constructor() {
    this._id = faker.datatype.uuid();
    this.avatar = faker.image.avatar();
    this.emoji = faker.internet.emoji();
    this.emojis = Array.from({ length: 3 }, () => faker.internet.emoji()).join(
      ""
    );
    this.sex = faker.name.sexType();
    this.firstName = faker.name.firstName(this.sex);
    this.lastName = faker.name.lastName();
    this.email = faker.helpers.unique(faker.internet.email, [
      this.firstName,
      this.lastName,
    ]);
    this.subscriptionTier = faker.helpers.arrayElement([
      "free",
      "basic",
      "business",
    ]);
  }
}

export function getUsers(num: number = 5) {
  return Array.from({ length: num }, () => new User());
}

export function getStringUsers(num: number = 5): string[][] {
  return Array.from({ length: num }, () => {
    return Object.values(new User());
  });
}
