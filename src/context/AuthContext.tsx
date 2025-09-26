"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "@/lib/types";

interface StudentInfo {
  registrationNumber: string;
  department: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrUsername: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, studentInfo?: StudentInfo) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize admin user if it doesn't exist
  const initializeAdmin = async () => {
    try {
      console.log("Setting up admin user...");

      // Check if admin user already exists in Firebase
      const adminDocRef = doc(db, "users", "admin-001");
      const adminDoc = await getDoc(adminDocRef);

      if (!adminDoc.exists()) {
        console.log("Creating admin user in Firebase...");

        const adminUser = {
          id: "admin-001",
          name: "Library Admin",
          email: "admin@libroreserva.com",
          username: "LibraryAdmin",
          password: "Pass123456",
          role: "admin",
          avatarUrl: "https://i.pravatar.cc/150?u=admin",
          createdAt: new Date()
        };

        // Store admin user in Firebase
        await setDoc(adminDocRef, adminUser);

        console.log("✅ Admin user created successfully in Firebase!");
        console.log("Login credentials:");
        console.log("- Username: LibraryAdmin");
        console.log("- Password: Pass123456");
      } else {
        console.log("Admin user already exists in Firebase");
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
  };

  useEffect(() => {
    // Initialize admin user on app start
    initializeAdmin();

    // Check if user is logged in from session storage
    const storedUser = sessionStorage.getItem("library_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        sessionStorage.removeItem("library_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (emailOrUsername: string, pass: string) => {
    setLoading(true);
    try {
      console.log("Attempting login with:", emailOrUsername);

      // First, try to find user by username
      let userDoc;
      if (emailOrUsername === "LibraryAdmin") {
        userDoc = await getDoc(doc(db, "users", "admin-001"));
      } else {
        // Search for user by email or username
        const usersRef = collection(db, "users");
        const emailQuery = query(usersRef, where("email", "==", emailOrUsername));
        const usernameQuery = query(usersRef, where("username", "==", emailOrUsername));

        let userSnapshot = await getDocs(emailQuery);
        if (userSnapshot.empty) {
          userSnapshot = await getDocs(usernameQuery);
        }

        if (!userSnapshot.empty) {
          userDoc = userSnapshot.docs[0];
        }
      }

      if (!userDoc || !userDoc.exists()) {
        throw new Error("User not found");
      }

      const userData = userDoc.data();

      // Check password (in production, use proper password hashing)
      if (userData.password !== pass) {
        throw new Error("Incorrect password");
      }

      // Login successful - create user object
      const loggedInUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatarUrl: userData.avatarUrl
      };

      setUser(loggedInUser);
      sessionStorage.setItem("library_user", JSON.stringify(loggedInUser));
      setLoading(false);

      console.log("✅ Login successful:", loggedInUser.name);

    } catch (error: any) {
      setLoading(false);
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (email: string, pass: string, name: string, studentInfo?: StudentInfo) => {
    setLoading(true);
    try {
      console.log("Starting signup process for:", email);

      // Check if user already exists
      const usersRef = collection(db, "users");
      const existingUserQuery = query(usersRef, where("email", "==", email));
      const existingUser = await getDocs(existingUserQuery);

      if (!existingUser.empty) {
        console.log("User already exists with email:", email);
        throw new Error("User with this email already exists");
      }

      // Check if registration number already exists (if provided)
      if (studentInfo?.registrationNumber) {
        console.log("Checking registration number:", studentInfo.registrationNumber);
        const regNumberQuery = query(usersRef, where("registrationNumber", "==", studentInfo.registrationNumber));
        const existingRegNumber = await getDocs(regNumberQuery);

        if (!existingRegNumber.empty) {
          console.log("Registration number already exists:", studentInfo.registrationNumber);
          throw new Error("Registration number already exists");
        }
      }

      // Create new user
      const userId = `student-${Date.now()}`;
      const newUser = {
        id: userId,
        name,
        email,
        password: pass, // In production, hash this password
        role: "student",
        avatarUrl: studentInfo?.profilePicture || `https://i.pravatar.cc/150?u=${email}`,
        registrationNumber: studentInfo?.registrationNumber,
        department: studentInfo?.department,
        profilePicture: studentInfo?.profilePicture,
        isActive: true,
        createdAt: new Date()
      };

      // Validate document size (Firestore limit is 1MB)
      const documentSize = new Blob([JSON.stringify(newUser)]).size;
      console.log("Document size:", documentSize, "bytes");

      if (documentSize > 1000000) { // 1MB limit
        throw new Error("Profile picture is too large. Please choose a smaller image or contact support.");
      }

      console.log("Creating user document with ID:", userId);
      await setDoc(doc(db, "users", userId), newUser);

      // Auto-login the new user
      const loggedInUser: User = {
        id: userId,
        name,
        email,
        role: "student",
        avatarUrl: studentInfo?.profilePicture || `https://i.pravatar.cc/150?u=${email}`,
        registrationNumber: studentInfo?.registrationNumber,
        department: studentInfo?.department,
        profilePicture: studentInfo?.profilePicture,
        isActive: true
      };

      console.log("Setting user in context and session storage");
      setUser(loggedInUser);
      sessionStorage.setItem("library_user", JSON.stringify(loggedInUser));

      // Send welcome notification for new students
      if (typeof window !== 'undefined') {
        const welcomeNotification = {
          type: 'success' as const,
          title: 'Welcome to LibroReserva!',
          message: `Welcome ${name}! Your student account has been created successfully. Start exploring our library collection and enjoy your reading journey.`
        };

        // Store welcome notification in localStorage for pickup by NotificationContext
        setTimeout(() => {
          const event = new CustomEvent('newNotification', { detail: welcomeNotification });
          window.dispatchEvent(event);
        }, 1000);
      }

      setLoading(false);
      console.log("Signup completed successfully");

    } catch (error: any) {
      console.error("Signup error in AuthContext:", error);
      setLoading(false);

      // Handle specific Firebase errors
      if (error.code === 'invalid-argument' && error.message.includes('exceeds the maximum allowed size')) {
        throw new Error("Profile picture is too large. Please choose a smaller image.");
      }

      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("library_user");
    router.push("/login");
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
