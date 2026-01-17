import { IEvent } from "@/types/events/state";
import { Market } from "@/types";
import { EventCategory, EventCategorySlug } from "@/types/events/filters";

const CATEGORY_LOOKUP = new Map<number, string>(
  Object.entries(EventCategory)
    .filter(([, v]) => typeof v === "number")
    .map(([k, v]) => [v as number, EventCategorySlug[v as EventCategory]]),
);

/**
 * Converts an Event into a Market-compatible object
 * so existing UI does NOT need to change.
 */
export function eventToMarket(event: IEvent): Market {
  // ----- CATEGORY -----
  const category =
    event.tagIds?.map((id) => CATEGORY_LOOKUP.get(id)).find(Boolean) ?? "Other";

  // ----- PROBABILITY -----
  let probabilityYes = 0;
  let probabilityNo = 0;

  const firstMarket = event.markets?.[0];

  if (firstMarket?.outcomes && firstMarket?.outcomePrices) {
    try {
      const outcomes = JSON.parse(firstMarket.outcomes);
      const prices = JSON.parse(firstMarket.outcomePrices);

      const yesIndex = outcomes.indexOf("Yes");
      const noIndex = outcomes.indexOf("No");

      probabilityYes = yesIndex !== -1 ? Number(prices[yesIndex]) * 100 : 0;

      probabilityNo = noIndex !== -1 ? Number(prices[noIndex]) * 100 : 0;
    } catch {
      // silently fail, UI will show 0/100
    }
  }

  return {
    id: event.eventId,
    question: event.title,
    slug: event.slug,
    category,
    probabilityYes,
    probabilityNo,
    liquidity: event.liquidity,
    volume24h: event.volume24hr,
    volumeTotal: event.volumeTotal,
    endDate: event.endDate,
    status: "active", // events are active by default
    change24h: null, // not available in events API
  };
}
