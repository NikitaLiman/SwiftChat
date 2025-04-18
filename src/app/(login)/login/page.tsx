"use client";
import React from "react";
import Styles from "../../../Sass/Sass-next-auth/authModel.module.scss";
import { ArrowDown } from "lucide-react";
import { signIn } from "next-auth/react";
import LoginForm from "@/Components/next-auth/logjn";
import RegisterForm from "@/Components/next-auth/register";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
interface Props {}

const authModel: React.FC<Props> = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [session]);
  const [state, setState] = React.useState<"login" | "register">("login");
  const onSwitch = () => {
    setState(state === "login" ? "register" : "login");
  };
  return (
    <div className={Styles.container}>
      <div className={Styles.container__content}>
        <div className={Styles.title}>
          <h1>SwiftChat </h1>
        </div>
        <div className={Styles.form}>
          {state === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
        <div className={Styles.bySocial}>
          <div
            onClick={() =>
              signIn("github", {
                redirect: true,
                callbackUrl: "/",
              })
            }
            className={Styles.github}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
              alt=""
            />
            <p>GitHub</p>
          </div>{" "}
          <div
            onClick={() =>
              signIn("google", {
                redirect: true,
                callbackUrl: "/",
              })
            }
            className={Styles.Google}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
              alt=""
            />
            <p>Google</p>
          </div>
        </div>
        <div className={Styles.switch}>
          <button onClick={onSwitch}>
            <p>{state === "login" ? "register" : "login"}</p>
            <ArrowDown className={Styles.svg} size={20} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default authModel;
