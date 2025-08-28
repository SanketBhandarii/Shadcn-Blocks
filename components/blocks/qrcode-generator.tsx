"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Copy, Palette, Zap } from "lucide-react"

interface QRCodeGeneratorProps {
  defaultText?: string
  colors?: string[]
  onGenerate?: (text: string, qrDataUrl: string) => void
  className?: string
}

export function QRCodeGenerator({
  defaultText = "",
  colors = [
    "#000000",
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
    "#14B8A6",
    "#F43F5E",
    "#A855F7",
    "#22C55E",
  ],
  onGenerate,
  className = "",
}: QRCodeGeneratorProps) {
  const [text, setText] = useState(defaultText)
  const [color, setColor] = useState(colors[0])
  const [copied, setCopied] = useState(false)

  const qrUrl = text.trim()
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}&color=${color.replace("#", "")}&bgcolor=ffffff`
    : ""

  useEffect(() => {
    if (text.trim() && qrUrl) onGenerate?.(text, qrUrl)
  }, [text, qrUrl, onGenerate])

  const downloadQR = async () => {
    if (!qrUrl) return
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `qr-${text.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "_")}.png`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      window.open(qrUrl, "_blank")
    }
  }

  const copyText = async () => {
    if (!text.trim()) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <Card className={`p-4 sm:p-6 bg-card border-border max-w-sm sm:max-w-md mx-auto ${className}`}>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">QR Code Generator</h3>
          <Badge variant="secondary" className="ml-auto">
            Live
          </Badge>
        </div>

        <div className="space-y-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text, URL, or message..."
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground">{text.length}/500 characters</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="text-sm font-medium">Color</span>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
            {colors.map((c) => (
              <motion.button
                key={c}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setColor(c)}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-all ${
                  color === c ? "border-primary scale-110" : "border-border"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded border border-border cursor-pointer"
          />
        </div>

        <div className="flex justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            {qrUrl ? (
              <img
                src={qrUrl || "/placeholder.svg"}
                alt="Generated QR Code"
                className="w-40 h-40 sm:w-48 sm:h-48 border border-border rounded-lg bg-white p-2"
              />
            ) : (
              <div className="w-40 h-40 sm:w-48 sm:h-48 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Type text to<br/> generate QR</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {qrUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <Button onClick={downloadQR} variant="outline" className="flex-1 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={copyText} variant="outline" className="flex-1 bg-transparent">
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy Text"}
            </Button>
          </motion.div>
        )}
      </div>
    </Card>
  )
}
