"use client";

import { BookFormValues } from "@/schemas/book";
import { BookForm } from "./book-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface CreateBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BookFormValues) => void;
  isLoading?: boolean;
}

export function CreateBookDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateBookDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Tambah Buku Baru
          </DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk menambahkan buku baru ke perpustakaan
          </DialogDescription>
        </DialogHeader>

        <BookForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
