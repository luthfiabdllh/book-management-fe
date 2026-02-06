"use client";

import { Suspense, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from "@/hooks/use-books";
import { useDebounce } from "@/hooks/use-debounce";
import { Book, BookQueryParams } from "@/types/book";
import { BookFormValues } from "@/schemas/book";
import { BookGrid } from "@/components/books/book-grid";
import { ViewBookDialog } from "@/components/books/view-book-dialog";
import { CreateBookDialog } from "@/components/books/create-book-dialog";
import { EditBookDialog } from "@/components/books/edit-book-dialog";
import { Pagination } from "@/components/shared/pagination";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, SortAsc, SortDesc, ArrowUpDown, RefreshCw, Rows3 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

function BooksPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL params
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;
  const search = searchParams.get("search") || "";
  const orderBy = searchParams.get("orderBy") || "title";
  const order = (searchParams.get("order") as "asc" | "desc") || "asc";

  // Local state
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Separate dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Selected book for view/edit/delete
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Query params
  const queryParams: BookQueryParams = {
    page,
    limit,
    search: debouncedSearch || undefined,
    orderBy,
    order,
  };

  // Hooks
  const { data, isLoading, isError, refetch } = useBooks(queryParams);
  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();
  const deleteMutation = useDeleteBook();

  // Update URL
  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/books?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    updateParams({ search: value || undefined, page: "1" });
  };

  // Handle sort
  const handleSort = (newOrderBy: string, newOrder: "asc" | "desc") => {
    updateParams({ orderBy: newOrderBy, order: newOrder, page: "1" });
  };

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    updateParams({ limit: newLimit.toString(), page: "1" });
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage.toString() });
  };

  // Handle create
  const handleCreate = () => {
    setCreateDialogOpen(true);
  };

  // Handle view
  const handleView = (book: Book) => {
    setSelectedBook(book);
    setViewDialogOpen(true);
  };

  // Handle edit (from card or view dialog)
  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setViewDialogOpen(false);
    setEditDialogOpen(true);
  };

  // Handle switch from view to edit
  const handleSwitchToEdit = () => {
    setViewDialogOpen(false);
    setEditDialogOpen(true);
  };

  // Handle delete
  const handleDelete = (book: Book) => {
    setSelectedBook(book);
    setDeleteDialogOpen(true);
  };

  // Create book submit
  const handleCreateSubmit = async (data: BookFormValues) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Buku berhasil ditambahkan");
      setCreateDialogOpen(false);
    } catch {
      toast.error("Gagal menambahkan buku");
    }
  };

  // Edit book submit
  const handleEditSubmit = async (data: BookFormValues) => {
    if (!selectedBook) return;
    try {
      await updateMutation.mutateAsync({ id: selectedBook.id, data });
      toast.success("Buku berhasil diperbarui");
      setEditDialogOpen(false);
      setSelectedBook(null);
    } catch {
      toast.error("Gagal memperbarui buku");
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedBook) return;

    try {
      await deleteMutation.mutateAsync(selectedBook.id);
      toast.success("Buku berhasil dihapus");
      setDeleteDialogOpen(false);
      setSelectedBook(null);
    } catch {
      toast.error("Gagal menghapus buku");
    }
  };

  const books = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Buku</h1>
          <p className="text-muted-foreground">
            {data?.meta?.total
              ? `Total ${data.meta.total} buku tersedia`
              : "Kelola koleksi buku perpustakaan"}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Buku
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari buku..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Urutkan</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("title", "asc")}>
                <SortAsc className="mr-2 h-4 w-4" />
                Judul (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("title", "desc")}>
                <SortDesc className="mr-2 h-4 w-4" />
                Judul (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("published_year", "desc")}>
                <SortDesc className="mr-2 h-4 w-4" />
                Tahun Terbaru
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("published_year", "asc")}>
                <SortAsc className="mr-2 h-4 w-4" />
                Tahun Terlama
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("stock", "desc")}>
                <SortDesc className="mr-2 h-4 w-4" />
                Stok Terbanyak
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Rows3 className="h-4 w-4" />
                <span className="hidden sm:inline">{limit}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[8, 12, 16, 20].map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => handleLimitChange(value)}
                  className={limit === value ? "bg-accent" : ""}
                >
                  {value} per halaman
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Book Grid or Error State */}
      {isError ? (
        <ErrorState
          title="Gagal memuat buku"
          message="Terjadi kesalahan saat memuat daftar buku. Silakan coba lagi."
          onRetry={() => refetch()}
          isNetworkError
        />
      ) : (
        <>
          <BookGrid
            books={books}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClick={handleView}
          />

          {/* Pagination */}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      {/* View Book Dialog */}
      <ViewBookDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        book={selectedBook}
        onEdit={handleSwitchToEdit}
      />

      {/* Create Book Dialog */}
      <CreateBookDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isLoading={createMutation.isPending}
      />

      {/* Edit Book Dialog */}
      <EditBookDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        book={selectedBook}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Buku</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus buku &quot;{selectedBook?.title}&quot;? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function BooksPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<BooksPageSkeleton />}>
      <BooksPageContent />
    </Suspense>
  );
}
