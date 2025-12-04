import { GenAuth } from "./gen-auth";

export const ResultError = {
  oneTime: async (result: any, store: string) => {
    if (result.error && result.error !== "OneTimeTokenInvalid") {
      await GenAuth.store({ value: store });
    }
  },
};
