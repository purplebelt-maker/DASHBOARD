export interface IEvent {
  eventId: string; // 👈 renamed from `id`

  title: string;
  slug: string;
  description?: string;

  startDate: string;
  endDate: string;

  liquidity: number;
  volume24hr: number;
  volumeTotal: number;

  volume1wk?: number;
  volume1mo?: number;
  volume1yr?: number;

  marketCount: number;

  markets: Record<string, any>[];
  tagIds: number[];
  categoryId: number;
  categorySlug: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface IEventResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  results: IEvent[];
}

export interface IEventState {
  data: null | IEventResponse;
  loading: boolean;
}
