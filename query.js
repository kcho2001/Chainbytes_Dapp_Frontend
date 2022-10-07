import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import React from "react";
import { AppRegistry } from "react-native";
import { app } from "./App";

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

const App = () => (
  <ApolloProvider client={client}>
    <app />
  </ApolloProvider>
);

AppRegistry.registerComponent("MyApplication", () => App);
