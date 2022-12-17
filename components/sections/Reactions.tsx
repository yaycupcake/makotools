import { useRouter } from "next/router";
import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Group,
  Paper,
  Text,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconChevronDown, IconChevronUp, IconMoodSmile } from "@tabler/icons";
import { Collapse } from "react-collapse";

import EmoteSelector from "../utilities/emotes/EmoteSelector";
import Emote from "../utilities/emotes/Emote";

import { DbReaction, Reaction } from "types/makotools";
import useUser from "services/firebase/user";
import emotes from "services/makotools/emotes";
import { CONSTANTS } from "services/makotools/constants";

const useStyles = createStyles((theme) => ({
  wrapper: {
    transition: theme.other.transition,
    overflow: "hidden",
  },
  content: {},
}));

function Reactions() {
  const { classes } = useStyles();
  const { asPath } = useRouter();
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const user = useUser();

  const reactionsDisabled = user.loading || !user.loggedIn;

  const currentPageId = asPath.replace(/\//g, "_");
  const addReaction = async (id: string) => {
    if (!user.loggedIn) return;
    const token = await user.user.getIdToken();
    await fetch(`${CONSTANTS.EXTERNAL_URLS.BACKEND}/api/reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify({
        data: {
          user: user.user.id,
          type: "emote",
          content: id,
          page: currentPageId,
        },
      }),
    });

    fetchReactions();
  };
  const fetchReactions = async () => {
    const { data }: { data: DbReaction[] } = await (
      await fetch(
        `${CONSTANTS.EXTERNAL_URLS.BACKEND}/api/reactions?filters[page][$eq]=${currentPageId}&sort=createdAt:desc`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    ).json();

    const reactions = data
      .map(({ attributes }) => {
        const emote = emotes.find((e) => e.stringId === attributes.content);
        if (emote) {
          const reaction: Reaction = {
            emote,
            alt: emote.name,
            id: attributes.createdAt,
          };
          return reaction;
        }
      })
      .filter((e) => typeof e !== "undefined");
    setReactions(reactions as Reaction[]);
  };

  useEffect(() => {
    fetchReactions();
  }, [asPath]);

  return (
    <Paper my="sm" withBorder p={3} radius="md">
      <Group spacing="xs" sx={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
        <EmoteSelector
          target={(onClick) => {
            return (
              <Tooltip
                label={<Text size="xs">Sign in to react!</Text>}
                disabled={!reactionsDisabled}
              >
                <Box>
                  <Button
                    variant="light"
                    size="xs"
                    color="hokke"
                    onClick={onClick}
                    leftIcon={<IconMoodSmile size={16} />}
                    px="xs"
                    disabled={reactionsDisabled}
                  >
                    Reactions
                  </Button>
                </Box>
              </Tooltip>
            );
          }}
          callback={(emote) => {
            addReaction(emote.stringId);
          }}
          disabled={user.loading || !user.loggedIn}
        >
          <></>
        </EmoteSelector>
        {reactions.length ? (
          <>
            <Box
              sx={{
                flexGrow: 1,
                overflow: "hidden",
                paddingTop: 2,
                maskImage: collapsed
                  ? "linear-gradient(to left, transparent, black 28px)"
                  : "",
              }}
            >
              <Collapse
                isOpened={true}
                theme={{
                  collapse: classes.wrapper,
                  content: classes.content,
                }}
              >
                <Group
                  spacing="xs"
                  sx={{
                    maxHeight: collapsed ? 24 : undefined,
                  }}
                >
                  {reactions?.map((r: any) => (
                    <Emote key={r.id} emote={r.emote} size={24} />
                  ))}
                </Group>
              </Collapse>
            </Box>

            <ActionIcon
              variant="light"
              onClick={() => {
                setCollapsed((c) => !c);
              }}
            >
              {collapsed ? (
                <IconChevronDown size={16} />
              ) : (
                <IconChevronUp size={16} />
              )}
            </ActionIcon>
          </>
        ) : (
          <Box
            sx={{ alignSelf: "stretch", display: "flex", alignItems: "center" }}
          >
            <Text size="sm" color="dimmed">
              Be the first to add a reaction!
            </Text>
          </Box>
        )}
      </Group>
    </Paper>
  );
}

export default Reactions;
