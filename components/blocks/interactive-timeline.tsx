"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, Users, Award, Briefcase, GraduationCap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: string
  location?: string
  participants?: number
  details: string[]
  image?: string
}

export interface TimelineTab {
  id: string
  label: string
  value: string
}

interface InteractiveTimelineProps {
  events: TimelineEvent[]
  tabs?: TimelineTab[]
  showFilters?: boolean
  onEventSelect?: (event: TimelineEvent) => void
  className?: string
  iconMap?: Record<string, any>
  colorMap?: Record<string, string>
}

const defaultIconMap = {
  work: Briefcase,
  education: GraduationCap,
  achievement: Award,
  milestone: Calendar,
} as const

const defaultColorMap = {
  work: "bg-blue-500",
  education: "bg-green-500",
  achievement: "bg-yellow-500",
  milestone: "bg-purple-500",
} as const

export function InteractiveTimeline({
  events,
  tabs,
  showFilters = true,
  onEventSelect,
  className = "",
  iconMap = defaultIconMap,
  colorMap = defaultColorMap,
}: InteractiveTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const { filteredData, availableTabs } = useMemo(() => {
    const filtered = filter === "all" ? events : events.filter((event) => event.type === filter)
    const tabsToUse =
      tabs ||
      Array.from(new Set(events.map((event) => event.type))).map((type) => ({
        id: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
      }))
    return { filteredData: filtered, availableTabs: tabsToUse }
  }, [events, filter, tabs])

  const handleEventClick = (event: TimelineEvent) => {
    const newSelectedId = selectedEvent === event.id ? null : event.id
    setSelectedEvent(newSelectedId)
    if (newSelectedId && onEventSelect) {
      onEventSelect(event)
    }
  }

  const handleFilterChange = (newFilter: string) => {
    setSelectedEvent(null)
    setFilter(newFilter)
  }

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 ${className}`}>
      {showFilters && availableTabs.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("all")}
            className="transition-all duration-300 ease-out"
          >
            All
          </Button>
          {availableTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={filter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(tab.value)}
              className="transition-all duration-300 ease-out"
            >
              {tab.label}
            </Button>
          ))}
        </motion.div>
      )}

      <div className="relative">
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-border/60" />

        <motion.div className="space-y-3 sm:space-y-4" layout transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
          {filteredData.map((event, index) => {
            const IconComponent = iconMap[event.type] || Calendar
            const colorClass = colorMap[event.type] || "bg-gray-500"

            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="relative flex items-start gap-4 sm:gap-6"
              >
                <div className={`relative z-10 w-3 h-3 sm:w-4 sm:h-4 rounded-full ${colorClass} flex-shrink-0 mt-3`}>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-current opacity-30"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />
                </div>

                <div className="flex-1 pb-3 sm:pb-4">
                  <Card
                    className={`cursor-pointer transition-all duration-500 ease-out ${
                      selectedEvent === event.id
                        ? "shadow-lg transform translate-y-[-2px]"
                        : "hover:shadow-md hover:transform hover:translate-y-[-1px]"
                    }`}
                    onClick={() => handleEventClick(event)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={`p-2 rounded-lg ${colorClass} text-white flex-shrink-0 transition-all duration-300`}
                          >
                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-base sm:text-lg text-balance">{event.title}</h3>
                            <p className="text-muted-foreground text-sm sm:text-base text-pretty">
                              {event.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-auto">
                          <Badge variant="outline" className="font-mono text-xs sm:text-sm">
                            {event.date}
                          </Badge>
                        </div>
                      </div>

                      {(event.location || event.participants) && (
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4">
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                          {event.participants && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>{event.participants} people</span>
                            </div>
                          )}
                        </div>
                      )}

                      <AnimatePresence mode="wait">
                        {selectedEvent === event.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4">
                              <h4 className="font-medium mb-3 text-sm sm:text-base">Key Highlights:</h4>
                              <ul className="space-y-2">
                                {event.details.map((detail, idx) => (
                                  <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: idx * 0.1,
                                      duration: 0.4,
                                      ease: [0.4, 0, 0.2, 1],
                                    }}
                                    className="flex items-start gap-2 text-xs sm:text-sm"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                                    <span className="text-pretty">{detail}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}