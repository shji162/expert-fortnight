import type { Status } from '../enums/status.enum';

export type AuctionOutput = {
  id: string;
  userId: string;
  name: string;
  description: string;
  minPrice: number;
  currentPrice: number;
  priceStep: number;
  depositAmount: number;
  expiresIn: string;
  category: string;
  status: Status;
};