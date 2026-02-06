"use client";

import Image from "next/image";
import { Book } from "@/types/book";
import { BookFormValues } from "@/schemas/book";
import { BookForm } from "./book-form";
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
import { useState } from "react";
import { Pencil, BookOpen, Calendar, Package, Hash } from "lucide-react";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
  mode: "create" | "view" | "edit";
  onSubmit: (data: BookFormValues) => void;
  isLoading?: boolean;
}

export function BookDialog({
  open,
  onOpenChange,
  book,
  mode,
  onSubmit,
  isLoading,
}: BookDialogProps) {
  const [currentMode, setCurrentMode] = useState(mode);

  // Reset mode when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentMode(mode);
    }
    onOpenChange(open);
  };

  const handleSubmit = (data: BookFormValues) => {
    onSubmit(data);
  };

  const title = {
    create: "Tambah Buku Baru",
    view: "Detail Buku",
    edit: "Edit Buku",
  }[currentMode];

  const description = {
    create: "Isi form di bawah untuk menambahkan buku baru ke perpustakaan",
    view: "Informasi lengkap tentang buku ini",
    edit: "Ubah informasi buku sesuai kebutuhan",
  }[currentMode];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {currentMode === "view" && book ? (
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
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Tutup
              </Button>
              <Button onClick={() => setCurrentMode("edit")}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        ) : (
          <BookForm
            book={currentMode === "edit" ? book : null}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onCancel={() => handleOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
