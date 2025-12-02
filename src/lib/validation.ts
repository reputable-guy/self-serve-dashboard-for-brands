// Form validation utilities for study creation

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Validate Step 1: Product Info
export function validateProductInfo(data: {
  productName: string;
  productDescription: string;
  productPrice: string;
  category: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.productName.trim()) {
    errors.push({ field: "productName", message: "Product name is required" });
  } else if (data.productName.length < 2) {
    errors.push({ field: "productName", message: "Product name must be at least 2 characters" });
  }

  if (!data.productDescription.trim()) {
    errors.push({ field: "productDescription", message: "Product description is required" });
  } else if (data.productDescription.length < 20) {
    errors.push({ field: "productDescription", message: "Description must be at least 20 characters" });
  }

  if (!data.productPrice.trim()) {
    errors.push({ field: "productPrice", message: "Product price is required" });
  } else {
    const price = parseFloat(data.productPrice);
    if (isNaN(price) || price <= 0) {
      errors.push({ field: "productPrice", message: "Please enter a valid price" });
    }
  }

  if (!data.category) {
    errors.push({ field: "category", message: "Please select a category" });
  }

  return { valid: errors.length === 0, errors };
}

// Validate Step 2: Study Settings
export function validateStudySettings(data: {
  rebateAmount: string;
  durationDays: string;
  totalSpots: string;
  requiredDevice: string;
  metricsToTrack: string[];
  productPrice?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.rebateAmount.trim()) {
    errors.push({ field: "rebateAmount", message: "Rebate amount is required" });
  } else {
    const rebate = parseFloat(data.rebateAmount);
    if (isNaN(rebate) || rebate <= 0) {
      errors.push({ field: "rebateAmount", message: "Please enter a valid rebate amount" });
    } else if (data.productPrice) {
      const price = parseFloat(data.productPrice);
      if (!isNaN(price) && rebate > price) {
        errors.push({ field: "rebateAmount", message: "Rebate cannot exceed product price" });
      }
    }
  }

  if (!data.durationDays.trim()) {
    errors.push({ field: "durationDays", message: "Study duration is required" });
  } else {
    const days = parseInt(data.durationDays);
    if (isNaN(days) || days < 7 || days > 90) {
      errors.push({ field: "durationDays", message: "Duration must be between 7 and 90 days" });
    }
  }

  if (!data.totalSpots.trim()) {
    errors.push({ field: "totalSpots", message: "Total spots is required" });
  } else {
    const spots = parseInt(data.totalSpots);
    if (isNaN(spots) || spots < 5 || spots > 1000) {
      errors.push({ field: "totalSpots", message: "Spots must be between 5 and 1000" });
    }
  }

  if (!data.requiredDevice) {
    errors.push({ field: "requiredDevice", message: "Please select a required device" });
  }

  if (data.metricsToTrack.length === 0) {
    errors.push({ field: "metricsToTrack", message: "Please select at least one metric to track" });
  }

  return { valid: errors.length === 0, errors };
}

// Helper to get error for a specific field
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}

// Validate URL format (optional field)
export function isValidUrl(url: string): boolean {
  if (!url.trim()) return true; // Empty is valid (optional)
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
