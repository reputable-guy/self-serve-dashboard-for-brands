"use client";

/**
 * Brand Settings Component
 * 
 * Allows brands to customize their export settings:
 * - Primary & secondary colors
 * - Logo upload & placement
 * - Font selection
 */

import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Palette, Type, Image as ImageIcon } from "lucide-react";
import type { BrandSettings } from "./carousel-templates";

// ============================================
// CONSTANTS
// ============================================

export const COLOR_PRESETS = [
  { name: "Reputable Teal", value: "#00D1C1" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#059669" },
  { name: "Orange", value: "#EA580C" },
  { name: "Pink", value: "#DB2777" },
  { name: "Red", value: "#DC2626" },
  { name: "Indigo", value: "#4F46E5" },
];

export const FONT_OPTIONS = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
];

export const LOGO_POSITIONS: { value: BrandSettings["logoPosition"]; label: string }[] = [
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
];

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  primaryColor: "#00D1C1",
  secondaryColor: "#10B981",
  textColor: "#1F2937",
  backgroundColor: "#F9FAFB",
  logoPosition: "top-right",
  fontFamily: "Inter, sans-serif",
};

// ============================================
// TYPES
// ============================================

interface BrandSettingsPanelProps {
  settings: BrandSettings;
  onChange: (settings: BrandSettings) => void;
  compact?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function BrandSettingsPanel({
  settings,
  onChange,
  compact = false,
}: BrandSettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(settings.logoUrl);

  const handleColorChange = (key: keyof BrandSettings, value: string) => {
    onChange({ ...settings, [key]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setLogoPreview(dataUrl);
        onChange({ ...settings, logoUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    onChange({ ...settings, logoUrl: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Colors Row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">Primary:</Label>
            <div className="flex gap-1">
              {COLOR_PRESETS.slice(0, 6).map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleColorChange("primaryColor", preset.value)}
                  className={`h-6 w-6 rounded-full border-2 transition-all ${
                    settings.primaryColor === preset.value
                      ? "border-gray-900 scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Logo Position */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">Logo:</Label>
            <Select
              value={settings.logoPosition}
              onValueChange={(value) =>
                onChange({ ...settings, logoPosition: value as BrandSettings["logoPosition"] })
              }
            >
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOGO_POSITIONS.map((pos) => (
                  <SelectItem key={pos.value} value={pos.value}>
                    {pos.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Colors Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Colors</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Primary Color */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Primary</Label>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-wrap">
                {COLOR_PRESETS.slice(0, 4).map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleColorChange("primaryColor", preset.value)}
                    className={`h-7 w-7 rounded-full border-2 transition-all ${
                      settings.primaryColor === preset.value
                        ? "border-gray-900 scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                  />
                ))}
              </div>
              <Input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                className="w-20 h-7 text-xs font-mono"
                placeholder="#00D1C1"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Secondary</Label>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-wrap">
                {COLOR_PRESETS.slice(4, 8).map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleColorChange("secondaryColor", preset.value)}
                    className={`h-7 w-7 rounded-full border-2 transition-all ${
                      settings.secondaryColor === preset.value
                        ? "border-gray-900 scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                  />
                ))}
              </div>
              <Input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                className="w-20 h-7 text-xs font-mono"
                placeholder="#10B981"
              />
            </div>
          </div>

          {/* Text Color */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Text</Label>
            <Input
              type="text"
              value={settings.textColor}
              onChange={(e) => handleColorChange("textColor", e.target.value)}
              className="w-full h-8 text-xs font-mono"
              placeholder="#1F2937"
            />
          </div>

          {/* Background Color */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Background</Label>
            <Input
              type="text"
              value={settings.backgroundColor}
              onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
              className="w-full h-8 text-xs font-mono"
              placeholder="#F9FAFB"
            />
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Logo</h4>
        </div>

        <div className="flex items-start gap-4">
          {/* Logo Preview/Upload */}
          <div className="flex-shrink-0">
            {logoPreview ? (
              <div className="relative">
                <div className="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-gray-400 transition-colors"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Upload</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          {/* Logo Position */}
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-1.5 block">Position</Label>
            <Select
              value={settings.logoPosition}
              onValueChange={(value) =>
                onChange({ ...settings, logoPosition: value as BrandSettings["logoPosition"] })
              }
            >
              <SelectTrigger className="w-full h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOGO_POSITIONS.map((pos) => (
                  <SelectItem key={pos.value} value={pos.value}>
                    {pos.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Verification badge appears in opposite corner
            </p>
          </div>
        </div>
      </div>

      {/* Typography Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Typography</h4>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Font Family</Label>
          <Select
            value={settings.fontFamily}
            onValueChange={(value) => onChange({ ...settings, fontFamily: value })}
          >
            <SelectTrigger className="w-full h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(DEFAULT_BRAND_SETTINGS)}
        className="w-full"
      >
        Reset to Defaults
      </Button>
    </div>
  );
}
