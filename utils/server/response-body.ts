import type { ResponErrorOneTimeParam } from "@/types/response";
import { GenAuth } from "./gen-auth";

export const ResponBody = {
  errorOneTime: async (param: ResponErrorOneTimeParam) => {
    const { respon, store } = param;
    const { url: _url, status: _status, statusText, headers: _headers, ok, error } = respon;
    // console.log({ _url, _status, statusText, _headers, ok, error });

    if (ok) {
      if (error && error === "OneTimeTokenInvalid") return;
    }
    if (!ok) {
      if (statusText === "Unauthorized") return;
    }
    await GenAuth.store({ value: store });
  },
};
