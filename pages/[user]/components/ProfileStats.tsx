import {
  Group,
  ThemeIcon,
  Box,
  Text,
  DefaultMantineColor,
} from "@mantine/core";
import { IconCalendar, IconHeart } from "@tabler/icons";
import dayjs from "dayjs";

import Picture from "components/core/Picture";
import { GameCharacter, GameUnit } from "types/game";
import { UserData } from "types/makotools";
import IconEnstars from "components/core/IconEnstars";

function StatContainer({
  icon,
  iconColor,
  title,
  children,
}: {
  icon: any;
  iconColor: DefaultMantineColor;
  title: string;
  children: any;
}) {
  return (
    <Group mt="xs" noWrap align="flex-start">
      <ThemeIcon variant="light" color={iconColor} sx={{ flexShrink: 0 }}>
        {icon}
      </ThemeIcon>
      <Box>
        <Text size="xs" weight={700} color="dimmed">
          {title}
        </Text>
        {children}
      </Box>
    </Group>
  );
}

function DisplayFaves({
  faveCharas,
  faveUnits,
  characters,
  units,
}: {
  faveCharas: number[];
  faveUnits: number[];
  characters: GameCharacter[];
  units: GameUnit[];
}) {
  if (faveCharas[0] === 0 && faveUnits[0] === 0) {
    return <Text>Everyone &lt;3</Text>;
  } else if (faveCharas[0] === -1 && faveUnits[0] === -1) {
    return <Text>I hate Ensemble Stars.</Text>;
  } else {
    return (
      <Group>
        <Group spacing={0}>
          {faveCharas.map((chara: number) => {
            return (
              <Picture
                transparent
                key={chara}
                srcB2={`assets/character_sd_square1_${chara}.png`}
                alt={
                  characters.find((c) => c.character_id === chara)
                    ?.first_name[0]
                }
                fill={false}
                width={50}
                height={50}
                sx={{ pointerEvents: "none" }}
              />
            );
          })}
        </Group>
        <Group>
          {faveUnits.map((unit: number) => {
            return (
              <ThemeIcon
                key={unit}
                color={units.find((u) => u.id === unit)?.image_color}
                variant="outline"
              >
                <IconEnstars unit={unit} size={100} />
              </ThemeIcon>
            );
          })}
        </Group>
      </Group>
    );
  }
}

function ProfileStats({
  profile,
  characters,
  units,
}: {
  profile: UserData;
  characters: GameCharacter[];
  units: GameUnit[];
}) {
  return (
    <Group my={7} noWrap spacing="xl" align="flex-start">
      {profile.profile__start_playing !== "0000-00-00" && (
        <StatContainer
          icon={<IconCalendar size={16} />}
          iconColor={"yellow"}
          title={"Started Playing"}
        >
          {profile.profile__start_playing &&
            dayjs(profile.profile__start_playing).format("MMMM YYYY")}
        </StatContainer>
      )}
      {profile.profile__fave_charas &&
        profile.profile__fave_charas.length > 0 && (
          <StatContainer
            icon={<IconHeart size={16} />}
            iconColor={"pink"}
            title={"Favorites"}
          >
            {profile.profile__fave_charas && (
              <DisplayFaves
                faveCharas={profile.profile__fave_charas}
                faveUnits={profile.profile__fave_units}
                characters={characters}
                units={units}
              />
            )}
          </StatContainer>
        )}
    </Group>
  );
}

export default ProfileStats;
