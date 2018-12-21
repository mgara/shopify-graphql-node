import {ClientError} from "../src";
import graphQL from "./graphql";

const query = `query { shop { id } }`;

interface Data {
  shop: {
    id: string
  };
}

graphQL
  .request(query)
  // tslint:disable-next-line:no-console
  .then((data: Data) => console.log(JSON.stringify(data.shop, null, 2)))
  // tslint:disable-next-line:no-console
  .catch((error: ClientError) => console.log(JSON.stringify(error, null, 2)));
