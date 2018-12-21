import {ClientError} from "../src";
import graphQL from "./graphql";

const query = `
  query($first: Int!) {
    shop {
      products(first: $first) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  }
`;

graphQL
  .request(query, {
    first: 10,
  })
  // tslint:disable-next-line:no-console
  .then((response) => console.log(JSON.stringify(response, null, 2)))
  // tslint:disable-next-line:no-console
  .catch((error: ClientError) => console.log(JSON.stringify(error, null, 2)));
