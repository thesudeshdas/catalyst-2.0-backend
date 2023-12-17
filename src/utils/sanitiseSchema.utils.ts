import { User } from 'src/schema/users.schema';

export function sanitiseUser(unsanitisedUser: any): User {
  return {
    ...unsanitisedUser,
    _id: undefined,
    __v: undefined,
    userId: unsanitisedUser._id,
  };
}

export function sanitiseAllUsers(unsanitisedUser: any): User[] {
  console.log({ unsanitisedUser });

  return unsanitisedUser.map((user) => ({
    ...user._doc,
    _id: undefined,
    __v: undefined,
    userId: user._doc._id,
  }));
}
