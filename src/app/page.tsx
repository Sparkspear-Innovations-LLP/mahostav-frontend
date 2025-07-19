'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ClientOnly } from "@/components/ui/client-only";
import { FileUpload } from "@/components/ui/file-upload";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BytescaleProvider } from "@/contexts/BytescaleContext";
import { BytescaleUploadResult } from "@/lib/bytescale";
import { cn } from "@/lib/utils";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function HomePage() {
  const form = useForm({});
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: Record<string, unknown>) {
    console.log('Form data:', data);

    setIsSubmitting(true);
    try {
      // Prepare the data for the backend API
      const formattedData = {
        mandalOfficialName: data.mandalOfficialName as string,
        popularName: data.popularName as string,
        pandalAddress: data.pandalAddress as string,
        googleMapsLink: data.googleMapsLink as string,
        yearEstablished: parseInt(data.yearEstablished as string),
        mandalHistory: data.mandalHistory as string,
        expectedAagman: data.expectedAagman ? new Date(data.expectedAagman as Date).toISOString() : null,
        aagmanStartLocation: data.aagmanStartLocation as string,
        isEcoFriendly: data.isEcoFriendly as string,
        primaryContactName: data.primaryContactName as string,
        primaryContactMobile: data.primaryContactMobile as string,
        publicEnquiryNumber: data.publicEnquiryNumber as string,
        websiteOrSocialLinks: data.websiteOrSocialLinks as string,
        mandalLogo: uploadedLogoUrl || '',
        highQualityPhotos: uploadedPhotoUrls,
        authorizingPerson: data.authorizingPerson as string,
      };

      console.log('Submitting to backend:', formattedData);

      // Submit to backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mandal-registration-form`, formattedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Backend response:', response.data);
      toast.success('Form submitted successfully!', {
        position: 'top-center',
      });
      form.reset();
      setUploadedPhotoUrls([]);
      setUploadedLogoUrl('');
    } catch (error) {
      console.error('Submission error:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message, {
          position: 'top-center',
        });
      } else {
        toast.error('An unexpected error occurred during submission', {
          position: 'top-center',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleUploadComplete = (results: BytescaleUploadResult[]) => {
    console.log('Photos uploaded to Bytescale:', results);
    // This is a generic handler, specific handlers will update state
  };

  const handlePhotoUploadComplete = (results: BytescaleUploadResult[]) => {
    const urls = results
      .filter(result => result.success && result.url)
      .map(result => result.url!);
    setUploadedPhotoUrls(prev => [...prev, ...urls]);
    handleUploadComplete(results);
  };

  const handleLogoUploadComplete = (results: BytescaleUploadResult[]) => {
    const urls = results
      .filter(result => result.success && result.url)
      .map(result => result.url!);
    if (urls.length > 0) {
      setUploadedLogoUrl(urls[0]); // Only take the first URL for logo
    }
    handleUploadComplete(results);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      form.setValue("expectedAagman", date);
    }
  }

  function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
    const currentDate = form.getValues("expectedAagman") || new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      if (newDate.getHours() >= 12) {
        newDate.setHours(hour === 12 ? 12 : hour + 12);
      } else {
        newDate.setHours(hour === 12 ? 0 : hour);
      }
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    form.setValue("expectedAagman", newDate);
  }

  return (
    <div className="flex flex-col items-center justify-center bg-orange-100 min-h-screen p-4">
      <h1 className="text-4xl font-bold text-orange-500 text-center">Welcome to Mohotsav</h1>
      <p className="">Celebrating culture and community.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full lg:w-1/3 mt-8 space-y-4">
          <FormField
            control={form.control}
            name="mandalOfficialName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mandal Official Name</FormLabel>
                <FormControl>
                  <Input className="bg-white" placeholder="Enter Mandal Official Name" {...field} />
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
                  <Input className="bg-white" placeholder="Enter Popular Name" {...field} />
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
                  <Input className="bg-white" placeholder="Enter Pandal Address" {...field} />
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
                  <Input className="bg-white" placeholder="Enter Google Maps Link" {...field} />
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
                  <Input className="bg-white" type="number" placeholder="Enter Year Established" {...field} />
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
                  <Input className="bg-white" placeholder="Enter Mandal History" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isEcoFriendly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is Eco-Friendly</FormLabel>
                <FormControl>
                  <Input className="bg-white" placeholder="Yes | No | Partially" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expectedAagman"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expected Aagman (12h)</FormLabel>
                <ClientOnly fallback={<Button variant="outline" className="w-full pl-3 text-left font-normal text-muted-foreground">Loading date picker...</Button>}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MM/dd/yyyy hh:mm aa")
                          ) : (
                            <span>MM/DD/YYYY hh:mm aa</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="sm:flex">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={handleDateSelect}
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i + 1)
                                .reverse()
                                .map((hour) => (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                      field.value &&
                                        field.value.getHours() % 12 === hour % 12
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange("hour", hour.toString())
                                    }
                                  >
                                    {hour}
                                  </Button>
                                ))}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                (minute) => (
                                  <Button
                                    key={minute}
                                    size="icon"
                                    variant={
                                      field.value &&
                                        field.value.getMinutes() === minute
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange("minute", minute.toString())
                                    }
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                )
                              )}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="">
                            <div className="flex sm:flex-col p-2">
                              {["AM", "PM"].map((ampm) => (
                                <Button
                                  key={ampm}
                                  size="icon"
                                  variant={
                                    field.value &&
                                      ((ampm === "AM" &&
                                        field.value.getHours() < 12) ||
                                        (ampm === "PM" &&
                                          field.value.getHours() >= 12))
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() => handleTimeChange("ampm", ampm)}
                                >
                                  {ampm}
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </ClientOnly>
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
                  <Input className="bg-white" placeholder="Enter Aagman Start Location" {...field} />
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
                  <Input className="bg-white" placeholder="Enter Primary Contact Name" {...field} />
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
                  <Input className="bg-white" placeholder="Enter Primary Contact Mobile" {...field} />
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
                  <Input className="bg-white" placeholder="Enter Public Enquiry Number" {...field} />
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
                  <Input className="bg-white" placeholder="Enter Website or Social Links" {...field} />
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
                  <Input className="bg-white" placeholder="Enter Authorizing Person" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mandalLogo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mandal Logo</FormLabel>
                <FormControl>
                  <ClientOnly fallback={<div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">Loading...</div>}>
                    <FileUpload
                      value={field.value || []}
                      onChange={field.onChange}
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024} // 5MB
                      accept={{
                        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
                      }}
                      enableBytescaleUpload={true}
                      folderName="mahostav-uploads/mandal-logos"
                      onUploadComplete={handleLogoUploadComplete}
                      onUploadError={handleUploadError}
                    />
                  </ClientOnly>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="highQualityPhotos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gallery Photos (Multiple Images)</FormLabel>
                <FormControl>
                  <ClientOnly fallback={<div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">Loading...</div>}>
                    <FileUpload
                      value={field.value || []}
                      onChange={field.onChange}
                      maxFiles={10}
                      maxSize={10 * 1024 * 1024} // 10MB
                      accept={{
                        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
                      }}
                      enableBytescaleUpload={true}
                      folderName="mahostav-uploads/gallery-photos"
                      onUploadComplete={handlePhotoUploadComplete}
                      onUploadError={handleUploadError}
                    />
                  </ClientOnly>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-4 w-full bg-orange-400"
            disabled={isSubmitting}

          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function Home() {
  return (
    <BytescaleProvider>
      <HomePage />
    </BytescaleProvider>
  );
}
