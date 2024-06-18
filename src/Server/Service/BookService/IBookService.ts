export type IBook = {
  // ... (book properties)
};

export interface IBookService {
  searchBook(filter: Partial<IBook>): Promise<{ data: IBook[], totalCount: number }>;
}