# shopify-graphql-node

> Shopify GraphQL for Node

## Installation

To install this package, you can run command

```bash
npm install --save shopify-graphql-node
```

Or 

```bash
yarn add shopify-graphql-node
```

## Usage

* Simple query

```javascript
import GraphQL from "shopify-graphql-node";

const GraphQLClient = new GraphQL("domain", "access-token");

const query = `query { shop { id } }`;

GraphQLClient
  .request(query)
  .then(data => console.log(JSON.stringify(data.shop, null, 2)))
  .catch(error => console.log(JSON.stringify(error, null, 2)));

```

* Simple mutation

```javascript
import GraphQL from "shopify-graphql-node";

const GraphQLClient = new GraphQL("domain", "access-token");

const mutation = `
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
      }
    }
  }
`;

GraphQLClient
  .request(mutation, {
    input: {
      descriptionHtml: "Collection was created from GraphQL",
      title: "GraphQL Collection",
    },
  })
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(error => console.log(JSON.stringify(error, null, 2)));

```

* For more example, please read [here](examples)

## Customize fetcher

## Issue

If you have any issue or question, please [create new issue](https://github.com/baorv/shopify-graphql-node/issues/new)

## License

This project is licensed under the [MIT License](LICENSE).

## Contributors

## Todo