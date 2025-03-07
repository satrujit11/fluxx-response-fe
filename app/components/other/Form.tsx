import { useForm, Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";

const MAX_FILE_SIZE_MB = 2; // Max file size in MB

const RiderKYCForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      aadharNumber: "",
      panNumber: "",
      dlNumber: "",
      vehicle: "",
      aadharFile: null,
      panFile: null,
      dlFile: null,
      riderPhoto: null,
    },
  });

  const handleFileValidation = (file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File size must be less than ${MAX_FILE_SIZE_MB}MB`;
    }
    return true;
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    // Append text fields
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("aadharNumber", data.aadharNumber);
    formData.append("panNumber", data.panNumber);
    formData.append("dlNumber", data.dlNumber);
    formData.append("vehicle", data.vehicle);

    // Append files
    if (data.aadharFile?.[0]) formData.append("aadharFile", data.aadharFile[0]);
    if (data.panFile?.[0]) formData.append("panFile", data.panFile[0]);
    if (data.dlFile?.[0]) formData.append("dlFile", data.dlFile[0]);
    if (data.riderPhoto?.[0]) formData.append("riderPhoto", data.riderPhoto[0]);

    try {
      setIsSubmitting(true);
      const response = await fetch("https://fluxx-response-be.onrender.com/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Something went wrong");

      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen">
      <div className="bg-white border-b sticky top-0">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-semibold text-center">Driver Registration</h1>
        </div>
      </div>
      <div className="container mx-auto bg-white h-full p-4">
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Driver Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Driver Name", name: "name", placeholder: "John Doe" },
                  { label: "Address", name: "address", placeholder: "123 Main St" },
                  { label: "Aadhar Number", name: "aadharNumber", placeholder: "XXXX-XXXX-XXXX" },
                  { label: "PAN Number", name: "panNumber", placeholder: "AAXXX1234X" },
                  { label: "DL Number", name: "dlNumber", placeholder: "DL123456789" },
                  { label: "Vehicle Registration Number", name: "vehicle", placeholder: "AB12345" },
                ].map(({ label, name, placeholder }: { label: string; name: any; placeholder: string }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    rules={{ required: `${label} is required` }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input placeholder={placeholder} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File Uploads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Upload Aadhar File", name: "aadharFile", accept: "image/*,application/pdf" },
                  { label: "Upload PAN File", name: "panFile", accept: "image/*,application/pdf" },
                  { label: "Upload Driving License", name: "dlFile", accept: "image/*,application/pdf" },
                  { label: "Upload Rider Photo", name: "riderPhoto", accept: "image/*" },
                ].map(({ label, name, accept }: { label: string; name: any; accept: string }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    rules={{ validate: (files) => handleFileValidation(files?.[0]) }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <Controller
                          name={name}
                          control={form.control}
                          render={({ field: { onChange, value } }) => (
                            <input
                              type="file"
                              accept={accept}
                              onChange={(e) => onChange(e.target.files)}
                            />
                          )}
                        />
                        {form.watch(name)?.[0] && (
                          <p className="text-sm text-gray-600">
                            Selected file: {form.watch(name)?.[0]?.name} ({(form.watch(name)?.[0]?.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default RiderKYCForm;

