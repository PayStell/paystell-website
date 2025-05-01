"use client"

import { useState, useEffect } from "react"
import { Search, CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import type { DateRange, TransactionFilter } from "@/types/transaction-types"

interface TransactionFiltersProps {
    filters: TransactionFilter
    onFilterChange: (filters: TransactionFilter) => void
    isLoading: boolean
}

export function TransactionFilters({ filters, onFilterChange, isLoading }: TransactionFiltersProps) {
    const [localFilters, setLocalFilters] = useState<TransactionFilter>(filters)
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
    const [activeFilterCount, setActiveFilterCount] = useState(0)

    // Update local filters when props change
    useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

    // Count active filters
    useEffect(() => {
        let count = 0
        if (filters.dateRange !== "7d") count++
        if (filters.status !== "all") count++
        if (filters.searchQuery) count++
        if (filters.minAmount || filters.maxAmount) count++
        setActiveFilterCount(count)
    }, [filters])

    const handleInputChange = (field: keyof TransactionFilter, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [field]: value }))
    }

    const handleDateRangeChange = (value: DateRange) => {
        setLocalFilters((prev) => ({
            ...prev,
            dateRange: value,
            // Reset custom dates if not using custom range
            ...(value !== "custom" && { startDate: "", endDate: "" }),
        }))
    }

    const handleApplyFilters = () => {
        onFilterChange(localFilters)
    }

    const handleResetFilters = () => {
        const resetFilters: TransactionFilter = {
            dateRange: "7d",
            startDate: "",
            endDate: "",
            status: "all",
            minAmount: "",
            maxAmount: "",
            searchQuery: "",
        }
        setLocalFilters(resetFilters)
        onFilterChange(resetFilters)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by transaction ID, address, or memo"
                        value={localFilters.searchQuery}
                        onChange={(e) => handleInputChange("searchQuery", e.target.value)}
                        className="pl-9 w-full"
                    />
                    {localFilters.searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                            onClick={() => handleInputChange("searchQuery", "")}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>

                <div className="flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="flex gap-2">
                                <Filter className="h-4 w-4" />
                                <span>Filters</span>
                                {activeFilterCount > 0 && (
                                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="end">
                            <div className="space-y-4">
                                <h4 className="font-medium">Filter Transactions</h4>

                                <div className="space-y-2">
                                    <Label htmlFor="date-range">Date Range</Label>
                                    <Select
                                        value={localFilters.dateRange}
                                        onValueChange={(value) => handleDateRangeChange(value as DateRange)}
                                    >
                                        <SelectTrigger id="date-range">
                                            <SelectValue placeholder="Select date range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="24h">Last 24 hours</SelectItem>
                                            <SelectItem value="7d">Last 7 days</SelectItem>
                                            <SelectItem value="30d">Last 30 days</SelectItem>
                                            <SelectItem value="90d">Last 90 days</SelectItem>
                                            <SelectItem value="all">All time</SelectItem>
                                            <SelectItem value="custom">Custom range</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {localFilters.dateRange === "custom" && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="start-date">Start Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="start-date"
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !localFilters.startDate && "text-muted-foreground",
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {localFilters.startDate ? format(new Date(localFilters.startDate), "PPP") : "Pick date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={localFilters.startDate ? new Date(localFilters.startDate) : undefined}
                                                        onSelect={(date) => handleInputChange("startDate", date ? date.toISOString() : "")}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="end-date">End Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="end-date"
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !localFilters.endDate && "text-muted-foreground",
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {localFilters.endDate ? format(new Date(localFilters.endDate), "PPP") : "Pick date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={localFilters.endDate ? new Date(localFilters.endDate) : undefined}
                                                        onSelect={(date) => handleInputChange("endDate", date ? date.toISOString() : "")}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={localFilters.status} onValueChange={(value) => handleInputChange("status", value)}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All transactions</SelectItem>
                                            <SelectItem value="success">Successful only</SelectItem>
                                            <SelectItem value="failed">Failed only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Accordion type="single" collapsible>
                                    <AccordionItem value="advanced">
                                        <AccordionTrigger className="py-2">Advanced Filters</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4 pt-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="min-amount">Min Amount (XLM)</Label>
                                                        <Input
                                                            id="min-amount"
                                                            type="number"
                                                            placeholder="0.0"
                                                            value={localFilters.minAmount}
                                                            onChange={(e) => handleInputChange("minAmount", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="max-amount">Max Amount (XLM)</Label>
                                                        <Input
                                                            id="max-amount"
                                                            type="number"
                                                            placeholder="0.0"
                                                            value={localFilters.maxAmount}
                                                            onChange={(e) => handleInputChange("maxAmount", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                <div className="flex justify-between pt-2">
                                    <Button variant="outline" size="sm" onClick={handleResetFilters} disabled={isLoading}>
                                        Reset
                                    </Button>
                                    <Button size="sm" onClick={handleApplyFilters} disabled={isLoading}>
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button onClick={handleApplyFilters} disabled={isLoading}>
                        Search
                    </Button>
                </div>
            </div>

            {/* Active filters display */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {filters.dateRange !== "7d" && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            {filters.dateRange === "custom"
                                ? `Date: ${filters.startDate ? format(new Date(filters.startDate), "MMM d") : ""} - ${filters.endDate ? format(new Date(filters.endDate), "MMM d") : ""}`
                                : filters.dateRange === "24h"
                                    ? "Last 24 hours"
                                    : filters.dateRange === "30d"
                                        ? "Last 30 days"
                                        : filters.dateRange === "90d"
                                            ? "Last 90 days"
                                            : filters.dateRange === "all"
                                                ? "All time"
                                                : `Last ${filters.dateRange}`}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 p-0"
                                onClick={() => {
                                    const newFilters: TransactionFilter = {
                                        ...filters,
                                        status: "all",
                                    }
                                    setLocalFilters(newFilters)
                                    onFilterChange(newFilters)
                                }}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {filters.status !== "all" && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Status: {filters.status === "success" ? "Successful" : "Failed"}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 p-0"
                                onClick={() => {
                                    const newFilters: TransactionFilter = {
                                        ...filters,
                                        searchQuery: "",
                                    }
                                    setLocalFilters(newFilters)
                                    onFilterChange(newFilters)
                                }}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {filters.searchQuery && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Search: {filters.searchQuery}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 p-0"
                                onClick={() => {
                                    const newFilters = { ...filters, searchQuery: "" }
                                    setLocalFilters(newFilters)
                                    onFilterChange(newFilters)
                                }}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {(filters.minAmount || filters.maxAmount) && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Amount: {filters.minAmount ? `${filters.minAmount}+ XLM` : ""}
                            {filters.minAmount && filters.maxAmount ? " to " : ""}
                            {filters.maxAmount ? `${filters.maxAmount} XLM` : ""}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 p-0"
                                onClick={() => {
                                    const newFilters = { ...filters, minAmount: "", maxAmount: "" }
                                    setLocalFilters(newFilters)
                                    onFilterChange(newFilters)
                                }}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {activeFilterCount > 1 && (
                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={handleResetFilters}>
                            Clear all
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
