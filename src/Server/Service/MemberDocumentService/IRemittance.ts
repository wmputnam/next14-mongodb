export interface IRemittance {
  id: string;  // in mongo db this is an ObjectId
  date: Date;
  amount: string;
  memo: string;
};