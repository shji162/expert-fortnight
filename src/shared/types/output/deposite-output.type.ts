export type DepositeStatus = 'ACTIVE' | 'RETURNED' | 'WRITTEN_OFF';

export type DepositeOutput = {
  id: string;
  userId: string;
  auctionId: string;
  deposite: number;
  status: DepositeStatus;
};