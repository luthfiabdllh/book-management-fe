export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  published_year: number;
  stock: number;
  cover_image?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BooksResponse {
  data: Book[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BookQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
  order?: "asc" | "desc";
}
