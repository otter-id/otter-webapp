export type ResponServer = {
  status?: number;
  statusText?: string;
  ok?: boolean;
  url?: string;
  type?: string;
  headers?: Headers;
  error?: string;
  message?: string;
  data?: any;
};

export type ResponFetch = Response | ResponServer;
export type ResponServerParam = {
  respon: ResponFetch;
};

export type ResponErrorOneTimeParam = {
  respon: ResponServer;
  store: string;
};
