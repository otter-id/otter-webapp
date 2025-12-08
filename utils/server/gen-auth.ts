import CryptoJS from "crypto-js";
import { cookies } from "next/headers";
import type { GenAuthSaveParam, GenAuthSyncReturn } from "@/types/auth";
import { ConstAuth } from "@/utils/server";

export const GenAuth = {
  token: async (): Promise<GenAuthSyncReturn> => {
    const local_key = ConstAuth.cookie_auth_key;
    const local_secret = ConstAuth.cookie_auth_secret;
    const token_secret = ConstAuth.one_time_secret;
    const token_init = ConstAuth.one_time_init;

    if (!local_key || !local_secret || !token_secret || !token_init) {
      // console.log({ schema: "error env", local_key, local_secret, token_secret, token_init });
      throw new Error("Failed setup one time token");
    }

    const cookie = await cookies();
    const local = cookie.get(local_key)?.value;
    if (!local) {
      const token_cur = CryptoJS.AES.encrypt(token_init, token_secret).toString();
      const token_new = token_cur.substring(0, 125);
      const local_cur = CryptoJS.AES.encrypt(token_new, local_secret).toString();

      // console.log({ schema: "sync init", token_cur, token_new });
      return { token: token_cur, store: local_cur };
    }

    const token_cur = CryptoJS.AES.decrypt(local, local_secret).toString(CryptoJS.enc.Utf8);
    if (token_cur !== token_init) {
      const token_new = CryptoJS.AES.encrypt(token_cur.substring(0, 125), token_secret).toString();
      const local_new = CryptoJS.AES.encrypt(token_new, local_secret).toString();

      // console.log({ schema: "sync edit", token_cur, token_new });
      return { token: token_new, store: local_new };
    }

    const local_cur = CryptoJS.AES.encrypt(token_cur, local_secret).toString();
    return { token: token_cur, store: local_cur };
  },
  store: async (param: GenAuthSaveParam) => {
    const local_key = ConstAuth.cookie_auth_key;
    const local_secret = ConstAuth.cookie_auth_secret;

    if (!local_key || !local_secret) {
      // console.log({ schema: "error env", local_key, local_secret });
      throw new Error("Failed setup one time token");
    }

    console.log({ schema: "store", value: param.value });
    (await cookies()).set(local_key, param.value, {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    const cookie = await cookies();
    const _local = cookie.get(local_key)?.value;
    // console.log({ schema: "store", value: local });
  },
};
