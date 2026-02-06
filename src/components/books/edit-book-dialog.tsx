"use client";

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
import { Pencil } from "lucide-react";

interface EditBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onSubmit: (data: BookFormValues) => void;
  isLoading?: boolean;
}

export function EditBookDialog({
  open,
  onOpenChange,
  book,
  onSubmit,
  isLoading,
}: EditBookDialogProps) {
  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            Edit Buku
          </DialogTitle>
          <DialogDescription>
            Ubah informasi buku sesuai kebutuhan
          </DialogDescription>
        </DialogHeader>

        <BookForm
          book={book}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
