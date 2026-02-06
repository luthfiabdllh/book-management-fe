"use client";

import { Book } from "@/types/book";
import { BookCard } from "./book-card";
import { Skeleton } from "@/components/ui/skeleton";

interface BookGridProps {
  books: Book[];
  isLoading: boolean;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onClick: (book: Book) => void;
}

export function BookGrid({ books, isLoading, onEdit, onDelete, onClick }: BookGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-lg">Belum ada buku</h3>
        <p className="text-muted-foreground mt-1">Mulai dengan menambahkan buku pertama Anda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
    </div>
  );
}

function BookCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}
