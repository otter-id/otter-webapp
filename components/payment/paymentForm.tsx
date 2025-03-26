"use client";

import { useState } from "react";
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
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface PaymentFormProps {
  onSubmit: (data: { name: string; phoneNumber: string }) => void;
  isLoading?: boolean;
  initialData?: { name: string; phoneNumber: string };
}

// Country codes for the dropdown
const countryCodes = [
  { code: "+62", country: "Indonesia 🇮🇩" },
  { code: "+60", country: "Malaysia 🇲🇾" },
  { code: "+65", country: "Singapore 🇸🇬" },
  { code: "+66", country: "Thailand 🇹🇭" },
  { code: "+63", country: "Philippines 🇵🇭" },
  { code: "+84", country: "Vietnam 🇻🇳" },
  { code: "+1", country: "United States 🇺🇸" },
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  countryCode: z.string().default("+62"),
  phoneNumber: z
    .string()
    .min(8, { message: "Phone number must be at least 8 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
});

export default function PaymentForm({
  onSubmit,
  isLoading = false,
  initialData,
}: PaymentFormProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+62");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      countryCode: "+62",
      phoneNumber: initialData?.phoneNumber
        ? initialData.phoneNumber.replace(/^\+\d+/, "")
        : "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const fullPhoneNumber = `${values.countryCode}${values.phoneNumber}`;
    onSubmit({
      name: values.name,
      phoneNumber: fullPhoneNumber,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCountryCode(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    {...field}
                    className="flex-1"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-black hover:bg-black/90"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
