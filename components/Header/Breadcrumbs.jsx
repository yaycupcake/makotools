import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Breadcrumbs,
  Anchor,
  Text,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons";

function PageAnchor(props) {
  return <Anchor {...props} />;
}

function BreadcrumbsApp() {
  const theme = useMantineTheme();
  const location = useRouter();
  const [pathnames, setPathnames] = useState(
    location.asPath.split("/").filter((x) => x)
  );

  useEffect(() => {
    setPathnames(location.asPath.split("/").filter((x) => x));
    // console.log(location);
    // console.log(pathnames);
  }, [location]);

  return (
    <Text
      size="xs"
      transform="capitalize"
      weight="500"
      // sx={{ fontFamily: theme.headings.fontFamily }}
    >
      <Breadcrumbs
        separator={
          <IconChevronRight
            size={12}
            style={{
              marginLeft: -theme.spacing.xs / 2,
              marginRight: -theme.spacing.xs / 2,
            }}
          />
        }
      >
        <Link href="/" passHref>
          <PageAnchor inherit>Ensemble Square</PageAnchor>
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <Link key={value} href={to} passHref>
              <PageAnchor inherit>{decodeURIComponent(value)}</PageAnchor>
            </Link>
          );
        })}
      </Breadcrumbs>
    </Text>
  );
}

export default BreadcrumbsApp;