import { useState, useEffect, forwardRef } from "react";
import PageTitle from "../../components/PageTitle";
import { useFirebaseUser } from "../../services/firebase/user";
import { useRouter } from "next/router";
import DebouncedUserInput from "../../components/core/DebouncedUserInput";
import DebouncedUsernameInput from "../../components/core/DebouncedUsernameInput";
import {
  Modal,
  Group,
  Select,
  Text,
  Stack,
  Title as MantineTitle,
  ThemeIcon,
  LoadingOverlay,
  useMantineTheme,
  useMantineColorScheme,
  TextInput,
  Accordion,
  ActionIcon,
  Tabs,
  Textarea,
} from "@mantine/core";

import {
  IconSun,
  IconMoonStars,
  IconUserCircle,
  IconBrush,
  IconDeviceGamepad2,
  IconAt,
  IconPencil,
} from "@tabler/icons";
import Flags from "country-flag-icons/react/3x2";

const gameRegions = [
  {
    value: "jp",
    label: "Japan",
    icon: <Flags.JP height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "cn",
    label: "Mainland China",
    icon: <Flags.CN height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "kr",
    label: "Korea",
    icon: <Flags.KR height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "tw",
    label: "Taiwan",
    icon: <Flags.TW height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "en",
    label: "Worldwide (English)",
    icon: <Flags.GB height={16} style={{ borderRadius: 3 }} />,
  },
  // { come on baby america
  //   value: "us",
  //   label: "United States",
  //   icon: <Flags.US height={16} style={{ borderRadius: 3 }} />,
  // },
];

const tlBadgeOptions = [
  {
    value: "none",
    label: "Hide all badges",
  },
  {
    value: "unofficial",
    label: "Only show badges for unofficial translations",
  },
  {
    value: "all",
    label: "Show all badges",
  },
];
const nameOrderOptions = [
  {
    value: "firstlast",
    label: "Given name, Family name",
    example: "Eg. Subaru Akehoshi",
  },
  {
    value: "lastfirst",
    label: "Family name, Given name",
    example: "Eg. Akehoshi Subaru",
  },
];

const nameOrderItem = forwardRef(function SelectItem(
  { label, example, ...others },
  ref
) {
  return (
    <div ref={ref} {...others}>
      <Text size="sm">{label}</Text>
      <Text size="xs" color="dimmed">
        {example}
      </Text>
    </div>
  );
});

const SelectItemForwardRef = forwardRef(function SelectItem(
  { label, icon, ...props },
  ref
) {
  return (
    <div ref={ref} {...props}>
      <Group spacing="xs">
        {icon}
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  );
});

function DarkModeOption() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Select
      value={colorScheme || "dark"}
      label={"Mode"}
      onChange={(value) => {
        theme.other.setAppColorScheme(value);
      }}
      itemComponent={SelectItemForwardRef}
      data={[
        {
          value: "light",
          label: "Light Mode",
          icon: <IconSun size={16} />,
        },
        {
          value: "dark",
          label: "Dark Mode",
          icon: <IconMoonStars size={16} />,
        },
      ]}
      icon={
        colorScheme === "dark" ? (
          <IconMoonStars size={16} />
        ) : (
          <IconSun size={16} />
        )
      }
    />
  );
}

function DropdownOption({ dataKey, data, label, ...props }) {
  const { firebaseUser, setUserDataKey } = useFirebaseUser();

  return (
    <Select
      value={firebaseUser.firestore?.[dataKey] || null}
      label={label}
      onChange={(value) => {
        setUserDataKey({ [dataKey]: value });
      }}
      itemComponent={SelectItemForwardRef}
      icon={
        data.filter((r) => r.value === firebaseUser.firestore?.[dataKey])[0]
          ?.icon || null
      }
      data={data}
      {...props}
    />
  );
}

function Page() {
  const router = useRouter();
  const { firebaseUser } = useFirebaseUser();
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);

  useEffect(() => {
    if (!firebaseUser.loading && !firebaseUser.loggedIn) {
      router.push("/login");
    }
  }, [firebaseUser, router]);

  return (
    <>
      <PageTitle title="Settings" />
      <LoadingOverlay visible={firebaseUser.loading} />
      <Tabs defaultValue="content">
        <Tabs.List>
          <Tabs.Tab
            value="content"
            icon={<IconDeviceGamepad2 size={14} />}
            color="yellow"
          >
            Content
          </Tabs.Tab>
          <Tabs.Tab
            value="appearance"
            icon={<IconBrush size={14} />}
            color="violet"
          >
            Appearance
          </Tabs.Tab>
          <Tabs.Tab
            value="profile"
            icon={<IconUserCircle size={14} />}
            color="lightblue"
          >
            Profile
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="content" pt="xs">
          <Stack>
            <DropdownOption
              dataKey="content_region"
              label="Game Region"
              data={gameRegions}
              description="This setting currently does not have an effect on content yet."
            />

            <DropdownOption
              dataKey="name_order"
              label="Preferred name order"
              data={nameOrderOptions}
              description="Only applies to names displayed in western languages. East asian languages retain their original name order."
              placeholder={nameOrderOptions[0].label + " (Default)"}
              itemComponent={nameOrderItem}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="appearance" pt="xs">
          <Stack>
            <DarkModeOption />
            <DropdownOption
              dataKey="show_tl_badge"
              label="Show officialty badges for translations"
              data={tlBadgeOptions}
              description="This setting may not be applied site-wide at this time."
              placeholder={tlBadgeOptions[0].label}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="profile" pt="xs">
          <Stack>
            <DebouncedUserInput
              label="Name"
              dataKey="name"
              placeholder={firebaseUser?.user?.email?.split("@")?.[0] || ""}
            />
            <TextInput
              label="Username"
              value={firebaseUser.firestore?.username}
              disabled
              description="Username changes are unavailable during the beta."
              placeholder={"Username not set"}
              icon={<IconAt size={16} />}
              sx={{ flexGrow: 1 }}
              rightSection={
                <ActionIcon
                  onClick={() => setUsernameModalOpen(true)}
                  variant="filled"
                  color="blue"
                  disabled //temporarily
                >
                  <IconPencil size={14} />
                </ActionIcon>
              }
            />
            <Modal
              opened={usernameModalOpen}
              onClose={() => setUsernameModalOpen(false)}
              title="Change Username"
              size="sm"
              centered
            >
              <DebouncedUsernameInput
                changedCallback={() => setUsernameModalOpen(false)}
              />
            </Modal>
            <Bio />
          </Stack>
        </Tabs.Panel>
      </Tabs>
      {/* <Accordion
        disableIconRotation
        multiple
        styles={{ control: { paddingTop: 14, paddingBottom: 14 } }}
      >
        <Accordion.Item value="content">
          <Accordion.Control
            icon={
            }
          >
            Content
          </Accordion.Control>
          <Accordion.Panel>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="appearance">
          <Accordion.Control
            icon={
            }
          >
            Appearance
          </Accordion.Control>
          <Accordion.Panel>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="profile">
          <Accordion.Control
            icon={
            }
          >
            Profile
          </Accordion.Control>
          <Accordion.Panel>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion> */}
    </>
  );
}

export default Page;

import Layout from "../../components/Layout";
import RichText from "../../components/core/RichText";
import Bio from "./Profile/Bio";
Page.getLayout = function getLayout(page, pageProps) {
  return <Layout pageProps={pageProps}>{page}</Layout>;
};
