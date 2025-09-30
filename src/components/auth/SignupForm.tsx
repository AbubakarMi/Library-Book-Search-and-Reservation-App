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
import { validateRegistrationNumber, getDepartmentFromRegNo, getDepartmentOptions } from "@/lib/registration-utils";
import { validateImageFile, compressImage, getInitials, getAvatarColor } from "@/lib/avatar-utils";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  registrationNumber: z.string().refine((val) => {
    const validation = validateRegistrationNumber(val);
    return validation.isValid;
  }, {
    message: "Invalid registration number format. Use: UG20/COMS/1168"
  }),
  department: z.string().min(2, { message: "Department is required." }),
  profilePicture: z.string().optional(),
});

// Get departments from the registration utils
const departments = getDepartmentOptions();

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // Auto-detect department when registration number changes
  const handleRegistrationNumberChange = (regNo: string) => {
    const departmentInfo = getDepartmentFromRegNo(regNo);
    if (departmentInfo) {
      form.setValue('department', departmentInfo.code);
    }
  };

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


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input value to allow selecting the same file again
    event.target.value = '';

    // Validate file using our utility
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid image file');
      return;
    }

    setImageLoading(true);
    setError(null);

    try {
      // Detect if we're on mobile for better compression
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const maxSize = isMobile ? 300 : 500; // Smaller size for mobile devices

      console.log('Processing image on mobile:', isMobile, 'max size:', maxSize);

      // Use the improved compression function from avatar-utils
      const compressedImage = await compressImage(file, maxSize);
      setProfileImagePreview(compressedImage);
      form.setValue('profilePicture', compressedImage);

      console.log('Image processed successfully');
    } catch (error) {
      console.error('Error processing image:', error);

      // Fallback for mobile devices - just convert to base64 without compression
      try {
        console.log('Attempting fallback conversion...');
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const base64 = e.target.result as string;
            setProfileImagePreview(base64);
            form.setValue('profilePicture', base64);
            console.log('Fallback conversion successful');
          }
        };
        reader.onerror = () => {
          setError('Failed to process image. Please try a smaller image or contact support.');
        };
        reader.readAsDataURL(file);
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
        setError('Failed to process image. Please try a smaller image or contact support.');
      }
    } finally {
      setImageLoading(false);
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
        profilePicture: values.profilePicture || undefined // Don't set default avatar
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
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Student Registration</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 px-2">Create your student account to access the library system</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Profile Picture Upload */}
          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-gray-200 dark:border-gray-700">
                      <AvatarImage src={profileImagePreview || undefined} />
                      <AvatarFallback className={`text-white text-lg ${getAvatarColor(form.watch('name') || 'User')}`}>
                        {getInitials(form.watch('name') || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="relative inline-block">
                      <input
                        type="file"
                        accept="image/*,image/heic,image/heif"
                        capture="environment"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        style={{
                          WebkitAppearance: 'none',
                          appearance: 'none',
                          fontSize: '16px' // Prevents zoom on iOS
                        }}
                        disabled={imageLoading}
                        id="profile-picture-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 h-12 px-6 text-sm font-medium min-w-[140px] relative z-0 touch-manipulation select-none"
                        disabled={imageLoading}
                        asChild
                      >
                        <label htmlFor="profile-picture-upload" className="cursor-pointer flex items-center gap-2">
                          {imageLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {imageLoading ? 'Processing...' : 'Upload Photo'}
                        </label>
                      </Button>
                    </div>
                    {profileImagePreview && (
                      <p className="text-xs text-green-600 text-center">✓ Photo uploaded successfully</p>
                    )}
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
                    <Input
                      placeholder="e.g., UG20/COMS/1168"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleRegistrationNumberChange(e.target.value);
                      }}
                    />
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department (auto-detected from reg no)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
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
