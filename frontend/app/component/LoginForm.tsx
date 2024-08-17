'use client'

import { Button, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/loginSchema";
import { FormData } from '../types/formTypes';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-y-2">
        <div className="mb-2 block">
          <Label htmlFor="username" value="Username anda" className="text-gray-500 dark:text-gray-400" />
        </div>
        <TextInput {...register('username')} id="username" type="text" placeholder="username" />
        {errors.username && <p className="text-sm font-light text-red-500">{errors.username.message}</p>}
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="mb-2 block">
          <Label htmlFor="password" value="Password anda" className="text-gray-500 dark:text-gray-400" />
        </div>
        <TextInput {...register('password')} id="password" type="password" placeholder="password" />
        {errors.password && <p className="text-sm font-light text-red-500">{errors.password.message}</p>}
      </div>
      <Button color={'blue'} className="mt-3" type="submit">Log In</Button>
    </form>
  )
}