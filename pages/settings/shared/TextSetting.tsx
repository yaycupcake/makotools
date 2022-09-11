import {
  useState,
  useMemo,
  useEffect,
  ReactElement,
  SyntheticEvent,
  FormEvent,
  ChangeEvent,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  TextInput,
  Loader,
  useMantineTheme,
  Textarea,
  Box,
  Text,
  TextInputProps,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";

import { useFirebaseUser } from "../../../services/firebase/user";
import { UserData } from "../../../types/makotools";

function TextSetting<T = {}>({
  label,
  dataKey,
  Component = TextInput,
  showCharCount = false,
  charLimit,
  ...props
}: TextInputProps & {
  label: string;
  dataKey: keyof UserData;
  Component?: any;
  showCharCount?: boolean;
  charLimit: number;
} & T) {
  const theme = useMantineTheme();
  const { firebaseUser, setUserDataKey } = useFirebaseUser();

  const isFirestoreAccessible =
    !firebaseUser.loading && firebaseUser.loggedIn && !!firebaseUser.firestore;

  const [inputValue, setInputValue] = useState(
    isFirestoreAccessible ? firebaseUser.firestore?.[dataKey] : undefined
  );

  const handleValueChange = useDebouncedCallback((value) => {
    if (
      isFirestoreAccessible &&
      !firebaseUser?.firestore?.admin?.disabledTextFields
    )
      setUserDataKey({ [dataKey]: value });
  }, 2000);

  const memoizedHandleValueChange = useMemo(
    () => handleValueChange,
    [handleValueChange]
  );

  useEffect(() => {
    if (isFirestoreAccessible) setInputValue(firebaseUser.firestore?.[dataKey]);
  }, [isFirestoreAccessible, firebaseUser, dataKey]);

  return (
    <Box>
      <Component
        value={inputValue}
        label={label}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          // console.log(e.target.value);
          setInputValue(e.target.value);
          if (e.target.value.length <= charLimit) {
            memoizedHandleValueChange(e.target.value);
          }
        }}
        rightSection={
          isFirestoreAccessible &&
          inputValue?.length &&
          (inputValue?.length > charLimit ? (
            <IconX size={18} color={theme.colors.red[5]} />
          ) : inputValue === firebaseUser.firestore?.[dataKey] ? (
            <IconCheck size={18} color={theme.colors.green[5]} />
          ) : (
            <Loader size="xs" />
          ))
        }
        autosize
        {...props}
        error={
          inputValue?.length > charLimit
            ? `${label} must be under ${charLimit} characters`
            : null
        }
        disabled={
          isFirestoreAccessible &&
          firebaseUser?.firestore?.admin?.disabledTextFields
        }
      />
      {showCharCount && (
        <Text align="right" color="dimmed" size="xs" mt="xs">
          Characters: {inputValue?.length}/{charLimit}
        </Text>
      )}
    </Box>
  );
}

export default TextSetting;