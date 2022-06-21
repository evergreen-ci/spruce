import React, { useState } from "react";
import { PublicKeyForm, publicKeyStateType } from "./PublicKeyForm";

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
export const PublicKeyFormView = () => {
  const [publicKeyState, setPublicKeyState] = useState<publicKeyStateType>({
    publicKey: {
      name: "",
      key: "",
    },
    savePublicKey: false,
  });
  return (
    <PublicKeyForm
      publicKeys={publicKeys}
      onChange={setPublicKeyState}
      data={publicKeyState}
    />
  );
};

export default {
  title: "Pages/Spawn/Public Key Form",
  component: PublicKeyForm,
};
