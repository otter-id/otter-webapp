'use client'
import CryptoJS from "crypto-js";
import { GenAuthSaveParam, GenAuthSyncReturn } from "./types";

export const GenAuth = {
  token: async (): Promise<GenAuthSyncReturn> => {
    const local_key = process.env.NEXT_PUBLIC_LS_AUTH_KEY;
    const local_secret = process.env.NEXT_PUBLIC_LS_AUTH_SECRET;
    const token_secret = process.env.NEXT_PUBLIC_ONE_TIME_SECRET;
    const token_init = process.env.NEXT_PUBLIC_ONE_TIME_INIT;

    if (!local_key || !local_secret || !token_secret || !token_init) {
      throw new Error("Failed setup one time token");
    }

    const local = localStorage.getItem(local_key);
    if (!local) {
      const token_cur = CryptoJS.AES.encrypt(token_init, token_secret).toString();
      const token_new = token_cur.substring(0, 125);
      const local_cur = CryptoJS.AES.encrypt(token_new, local_secret).toString();

      console.log({ schema: 'sync init', token_cur, token_new })
      return { token: token_cur, store: local_cur };
    }

    const token_cur = CryptoJS.AES.decrypt(local, local_secret).toString(CryptoJS.enc.Utf8);
    if (token_cur !== token_init) {
      const token_new = CryptoJS.AES.encrypt(token_cur.substring(0, 125), token_secret).toString();
      const local_new = CryptoJS.AES.encrypt(token_new, local_secret).toString();

      console.log({ schema: 'sync edit', token_cur, token_new })
      return { token: token_new, store: local_new };
    }

    const local_new = CryptoJS.AES.encrypt(token_cur, local_secret).toString();
    return { token: token_cur, store: local_new };
  },
  store: async (param: GenAuthSaveParam) => {
    const local_key = process.env.NEXT_PUBLIC_LS_AUTH_KEY;
    const local_secret = process.env.NEXT_PUBLIC_LS_AUTH_SECRET;

    if (!local_key || !local_secret) {
      throw new Error("Failed setup one time token");
    }

    console.log({ schema: 'store', value: param.value });
    localStorage.setItem(local_key, param.value);
  },
};