export interface Banner {
  _id: string;
  title: string;
  image: string;
  [key: string]: unknown;
}

type AsyncStatusValue = "idle" | "pending" | "fulfilled" | "rejected";

interface AsyncStatus {
  status: AsyncStatusValue;
  error: string | null | undefined;
}

export interface BannerState {
  banners: Banner[];
  bannersHistory: Banner[];
  backendResponse?: Banner;
  fetch: AsyncStatus;
  create: AsyncStatus;
  update: AsyncStatus;
  delete: AsyncStatus;
}
