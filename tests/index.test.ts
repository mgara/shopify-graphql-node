import test from "ava";
import fetchMock from "fetch-mock";
import GraphQL from "../src";

const graphQL = new GraphQL("baorv-store", "daaa7e126a0732175314aea26a042926");

test("simple-query", async (t) => {
  const data = {
    shop: {
      id: "",
    },
  };
  const query = `query { shop { id } }`;
  await mock({body: {data}}, async () => {
    t.deepEqual(await graphQL.request(query), data);
  });
});

async function mock(response: any, testFn: () => Promise<void>) {
  fetchMock.mock({
    matcher: "*",
    response: {
      body: JSON.stringify(response.body),
      headers: {
        "Content-Type": "application/json",
        ...response.headers,
      },
    },
  });

  await testFn();

  fetchMock.restore();
}
