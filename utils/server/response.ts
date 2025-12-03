export const Respon = {
  server: (respon: Response, result: any) => {
    const { status, statusText, ok, url, type, headers } = respon;
    return Object.assign(result, { status, statusText, ok, url, type, headers });
  },
};
