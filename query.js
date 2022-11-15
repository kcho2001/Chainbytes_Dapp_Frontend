import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import React from "react";
import { AppRegistry } from "react-native";

// Initialize Apollo Client
export const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/jossduff/coffee-subgraph",
  cache: new InMemoryCache(),
});

export const GET_CHECKINS = gql`
  query {
    checkIns {
      workerCheckedIn {
        id
        daysUnpaid
      }
    }
  }
`;

export const GET_WORKER_CHECKINS = (id) =>
  gql`
  query {
  worker(id: "${id}") {
    	checkIns{
        year
        month
        day
      }
    }
  }
`;

const App = () => (
  <ApolloProvider client={client}>
    <app />
  </ApolloProvider>
);

AppRegistry.registerComponent("MyApplication", () => App);
