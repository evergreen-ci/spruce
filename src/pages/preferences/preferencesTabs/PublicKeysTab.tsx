import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { Table, Skeleton } from "antd";
import { usePreferencesAnalytics } from "analytics";
import { PlusButton } from "components/Buttons";
import Popconfirm from "components/Popconfirm";
import { WordBreak } from "components/styles";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
  RemovePublicKeyMutation,
  RemovePublicKeyMutationVariables,
} from "gql/generated/types";
import { REMOVE_PUBLIC_KEY } from "gql/mutations";
import { GET_MY_PUBLIC_KEYS } from "gql/queries";
import {
  EditModal,
  EditModalPropsState,
} from "pages/preferences/preferencesTabs/publicKeysTab/EditModal";

export const PublicKeysTab: React.VFC = () => {
  const dispatchToast = useToastContext();
  const { sendEvent } = usePreferencesAnalytics();
  const [editModalProps, setEditModalProps] = useState<EditModalPropsState>(
    defaultEditModalProps
  );
  const onCancel = () => {
    setEditModalProps(defaultEditModalProps);
  };
  const { data: myKeysData, loading: loadingMyPublicKeys } = useQuery<
    MyPublicKeysQuery,
    MyPublicKeysQueryVariables
  >(GET_MY_PUBLIC_KEYS, {
    onCompleted() {},
    onError(error) {
      dispatchToast.error(
        `There was an error fetching your public keys: ${error.message}`
      );
    },
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
      cache.writeQuery<MyPublicKeysQuery, MyPublicKeysQueryVariables>({
        data: { myPublicKeys: [...data.removePublicKey] },
        query: GET_MY_PUBLIC_KEYS,
      });
    },
  });

  const columns = [
    {
      dataIndex: "name",
      key: "name",
      render: (text: string): JSX.Element => (
        <WordBreak data-cy="table-key-name">{text}</WordBreak>
      ),
      title: "Name",
    },
    {
      render: (text: string, { key, name }: PublicKey): JSX.Element => (
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
            align="right"
            onConfirm={() => {
              sendEvent({ name: "Delete public key" });
              removePublicKey({ variables: { keyName: name } });
            }}
            trigger={
              <StyledButton
                size="small"
                data-cy="delete-btn"
                disabled={loadingRemovePublicKey}
              >
                <Icon glyph="Trash" />
              </StyledButton>
            }
          >
            Delete this public key?
          </Popconfirm>
        </BtnContainer>
      ),
      title: "Actions",
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
      <PlusButton
        size="small"
        data-cy="add-key-button"
        onClick={() => {
          setEditModalProps({
            initialPublicKey: null,
            visible: true,
          });
        }}
      >
        Add New Key
      </PlusButton>
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
  initialPublicKey: null,
  visible: false,
};

const TableContainer = styled.div`
  margin-top: 48px;
`;

const StyledButton = styled(Button)`
  margin-left: ${size.xs};
`;

const BtnContainer = styled.div`
  white-space: nowrap;
`;
