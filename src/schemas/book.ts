import { z } from "zod";

// ISBN-13 regex pattern
const isbn13Regex = /^(?:ISBN(?:-13)?:?\s?)?(?=[0-9]{13}$|(?=(?:[0-9]+[-\s]){4})[-\s0-9]{17}$)97[89][-\s]?[0-9]{1,5}[-\s]?[0-9]+[-\s]?[0-9]+[-\s]?[0-9]$/;

export const bookSchema = z.object({
  title: z.string().min(1, "Judul tidak boleh kosong"),
  author: z.string().min(1, "Penulis tidak boleh kosong"),
  isbn: z.string().min(1, "ISBN tidak boleh kosong").regex(isbn13Regex, "ISBN tidak valid (format ISBN-13)"),
  published_year: z.number()
    .int("Tahun terbit harus berupa angka bulat")
    .max(new Date().getFullYear(), `Tahun terbit tidak boleh lebih dari ${new Date().getFullYear()}`),
  stock: z.number()
    .int("Stok harus berupa angka bulat")
    .min(0, "Stok tidak boleh kurang dari 0"),
  cover_image: z.string().min(1, "URL gambar wajib diisi").url("Cover image harus berupa URL yang valid"),
});

export type BookFormValues = z.infer<typeof bookSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
