"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Clock, TrendingUp, Hash, User, FileText, Command } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface SearchResult {
  id: string
  title: string
  description: string
  type: "recent" | "trending" | "suggestion" | "user" | "document"
  icon?: React.ReactNode
  category: string
}

interface SmartSearchBarProps {
  data: SearchResult[]
  placeholder?: string
  onSelect?: (result: SearchResult) => void
  onSearch?: (query: string) => void
  maxResults?: number
  showCategories?: boolean
  className?: string
}

export function SmartSearchBar({
  data,
  placeholder = "Search anything... (⌘K)",
  onSelect,
  onSearch,
  maxResults = 5,
  showCategories = true,
  className = "",
}: SmartSearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query.length > 0) {
      const filtered = data
        .filter(
          (result) =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, maxResults)
      setResults(filtered)
      setIsOpen(true)
      setSelectedIndex(-1)
      onSearch?.(query)
    } else {
      setResults(data.slice(0, 3))
      setIsOpen(query.length === 0 && document.activeElement === inputRef.current)
    }
  }, [query, data, maxResults, onSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      onSelect?.(results[selectedIndex])
      setIsOpen(false)
      setQuery("")
    } else if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "recent":
        return <Clock className="w-3 h-3" />
      case "trending":
        return <TrendingUp className="w-3 h-3" />
      case "user":
        return <User className="w-3 h-3" />
      default:
        return <Hash className="w-3 h-3" />
    }
  }

  const getDefaultIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Command className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-base bg-background border-2 focus:border-primary transition-colors"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full z-50"
          >
            <Card className="p-2 shadow-lg border-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                      }`}
                      onClick={() => {
                        onSelect?.(result)
                        setIsOpen(false)
                        setQuery("")
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {result.icon || getDefaultIcon(result.type)}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {getTypeIcon(result.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{result.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{result.description}</div>
                        </div>
                        {showCategories && (
                          <Badge variant="secondary" className="text-xs">
                            {result.category}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">No results found for "{query}"</div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
