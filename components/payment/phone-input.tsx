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
  disabled?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  className,
  disabled = false,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const country = countries.find((c) => value.startsWith(c.dialCode));
    if (country) {
      setSelectedCountry(country);
      setPhoneNumber(value.substring(country.dialCode.length));
    } else if (value.startsWith(selectedCountry.dialCode)) {
      setPhoneNumber(value.substring(selectedCountry.dialCode.length));
    } else {
      setPhoneNumber(value || "");
    }
  }, [value, selectedCountry.dialCode]);

  const validatePhoneNumber = (number: string) => {
    return /^\d{6,}$/.test(number);
  };

  const triggerChange = (country: Country, number: string) => {
    const combinedValue = country.dialCode + number;
    const isValidNumber = validatePhoneNumber(number);
    setIsValid(isValidNumber);
    if (combinedValue !== value) {
      onChange(combinedValue, isValidNumber);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
    triggerChange(selectedCountry, value);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    triggerChange(country, phoneNumber);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 px-3 rounded-r-none border-r-0 focus:ring-0"
              disabled={disabled}
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
          disabled={disabled}
        />
      </div>
      {phoneNumber && !isValid && !disabled && (
        <p className="text-xs text-red-500 mt-1">
          Please enter a valid phone number
        </p>
      )}
    </div>
  );
}