"use client";

import { Button } from "@/components/ui/button";
import LabelledInput from "@/components/ui/labelledInput";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { z, type ZodError } from "zod";
import { BACKEND_URL } from "@/config/config";
import { toast } from "sonner";

interface SignupRequest {
  status: string;
  token: string;
}

const createUser = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

export default function SignupPage() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    username?: string;
  }>({});

  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem("authorization");
      if (token) {
        navigate("/");
      }
    }, [navigate]);

  const handleSignup = async () => {
    const result = createUser.safeParse({
      email,
      password,
      firstName: firstname,
      lastName: lastname,
      username,
    });
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
      const req = await axios.post<SignupRequest>(
        `${BACKEND_URL}/api/v1/auth/signup`,
        {
          email,
          password,
          firstName: firstname,
          lastName: lastname,
          username,
        }
      );

      if (req.status != 201) {
        toast("something went wrong");
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastname('');
        setUsername('');
        return;
      }
      console.log(req.data.token);
      console.log(req.data);
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
        mx-auto my-8 "
    >
      <div className="flex flex-col gap-2">
        <div className="text-center text-3xl font-sans">Hi there!</div>
        <div className="text-[16px] text-center">
          Enter your email to sign in to your account
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-4 text-lg">
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <LabelledInput
            label="First name"
            inputPlaceholder="John"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
          <LabelledInput
            label="Last name"
            inputPlaceholder="Doe"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
          <LabelledInput
            label="Email address"
            inputPlaceholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <LabelledInput
            label="Username"
            inputPlaceholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
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
          <Button onClick={handleSignup}>Submit</Button>
        </div>
        <div>----- or -----</div>
        <div className="text-blue-500 text-center">
          <div>
            <Link to="/signin"> Already a user? Signin</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
