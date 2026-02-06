import axiosInstance from "@/lib/axios";
import { Book, BooksResponse, BookQueryParams } from "@/types/book";
import { BookFormValues } from "@/schemas/book";

interface BackendBooksResponse {
  data: Book[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}

export async function fetchBooks(params: BookQueryParams = {}): Promise<BooksResponse> {
  const { page = 1, limit = 12, search, orderBy = "title", order = "asc" } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);
  queryParams.append("orderBy", orderBy);
  queryParams.append("order", order);

  const response = await axiosInstance.get<BackendBooksResponse>(`/books?${queryParams.toString()}`);
  
  // Map backend response to frontend format
  return {
    data: response.data.data,
    meta: {
      page: response.data.meta.page,
      limit,
      total: response.data.meta.total,
      totalPages: response.data.meta.last_page,
    },
  };
}

export async function fetchBook(id: string): Promise<Book> {
  const response = await axiosInstance.get<Book>(`/books/${id}`);
  return response.data;
}

export async function createBook(data: BookFormValues): Promise<Book> {
  const response = await axiosInstance.post<Book>("/books", data);
  return response.data;
}

export async function updateBook(id: string, data: Partial<BookFormValues>): Promise<Book> {
  const response = await axiosInstance.patch<Book>(`/books/${id}`, data);
  return response.data;
}

export async function deleteBook(id: string): Promise<void> {
  await axiosInstance.delete(`/books/${id}`);
}
