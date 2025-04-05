
import type React from "react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./Button"
import { useResume } from "@/hooks/use-resume"
import { Toast } from "./Toast"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface ResumeUploadProps {
  formData: {
    resume: File | null
  }
  updateFormData: (data: Partial<ResumeUploadProps["formData"]>) => void
  onNext: () => void
  onSkip: () => void
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ formData, updateFormData, onNext, onSkip }) => {
  const { uploadResume, loading, error } = useResume()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        updateFormData({ resume: acceptedFiles[0] })
      }
    },
    [updateFormData],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
  })

  const handleUpload = async () => {
    if (!formData.resume) return
    
    try {
      await uploadResume(formData.resume)
      setToastMessage("Resume uploaded successfully")
      setToastType("success")
      setShowToast(true)
      onNext()
    } catch (err) {
      setToastMessage(err instanceof Error ? err.message : "Failed to upload resume")
      setToastType("error")
      setShowToast(true)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="self-stretch text-stone-950 text-2xl font-bold font-['Inter']">Upload Resume</h2>
      <div
        {...getRootProps()}
        className="self-stretch h-52 px-3 py-2 bg-white rounded-lg border border-zinc-200 flex-col justify-center items-center gap-2.5 flex cursor-pointer"
      >
        <input {...getInputProps()} />
        <svg height="63" width="63" fill="none" viewBox="0 0 63 63" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.6868 7.85547C13.416 10.1236 13.416 13.7791 13.416 21.0847V41.7514C13.416 49.0571 13.416 52.7125 15.6868 54.9806C17.9549 57.2514 21.6103 57.2514 28.916 57.2514H34.0827C41.3884 57.2514 45.0438 57.2514 47.3119 54.9806C49.5827 52.7125 49.5827 49.0571 49.5827 41.7514V21.0847C49.5827 13.7791 49.5827 10.1236 47.3119 7.85547C45.0438 5.58472 41.3884 5.58472 34.0827 5.58472H28.916C21.6103 5.58472 17.9549 5.58472 15.6868 7.85547ZM21.8118 44.3347C21.8118 43.8209 22.016 43.328 22.3793 42.9647C22.7427 42.6013 23.2355 42.3972 23.7493 42.3972H31.4993C32.0132 42.3972 32.506 42.6013 32.8694 42.9647C33.2327 43.328 33.4368 43.8209 33.4368 44.3347C33.4368 44.8486 33.2327 45.3414 32.8694 45.7047C32.506 46.0681 32.0132 46.2722 31.4993 46.2722H23.7493C23.2355 46.2722 22.7427 46.0681 22.3793 45.7047C22.016 45.3414 21.8118 44.8486 21.8118 44.3347ZM23.7493 32.0639C23.2355 32.0639 22.7427 32.268 22.3793 32.6314C22.016 32.9947 21.8118 33.4875 21.8118 34.0014C21.8118 34.5152 22.016 35.0081 22.3793 35.3714C22.7427 35.7348 23.2355 35.9389 23.7493 35.9389H39.2494C39.7632 35.9389 40.256 35.7348 40.6194 35.3714C40.9827 35.0081 41.1869 34.5152 41.1869 34.0014C41.1869 33.4875 40.9827 32.9947 40.6194 32.6314C40.256 32.268 39.7632 32.0639 39.2494 32.0639H23.7493ZM21.8118 23.6681C21.8118 23.1542 22.016 22.6614 22.3793 22.298C22.7427 21.9347 23.2355 21.7306 23.7493 21.7306H39.2494C39.7632 21.7306 40.256 21.9347 40.6194 22.298C40.9827 22.6614 41.1869 23.1542 41.1869 23.6681C41.1869 24.1819 40.9827 24.6747 40.6194 25.0381C40.256 25.4014 39.7632 25.6056 39.2494 25.6056H23.7493C23.2355 25.6056 22.7427 25.4014 22.3793 25.0381C22.016 24.6747 21.8118 24.1819 21.8118 23.6681Z"
            fill="url(#paint0_linear_273_8464)"
            fillOpacity="0.87"
            fillRule="evenodd"
          />
          <path
            d="M14.0231 10.9011C13.416 13.1822 13.416 16.3752 13.416 21.0846V41.7513C13.416 46.4607 13.416 49.6511 14.0231 51.9348L13.416 51.8883C10.8973 51.6403 9.2026 51.0797 7.93677 49.8139C5.66602 47.5457 5.66602 43.8903 5.66602 36.5846V26.2513C5.66602 18.943 5.66602 15.2902 7.93677 13.022C9.2026 11.7562 10.8973 11.1956 13.416 10.9476L14.0231 10.9011ZM48.9756 51.9348C49.5827 49.6511 49.5827 46.4581 49.5827 41.7513V21.0846C49.5827 16.3752 49.5827 13.1822 48.9756 10.9011L49.5827 10.9476C52.1014 11.1956 53.7961 11.7562 55.0619 13.022C57.3327 15.2902 57.3327 18.9405 57.3327 26.2487V36.582C57.3327 43.8929 57.3327 47.5431 55.0619 49.8139C53.7961 51.0797 52.1014 51.6403 49.5827 51.8883L48.9756 51.9348Z"
            fill="#C4B3DD"
            opacity="0.47"
          />
          <defs>
            <linearGradient
              id="paint0_linear_273_8464"
              gradientUnits="userSpaceOnUse"
              x1="31.4993"
              x2="31.4993"
              y1="5.58472"
              y2="57.2514"
            >
              <stop />
              <stop offset="1" stopColor="#5433EB" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex-col justify-start items-start gap-1.5 flex">
          <div className="w-44 text-center">
            <span className="text-zinc-500 text-xs font-medium font-['Inter']">
              {isDragActive ? "Drop your resume here" : formData.resume ? "File selected" : "Drag your resume here or "}
            </span>
            {!formData.resume && !isDragActive && (
              <span className="text-indigo-600 text-xs font-bold font-['Inter']">click to upload</span>
            )}
            {!formData.resume && (
              <span className="text-zinc-500 text-xs font-medium font-['Inter']"> from your PC</span>
            )}
          </div>
          <div className="w-44 text-center text-zinc-500/40 text-xs font-medium font-['Inter']">(PDF, DOC, DOCX)</div>
        </div>
      </div>
      
      {formData.resume && (
        <div className="text-sm text-gray-600">
          Selected file: {formData.resume.name} ({Math.round(formData.resume.size / 1024)} KB)
        </div>
      )}
      
      <Button
        type="button"
        variant="primary"
        size="large"
        className="w-full"
        onClick={handleUpload}
        disabled={!formData.resume || loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload resume"
        )}
      </Button>
      
      <div className="self-stretch h-px border border-black/20" />
      
      <Button 
        type="button" 
        variant="secondary" 
        size="large" 
        className="w-full" 
        onClick={onSkip}
        disabled={loading}
      >
        Skip for now
      </Button>
      
      {showToast && (
        <Toast
          message={toastMessage}
          icon={toastType === 'success' ? <CheckCircle className="text-green-500" /> : <AlertCircle className="text-red-500" />}
          title={toastType === 'success' ? 'Success' : 'Error'}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}

