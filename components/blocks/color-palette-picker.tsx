"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Palette, Shuffle } from "lucide-react"

interface Color {
  hex: string
  name: string
}

interface ColorPalette {
  name: string
  colors: Color[]
}

interface ColorPalettePickerProps {
  predefinedPalettes: ColorPalette[]
  onColorCopy?: (hex: string) => void
  onPaletteChange?: (palette: ColorPalette) => void
  onCustomColorAdd?: (color: Color) => void
  showCustomInput?: boolean
  className?: string
}

export function ColorPalettePicker({
  predefinedPalettes,
  onColorCopy,
  onPaletteChange,
  onCustomColorAdd,
  showCustomInput = true,
  className = "",
}: ColorPalettePickerProps) {
  const [selectedPalette, setSelectedPalette] = useState(predefinedPalettes[0])
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [customColor, setCustomColor] = useState("#3B82F6")

  const copyToClipboard = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopiedColor(hex)
      setTimeout(() => setCopiedColor(null), 2000)
      onColorCopy?.(hex)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const generateRandomPalette = () => {
    const colors: Color[] = []
    for (let i = 0; i < 5; i++) {
      const hex =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")
      colors.push({ hex: hex.toUpperCase(), name: `Color ${i + 1}` })
    }
    const randomPalette = { name: "Random Palette", colors }
    setSelectedPalette(randomPalette)
    onPaletteChange?.(randomPalette)
  }

  const addCustomColor = () => {
    const newColor: Color = {
      hex: customColor.toUpperCase(),
      name: "Custom",
    }
    const updatedPalette = {
      ...selectedPalette,
      colors: [...selectedPalette.colors.slice(0, 4), newColor],
    }
    setSelectedPalette(updatedPalette)
    onCustomColorAdd?.(newColor)
    onPaletteChange?.(updatedPalette)
  }

  const getContrastColor = (hex: string) => {
    const r = Number.parseInt(hex.slice(1, 3), 16)
    const g = Number.parseInt(hex.slice(3, 5), 16)
    const b = Number.parseInt(hex.slice(5, 7), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? "#000000" : "#FFFFFF"
  }

  const handlePaletteSelect = (palette: ColorPalette) => {
    setSelectedPalette(palette)
    onPaletteChange?.(palette)
  }

  return (
    <div className={`max-w-2xl mx-auto space-y-6 ${className}`}>
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Palette Picker
            </CardTitle>
            <Button variant="outline" size="sm" onClick={generateRandomPalette}>
              <Shuffle className="h-4 w-4 mr-2" />
              Random
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {predefinedPalettes.map((palette) => (
              <Button
                key={palette.name}
                variant={selectedPalette.name === palette.name ? "default" : "outline"}
                size="sm"
                onClick={() => handlePaletteSelect(palette)}
              >
                {palette.name}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">{selectedPalette.name}</h3>
            <div className="grid grid-cols-5 gap-3">
              {selectedPalette.colors.map((color, index) => (
                <motion.div
                  key={`${color.hex}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div
                    className="aspect-square rounded-lg cursor-pointer border-2 border-border/20 hover:border-border transition-colors relative group"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyToClipboard(color.hex)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedColor === color.hex ? (
                        <Check className="h-5 w-5" style={{ color: getContrastColor(color.hex) }} />
                      ) : (
                        <Copy className="h-5 w-5" style={{ color: getContrastColor(color.hex) }} />
                      )}
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-medium">{color.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {color.hex}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {showCustomInput && (
            <div className="flex gap-2">
              <Input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-16 h-10 p-1 border-border/50"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#3B82F6"
                className="flex-1"
              />
              <Button onClick={addCustomColor} variant="outline">
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
