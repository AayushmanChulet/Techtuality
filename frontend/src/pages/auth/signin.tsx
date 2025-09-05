"use client";
import { Button } from "@/components/ui/button";
import LabelledInput from "@/components/ui/labelledInput";
import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import z, { ZodError } from "zod";
import { toast } from "sonner";

interface SigninRequest {
  status: string;
  token: string;
}

const signinSchema = z.object({
  identifier: z.string().min(1, { message: "Email/Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default function SigninPage() {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authorization");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSignin = async () => {
    const result = signinSchema.safeParse({ identifier, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      console.log(result.error);
      (result.error as ZodError).issues.forEach((issue) => {
        if (issue.path[0])
          fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const req = await axios.post<SigninRequest>(
        `${BACKEND_URL}/api/v1/auth/signin`,
        {
          identifier,
          password,
        }
      );
      if (req.status != 200) {
        toast("something went wrong");
        setIdentifier('');
        setPassword('');
        return;
      }

      localStorage.setItem("authorization", `Bearer ${req.data.token}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="w-full max-w-md
        bg-[#222229] 
        text-[#cfd4db] 
        py-8 px-6            
        sm:py-12 sm:px-12    
        md:py-16 md:px-16 
        flex flex-col gap-6
        items-center justify-center 
        rounded-2xl sm:rounded-3xl 
        font-ArchitectsDaughter
        mx-auto my-8      
"
    >
      <div className="flex flex-col gap-2">
        <div className="text-center text-3xl font-sans">Hi there!</div>
        <div className="text-[16px]">
          Enter your email to sign in to your account
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-4 text-lg">
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <LabelledInput
            label="Email address/Username"
            inputPlaceholder="johndoe@gmail.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm">{errors.identifier}</p>
          )}
          <LabelledInput
            label="Password"
            inputType="password"
            inputPlaceholder="****"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
          <Button onClick={handleSignin}>Submit</Button>
        </div>
        <div>----- or -----</div>
        <div className="text-blue-500 text-center">
          <div>
            <Link to="/signup"> Don't have an account? Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
