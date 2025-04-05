"use client"

import type React from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "./Button"

interface SuccessPageProps {
  onContinue: () => void
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onContinue }) => {
  return (
    <div className="w-full h-full p-2.5 bg-white flex">
      <div className="grow shrink basis-0 self-stretch px-10 pt-24 pb-8 bg-indigo-600 rounded-lg flex-col justify-start items-start gap-9 inline-flex">
        <div className="self-stretch h-56 flex-col justify-start items-center gap-3.5 flex">
          <div className="w-16 h-16 relative">
            <CheckCircle size={56} className="text-white" />
          </div>
          <h2 className="self-stretch text-center text-white text-2xl font-bold font-['Inter']">
            Your profile has been created
          </h2>
          <p className="self-stretch text-center text-white text-base font-normal font-['Inter'] leading-normal">
            Welcome to Pasa: your passport to advancing your career. We've sent you a welcome email - it's purely for
            record keeping, you can go ahead and go to the dashboard.
          </p>
        </div>
        <div className="self-stretch h-12 flex-col justify-start items-start gap-6 flex">
          <Button
            variant="secondary"
            size="large"
            className="w-full bg-white text-indigo-600 hover:bg-indigo-50"
            onClick={onContinue}
          >
            Continue to dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

