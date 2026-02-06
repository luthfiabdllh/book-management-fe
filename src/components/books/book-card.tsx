"use client";

import Image from "next/image";
import { Book } from "@/types/book";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, BookOpen } from "lucide-react";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onClick: (book: Book) => void;
}

export function BookCard({ book, onEdit, onDelete, onClick }: BookCardProps) {
  const isOutOfStock = book.stock === 0;

  return (
    <Card
      data-testid="book-card"
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 overflow-hidden py-0"
      onClick={() => onClick(book)}
    >
      {/* Cover Image */}
      <div className="relative h-40 bg-muted">
        {book.cover_image ? (
          <Image
            src={book.cover_image}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5">
            <BookOpen className="w-12 h-12 text-primary/30" />
          </div>
        )}
        {/* Dropdown overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(book);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(book);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-base font-semibold line-clamp-2 leading-tight">
          {book.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
        {book.isbn && (
          <p className="text-xs text-muted-foreground mt-1">ISBN: {book.isbn}</p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0 pb-3">
        <span className="text-xs text-muted-foreground">{book.published_year}</span>
        <Badge variant={isOutOfStock ? "destructive" : "secondary"}>
          {isOutOfStock ? "Habis" : `Stok: ${book.stock}`}
        </Badge>
      </CardFooter>
    </Card>
  );
}
