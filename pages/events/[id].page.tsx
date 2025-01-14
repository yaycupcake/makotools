import {
  ActionIcon,
  Divider,
  Group,
  Paper,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBook,
  IconBookmark,
  IconCards,
  IconDiamond,
  IconMusic,
  IconVinyl,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useListState } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";

import ESPageHeader from "./components/ESPageHeader";
import PointsTable from "./components/PointsTable";
import Stories from "./components/Stories";
import SectionTitle from "./components/SectionTitle";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCard, Event, GameUnit, Scout } from "types/game";
import { QuerySuccess } from "types/makotools";
import { CardCard } from "components/core/CardCard";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import { useCollections } from "services/makotools/collection";
import NewCollectionModal from "pages/cards/components/NewCollectionModal";
import useUser from "services/firebase/user";

function Page({
  event,
  scout,
  cardsQuery,
  unitsQuery,
}: {
  event: Event;
  scout: Scout;
  cardsQuery: QuerySuccess<GameCard[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
}) {
  const { t } = useTranslation("events__event");
  const user = useUser();
  const theme = useMantineTheme();
  let cards = useMemo(() => cardsQuery.data, [cardsQuery.data]);
  let units = useMemo(() => unitsQuery.data, [unitsQuery.data]);
  const { collections, onEditCollection, onNewCollection } = useCollections();
  const [newCollectionModalOpened, setNewCollectionModalOpened] =
    useState<boolean>(false);
  const [bookmarks, handlers] = useListState<number>(
    user.loggedIn ? user.db.bookmarks__events || [] : []
  );

  cards = cards.filter((card) => {
    return event.cards?.includes(card.id);
  });

  units = units.filter(
    (unit: GameUnit) => event.unit_id && event.unit_id.includes(unit.id)
  );

  let contentItems = [
    {
      id: "#cards",
      name: t("cards"),
      icon: <IconCards size={16} strokeWidth={3} />,
    },
    {
      id: "#story",
      name: t("story"),
      icon: <IconBook size={16} strokeWidth={3} />,
    },
    {
      id: "#scout",
      name: t("scout"),
      icon: <IconDiamond size={16} strokeWidth={3} />,
    },
  ];

  if (event.type !== "tour")
    contentItems.splice(contentItems.length - 1, 0, {
      id: "#song",
      name: t("events:song"),
      icon: <IconMusic size={16} strokeWidth={3} />,
    });

  useEffect(() => {
    user.loggedIn &&
      user.db.set({
        bookmarks__events: bookmarks,
      });
  }, [bookmarks]);

  return (
    <>
      <Group>
        <PageTitle title={event.name[0]} sx={{ flex: "1 0 80%" }} />
        {((user.loggedIn &&
          user.db.admin?.patreon &&
          user.db.admin?.patreon >= 1) ||
          (user.loggedIn && user.db.admin?.administrator)) && (
          <Tooltip
            label={
              user.loggedIn
                ? bookmarks.includes(event.event_id)
                  ? t("events:event.addBookmark")
                  : t("events:event.removeBookmark")
                : t("loginBookmark")
            }
            position="bottom"
          >
            <ActionIcon
              size={60}
              disabled={!user.loggedIn}
              onClick={() => {
                bookmarks.includes(event.event_id)
                  ? handlers.remove(bookmarks.indexOf(event.event_id))
                  : handlers.append(event.event_id);
              }}
            >
              <IconBookmark
                size={60}
                fill={
                  bookmarks.includes(event.event_id)
                    ? theme.colors[theme.primaryColor][4]
                    : "none"
                }
                strokeWidth={bookmarks.includes(event.event_id) ? 0 : 2}
              />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
      <ESPageHeader content={event} units={units} />
      <SectionTitle title="Cards" id="cards" Icon={IconCards} />
      <ResponsiveGrid width={224}>
        {cards.map((card: GameCard) => (
          <CardCard
            key={card.id}
            card={card}
            cardOptions={{ showFullInfo: true }}
            collections={collections}
            lang={cardsQuery.lang}
            onEditCollection={onEditCollection}
            onNewCollection={() => setNewCollectionModalOpened(true)}
          />
        ))}
      </ResponsiveGrid>
      <Divider my="md" />
      <SectionTitle title={t("story")} id="story" Icon={IconBook} />
      <Stories content={event} />
      <Divider my="md" />
      {event.type !== "tour" && (
        <>
          <SectionTitle title={t("song")} id="song" Icon={IconVinyl} />
          <Paper p="sm" withBorder>
            <Text align="center" color="dimmed" size="sm" weight={700}>
              {t("comingSoon")}
            </Text>
          </Paper>
          <Divider my="md" />
        </>
      )}
      {scout && (
        <>
          <SectionTitle
            title={t("scoutTitle", { scout: scout.name[0] })}
            id="scout"
            Icon={IconDiamond}
          />
          <PointsTable
            id={scout.gacha_id}
            type={event.type}
            eventName={event.name[0]}
            scoutName={scout.name[0]}
            banner={scout.banner_id}
          />
        </>
      )}
      <NewCollectionModal
        // use key to reset internal form state on close
        key={JSON.stringify(newCollectionModalOpened)}
        opened={newCollectionModalOpened}
        onClose={() => setNewCollectionModalOpened(false)}
        onNewCollection={onNewCollection}
      />
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ res, locale, params }) => {
    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };

    const getEvents: any = await getLocalizedDataArray<Event>(
      "events",
      locale,
      "event_id"
    );

    const getEvent: any = getItemFromLocalizedDataArray<Event>(
      getEvents,
      parseInt(params.id),
      "event_id"
    );

    if (getEvent.status === "error") return { notFound: true };

    const getScouts: any = await getLocalizedDataArray<Scout>(
      "scouts",
      locale,
      "gacha_id"
    );

    const getScout = getItemFromLocalizedDataArray<Scout>(
      getScouts,
      getEvent.data.gacha_id as number,
      "gacha_id"
    );

    if (getScout.status === "error") return { notFound: true };

    const getUnits = await getLocalizedDataArray("units", locale, "id");

    const cards = await getLocalizedDataArray<GameCard>("cards", locale, "id", [
      "id",
      "name",
      "title",
      "type",
      "rarity",
      "stats.ir.da",
      "stats.ir.vo",
      "stats.ir.pf",
      "stats.ir4.da",
      "stats.ir4.vo",
      "stats.ir4.pf",
      "character_id",
    ]);

    const event = getEvent.data;
    const scout = getScout.data;
    const title = event.name[0];
    const breadcrumbs = ["events", title];

    return {
      props: {
        event: event,
        scout: scout,
        cardsQuery: cards,
        unitsQuery: getUnits,
        title,
        breadcrumbs,
      },
    };
  }
);

Page.getLayout = getLayout({});
export default Page;
