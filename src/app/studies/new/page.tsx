"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import { StudyPreview } from "@/components/study-preview";
import { useStudyForm } from "@/lib/study-context";
import { CATEGORIES } from "@/lib/constants";
import { validateProductInfo, getFieldError, ValidationError } from "@/lib/validation";

export default function CreateStudyStep1() {
  const router = useRouter();
  const { formData, updateField } = useStudyForm();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const descriptionLength = formData.productDescription.length;
  const maxDescriptionLength = 500;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleContinue = () => {
    const result = validateProductInfo({
      productName: formData.productName,
      productDescription: formData.productDescription,
      productPrice: formData.productPrice,
      category: formData.category,
    });

    if (!result.valid) {
      setErrors(result.errors);
      // Mark all fields as touched to show errors
      setTouched({
        productName: true,
        productDescription: true,
        productPrice: true,
        category: true,
      });
      return;
    }

    setErrors([]);
    router.push("/studies/new/settings");
  };

  const getError = (field: string) => {
    if (!touched[field]) return undefined;
    return getFieldError(errors, field);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-medium text-muted-foreground">
              Step 1 of 3: Product Info
            </h1>
            <span className="text-sm text-muted-foreground">33%</span>
          </div>
          <Progress value={33} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Form Section - 60% */}
          <div className="flex-[3]">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">
                  Tell us about your product
                </h2>

                <div className="space-y-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      placeholder="e.g. Sensate Relaxation Device"
                      value={formData.productName}
                      onChange={(e) => updateField("productName", e.target.value)}
                      onBlur={() => handleBlur("productName")}
                      className={getError("productName") ? "border-red-500" : ""}
                    />
                    {getError("productName") && (
                      <p className="text-xs text-red-500">{getError("productName")}</p>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    <ImageUpload
                      value={formData.productImage}
                      onChange={(value) => updateField("productImage", value)}
                    />
                  </div>

                  {/* Product Description */}
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Product Description *</Label>
                    <Textarea
                      id="productDescription"
                      placeholder="Briefly describe what your product does and its main benefits..."
                      value={formData.productDescription}
                      onChange={(e) =>
                        updateField(
                          "productDescription",
                          e.target.value.slice(0, maxDescriptionLength)
                        )
                      }
                      onBlur={() => handleBlur("productDescription")}
                      className={`min-h-[120px] resize-none ${getError("productDescription") ? "border-red-500" : ""}`}
                    />
                    <div className="flex justify-between">
                      {getError("productDescription") ? (
                        <p className="text-xs text-red-500">{getError("productDescription")}</p>
                      ) : (
                        <span />
                      )}
                      <p className="text-xs text-muted-foreground">
                        {descriptionLength}/{maxDescriptionLength} characters
                      </p>
                    </div>
                  </div>

                  {/* Product Price */}
                  <div className="space-y-2">
                    <Label htmlFor="productPrice">Product Price *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="productPrice"
                        type="text"
                        inputMode="decimal"
                        placeholder="299.00"
                        value={formData.productPrice}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          updateField("productPrice", value);
                        }}
                        onBlur={() => handleBlur("productPrice")}
                        className={`pl-7 ${getError("productPrice") ? "border-red-500" : ""}`}
                      />
                    </div>
                    {getError("productPrice") && (
                      <p className="text-xs text-red-500">{getError("productPrice")}</p>
                    )}
                  </div>

                  {/* Product URL */}
                  <div className="space-y-2">
                    <Label htmlFor="productUrl">Product URL (optional)</Label>
                    <Input
                      id="productUrl"
                      type="url"
                      placeholder="https://yoursite.com/product"
                      value={formData.productUrl}
                      onChange={(e) => updateField("productUrl", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      We&apos;ll use this to help generate study content
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => {
                        updateField("category", value);
                        setTouched((prev) => ({ ...prev, category: true }));
                      }}
                    >
                      <SelectTrigger className={getError("category") ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getError("category") && (
                      <p className="text-xs text-red-500">{getError("category")}</p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button variant="ghost" asChild>
                    <Link href="/studies">Cancel</Link>
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white"
                  >
                    Continue to Study Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section - 40% */}
          <div className="flex-[2]">
            <div className="sticky top-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Live Preview
              </h3>
              <StudyPreview
                productName={formData.productName}
                productImage={formData.productImage}
                category={formData.category}
                rebateAmount={formData.rebateAmount}
                durationDays={formData.durationDays}
                totalSpots={formData.totalSpots}
                requiredDevice={formData.requiredDevice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
