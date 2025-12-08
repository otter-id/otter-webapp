import type { ResponErrorOneTimeParam } from "@/types/response";
import { GenAuth } from "./gen-auth";

export const ResponBody = {
  errorOneTime: async (param: ResponErrorOneTimeParam) => {
    const { respon, store } = param;
    if (respon.ok) {
      if ((respon as any).error && (respon as any).error === "OneTimeTokenInvalid") return;
      await GenAuth.store({ value: store });
    }
  },
};
