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
  const safeUser = React.useMemo(() => {
    return user ? JSON.parse(JSON.stringify(user)) : null;
  }, [user]);
  const [avatar, setAvatar] = React.useState(
    safeUser?.cvBase64
      ? `data:${safeUser.mimeType};base64,${safeUser.cvBase64}`
      : log
  );
  const [clicked, setClicked] = React.useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = React.useState<File | null>(null);
  console.log(selectedPhoto, "photo");
  const form = useForm({
    resolver: zodResolver(EditProfile),
    defaultValues: {
      fullname: safeUser?.fullname || "",
      email: safeUser?.email || "",
      bio: safeUser?.bio || "",
      username: safeUser?.username || "",
    },
  });

  const { watch } = form;

  React.useEffect(() => {
    if (safeUser) {
      form.reset({
        fullname: safeUser?.fullname || "",
        email: safeUser?.email || "",
        bio: safeUser?.bio || "",
        username: safeUser?.username || "",
      });
    }
  }, [safeUser, form]);

  React.useEffect(() => {
    const subscription = watch((value) => {
      const isChanged = Object.keys(value).some(
        (key) => value[key as keyof TformEditValues] !== safeUser?.[key]
      );
      setClicked(isChanged);
    });
    return () => subscription.unsubscribe();
  }, [watch, safeUser]);

  const ChangePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      setAvatar(URL.createObjectURL(file)); // сразу показать на UI
      setClicked(true);
    }
  };

  const onSubmit = async (data: TformEditValues) => {
    try {
      let updatedAvatar = safeUser?.avatar;

      if (selectedPhoto) {
        const formData = new FormData();
        formData.append("file", selectedPhoto);
        formData.append("email", data.email);
        const response = await instanseAxios.post("/upload", formData);
        if (response.status !== 200)
          throw new Error("Ошибка загрузки аватарки");

        const { cvBase64, mimeType } = response.data;

        updatedAvatar = `data:${mimeType};base64,${cvBase64}`;
      }

      await userSessionUpdate({
        fullname: data.fullname,
        email: data.email,
        bio: data.bio || "",
        avatar: updatedAvatar,
      });

      // сразу обновляем локальный state, чтобы UI поменялся
      setClicked(false);
    } catch (error) {
      console.error(error);
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
                {safeUser?.avatar ? (
                  <Image
                    src={
                      avatar
                        ? avatar
                        : `data:${safeUser.mimeType};base64,${safeUser.cvBase64}`
                    }
                    width={200}
                    height={200}
                    alt="Profile Image"
                  />
                ) : (
                  <div className={Styles.Avatar__avatar}>
                    <Image src={log} alt="" width={20000} height={20000} />
                    <p>{safeUser?.fullname?.substring(0, 1)}</p>
                  </div>
                )}
                <div onClick={() => setClicked(true)} className={Styles.input}>
                  <Camera className={Styles.icon} />
                  <input type="file" accept="image/*" onChange={ChangePhoto} />
                </div>
              </div>
            </div>
            <FormProvider {...form}>
              <form
                className={Styles.form}
                onSubmit={form.handleSubmit(onSubmit)}>
                <div className={Styles.form__content}>
                  <FormEdit
                    name="fullname"
                    additionalLabel={`${t("firstName")} (${t("required")})`}
                    required={false}
                    classname={Styles.input}
                    placeholder=""
                  />
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
                </div>
                <p>{t("details")}</p>
                <div className={Styles.UsernameBox}>
                  <h1>{t("userName")}</h1>
                  <FormEdit
                    name="username"
                    additionalLabel={`${t("userName")} (${t("optional")})`}
                    required={false}
                    classname={Styles.input}
                    placeholder=""
                  />
                </div>
                {clicked ? (
                  <div className={Styles.confirmButton}>
                    <button>
                      <Check />
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </form>
            </FormProvider>
          </div>
        </div>
      ) : (
        <div className={Styles.unContainer}></div>
      )}
    </>
  );
};

export default EditDrawerBlock;
