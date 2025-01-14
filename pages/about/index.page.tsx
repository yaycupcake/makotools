import {
  Blockquote,
  Box,
  NavLink,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBook2,
  IconGavel,
  IconHeart,
  IconHeartHandshake,
  IconLanguageHiragana,
  IconNews,
  IconSpy,
} from "@tabler/icons-react";
import Link from "next/link";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import Picture from "components/core/Picture";
import useTranslation from "next-translate/useTranslation";

function Page() {
  const { t } = useTranslation("about");
  const theme = useMantineTheme();
  const bannerBlue =
    theme.colorScheme === "dark"
      ? theme.colors[theme.primaryColor][9]
      : theme.colors[theme.primaryColor][5];
  const backgroundColor =
    theme.colorScheme === "dark"
      ? theme.colors.dark[8]
      : theme.fn.lighten(theme.colors.gray[0], 0.5);
  return (
    <>
      <Box
        sx={(theme) => ({
          maxWidth: "100%",
          overflow: "visible",
          marginBottom: 25,
          "&:after": {
            content: "''",
            display: "block",
            borderRight: `solid 100vw ${backgroundColor}`,
            borderBottom: `solid 48px ${backgroundColor}`,
            borderLeft: `solid 100vw transparent`,
            borderTop: `solid 48px transparent`,
            marginLeft: "-100vw",
            // transform: "translateY(-50%)",
            zIndex: 3,
            position: "absolute",
            top: "calc(50vh - 80px)",
          },
        })}
      >
        <Box
          sx={(theme) => ({
            height: "50vh",
            // minHeight: 200,
            background: bannerBlue,
            marginTop: -16 - 32,
            width: "500%",
            marginLeft: "-200%",
            paddingLeft: "200%",
            paddingRight: "200%",
            paddingTop: 48,
            color: "white",
            paddingBottom: 48,
          })}
        >
          <Picture
            srcB2="assets/card_still_full1_3117_normal.png"
            alt="Makoto streaming"
            sx={{
              position: "absolute",
              width: "calc(100vw - var(--mantine-navbar-width))",
              height: "50vh",
              left: 0,
              top: 0,
              img: {
                objectPosition: "top",
                objectFit: "cover",
              },
              ":before": {
                content: "''",
                position: "absolute",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(#0009, #0000 20%, #0000 60%, #000C)",
                zIndex: 2,
              },
            }}
          />
          <Stack sx={{ height: "100%" }}>
            <Box sx={{ flexGrow: 1 }} />
            <PageTitle
              title={t("title")}
              space={16}
              sx={{
                overflow: "visible",
                zIndex: 5,
              }}
            />
          </Stack>
        </Box>
      </Box>
      <Blockquote icon={<IconBook2 />} pt={0}>
        <Text size="xl">{t("tagline")}</Text>
      </Blockquote>

      <Stack spacing={0}>
        {[
          {
            link: "announcements",
            name: t("linkNames.announcements"),
            icon: IconNews,
          },
          {
            link: "guidelines",
            name: t("linkNames.guidelines"),
            icon: IconHeartHandshake,
          },
          {
            link: "translations",
            name: t("linkNames.translations"),
            icon: IconLanguageHiragana,
          },
          {
            link: "acknowledgements",
            name: t("linkNames.acknowledgements"),
            icon: IconHeart,
          },
          { link: "privacy", name: t("linkNames.privacy"), icon: IconSpy },
          { link: "terms", name: t("linkNames.terms"), icon: IconGavel },
        ].map((l) => (
          <NavLink
            component={Link}
            href={`/about/${l.link}`}
            icon={
              <ThemeIcon variant="light">
                <l.icon size={18} />
              </ThemeIcon>
            }
            key={l.link}
            label={<Text weight={500}>{l.name}</Text>}
            variant="subtle"
            active
            sx={(theme) => ({ borderRadius: theme.radius.sm })}
          />
        ))}
      </Stack>
    </>
  );
}

Page.getLayout = getLayout({
  headerProps: {
    forceLight: true,
  },
});
export default Page;
