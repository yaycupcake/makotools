import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getData, getB2File, getLocalizedData } from "../../services/ensquare";
import Layout from "../../components/Layout";
import Title from "../../components/PageTitle";
import Head from "next/head";
import ImageViewer from "../../components/core/ImageViewer";
import {
  Text,
  Box,
  BackgroundImage,
  Image,
  Group,
  AspectRatio,
  Badge,
  useMantineTheme,
} from "@mantine/core";
import { IconStar } from "@tabler/icons";
import attributes from "../../components/cards/attributes.json";

function Character({ cards, characters, i, characterID }) {
  // const { id } = useParams();
  // const router = useRouter();
  // const { id } = router.query;
  const theme = useMantineTheme();
  const card = cards.main.data[i];
  const cardLocalizedMain = cards.localized[0].data[i];
  const character = characters.main.data[characterID];
  const characterLocalizedMain = characters.localized[0].data[characterID];
  console.log(card);
  return (
    <>
      <Head>
        {/* <title>{`${character.first_name} ${character.last_name} - EnSquare`}</title> */}
        {/* <meta name="description" content={character.introduction} /> */}
      </Head>
      <Title
        title={
          <>
            ({cardLocalizedMain.title}) {characterLocalizedMain.last_name}{" "}
            {characterLocalizedMain.first_name}
            <Group mt="sm" spacing="xs">
              <Badge size="xl" color="yellow" sx={{ textTransform: "none" }}>
                {card.rarity}
                <IconStar
                  size={13}
                  strokeWidth={3}
                  style={{ verticalAlign: -1 }}
                />
              </Badge>
              <Badge
                size="xl"
                color={attributes[card.type].color}
                sx={{ textTransform: "none" }}
              >
                {attributes[card.type].fullname}
              </Badge>
            </Group>
            {/* <Paper
              component={Box}
              sx={{
                position: "absolute",
                bottom: -2,
                right: -12.5,
                borderTopLeftRadius: theme.radius.sm,
                transform: "skew(-15deg)",
                pointerEvents: "none",
                borderBottom: `solid 2px ${
                  characters.find((c) => c.character_id === card.character_id)
                    .image_color
                }`,
              }}
              pl={10}
              pr={20}
              py={2}
              radius={0}
            >
              <Text
                size="xs"
                weight="700"
                sx={{
                  transform: "skew(15deg)",
                }}
              >{`${cardMainLang?.name?.split(" ")?.[0]}`}</Text>
            </Paper> */}
          </>
        }
      ></Title>
      <Group>
        {["normal", "evolution"].map((type) => (
          <AspectRatio
            ratio={3 / 4}
            key={type}
            sx={{ minHeight: 10, flexGrow: 1 }}
          >
            <ImageViewer
              radius="md"
              alt={card.title}
              withPlaceholder
              src={getB2File(`assets/card_rectangle4_${card.id}_${type}.png`)}
              // width={240}
            ></ImageViewer>
          </AspectRatio>
        ))}
      </Group>
    </>
  );
}

export default Character;

export async function getServerSideProps({ req, res, locale }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=7200, stale-while-revalidate=172800"
  );
  // refresh every 2 hours, stale for 48hrs
  // console.log(locale);

  const cards = await getLocalizedData("cards", locale);
  const characters = await getLocalizedData("characters", locale);
  const { data: cardsJP } = await getData("cards", "ja");
  const urlSegments = req.url.split("/");
  const lastURLSegment = decodeURIComponent(urlSegments[urlSegments.length - 1])
    .toLocaleLowerCase()
    .trim();
  const cardID = parseInt(lastURLSegment, 10);
  // console.log(lastSegment);
  const cardIndex = cardsJP.indexOf(
    cardsJP.find(
      isNaN(cardID)
        ? (item) => `${item.title}`.toLocaleLowerCase() === lastURLSegment
        : (item) => item.id === cardID
    )
  );
  // console.log();
  const characterID = characters.main.data.indexOf(
    characters.main.data.find(
      (c) =>
        c.character_id ===
        cards.main.data.find((c) => c.id === cardID).character_id
    )
  );

  // console.log(charactersEN);
  return {
    props: { cards, characters, i: cardIndex, characterID },
  };
}

Character.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
