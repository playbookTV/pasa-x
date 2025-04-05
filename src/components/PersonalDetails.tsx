"use client"

import type React from "react"
import { TextInput } from "./TextInput"
import { Dropdown } from "./Dropdown"
import { Button } from "./Button"

interface PersonalDetailsProps {
  formData: {
    fullName: string
    email: string
    skills: string[]
    currentRole: string
  }
  updateFormData: (data: Partial<PersonalDetailsProps["formData"]>) => void
  onNext: () => void
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ formData, updateFormData, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  const handleSkillsChange = (skills: string[]) => {
    updateFormData({ skills })
  }

  const roleOptions = [
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "manager", label: "Manager" },
    { value: "other", label: "Other" },
  ]

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <h2 className="text-stone-950 text-2xl font-bold font-['Inter']">Create Account</h2>
      <div className="space-y-4">
        <TextInput
          label="Full name"
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          placeholder="Full name"
          required
        />
        <TextInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder="Email"
          required
        />
        <TextInput
          label="Skills"
          isTagInput
          tags={formData.skills}
          onTagsChange={handleSkillsChange}
          placeholder="Type skills and press comma to add"
          required
        />
        <Dropdown
          label="Current role"
          options={roleOptions}
          value={formData.currentRole}
          onChange={(value) => updateFormData({ currentRole: value })}
          placeholder="Select role"
        />
      </div>
      <div className="space-y-4 pt-2">
        <Button type="submit" variant="primary" size="large" className="w-full">
          Continue
        </Button>
        <Button type="button" variant="secondary-colored" size="large" className="w-full">
          Sign in
        </Button>
      </div>
    </form>
  )
}

