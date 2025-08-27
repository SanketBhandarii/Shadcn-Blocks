"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface CounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}

function Counter({ end, duration = 2, prefix = "", suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

interface AnimatedCounterProps {
  stats: Array<{
    label: string
    value: number
    prefix?: string
    suffix?: string
  }>
  duration?: number
  className?: string
}

export function AnimatedCounter({ stats, duration = 2, className = "" }: AnimatedCounterProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-primary ">
              <Counter end={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} duration={duration} />
            </div>
            <p className="text-muted-foreground">{stat.label}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
