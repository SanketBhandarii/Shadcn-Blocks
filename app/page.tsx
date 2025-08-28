"use client";

import {
  SmartSearchBar,
  type SearchResult,
} from "@/components/blocks/smart-search-bar";
import {
  InteractiveTimeline,
  type TimelineEvent,
} from "@/components/blocks/interactive-timeline";
import { AnimatedCounter } from "@/components/blocks/animated-counter";
import {
  QRCodeGenerator,
} from "@/components/blocks/qrcode-generator";
import { ColorPalettePicker } from "@/components/blocks/color-palette-picker";
import { FileText, UserIcon, TrendingUp, Hash } from "lucide-react";

export default function Home() {
  const counterStats = [
    { label: "Active Users", value: 12543, prefix: "", suffix: "+" },
    { label: "Revenue", value: 89750, prefix: "$", suffix: "" },
    { label: "Growth Rate", value: 24, prefix: "", suffix: "%" },
  ];

  const cardData = {
    title: "Interactive Card Component",
    description:
      "A beautiful, animated card component with hover effects and interactive elements.",
    badge: "Component",
    rating: 4.9,
    features: [
      "Fully responsive design",
      "Smooth animations",
      "Dark mode support",
    ],
  };

  const progressSteps = [
    {
      title: "Account Setup",
      description: "Create your account and verify email",
    },
    {
      title: "Profile Information",
      description: "Add your personal and business details",
    },
    {
      title: "Preferences",
      description: "Configure your app preferences",
    },
    {
      title: "Integration",
      description: "Connect your favorite tools",
    },
    {
      title: "Complete",
      description: "You're all set to get started!",
    },
  ];

  const colorPalettes = [
    {
      name: "Ocean Breeze",
      colors: [
        { hex: "#0EA5E9", name: "Sky Blue" },
        { hex: "#06B6D4", name: "Cyan" },
        { hex: "#10B981", name: "Emerald" },
        { hex: "#3B82F6", name: "Blue" },
        { hex: "#8B5CF6", name: "Violet" },
      ],
    },
    {
      name: "Sunset Glow",
      colors: [
        { hex: "#F59E0B", name: "Amber" },
        { hex: "#EF4444", name: "Red" },
        { hex: "#EC4899", name: "Pink" },
        { hex: "#F97316", name: "Orange" },
        { hex: "#84CC16", name: "Lime" },
      ],
    },
    {
      name: "Monochrome",
      colors: [
        { hex: "#000000", name: "Black" },
        { hex: "#374151", name: "Gray 700" },
        { hex: "#6B7280", name: "Gray 500" },
        { hex: "#D1D5DB", name: "Gray 300" },
        { hex: "#FFFFFF", name: "White" },
      ],
    },
  ];

  const searchData: SearchResult[] = [
    {
      id: "1",
      title: "React Hooks Guide",
      description: "Complete guide to React hooks and best practices",
      type: "recent",
      icon: <FileText className="w-4 h-4" />,
      category: "Documentation",
    },
    {
      id: "2",
      title: "John Doe",
      description: "Senior Developer",
      type: "user",
      icon: <UserIcon className="w-4 h-4" />,
      category: "People",
    },
    {
      id: "3",
      title: "TypeScript Best Practices",
      description: "Modern TypeScript patterns and techniques",
      type: "trending",
      icon: <TrendingUp className="w-4 h-4" />,
      category: "Tutorial",
    },
    {
      id: "4",
      title: "API Documentation",
      description: "REST API endpoints and usage examples",
      type: "document",
      icon: <FileText className="w-4 h-4" />,
      category: "Documentation",
    },
    {
      id: "5",
      title: "Design System",
      description: "Component library guidelines and standards",
      type: "suggestion",
      icon: <Hash className="w-4 h-4" />,
      category: "Design",
    },
  ];
  // Sample data for the timeline component
  const sampleTabs = [
    { id: "all", label: "All Events", value: "all" },
    { id: "work", label: "Work", value: "work" },
    { id: "personal", label: "Personal", value: "personal" },
    { id: "milestone", label: "Milestones", value: "milestone" },
  ];

  const sampleTimelineData = [
    {
      id: "1",
      title: "Project Launch",
      description:
        "Successfully launched the new product with great user feedback.",
      date: "2024-01-15",
      type: "work",
      details: ["Product launch", "User feedback", "Market response"],
    },
    {
      id: "2",
      title: "Team Expansion",
      description:
        "Hired 5 new talented developers to strengthen our engineering team.",
      date: "2024-02-20",
      type: "work",
      details: ["Hiring process", "Team growth", "Engineering culture"],
    },
    {
      id: "3",
      title: "Personal Achievement",
      description: "Completed marathon training and ran my first 26.2 miles.",
      date: "2024-03-10",
      type: "personal",
      details: ["Training", "Marathon", "Personal goal"],
    },
    {
      id: "4",
      title: "Major Milestone",
      description:
        "Reached 1 million users on our platform - a huge achievement!",
      date: "2024-04-05",
      type: "milestone",
      details: ["User growth", "Platform success", "Business milestone"],
    },
  ];

  const qrColors = [
    "#000000",
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
  ];

  return (
    <div className="min-h-screen bg-background p-8 space-y-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-16 text-balance">
          Shadcn Blocks Built ( by sanket )
        </h1>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-semibold mb-8">
              Color Palette Picker
            </h2>
            <ColorPalettePicker
              predefinedPalettes={colorPalettes}
              onColorCopy={(hex) => console.log("Color copied:", hex)}
              onPaletteChange={(palette) =>
                console.log("Palette changed:", palette.name)
              }
              onCustomColorAdd={(color) =>
                console.log("Custom color added:", color)
              }
              showCustomInput={true}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-8">Animated Counter</h2>
            <AnimatedCounter stats={counterStats} duration={2} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-8">QR Code Generator</h2>
            <QRCodeGenerator
              defaultText="https://shadcnblocks.com"
              colors={qrColors}
              onGenerate={(text, qrDataUrl) =>
                console.log("QR generated for:", text)
              }
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-8">Smart Search Bar</h2>
            <SmartSearchBar
              data={searchData}
              placeholder="Search documentation, people, and more..."
              onSelect={(result) => console.log("Selected:", result)}
              onSearch={(query) => console.log("Searching:", query)}
              maxResults={8}
              showCategories={true}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-8">
              Interactive Timeline
            </h2>
            <InteractiveTimeline
              events={sampleTimelineData}
              tabs={sampleTabs}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
