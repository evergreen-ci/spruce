import { useQuery } from "@apollo/client";
import {
  Cell,
  HeaderCell,
  HeaderRow,
  Row,
  Table,
  TableBody,
  TableHead,
} from "@leafygreen-ui/table/new";
import { getSubscriberText } from "constants/subscription";
import {
  UserSubscriptionsQuery,
  UserSubscriptionsQueryVariables,
} from "gql/generated/types";
import { USER_SUBSCRIPTIONS } from "gql/queries";
import { PreferencesCard } from "pages/preferences/Card";
import { projectSubscriptionMethods } from "types/subscription";
import { string } from "utils";

const { toSentenceCase } = string;

export const UserSubscriptions: React.VFC<{}> = () => {
  const { data } = useQuery<
    UserSubscriptionsQuery,
    UserSubscriptionsQueryVariables
  >(USER_SUBSCRIPTIONS);

  if (!data) return null;

  const {
    user: { subscriptions },
  } = data;

  return (
    <PreferencesCard>
      <Table>
        <TableHead>
          <HeaderRow>
            <HeaderCell>Type</HeaderCell>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Event</HeaderCell>
            <HeaderCell>Notify by</HeaderCell>
            <HeaderCell>Target</HeaderCell>
          </HeaderRow>
        </TableHead>
        <TableBody>
          {subscriptions.map(({ id, resourceType, subscriber }) => (
            <Row key={id}>
              <Cell>{toSentenceCase(resourceType)}</Cell>
              <Cell>{id}</Cell>
              <Cell />
              <Cell>{subscriptionMethodMap[subscriber.type]}</Cell>
              <Cell>{getSubscriberText(subscriber)}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </PreferencesCard>
  );
};

const subscriptionMethodMap = projectSubscriptionMethods.reduce(
  (obj, { label, value }) => ({
    ...obj,
    [value]: label,
  }),
  {}
);
