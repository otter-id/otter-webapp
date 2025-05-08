"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

// Sample list of countries - in a real app, you'd have a more complete list
const countries: Country[] = [
  { name: "Indonesia", code: "ID", dialCode: "+62", flag: "🇮🇩" },
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "Malaysia", code: "MY", dialCode: "+60", flag: "🇲🇾" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  className?: string;
}

export function PhoneInput({ value, onChange, className }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Update the combined value when either country or number changes
  useEffect(() => {
    const combinedValue = selectedCountry.dialCode + phoneNumber;
    const isValidNumber = validatePhoneNumber(phoneNumber);
    setIsValid(isValidNumber);
    onChange(combinedValue, isValidNumber);
  }, [selectedCountry, phoneNumber, onChange]);

  // Initialize phone number from value if provided
  useEffect(() => {
    if (value) {
      // Find the country code in the value
      const country = countries.find((c) => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.substring(country.dialCode.length));
      } else {
        setPhoneNumber(value);
      }
    }
  }, []);

  const validatePhoneNumber = (number: string) => {
    // Basic validation - should be at least 6 digits, numbers only
    return /^\d{6,}$/.test(number);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 px-3 rounded-r-none border-r-0 focus:ring-0"
            >
              <span className="text-base">{selectedCountry.flag}</span>
              <span className="text-xs font-medium">
                {selectedCountry.dialCode}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="max-h-[300px] overflow-y-auto"
          >
            {countries.map((country) => (
              <DropdownMenuItem
                key={country.code}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleCountrySelect(country)}
              >
                <span className="text-base">{country.flag}</span>
                <span className="text-sm">{country.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {country.dialCode}
                </span>
                {selectedCountry.code === country.code && (
                  <Check className="h-4 w-4 ml-2" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="rounded-l-none"
          placeholder="Phone number"
        />
      </div>
      {phoneNumber && !isValid && (
        <p className="text-xs text-red-500 mt-1">
          Please enter a valid phone number
        </p>
      )}
    </div>
  );
}
