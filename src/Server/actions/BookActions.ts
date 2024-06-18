'use server';

import { BookService } from "../Service/BookService/BookService";

export const fetchBooks = async (pageNumber: number) => {
  const bookService = new BookService();
  return await bookService.searchBook({}, pageNumber, 10);
};