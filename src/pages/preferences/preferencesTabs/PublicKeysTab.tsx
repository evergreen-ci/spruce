import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { Table, Skeleton, Popconfirm } from "antd";
import { usePreferencesAnalytics } from "analytics";
import { WordBreak } from "components/Typography";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  GetMyPublicKeysQuery,
  GetMyPublicKeysQueryVariables,
  RemovePublicKeyMutation,
  RemovePublicKeyMutationVariables,
} from "gql/generated/types";
import { REMOVE_PUBLIC_KEY } from "gql/mutations";
import { GET_MY_PUBLIC_KEYS } from "gql/queries";
import {
  EditModal,
  EditModalPropsState,
} from "pages/preferences/preferencesTabs/publicKeysTab/EditModal";

export const PublicKeysTab: React.FC = () => {
  const dispatchToast = useToastContext();
  const { sendEvent } = usePreferencesAnalytics();
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
      dispatchToast.error(
        `There was an error fetching your public keys: ${error.message}`
      );
    },
    onCompleted() {},
  });
  const [removePublicKey, { loading: loadingRemovePublicKey }] = useMutation<
    RemovePublicKeyMutation,
    RemovePublicKeyMutationVariables
  >(REMOVE_PUBLIC_KEY, {
    onError(error) {
      dispatchToast.error(
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
        <WordBreak data-cy="table-key-name">{text}</WordBreak>
      ),
    },
    {
      title: "Actions",
      render: (text: string, { name, key }: PublicKey): JSX.Element => (
        <BtnContainer>
          <Button
            size="small"
            data-cy="edit-btn"
            leftGlyph={<Icon glyph="Edit" />}
            onClick={() => {
              setEditModalProps({
                initialPublicKey: { key, name },
                visible: true,
              });
            }}
          />
          <Popconfirm
            icon={null}
            placement="topRight"
            title="Delete this public key?"
            onConfirm={() => {
              sendEvent({ name: "Delete public key" });
              removePublicKey({ variables: { keyName: name } });
            }}
            okText="Yes"
            cancelText="Cancel"
          >
            {/* @ts-expect-error */}
            <StyledButton
              size="small"
              data-cy="delete-btn"
              leftGlyph={<Icon glyph="Trash" />}
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
        leftGlyph={<Icon glyph="Plus" />}
        onClick={() => {
          setEditModalProps({
            visible: true,
            initialPublicKey: null,
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
  initialPublicKey: null,
};

const TableContainer = styled.div`
  margin-top: 48px;
`;

// @ts-expect-error
const StyledButton = styled(Button)`
  margin-left: ${size.xs};
`;

const BtnContainer = styled.div`
  white-space: nowrap;
`;
