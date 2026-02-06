"use client";

import Image from "next/image";
import { Book } from "@/types/book";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pencil, BookOpen, Calendar, Package, Hash } from "lucide-react";

interface ViewBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onEdit: () => void;
}

export function ViewBookDialog({
  open,
  onOpenChange,
  book,
  onEdit,
}: ViewBookDialogProps) {
  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Detail Buku
          </DialogTitle>
          <DialogDescription>Informasi lengkap tentang buku ini</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cover Image */}
          {book.cover_image && (
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
              <Image
                src={book.cover_image}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 500px) 100vw, 500px"
              />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {!book.cover_image && (
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg leading-tight">{book.title}</h3>
                <p className="text-muted-foreground">{book.author}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              {book.isbn && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ISBN:</span>
                  <span>{book.isbn}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tahun:</span>
                <span>{book.published_year}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Stok:</span>
                <Badge variant={book.stock === 0 ? "destructive" : "secondary"}>
                  {book.stock} unit
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
            <Button onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
