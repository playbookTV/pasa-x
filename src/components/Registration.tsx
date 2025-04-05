"use client"

import type React from "react"
import { useState } from "react"
import { PersonalDetails } from "./PersonalDetails"
import { ResumeUpload } from "./ResumeUpload"
import { PasswordSetup } from "./PasswordSetup"
import { SuccessPage } from "./SuccessPage"
import { ProgressSteps } from "./ProgressSteps"
import { Logo } from "./Logo"
import { ArrowLeft } from "lucide-react"

type RegistrationStep = "personal" | "resume" | "password" | "success"

interface RegistrationProps {
  onComplete?: (userData: {
    email: string;
    password: string;
    fullName: string;
    currentRole?: string;
  }) => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onComplete }) => {
  const [step, setStep] = useState<RegistrationStep>("personal")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    skills: [] as string[],
    currentRole: "",
    resume: null as File | null,
    password: "",
  })

  const getStepNumber = (currentStep: RegistrationStep): number => {
    const steps: RegistrationStep[] = ["personal", "resume", "password"]
    return steps.indexOf(currentStep) + 1
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (step === "personal") setStep("resume")
    else if (step === "resume") setStep("password")
    else if (step === "password") {
      setStep("success")
      // Call onComplete with user data
      if (onComplete) {
        onComplete({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          currentRole: formData.currentRole,
        });
      }
    }
  }

  const prevStep = () => {
    if (step === "resume") setStep("personal")
    else if (step === "password") setStep("resume")
  }

  const handleContinueToDashboard = () => {
    // Navigate to dashboard using a callback
    if (window && window.location) {
      window.location.href = "/dashboard";
    }
  }

  if (step === "success") {
    return <SuccessPage onContinue={handleContinueToDashboard} />
  }

  return (
    <div className="w-96 px-2.5 pt-9 pb-2.5 bg-slate-100 flex-col justify-start items-start gap-6 inline-flex">
      <Logo variant="withText" />
      <div className="self-stretch px-4 pt-4 pb-6 bg-white rounded-xl shadow-sm">
        <div className="rounded-lg flex-col justify-start items-center gap-6 flex">
          <div className="self-stretch flex items-center justify-between mb-2">
            {step !== "personal" && (
              <button
                onClick={prevStep}
                className="flex items-center gap-1 text-indigo-600 text-sm font-semibold font-['Inter']"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <div className={`w-32 ${step === "personal" ? "" : "ml-auto"}`}>
              <ProgressSteps totalSteps={3} currentStep={getStepNumber(step)} />
            </div>
          </div>
          {step === "personal" && (
            <PersonalDetails formData={formData} updateFormData={updateFormData} onNext={nextStep} />
          )}
          {step === "resume" && (
            <ResumeUpload formData={formData} updateFormData={updateFormData} onNext={nextStep} onSkip={nextStep} />
          )}
          {step === "password" && (
            <PasswordSetup formData={formData} updateFormData={updateFormData} onSubmit={nextStep} />
          )}
        </div>
      </div>
    </div>
  )
}

