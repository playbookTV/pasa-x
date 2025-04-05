"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string
  className?: string
  isTagInput?: boolean
  tags?: string[]
  onTagsChange?: (tags: string[]) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  className,
  isTagInput = false,
  tags: externalTags,
  onTagsChange,
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>("")
  const [tags, setTags] = useState<string[]>(externalTags || [])

  // Sync with external tags if provided
  useEffect(() => {
    if (externalTags) {
      setTags(externalTags)
    }
  }, [externalTags])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (!isTagInput) {
      onChange?.(e)
      return
    }

    // Check if the user entered a comma
    if (value.endsWith(",")) {
      const newTag = value.slice(0, -1).trim()
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag]
        setTags(newTags)
        onTagsChange?.(newTags)
        setInputValue("")
      } else {
        setInputValue("")
      }
    } else {
      onChange?.(e)
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(newTags)
    onTagsChange?.(newTags)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isTagInput) return

    // Handle backspace to remove the last tag when input is empty
    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      const newTags = [...tags]
      newTags.pop()
      setTags(newTags)
      onTagsChange?.(newTags)
    }
  }

  return (
    <div className={cn("min-h-[4rem] flex-col justify-start items-start gap-1.5 flex w-full", className)}>
      <label
        htmlFor={props.id || props.name}
        className="text-slate-900 text-sm font-medium font-['Inter'] leading-tight"
      >
        {label}
      </label>
      <div className="self-stretch min-h-10 justify-start items-start gap-1.5 inline-flex">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-1.5 inline-flex">
          <div className="self-stretch px-3 py-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] border border-slate-200 flex items-center w-full min-h-[2.5rem] flex-wrap gap-1">
            {isTagInput &&
              tags.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 rounded-md text-indigo-700 text-xs font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-indigo-400 hover:text-indigo-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            <input
              {...props}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={cn(
                "text-slate-900 text-base font-normal font-['Inter'] leading-normal placeholder-slate-400 focus:outline-none",
                isTagInput && tags.length > 0 ? "w-auto flex-grow" : "w-full h-full",
              )}
              placeholder={isTagInput && tags.length > 0 ? "" : props.placeholder || label}
            />
          </div>
        </div>
      </div>
      {isTagInput && <div className="text-xs text-slate-500 mt-1">Type a skill and press comma to add it</div>}
    </div>
  )
}

