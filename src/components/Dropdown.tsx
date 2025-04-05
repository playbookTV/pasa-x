"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [triggerWidth, setTriggerWidth] = useState(0)

  useEffect(() => {
    if (dropdownRef.current) {
      setTriggerWidth(dropdownRef.current.offsetWidth)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue)
      setIsOpen(false)
    },
    [onChange],
  )

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={cn("h-16 w-full flex-col justify-start items-start gap-1.5 flex", className)} ref={dropdownRef}>
      <label className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight">{label}</label>
      <div className="relative w-full">
        <button
          className="w-full h-10 px-3 py-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] border border-slate-200 justify-between items-center inline-flex"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`${label}-label`}
        >
          <span className="text-slate-900 text-base font-normal font-['Inter'] leading-normal truncate">
            {selectedOption ? selectedOption.label : "Select an option"}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
        </button>
        {isOpen && (
          <ul
            className="absolute z-10 w-full mt-1 py-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto"
            role="listbox"
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={cn(
                  "px-3 py-2 text-slate-900 text-base font-normal font-['Inter'] leading-normal cursor-pointer hover:bg-slate-100",
                  option.value === value && "bg-slate-100",
                )}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

