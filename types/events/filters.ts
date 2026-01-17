// types/events/filters.ts

export enum EventCategory {
  Finance = 120,
  // Elections = 144,
  Economy = 100328,
  Politics = 2,
  World = 101970,
  Crypto = 21,
  Tech = 1401,
  Geopolitics = 100265,
}
export const EventCategorySlug: Record<EventCategory, string> = {
  [EventCategory.Finance]: "finance",
  // [EventCategory.Elections]: 'elections',
  [EventCategory.Economy]: "economy",
  [EventCategory.Politics]: "politics",
  [EventCategory.World]: "world",
  [EventCategory.Crypto]: "crypto",
  [EventCategory.Tech]: "tech",
  [EventCategory.Geopolitics]: "geopolitics",
};

export type SortBy =
  | "volumeTotal"
  | "volume24hr"
  | "volume1wk"
  | "volume1mo"
  | "volume1yr"
  | "liquidity";

export type SortOrder = "asc" | "desc";

export type EndingIn = "7d" | "14d" | "1mo" | "3mo" | "6mo" | "1yr";

export interface EventsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: EventCategory[]; // 👈 supports array
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  endingIn?: EndingIn;
}
