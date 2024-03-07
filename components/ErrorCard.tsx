import * as React from "react";
import { Alert, List } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { error } from "console";

type ErrorCardProps = {
  message?: string;
  arrayOfErrors?: string[];
};

export const ErrorCard: React.FC<ErrorCardProps> = ({
  message,
  arrayOfErrors,
}) => {
  return (
    <>
      <Alert
        mt="xs"
        icon={<IconAlertCircle size="1rem" />}
        color="red"
        variant="outline"
      >
        {message ? (
          message
        ) : (
          <List>
            {arrayOfErrors?.map((error, index) => (
              <List.Item key={index}>{error}</List.Item>
            ))}
          </List>
        )}
      </Alert>
    </>
  );
};
