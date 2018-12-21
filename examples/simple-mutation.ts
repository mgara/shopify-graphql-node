import {ClientError} from "../src";
import graphQL from "./graphql";

const mutation = `
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
      }
    }
  }
`;

interface Data {
  collectionCreate: {
    collection: {
      id: string
    }
  };
}

graphQL
  .request(mutation, {
    input: {
      descriptionHtml: "Collection was created from GraphQL",
      title: "GraphQL Collection",
    },
  })
  // tslint:disable-next-line:no-console
  .then((data: Data) => console.log(JSON.stringify(data, null, 2)))
  // tslint:disable-next-line:no-console
  .catch((error: ClientError) => console.log(JSON.stringify(error, null, 2)));
