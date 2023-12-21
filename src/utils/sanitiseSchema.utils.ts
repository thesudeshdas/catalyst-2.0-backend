import { User } from 'src/schema/users.schema';

export function sanitiseUser(unsanitisedUser: any): User {
  if (unsanitisedUser._doc) {
    return {
      ...unsanitisedUser._doc,
      _id: undefined,
      __v: undefined,
      userId: unsanitisedUser._id,
    };
  }

  return {
    ...unsanitisedUser,
    _id: undefined,
    __v: undefined,
    userId: unsanitisedUser._id,
  };
}

export function sanitiseAllUsers(unsanitisedUser: any): User[] {
  return unsanitisedUser.map((user) => ({
    ...user._doc,
    _id: undefined,
    __v: undefined,
    userId: user._doc._id,
  }));
}
