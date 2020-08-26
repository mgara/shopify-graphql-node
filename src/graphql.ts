import { ClientError, LeakyBucketError, Variables } from "./errors";
import { Fetcher, RawFetcher } from "./fetcher";

class GraphQL {
  private url: string;
  private domain: string;
  private accessToken: string;
  private headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  private fetcher: Fetcher;

  private api: string;
  private apiVersion: string;

  public constructor(
    domain: string,
    accessToken: string,
    api: string,
    apiVersion: string,
    fetcher?: Fetcher
  ) {
    this.apiVersion = apiVersion || "2020-04";

    if (!["admin", "storefront"].includes(api)) {
      throw new Error(
        "the api must be one of 'storefront' or 'admin' for this instance"
      );
    }

    this.api = api;

    if (domain.endsWith(".myshopify.com")) {
      domain = domain.replace(".myshopify.com", "");
    }

    this.domain = domain;
    this.accessToken = accessToken;

    this.url = "";

    if (this.api === "admin") {
      this.url = `https://${domain}.myshopify.com/admin/api/${this.apiVersion}/graphql.json`;
    }

    if (this.api === "storefront") {
      this.url = `https://${domain}.myshopify.com/api/${this.apiVersion}/graphql.json/`;
    }

    if (this.api === "admin") {
      this.headers = {
        ...this.headers,
        "X-Shopify-Access-Token": this.accessToken,
      };
    }

    if (this.api === "storefront") {
      this.headers = {
        ...this.headers,
        "X-Shopify-Storefront-Access-Token": this.accessToken,
      };
    }

    if (typeof fetcher !== "undefined") {
      this.fetcher = fetcher;
    } else {
      this.fetcher = new RawFetcher();
    }
  }

  public async request<T extends any>(
    query: string,
    variables?: Variables
  ): Promise<any> {
    const body = JSON.stringify({
      query,
      variables: variables ? variables : undefined,
    });

    const response = await this.fetcher.post(this.url, {
      body,
      headers: this.headers,
    });

    const startTime = new Date().getTime();
    const result = await this.getResult(response);
    const now = new Date().getTime();
    const delay = now - startTime;
    const throttelingTimeout = delay > 500 ? 0 : 500 - delay;

    if (response.ok && !result.errors && result.data) {
      // tslint:disable-next-line:no-console
      console.log(`Resolving after throttelingTimeout: ${throttelingTimeout}`);
      setTimeout(() => {
        return result.data;
      }, throttelingTimeout);
    } else {
      const errorResult =
        typeof result === "string" ? { error: result } : result;
      if (response.status === 429) {
        throw new LeakyBucketError(
          { ...errorResult, status: response.status },
          { query, variables },
          0,
          40
        );
      }
      throw new ClientError(
        { ...errorResult, status: response.status },
        { query, variables }
      );
    }
  }

  public setDomain(domain: string) {
    if (domain.endsWith(".myshopify.com")) {
      domain = domain.replace(".myshopify.com", "");
    }
    this.domain = domain;
    this.url = `https://${domain}.myshopify.com/admin/api/graphql.json`;
  }

  public setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
    this.headers = {
      ...this.headers,
      "X-Shopify-Access-Token": this.accessToken,
    };
  }

  public withDetailedCost() {
    this.headers = {
      ...this.headers,
      "X-Graphql-Cost-Include-Fields": "true",
    };
  }

  public getDomain(): string {
    return this.domain;
  }

  public getAccessToken(): string {
    return this.accessToken;
  }

  public getUrl(): string {
    return this.url;
  }

  private async getResult(response: Response): Promise<any> {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.startsWith("application/json")) {
      return response.json();
    } else {
      return response.text();
    }
  }
}

export default GraphQL;
