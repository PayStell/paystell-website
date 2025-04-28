"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
  onNext: () => void
  onPrevious: () => void
  isLoading: boolean
  totalItems: number
}

export function Pagination({
  currentPage,
  hasNext,
  hasPrev,
  onNext,
  onPrevious,
  isLoading,
  totalItems,
}: PaginationProps) {
  return (
    <div className="flex items-center gap-5 justify-between">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{totalItems}</span> transactions
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!hasPrev || isLoading}
          className="h-8 w-8 p-0 sm:h-9 sm:w-9 sm:px-10 sm:py-0 text-xs"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        <div className="text-sm font-medium px-2">Page {currentPage}</div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!hasNext || isLoading}
          className="h-8 w-8 p-0 sm:h-9 sm:w-9 sm:px-10 sm:py-0"
        >
          <span className="hidden sm:inline">Nxt</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
