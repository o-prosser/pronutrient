"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "./actions";

const initialState = {
  errors: {
    name: [],
    email: [],
    password: [],
  },
  returnedValues: {
    name: "",
    email: "",
  },
};

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(registerAction, initialState);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError("");

  //   // Validation
  //   if (formData.password !== formData.confirmPassword) {
  //     setError("Passwords do not match");
  //     setIsLoading(false);
  //     return;
  //   }

  //   if (formData.password.length < 6) {
  //     setError("Password must be at least 6 characters long");
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     // Mock registration logic
  //     console.log("Creating account:", formData);

  //     // Redirect to login or main app
  //     window.location.href = "/auth/login";
  //   } catch (err) {
  //     setError("An error occurred. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create account
        </CardTitle>
        <CardDescription className="text-center">
          Start your nutrition tracking journey today
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                defaultValue={state.returnedValues.name}
                className="pl-10"
                required
              />
            </div>
            {state.errors.name?.length || 0 > 0 ? (
              <Alert variant="destructive">
                <AlertDescription>
                  {state.errors.name?.join(", ")}
                </AlertDescription>
              </Alert>
            ) : (
              ""
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                defaultValue={state.returnedValues.email}
                className="pl-10"
                required
              />
            </div>
            {state.errors.email?.length || 0 > 0 ? (
              <Alert variant="destructive">
                <AlertDescription>
                  {state.errors.email?.join(", ")}
                </AlertDescription>
              </Alert>
            ) : (
              ""
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="pl-10 pr-10"
                name="password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {state.errors.password?.length || 0 > 0 ? (
              <Alert variant="destructive">
                <AlertDescription>
                  {state.errors.password?.join(", ")}
                </AlertDescription>
              </Alert>
            ) : (
              ""
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              required
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">
            Create account
          </Button>
          {/* <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button> */}

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
