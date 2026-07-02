"use client";

import { useState, useEffect, useMemo } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, User, Lock, Sparkles, Phone, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

// Unsplash product images for the slider
const PRODUCT_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
    title: "Premium Sportswear Kits",
    description: "Engineered for maximum performance and ultimate comfort.",
  },
  {
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    title: "Customized Premium Hoodies",
    description: "Designed with high-quality fabrics tailored to your exact fit.",
  },
  {
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=600&auto=format&fit=crop",
    title: "Elite Tracksuits & Gear",
    description: "Stay ahead of the game with our premium outerwear collections.",
  },
];

export function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const passwordValue = watch("password");

  // Left slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % PRODUCT_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Generate random stars for the background animation
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 2 + 1, // 1px to 3px
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 3,
    }));
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Registration failed. Please try again.");
      }

      setSuccessMsg("Account created successfully! Redirecting to login...");
      toast.success("Account created successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Starry Sky Background with Framer Motion */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
              y: [0, -15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: star.duration,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating/Hanging Constellation Orbs */}
        <motion.div
          className="absolute top-10 left-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[80px]"
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]"
          animate={{
            y: [15, -15, 15],
            x: [10, -10, 10],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[650px] border border-white/20"
      >
        {/* Left Panel - Premium Product Slider */}
        <div className="w-full md:w-1/2 relative bg-black text-white flex flex-col justify-between overflow-hidden md:flex hidden min-h-[650px]">
          {/* Back button */}
          <div className="absolute top-8 left-8 z-30">
            <button
              onClick={() => router.push("/")}
              className="group w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/15 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          {/* AnimatePresence for smooth product image transition */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.45, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full relative"
              >
                <img
                  src={PRODUCT_SLIDES[activeSlide].image}
                  alt={PRODUCT_SLIDES[activeSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider content info */}
          <div className="relative z-20 mt-auto p-12 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-bold text-blue-300 tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} /> Customize Jersey
            </div>

            <div className="h-32 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute"
                >
                  <h2 className="text-3xl font-extrabold leading-tight tracking-tight mb-2">
                    {PRODUCT_SLIDES[activeSlide].title}
                  </h2>
                  <p className="text-gray-300 text-sm max-w-sm leading-relaxed font-medium">
                    {PRODUCT_SLIDES[activeSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Dots */}
            <div className="flex gap-2 mt-8">
              {PRODUCT_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeSlide === i ? "bg-white w-6" : "bg-white/40 w-1.5"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Sign Up Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 md:p-14 flex flex-col justify-center bg-white/70 backdrop-blur-md">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">
              Create an Account
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors inline-flex items-center hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-medium rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="First Name"
                id="firstName"
                placeholder="John"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.firstName?.message}
                {...register("firstName", { required: "First name is required" })}
              />
              <Input
                label="Last Name"
                id="lastName"
                placeholder="Doe"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.lastName?.message}
                {...register("lastName", { required: "Last name is required" })}
              />
            </div>

            {/* Email Field */}
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email", {
                required: "Email address is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            {/* Phone Field */}
            <Input
              label="Phone Number"
              id="phone"
              type="tel"
              placeholder="01712345678"
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9+ \-()]{10,15}$/,
                  message: "Please enter a valid phone number (at least 10 digits)",
                },
              })}
            />

            {/* Password Fields Grid */}
            <div className="grid grid-cols-1  gap-3.5">
              {/* Password Field */}
              <Input
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                }
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              {/* Confirm Password Field */}
              <Input
                label="Confirm Password"
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                }
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (val) => {
                    if (val !== passwordValue) {
                      return "Passwords do not match";
                    }
                  },
                })}
              />
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-center gap-2">
                <Controller
                  name="agreeToTerms"
                  control={control}
                  rules={{ required: "You must agree to the terms and conditions" }}
                  render={({ field }) => (
                    <Checkbox
                      id="agreeToTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-indigo-600 font-bold hover:underline">
                    Terms & Conditions
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-[11px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white hover:opacity-95 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-2 shadow-lg shadow-indigo-950/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* OR Divider */}
          <div className="relative my-4.5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 px-3 text-slate-500 font-semibold">
                Or
              </span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <Button
            variant="outline"
            className="w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            type="button"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.62 0 3.06.56 4.2 1.66l3.12-3.12C17.43 1.84 14.9 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8c.84-2.5 3.17-4.26 6.9-4.26z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.59l3.69 2.86c2.16-1.99 3.72-4.92 3.72-8.6z"
              />
              <path
                fill="#FBBC05"
                d="M5.1 14.9c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.5 7.54C.54 9.46 0 11.62 0 12.9s.54 3.44 1.5 5.36l3.6-2.8z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.86c-1.12.75-2.55 1.2-4.27 1.2-3.73 0-6.06-1.76-6.9-4.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"
              />
            </svg>
            Sign up with Google
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
