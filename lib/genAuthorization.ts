'use client';
import CryptoJS from "crypto-js";

export const GenAuthorization = {
  sync: () => {
    const local_key = process.env.NEXT_PUBLIC_LS_AUTH_KEY;
    const local_backup_key = process.env.NEXT_PUBLIC_LS_AUTH_BACKUP_KEY;
    const local_secret = process.env.NEXT_PUBLIC_LS_AUTH_SECRET;
    const token_secret = process.env.NEXT_PUBLIC_ONE_TIME_SECRET;
    const token_init = process.env.NEXT_PUBLIC_ONE_TIME_INIT;


    if (!local_key || !local_backup_key || !local_secret || !token_secret || !token_init) {
      throw new Error("Failed setup one time token");
    }

    const local = localStorage.getItem(local_key);
    if (!local) {
      const token_cur = CryptoJS.AES.encrypt(token_init, token_secret).toString();
      const token_new = token_cur.substring(0, 125);
      const local_cur = CryptoJS.AES.encrypt(token_new, local_secret).toString();
      localStorage.setItem(local_key, local_cur);

      const local_backup = CryptoJS.AES.encrypt(token_new, local_secret).toString();
      localStorage.setItem(local_backup_key, local_backup);

      console.log({ schema: 'sync init', token_cur, token_new })
      return token_cur;
    }

    const token_cur = CryptoJS.AES.decrypt(local, local_secret).toString(CryptoJS.enc.Utf8);
    if (token_cur !== token_init) {
      const local_backup = CryptoJS.AES.encrypt(token_cur, local_secret).toString();
      localStorage.setItem(local_backup_key, local_backup);

      const token_new = CryptoJS.AES.encrypt(token_cur.substring(0, 125), token_secret).toString();
      const local_new = CryptoJS.AES.encrypt(token_new, local_secret).toString();
      localStorage.setItem(local_key, local_new);

      console.log({ schema: 'sync edit', token_cur, token_new })
      return token_new;
    }
  },
  undo: () => {
    const local_key = process.env.NEXT_PUBLIC_LS_AUTH_KEY;
    const local_backup_key = process.env.NEXT_PUBLIC_LS_AUTH_BACKUP_KEY;
    const local_secret = process.env.NEXT_PUBLIC_LS_AUTH_SECRET;
    const token_secret = process.env.NEXT_PUBLIC_ONE_TIME_SECRET;
    const token_init = process.env.NEXT_PUBLIC_ONE_TIME_INIT;


    if (!local_key || !local_backup_key || !local_secret || !token_secret || !token_init) {
      throw new Error("Failed setup one time token");
    }

    const local = localStorage.getItem(local_backup_key);
    if (local) {
      const token_cur = CryptoJS.AES.decrypt(local, local_secret).toString(CryptoJS.enc.Utf8);
      const local_new = CryptoJS.AES.encrypt(token_cur, local_secret).toString();
      localStorage.setItem(local_key, local_new);

      console.log({ schema: 'undo', token_cur, local_new })
    }
  },
};