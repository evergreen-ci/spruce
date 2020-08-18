import React, { useState } from "react";
import { Table, Skeleton, Popconfirm } from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import styled from "@emotion/styled";
import { GET_MY_PUBLIC_KEYS } from "gql/queries";
import { useBannerDispatchContext } from "context/banners";
import {
  GetMyPublicKeysQuery,
  GetMyPublicKeysQueryVariables,
  RemovePublicKeyMutation,
  RemovePublicKeyMutationVariables,
} from "gql/generated/types";
import {
  EditModal,
  EditModalPropsState,
} from "pages/preferences/preferencesTabs/publicKeysTab/EditModal";
import { REMOVE_PUBLIC_KEY } from "gql/mutations";

export const PublicKeysTab: React.FC = () => {
  const dispatchBanner = useBannerDispatchContext();
  const [editModalProps, setEditModalProps] = useState<EditModalPropsState>(
    defaultEditModalProps
  );
  const onCancel = () => {
    setEditModalProps(defaultEditModalProps);
  };
  const { data: myKeysData, loading: loadingMyPublicKeys } = useQuery<
    GetMyPublicKeysQuery,
    GetMyPublicKeysQueryVariables
  >(GET_MY_PUBLIC_KEYS, {
    onError(error) {
      dispatchBanner.errorBanner(
        `There was an error fetching your public keys: ${error.message}`
      );
    },
    onCompleted() {
      dispatchBanner.clearAllBanners();
    },
  });
  const [removePublicKey, { loading: loadingRemovePublicKey }] = useMutation<
    RemovePublicKeyMutation,
    RemovePublicKeyMutationVariables
  >(REMOVE_PUBLIC_KEY, {
    onError(error) {
      dispatchBanner.errorBanner(
        `There was an error removing the public key: ${error.message}`
      );
    },
    update(cache, { data }) {
      cache.writeQuery<GetMyPublicKeysQuery, GetMyPublicKeysQueryVariables>({
        query: GET_MY_PUBLIC_KEYS,
        data: { myPublicKeys: [...data.removePublicKey] },
      });
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string): JSX.Element => (
        <span data-cy="table-key-name">{text}</span>
      ),
    },
    {
      title: "Actions",
      render: (text: string, { name, key }: PublicKey): JSX.Element => (
        <BtnContainer>
          <Button
            size="small"
            data-cy="edit-btn"
            glyph={<Icon glyph="Edit" />}
            onClick={() => {
              setEditModalProps({
                replaceKey: { key, name },
                visible: true,
              });
            }}
          />
          <Popconfirm
            icon={null}
            placement="topRight"
            title="Delete this public key?"
            onConfirm={() => {
              removePublicKey({ variables: { keyName: name } });
            }}
            okText="Yes"
            cancelText="Cancel"
          >
            <StyledButton
              size="small"
              data-cy="delete-btn"
              glyph={<Icon glyph="Trash" />}
              disabled={loadingRemovePublicKey}
            />
          </Popconfirm>
        </BtnContainer>
      ),
    },
  ];

  const tableData = myKeysData?.myPublicKeys ?? [];
  const table = tableData.length ? (
    <Table
      rowKey={({ name }) => name}
      columns={columns}
      dataSource={tableData}
      pagination={false}
    />
  ) : (
    "No keys saved. Add a new key to populate the list."
  );

  return (
    <div>
      <Button
        size="small"
        data-cy="add-key-button"
        glyph={<Icon glyph="Plus" />}
        onClick={() => {
          setEditModalProps({
            visible: true,
            replaceKey: null,
          });
        }}
      >
        Add New Key
      </Button>
      <TableContainer>
        {loadingMyPublicKeys ? (
          <Skeleton active title={false} paragraph={{ rows: 4 }} />
        ) : (
          table
        )}
      </TableContainer>
      <EditModal {...editModalProps} onCancel={onCancel} />
    </div>
  );
};

interface PublicKey {
  name: string;
  key: string;
}

const defaultEditModalProps = {
  visible: false,
  replaceKey: null,
};

const TableContainer = styled.div`
  margin-top: 48px;
`;

const StyledButton = styled(Button)`
  margin-left: 8px;
`;

const BtnContainer = styled.div`
  white-space: nowrap;
`;
