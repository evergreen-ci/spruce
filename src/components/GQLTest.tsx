import * as React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_GREETING = gql`
  {
    userPatches(userId: "sam.kleinman") {
      description
      id
    }
  }
`;

export function Hello() {
  const { loading, error, data } = useQuery(GET_GREETING, {
    variables: { language: "english" }
  });
  console.log("hello render...");
  if (error) {
    console.log("error in test comp", error);
  }
  if (loading) {
    return <p>Loading ...</p>;
  }
  return <h1>Hello {JSON.stringify(data)}!</h1>;
}

export default Hello;
