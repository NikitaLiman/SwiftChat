import React from "react";
import Styles from "../../Sass/Sass-next-auth/authModel.module.scss";
import { registerFormSchema, TformRegisterValues } from "./schemas";
import { CreateUser } from "@/app/actions";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../Comp-blocks/FormInput";

const RegisterForm: React.FC = () => {
  const onSubmit = async (data: TformRegisterValues) => {
    try {
      await CreateUser({
        email: data.email,
        fullname: data.fullname,
        password: data.password,
      });
      console.log("User Created");
    } catch (error) {
      console.log(error);
    }
  };
  const form = useForm<TformRegisterValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      fullname: "",
      confirmPassword: "",
    },
  });
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={Styles.FORM}>
          <div className={Styles.FORM__content}>
            <h1>Register</h1>
            <p>Enter your E-mail & Password to Register </p>
          </div>
        </div>

        <div className={Styles.inputs}>
          <FormInput label="Fullname" name="fullname" required={true} />
          <FormInput label="E-Mail" name="email" required={true} />
          <FormInput
            label="Password"
            name="password"
            required={true}
            type="password"
          />
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            required={true}
          />
        </div>

        <button type="submit" className={Styles.btn}>
          {form.formState.isSubmitting ? "Enter.." : "register"}
        </button>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
