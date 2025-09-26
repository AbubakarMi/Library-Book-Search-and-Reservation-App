"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Upload, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  registrationNumber: z.string().min(3, { message: "Registration number must be at least 3 characters." }),
  department: z.string().min(2, { message: "Department must be at least 2 characters." }),
  profilePicture: z.string().optional(),
});

const departments = [
  "Computer Science",
  "Information Technology",
  "Engineering",
  "Business Administration",
  "English Literature",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Psychology",
  "Economics",
  "History",
  "Other"
];

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      registrationNumber: "",
      department: "",
      profilePicture: "",
    },
  });

  const compressImage = (file: File, maxSizeKB: number = 100): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions to maintain aspect ratio
        const maxWidth = 300;
        const maxHeight = 300;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        // Start with high quality and reduce until size is acceptable
        let quality = 0.9;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Estimate size in KB (base64 is ~33% larger than binary)
        const sizeKB = (compressedDataUrl.length * 0.75) / 1024;

        if (sizeKB > maxSizeKB && quality > 0.1) {
          quality = Math.max(0.1, quality * (maxSizeKB / sizeKB));
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageLoading(true);
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Please select a valid image file.');
          return;
        }

        // Validate file size (max 5MB for upload)
        if (file.size > 5 * 1024 * 1024) {
          setError('Image file is too large. Please select an image smaller than 5MB.');
          return;
        }

        // Compress the image
        const compressedImage = await compressImage(file, 80); // 80KB max
        setProfileImagePreview(compressedImage);
        form.setValue('profilePicture', compressedImage);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error processing image:', error);
        setError('Failed to process image. Please try again.');
      } finally {
        setImageLoading(false);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      console.log("Attempting signup with values:", {
        name: values.name,
        email: values.email,
        registrationNumber: values.registrationNumber,
        department: values.department,
        hasProfilePicture: !!values.profilePicture
      });

      await signup(values.email, values.password, values.name, {
        registrationNumber: values.registrationNumber,
        department: values.department,
        profilePicture: values.profilePicture || `https://i.pravatar.cc/150?u=${values.email}`
      });

      console.log("Signup successful, redirecting to dashboard");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Could not create account. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Student Registration</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Create your student account to access the library system</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture Upload */}
          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24 border-2 border-gray-200 dark:border-gray-700">
                      <AvatarImage src={profileImagePreview || undefined} />
                      <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
                        <User className="w-8 h-8 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={imageLoading}
                      />
                      <Button type="button" variant="outline" className="flex items-center gap-2" disabled={imageLoading}>
                        {imageLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {imageLoading ? 'Processing...' : 'Upload Photo'}
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="REG2024001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
