export type Auction = {
  userId: string;
  name: string;
  description: string;
  minPrice: number;
  priceStep: number;
  depositAmount: number;
  expiresIn: Date;
  category: string;
};