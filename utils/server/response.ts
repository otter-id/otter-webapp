import type { ResponFetch, ResponServerParam } from "@/types/response";

export const Respon = {
  server: async (param: ResponServerParam): Promise<ResponFetch> => {
    const { respon } = param;
    const { status, statusText, ok, url, type, headers } = respon;
    const body = await (respon as Response).json();
    return Object.assign(body, { status, statusText, ok, url, type, headers });
  },
};
