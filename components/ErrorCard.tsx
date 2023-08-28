import * as React from "react";
import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

type ErrorCardProps = {
  message: string | undefined;
};

export const ErrorCard: React.FC<ErrorCardProps> = ({ message }) => {
  return (
    <Alert
      mt="xs"
      icon={<IconAlertCircle size="1rem" />}
      color="red"
      variant="outline"
    >
      {message}
    </Alert>
  );
};
