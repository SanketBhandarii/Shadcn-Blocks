"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Circle, ArrowRight } from "lucide-react"

interface Step {
  title: string
  description: string
}

interface ProgressStepsProps {
  steps: Step[]
  initialStep?: number
  onStepChange?: (step: number) => void
  onComplete?: () => void
  className?: string
}

export function ProgressSteps({
  steps,
  initialStep = 0,
  onStepChange,
  onComplete,
  className = "",
}: ProgressStepsProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      onStepChange?.(newStep)
    } else {
      onComplete?.()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      onStepChange?.(newStep)
    }
  }

  return (
    <Card className={`p-8 max-w-2xl mx-auto ${className}`}>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((_, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStep
                      ? "border-primary text-primary"
                      : "border-muted text-muted-foreground"
                }`}
                initial={false}
                animate={{
                  scale: index === currentStep ? 1.1 : 1,
                }}
              >
                {index < currentStep ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5 fill-current" />}
              </motion.div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-16 mx-2 transition-colors ${index < currentStep ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground text-center">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-semibold mb-2">{steps[currentStep].title}</h3>
        <p className="text-muted-foreground">{steps[currentStep].description}</p>
      </motion.div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={nextStep} disabled={currentStep === steps.length - 1} className="group">
          {currentStep === steps.length - 1 ? "Complete" : "Next"}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  )
}
