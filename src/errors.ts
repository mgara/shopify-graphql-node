type Variables = { [key: string]: any };

interface GraphQLRequestContext {
  query: string;
  variables?: Variables;
}

interface GraphQLError {
  message: string;
  locations: { line: number, column: number }[];
  path: string[];
}

interface GraphQLResponse {
  data?: any;
  errors?: GraphQLError[];
  extensions?: any;
  status: number;

  [key: string]: any;
}

class ClientError extends Error {
  public response: GraphQLResponse;
  public request: GraphQLRequestContext;

  public constructor(response: GraphQLResponse, request: GraphQLRequestContext) {
    const message = `${ClientError.extractMessage(response)}: ${JSON.stringify({response, request})}`;
    super(message);
    this.response = response;
    this.request = request;

    // tslint:disable-next-line
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, ClientError);
    }
  }

  private static extractMessage(response: GraphQLResponse): string {
    try {
      return response.errors![0].message;
    } catch (e) {
      return `GraphQL Error (Code: ${response.status})`;
    }
  }
}

class LeakyBucketError extends ClientError {

  public usedNumber: number;
  public availableNumber: number;

  public constructor(response: GraphQLResponse, request: GraphQLRequestContext,
                     usedNumber: number, availableNumber: number) {
    super(response, request);
    this.usedNumber = usedNumber;
    this.availableNumber = availableNumber;
  }
}

export {Variables, GraphQLRequestContext, GraphQLResponse, GraphQLError, ClientError, LeakyBucketError};
