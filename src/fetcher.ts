import "cross-fetch/polyfill";

interface Fetcher {
  post(url: string, init: RequestInit): Promise<Response>;
}

class RawFetcher {
  public post(url: string, init: RequestInit): Promise<Response> {
    return fetch(url, {
      ...init,
      method: "POST",
    });
  }
}

export {Fetcher, RawFetcher};
