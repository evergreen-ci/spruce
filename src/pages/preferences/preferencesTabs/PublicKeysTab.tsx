import React from "react";
import { Table, Skeleton } from "antd";
import { useQuery } from "@apollo/react-hooks";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import styled from "@emotion/styled";
import { GET_MY_PUBLIC_KEYS } from "gql/queries";
import { useBannerDispatchContext } from "context/banners";
import {
  GetMyPublicKeysQuery,
  GetMyPublicKeysQueryVariables,
} from "gql/generated/types";

export const PublicKeysTab: React.FC = () => {
  const dispatchBanner = useBannerDispatchContext();
  const { data, loading } = useQuery<
    GetMyPublicKeysQuery,
    GetMyPublicKeysQueryVariables
  >(GET_MY_PUBLIC_KEYS, {
    onError: (error) => {
      dispatchBanner.errorBanner(
        `There was an error fetching your public keys: ${error.message}`
      );
    },
  });

  const tableData = data?.myPublicKeys ?? [];

  return (
    <div>
      <Button
        size="small"
        data-cy="add-key-button"
        glyph={<Icon glyph="Plus" />}
      >
        Add New Key
      </Button>
      <TableContainer>
        {loading ? (
          <Skeleton active title={false} paragraph={{ rows: 4 }} />
        ) : (
          <Table
            rowKey={({ name }) => name}
            columns={columns}
            dataSource={tableData}
            pagination={false}
          />
        )}
      </TableContainer>
    </div>
  );
};

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Actions",
    render: (text: string, publicKey: PublicKey): JSX.Element => (
      <BtnContainer>
        <Button
          size="small"
          data-cy={`${publicKey.name}-edit-btn`}
          glyph={<Icon glyph="Edit" />}
        />
        <StyledButton
          size="small"
          data-cy={`${publicKey.name}-delete-btn`}
          glyph={<Icon glyph="Trash" />}
        />
      </BtnContainer>
    ),
  },
];

interface PublicKey {
  name: string;
  key: string;
}

const TableContainer = styled.div`
  margin-top: 48px;
`;

const StyledButton = styled(Button)`
  margin-left: 8px;
`;

const BtnContainer = styled.div`
  white-space: nowrap;
`;
