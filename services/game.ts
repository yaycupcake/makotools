import { DEFAULT_LOCALE } from "./makotools/locales";

import { Locale, NameOrder } from "types/makotools";
import { Stats } from "types/game";

export const MAX_CARD_COPIES = 5;

// https://en.wikipedia.org/wiki/Personal_name#Eastern_name_order
const lastFirstLocales: Locale[] = ["ja", "zh-CN", "zh-TW", "ko"];
export function getNameOrder(
  { first_name, last_name }: { first_name: string; last_name: string },
  setting?: NameOrder,
  locale?: Locale | string
): string;
export function getNameOrder(
  { first_name, last_name }: { first_name: string[]; last_name: string[] },
  setting?: NameOrder,
  locale?: Locale | string
): string;
export function getNameOrder(
  {
    first_name,
    last_name,
  }:
    | { first_name: string; last_name: string }
    | { first_name: string[]; last_name: string[] },
  setting: NameOrder = "lastfirst",
  locale: Locale | string = DEFAULT_LOCALE
  //   string accepted bc nextjs always returns locale as string
): string {
  const firstName = Array.isArray(first_name)
    ? first_name[0] || ""
    : first_name || "";
  const lastName = Array.isArray(last_name)
    ? last_name[0] || ""
    : last_name || "";

  if (lastFirstLocales.includes(locale as Locale))
    return `${lastName}${firstName}`;

  if (setting === "lastfirst") return `${lastName} ${firstName}`.trim();

  return `${firstName} ${lastName}`.trim();
}

export function sumStats(stats: Stats | any, fallback = "?"): number | string {
  if (!stats?.da || !stats?.vo || !stats?.pf) return fallback;
  const sum = stats.da + stats.vo + stats.pf;
  return sum;
}
