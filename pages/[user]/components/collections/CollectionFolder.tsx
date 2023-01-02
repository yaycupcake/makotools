import {
  Accordion,
  Box,
  Button,
  Group,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";

import CollectionCard from "./CollectionCard";
import { ICONS } from "./icons";
import PRIVACY_LEVELS from "./privacyLevels";

import { CardCollection, CollectedCard } from "types/makotools";
import ResponsiveGrid from "components/core/ResponsiveGrid";

function CollectionFolder({
  collection,
  isYourProfile,
}: {
  collection: CardCollection;
  isYourProfile: boolean | undefined;
}) {
  const theme = useMantineTheme();

  const ICON_STYLE = {
    borderRadius: theme.radius.lg,
  };

  const icon = ICONS[collection.icon || 0];
  const privacy = PRIVACY_LEVELS[collection.privacyLevel];
  return (
    <Accordion.Item value={collection.id}>
      <Accordion.Control py="xs" px="md">
        <Group noWrap>
          <Text color={icon.color} inline>
            <icon.component {...icon.props} />
          </Text>
          <Box>
            <Text size="md" weight={800}>
              {collection.name}
              {isYourProfile && (
                <Tooltip
                  label={
                    <Text size="xs" weight={500}>
                      {privacy.description}
                    </Text>
                  }
                  position="top"
                  withinPortal
                >
                  <Text
                    inline
                    span
                    ml="xs"
                    sx={{ verticalAlign: -2 }}
                    color="dimmed"
                  >
                    <privacy.icon size={16} />
                  </Text>
                </Tooltip>
              )}
            </Text>
            <Text size="xs" weight={500} color="dimmed">
              {collection.cards.length} cards in collection
            </Text>
          </Box>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {collection.cards && collection.cards.length > 0 ? (
          <ResponsiveGrid width={100}>
            {collection.cards
              .filter((c: CollectedCard) => c.count)
              .map((c: CollectedCard) => (
                <CollectionCard key={c.id} card={c} />
              ))}
          </ResponsiveGrid>
        ) : (
          <Stack align="flex-start">
            <Text color="dimmed">This collection is empty.</Text>
            <Button variant="outline" component={Link} href="/cards">
              Add some cards!
            </Button>
          </Stack>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default CollectionFolder;