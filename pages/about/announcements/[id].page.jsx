import Head from "next/head";

import { Text, Box, TypographyStylesProvider } from "@mantine/core";

import Layout, { getLayout } from "../../../components/Layout";
import PageTitle from "../../../components/PageTitle";
import ImageViewer from "../../../components/core/ImageViewer";

import Reactions from "../../../components/core/Reactions";

function Page({ post }) {
  console.log(post);
  return (
    <>
      <PageTitle title={post.title.rendered} />
      <TypographyStylesProvider
        className="wordpress-style"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        sx={(theme) => ({
          figcaption: {
            fontSize: theme.fontSizes.xs,
            color: theme.other.getDimmed(theme),
          },
        })}
      />
    </>
  );
}

Page.getLayout = getLayout({});
export default Page;

export async function getServerSideProps({ res, locale, params }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=7200, stale-while-revalidate=172800"
  );

  try {
    const initRespose = await fetch(
      `https://backend-stars.ensemble.moe/wp-main/wp-json/wp/v2/posts/${params.id}`
    );
    const post = await initRespose.json();

    return {
      props: {
        post,
        meta: { title: post.title.rendered },
      },
    };
  } catch {
    return { notFound: true };
  }
}
