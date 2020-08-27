import React, { useState } from "react";
import { PublicKeyInput } from "gql/generated/types";
import { PublicKeyForm } from "./PublicKeyForm";
import "antd/es/select/style/css";
import "antd/es/carousel/style/css";

const publicKeys = [
  { key: "ssh key some long key name", name: "MyFirstKey.pub" },
  {
    key: "ssh second key with some long key name",
    name: "MySecondKey.pub",
  },
  {
    key: "ssh wow this key is very good totally secure",
    name: "MyThirdKey.pub",
  },
];
interface publicKeyState {
  publicKey: PublicKeyInput;
  savePublicKey: boolean;
}
export const PublicKeyFormView = () => {
  const [publicKeyState, setPublicKeyState] = useState<publicKeyState>({
    publicKey: {
      name: "",
      key: "",
    },
    savePublicKey: false,
  });
  console.log(publicKeyState[0]);
  return (
    <PublicKeyForm
      publicKeys={publicKeys}
      onChange={setPublicKeyState}
      data={publicKeyState}
    />
  );
};

export default {
  title: "Public Key Form",
};
