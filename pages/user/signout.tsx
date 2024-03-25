import * as React from "react";
import { Button } from "@mantine/core";
import { signOut } from "next-auth/react";

const Signout: React.FC = () => {
  return (
    <Button
      onClick={() => {
        signOut({ callbackUrl: "/" });
      }}
    >
      Sign Out
    </Button>
  );
};

export default Signout;
