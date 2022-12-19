import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import {
  TextInput,
  useMantineTheme,
  Text,
  TextInputProps,
} from "@mantine/core";

import { UserData } from "types/makotools";
import useUser from "services/firebase/user";

function TextSetting<T = {}>({
  label,
  dataKey,
  Component = TextInput,
  showCharCount = false,
  charLimit,
  externalSetter,
  profileState,
  ...props
}: TextInputProps & {
  label: string;
  dataKey: keyof UserData;
  Component?: any;
  showCharCount?: boolean;
  charLimit: number;
  externalSetter: Dispatch<SetStateAction<any>>;
  profileState: any;
} & T) {
  const theme = useMantineTheme();
  const user = useUser();

  const isFirestoreAccessible = user.loggedIn;

  const [inputValue, setInputValue] = useState(
    user.loggedIn ? user.db?.[dataKey] : undefined
  );

  // const handleValueChange = useDebouncedCallback((value) => {
  //   if (user.loggedIn && !user?.db?.admin?.disableTextFields) {
  //     externalSetter(value);
  //   }
  // }, 2000);

  // const memoizedHandleValueChange = useMemo(
  //   () => handleValueChange,
  //   [handleValueChange]
  // );

  useEffect(() => {
    if (isFirestoreAccessible) setInputValue(user.db?.[dataKey]);
  }, [isFirestoreAccessible, user, dataKey]);

  return (
    <>
      <Component
        value={inputValue}
        label={label}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
          externalSetter({ ...profileState, [dataKey]: e.target.value });
          console.log(e.target.value);
        }}
        // rightSection={
        //   inputValue?.length &&
        //   (inputValue?.length > charLimit ? (
        //     <IconX size={18} color={theme.colors.red[5]} />
        //   ) : inputValue === user.db?.[dataKey] ? (
        //     <IconCheck size={18} color={theme.colors.green[5]} />
        //   ) : (
        //     <Loader size="xs" />
        //   ))
        // }
        autosize
        {...props}
        error={
          inputValue?.length > charLimit
            ? `${label} must be under ${charLimit} characters`
            : null
        }
        disabled={isFirestoreAccessible && user?.db?.admin?.disableTextFields}
      />
      {showCharCount && (
        <Text align="right" color="dimmed" size="xs" mt="xs">
          Characters: {inputValue?.length}/{charLimit}
        </Text>
      )}
    </>
  );
}

export default TextSetting;