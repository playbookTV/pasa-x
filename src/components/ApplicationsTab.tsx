"use client"

import type React from "react"
import { useState } from "react"
import { SearchBar } from "./SearchBar"
import { FilterButton } from "./FilterButton"
import { ApplicationItemCompact } from "./ApplicationItemCompact"

type ApplicationStatus = "all" | "applied" | "interview" | "offer" | "rejected" | "screening"

interface Application {
  company: string
  date: string
  jobTitle: string
  status: string
}

export const ApplicationsTab: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample applications data
  const applications: Application[] = [
    {
      company: "MOZILLA",
      date: "12 NOV.24",
      jobTitle: "Senior staff designer",
      status: "OFFER",
    },
    {
      company: "MOZILLA",
      date: "12 NOV.24",
      jobTitle: "Senior staff designer",
      status: "DECLINED",
    },
    {
      company: "MOZILLA",
      date: "12 NOV.24",
      jobTitle: "Senior staff designer",
      status: "APPLIED",
    },
    {
      company: "MOZILLA",
      date: "12 NOV.24",
      jobTitle: "Senior staff designer",
      status: "INTERVIEW",
    },
    {
      company: "MOZILLA",
      date: "12 NOV.24",
      jobTitle: "Senior staff designer",
      status: "SCREENING",
    },
  ]

  // Filter applications based on active filter and search query
  const filteredApplications = applications.filter((app) => {
    const matchesFilter = activeFilter === "all" || app.status.toLowerCase() === activeFilter.toLowerCase()
    const matchesSearch =
      searchQuery === "" ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="self-stretch inline-flex flex-col justify-start items-start gap-6">
      {/* Header and Search */}
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="self-stretch justify-center text-neutral-800 text-xl font-bold font-['Inter']">
          My Applications
        </div>
        <div className="self-stretch inline-flex justify-start items-start gap-4">
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Filters and Applications List */}
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        {/* Filter Buttons */}
        <div className="inline-flex justify-start items-start gap-2.5">
          <FilterButton label="All" active={activeFilter === "all"} onClick={() => setActiveFilter("all")} />
          <FilterButton
            label="Applied"
            active={activeFilter === "applied"}
            onClick={() => setActiveFilter("applied")}
          />
          <FilterButton
            label="Interview"
            active={activeFilter === "interview"}
            onClick={() => setActiveFilter("interview")}
          />
          <FilterButton label="Offer" active={activeFilter === "offer"} onClick={() => setActiveFilter("offer")} />
          <FilterButton
            label="Rejected"
            active={activeFilter === "rejected"}
            onClick={() => setActiveFilter("rejected")}
          />
        </div>

        {/* Applications List */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          {filteredApplications.map((app, index) => (
            <ApplicationItemCompact
              key={index}
              company={app.company}
              date={app.date}
              jobTitle={app.jobTitle}
              status={app.status}
              className="self-stretch px-4"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

