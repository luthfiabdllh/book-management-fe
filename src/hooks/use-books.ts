"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBooks, fetchBook, createBook, updateBook, deleteBook } from "@/lib/queries/books";
import { BookQueryParams } from "@/types/book";
import { BookFormValues } from "@/schemas/book";

export function useBooks(params: BookQueryParams = {}) {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => fetchBooks(params),
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ["books", id],
    queryFn: () => fetchBook(id),
    enabled: !!id,
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookFormValues) => createBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BookFormValues> }) =>
      updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
