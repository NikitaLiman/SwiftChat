"use client";
import React from "react";
import Styles from "../../Sass/Sass-next-auth/authModel.module.scss";
import { formLoginSchema, TformLoginValues } from "./schemas";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../Comp-blocks/FormInput";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const onSubmit = async (data: TformLoginValues) => {
    console.log("Form data:", data);
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
        callbackUrl: "/",
      });
      if (res?.ok && res.url) {
        router.push(res.url);
      } else {
        console.log("Cannot Enter To account");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const form = useForm<TformLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={Styles.FORM}>
          <div className={Styles.FORM__content}>
            <h1>Login</h1>
            <p>Enter your E-mail & Password to Login </p>
          </div>
        </div>

        <div className={Styles.inputs}>
          <FormInput label="E-Mail" name="email" required={true} />
          <FormInput
            label="Password"
            name="password"
            required={true}
            type="password"
          />
        </div>

        <button type="submit" className={Styles.btn}>
          {form.formState.isSubmitting ? "Enter.." : "login"}
        </button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
