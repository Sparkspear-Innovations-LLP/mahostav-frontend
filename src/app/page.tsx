'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl, FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns/fp";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";

export default function Home() {
  const form = useForm({});
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold">Welcome to Mohotsav</h1>
      <p className="mt-4">Celebrating culture and community.</p>

      <Form {...form}>
        <div className="w-1/3 mt-8 space-y-4">
          <FormField
            control={form.control}
            name="mandalOfficialName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mandal Official Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Mandal Official Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="popularName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Popular Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Popular Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pandalAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pandal Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Pandal Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="googleMapsLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Maps Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Google Maps Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearEstablished"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Established</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Year Established" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mandalHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mandal History</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Mandal History" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aagmanStartLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aagman Start Location</FormLabel>
                <FormControl>
                  <Input type="time" placeholder="Enter Aagman Start Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aagmanStartLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aagman Start Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Aagman Start Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primaryContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Primary Contact Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primaryContactMobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Contact Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Primary Contact Mobile" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publicEnquiryNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Public Enquiry Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Public Enquiry Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="websiteOrSocialLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website or Social Links</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Website or Social Links" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authorizingPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authorizing Person</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Authorizing Person" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
}
