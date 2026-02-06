"use client";

import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isNetworkError?: boolean;
}

export function ErrorState({
  title = "Gagal memuat data",
  message = "Terjadi kesalahan saat memuat data. Silakan coba lagi.",
  onRetry,
  isNetworkError = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        {isNetworkError ? (
          <WifiOff className="w-8 h-8 text-destructive" />
        ) : (
          <AlertCircle className="w-8 h-8 text-destructive" />
        )}
      </div>
      <h3 className="font-semibold text-lg text-foreground">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Coba Lagi
        </Button>
      )}
    </div>
  );
}

interface NotFoundStateProps {
  title?: string;
  message?: string;
}

export function NotFoundState({
  title = "Tidak ditemukan",
  message = "Item yang Anda cari tidak ditemukan.",
}: NotFoundStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg text-foreground">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-md">{message}</p>
    </div>
  );
}
