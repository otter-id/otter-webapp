export const ResponServer = async (param: Response) => {
  const { status, statusText, ok, url, type, headers } = param;
  const response = await param.json();
  return { response, status, statusText, ok, url, type, headers };
};
