import { faker } from "@faker-js/faker";
import type { SexType } from "@faker-js/faker";

type SubscriptionTier = "free" | "basic" | "business";

export interface User {
  _id: string;
  emoji: string;
  emojis: string;
  avatar: string;
  birthday: Date;
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
  birthday: Date;
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
    this.birthday = faker.date.birthdate();
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

export const users: User[] = Array.from({ length: 30 }, () => new User());
