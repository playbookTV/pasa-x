"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search applications", onSearch, className }) => {
  const [query, setQuery] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("self-stretch inline-flex justify-start items-start gap-2", className)}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-80 px-3 py-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] outline outline-1 outline-violet-100 text-slate-900 text-sm font-normal font-['Inter'] leading-normal placeholder:text-slate-400 focus:outline-indigo-300 focus:outline-2"
      />
      <button
        type="submit"
        className="flex-1 self-stretch px-2 py-3 bg-gradient-to-b from-indigo-600 to-indigo-700 rounded-sm shadow-[0px_1px_3px_0px_rgba(143,39,9,0.20)] shadow-[0px_0px_0px_1px_rgba(53,22,191,1.00)] shadow-[inset_0px_-1px_0px_0px_rgba(53,22,191,1.00)] shadow-[inset_0px_1px_0px_0px_rgba(117,127,248,1.00)] flex justify-center items-center gap-2 overflow-hidden"
      >
        <div className="text-center justify-center text-white text-sm font-semibold font-['Inter']">Search</div>
      </button>
    </form>
  )
}

