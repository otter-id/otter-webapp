import { GenAuth } from "./gen-auth";

export const ResultError = {
  oneTime: async (result: any, store: string) => {
    if (result.ok) {
      if (result.error && result.error === "OneTimeTokenInvalid") return;
      await GenAuth.store({ value: store });
    }
  },
};
