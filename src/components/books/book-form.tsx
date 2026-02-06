"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookSchema, BookFormValues } from "@/schemas/book";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ImageIcon, AlertCircle } from "lucide-react";

interface BookFormProps {
  book?: Book | null;
  onSubmit: (data: BookFormValues) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function BookForm({ book, onSubmit, isLoading, onCancel }: BookFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(book?.cover_image || null);
  const [imageError, setImageError] = useState(false);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || "",
      author: book?.author || "",
      isbn: book?.isbn || "",
      published_year: book?.published_year || new Date().getFullYear(),
      stock: book?.stock || 0,
      cover_image: book?.cover_image || "",
    },
  });

  // Watch cover_image field for live preview
  const coverImageValue = form.watch("cover_image");

  useEffect(() => {
    if (coverImageValue && coverImageValue.startsWith("http")) {
      setImagePreview(coverImageValue);
      setImageError(false);
    } else {
      setImagePreview(null);
    }
  }, [coverImageValue]);

  const handleSubmit = (data: BookFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Live Image Preview */}
        <div className="relative h-40 w-full rounded-lg overflow-hidden bg-muted">
          {imagePreview && !imageError ? (
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 500px) 100vw, 500px"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              {imageError ? (
                <>
                  <AlertCircle className="w-10 h-10 mb-2 text-destructive/50" />
                  <span className="text-sm text-destructive/70">Gambar tidak dapat dimuat</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <span className="text-sm">Preview Cover</span>
                </>
              )}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="cover_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Cover Image (Opsional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  disabled={isLoading} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Buku</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan judul buku" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Penulis</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama penulis" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isbn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISBN</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan ISBN" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="published_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahun Terbit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2024"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stok</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Batal
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : book ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Buku"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
