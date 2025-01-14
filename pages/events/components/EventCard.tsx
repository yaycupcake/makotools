import {
  Box,
  createStyles,
  Paper,
  Title,
  Text,
  Badge,
  Group,
  Tooltip,
  Stack,
  ThemeIcon,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import {
  IconArrowsShuffle2,
  IconBookmark,
  IconBus,
  IconDiamond,
} from "@tabler/icons-react";
import { UseListStateHandlers, useMediaQuery } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";

import Picture from "components/core/Picture";
import { Event, GameUnit } from "types/game";
import { useDayjs } from "services/libraries/dayjs";
import IconEnstars from "components/core/IconEnstars";
import useUser from "services/firebase/user";

const useStyles = createStyles((theme) => ({
  eventCard: {
    display: "flex",
    flexFlow: "row wrap",
    width: "100%",
    margin: "auto",
    overflow: "hidden",
    marginBottom: theme.spacing.xs,
  },
  eventInfo: {
    position: "relative",
    flex: "2 1 60%",
    minWidth: 200,
    rowGap: 0,
    columnGap: theme.spacing.md,
  },
  eventInfoText: {
    "&&&&&": {
      flex: "2 1 60%",
      minWidth: 200,
      maxWidth: 500,
    },
  },
  eventInfoDates: {
    "&&&&&": {
      flex: "1 1 30%",
      minWidth: 200,
    },
  },
  eventSummary: {
    fontSize: "11pt",
    marginBottom: "1vh",
  },
}));

function EventCard({
  event,
  units,
  bookmarked,
  bookmarks,
  bookmarkHandlers,
}: {
  event: Event;
  units: GameUnit[];
  bookmarked: boolean;
  bookmarks: number[];
  bookmarkHandlers: UseListStateHandlers<number>;
}) {
  const { t } = useTranslation("events");
  const user = useUser();
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { dayjs } = useDayjs();

  const isMobile = useMediaQuery("(max-width: 768px)");

  let eventUnits: GameUnit[] = units.filter((unit: GameUnit) => {
    return event.unit_id ? event.unit_id?.includes(unit.id) : false;
  });

  const isEstimatedDate = dayjs(event.start.en).isAfter(dayjs());
  const isOngoing = dayjs().isBetween(
    dayjs(event.start.en),
    dayjs(event.end.en)
  );

  return (
    <Paper
      withBorder
      className={classes.eventCard}
      component={Link}
      href={`/events/${event.event_id}`}
    >
      <Box sx={{ position: "relative", flex: "1 1 30%", minWidth: 175 }}>
        <Picture
          alt={event.name[0]}
          srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
          sx={(theme) => ({
            height: "100%",
            minHeight: 150,
          })}
        />
      </Box>
      <Group className={classes.eventInfo} align="start" px="md" py="sm">
        <Box className={classes.eventInfoText}>
          <Title order={3}>
            {event.name[0]}
            {isOngoing && (
              <Badge
                ml="xs"
                color="yellow"
                variant="filled"
                size="md"
                sx={{ verticalAlign: 3 }}
              >
                Ongoing
              </Badge>
            )}
          </Title>

          <Text className={classes.eventSummary}>
            {event.intro_lines?.[0] || t("event.tbaDesc")}
          </Text>
        </Box>
        <Box className={classes.eventInfoDates}>
          <Stack spacing={0}>
            <Group spacing="xs">
              <Badge
                size="lg"
                variant="filled"
                color={
                  event.type === "song"
                    ? "grape"
                    : event.type === "shuffle"
                    ? "toya_default"
                    : "teal"
                }
                leftSection={
                  <Box mt={4}>
                    {event.type === "song" ? (
                      <IconDiamond size={14} strokeWidth={3} />
                    ) : event.type === "shuffle" ? (
                      <IconArrowsShuffle2 size={14} strokeWidth={3} />
                    ) : (
                      <IconBus size={14} strokeWidth={3} />
                    )}
                  </Box>
                }
              >
                {t(event.type)}
              </Badge>

              {eventUnits.map((unit) => (
                <ThemeIcon
                  key={unit.id}
                  color={unit.image_color}
                  sx={(theme) => ({
                    borderRadius: theme.radius.lg,
                  })}
                >
                  <IconEnstars unit={unit.id} size={14} />
                </ThemeIcon>
              ))}
            </Group>
            <Group
              sx={(theme) => ({
                rowGap: theme.spacing.xs,
                columnGap: theme.spacing.md,
              })}
              mt="xs"
            >
              <Box sx={{ flex: "1 1 0", minWidth: 185 }}>
                <Text size="xs" color="dimmed" weight={700}>
                  {t("start")} ({dayjs(event.start.en).format("z")})
                </Text>
                <Text weight={500}>{dayjs(event.start.en).format("lll")}</Text>
              </Box>
              <Box sx={{ flex: "1 1 0", minWidth: 185 }}>
                <Text size="xs" color="dimmed" weight={700}>
                  {t("end")} ({dayjs(event.end.en).format("z")})
                </Text>
                <Text weight={500}>{dayjs(event.end.en).format("lll")}</Text>
              </Box>
            </Group>

            {isEstimatedDate && (
              <Tooltip
                multiline
                width={250}
                label={t("event.estimateDesc")}
                position="bottom-start"
                withArrow
                p="sm"
              >
                <Text color="dimmed" size="xs">
                  {t("event.estimate")}
                </Text>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Group>
      {(user.loggedIn &&
        user.db.admin?.patreon &&
        user.db.admin?.patreon >= 1) ||
        (user.loggedIn && user.db.admin?.administrator && (
          <Tooltip
            label={
              !bookmarked ? t("event.addBookmark") : t("event.removeBookmark")
            }
            position="bottom"
          >
            <ActionIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                bookmarked
                  ? bookmarkHandlers.remove(bookmarks.indexOf(event.event_id))
                  : bookmarkHandlers.append(event.event_id);
              }}
              size="lg"
            >
              <IconBookmark
                fill={bookmarked ? theme.colors[theme.primaryColor][4] : "none"}
                strokeWidth={bookmarked ? 0 : isMobile ? 1 : 2}
                size={
                  !isMobile
                    ? bookmarked
                      ? 32
                      : 26
                    : isMobile && bookmarked
                    ? 44
                    : 40
                }
              />
            </ActionIcon>
          </Tooltip>
        ))}
    </Paper>
  );
}

export default EventCard;
