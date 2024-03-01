import { ApolloProvider } from "@apollo/client";
import { useCreateGQLCLient } from "hooks/useCreateGQLClient";

const GQLWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useCreateGQLCLient();
  if (!client) {
    return null;
  }
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GQLWrapper;
