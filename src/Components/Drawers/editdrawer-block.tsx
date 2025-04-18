"use client";
import React from "react";
import Styles from "../../Sass/EdDrawer.module.scss";
import { ArrowLeft, Camera, Check } from "lucide-react";
import log from "../../img/623db209553ff3994165289505307556.png";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { FormEdit } from "../Comp-blocks/InputEdit";
import { t } from "i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProfile, TformEditValues } from "../next-auth/schemas";
import { userSessionUpdate } from "@/app/actions";
import { instanseAxios } from "../../../servises/instance";

interface Props {
  active: boolean;
  close: () => void;
  user: any;
}

const EditDrawerBlock: React.FC<Props> = ({ active, close, user }) => {
  const [clicked, setClicked] = React.useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = React.useState<File | null>(null);

  const form = useForm({
    resolver: zodResolver(EditProfile),
    defaultValues: {
      fullname: user?.fullname || "",
      email: user?.email || "",
      bio: user?.bio || "",
      username: user?.username || "",
    },
  });
  const { watch } = form;
  React.useEffect(() => {
    if (user) {
      form.reset({
        fullname: user?.fullname || "",
        email: user?.email || "",
        bio: user?.bio || "",
        username: user?.username || "",
      });
    }
  }, [user, form]);

  React.useEffect(() => {
    const subscription = watch((value) => {
      const isChanged = Object.keys(value).some(
        (key) => value[key as keyof TformEditValues] !== user?.[key]
      );
      setClicked(isChanged);
    });
    return () => subscription.unsubscribe();
  }, [watch, user]);

  const ChangePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target.files?.[0];
    if (target) {
      setSelectedPhoto(target);
    }
  };

  const onSubmit = async (data: TformEditValues) => {
    console.log("Form data:", data);
    try {
      let avatarUrl = user.avatar;
      if (selectedPhoto) {
        const formData = new FormData();
        formData.append("file", selectedPhoto);

        const response = await instanseAxios.post(`/upload`, formData);

        if (response.status !== 200)
          throw new Error("Ошибка загрузки аватарки");

        const { url } = await response.data;
        avatarUrl = url;
      }
      await userSessionUpdate({
        email: data.email,
        fullname: data.fullname,
        bio: data.bio || "",
        avatar: avatarUrl || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {active ? (
        <div className={Styles.container}>
          <div className={Styles.header}>
            <div className={Styles.backEl}>
              <div className={Styles.backEl__arrow}>
                <button onClick={close}>
                  <ArrowLeft color="gray" size={26} />
                </button>
              </div>
              <p>{t("EdProfile")}</p>
            </div>
          </div>
          <div className={Styles.container__content}>
            <div className={Styles.container__content__avatarBox}>
              <div className={Styles.Avatar}>
                {user?.avatar ? (
                  <Image
                    src={user?.avatar}
                    width={20000}
                    height={20000}
                    alt="Profile Image"
                  />
                ) : (
                  <div className={Styles.Avatar__avatar}>
                    <Image src={log} alt="" width={20000} height={20000} />
                    <p>{user?.fullname.substring(0, 1)}</p>
                  </div>
                )}
                <div onClick={() => setClicked(true)} className={Styles.input}>
                  <Camera className={Styles.icon} />
                  <input type="file" accept="image/*" onChange={ChangePhoto} />
                </div>
              </div>
            </div>
            <FormProvider {...form}>
              {" "}
              <form
                className={Styles.form}
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className={Styles.form__content}>
                  <FormEdit
                    name="fullname"
                    additionalLabel={`${t("firstName")} (${t("required")})`}
                    required={false}
                    classname={Styles.input}
                    placeholder=""
                  />{" "}
                  <FormEdit
                    name="email"
                    additionalLabel={`${t("email")} (${t("optional")})`}
                    required={false}
                    classname={Styles.input}
                    placeholder=""
                  />
                  <FormEdit
                    name="bio"
                    additionalLabel={t("bio")}
                    required={false}
                    classname={Styles.input}
                    placeholder=""
                  />
                </div>{" "}
                <p>{t("details")}</p>{" "}
                <div className={Styles.UsernameBox}>
                  <h1>{t("userName")}</h1>{" "}
                  <FormEdit
                    name="username"
                    additionalLabel={`${t("userName")} (${t("optional")})`}
                    required={false}
                    classname={Styles.input}
                    placeholder=""
                  />{" "}
                </div>{" "}
                {clicked ? (
                  <div className={Styles.confirmButton}>
                    <button>
                      <Check />
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </form>{" "}
            </FormProvider>
          </div>{" "}
        </div>
      ) : (
        <div className={Styles.unContainer}></div>
      )}
    </>
  );
};

export default EditDrawerBlock;
