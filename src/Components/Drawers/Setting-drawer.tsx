"use client";
import React from "react";
import Styles from "../../Sass/StDrawer.module.scss";
import {
  ArrowLeft,
  AtSign,
  CircleAlert,
  EllipsisVertical,
  Languages,
  LogOut,
  Pencil,
  Phone,
} from "lucide-react";
import log from "../../img/623db209553ff3994165289505307556.png";
import Image from "next/image";
import { signOut } from "next-auth/react";
import EditDrawer from "./EditDrawer";
import LanguageDrawer from "./LanguageDrawer";
import { t } from "i18next";
import { instanseAxios } from "../../../servises/instance";

interface Props {
  active: boolean;
  onOpen: () => void;
  session: any;
}

const SettingDrawer: React.FC<Props> = ({ active, onOpen, session }) => {
  const [logOut, setLogOut] = React.useState<boolean>(false);
  const [onClose, setClose] = React.useState<boolean>(false);
  const [onCloselg, setonCloselg] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<any>(null);
  const getUser = async () => {
    try {
      const res = await instanseAxios.get(`/user?email=${session.user.email}`);
      const data = await res.data;
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  React.useEffect(() => {
    if (session?.user?.email) {
      getUser();
    }
  }, [session]);
  const close = () => {
    setClose(false);
  };
  const closeLg = () => {
    setonCloselg(false);
  };

  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const clickAway = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setLogOut(false);
      }
    };
    document.addEventListener("mousedown", clickAway);
    return () => document.removeEventListener("mousedown", clickAway);
  }, []);

  const list = [
    { icon: <Phone />, include: "+11 111 111 111", span: t("Phone") },
    { icon: <AtSign />, include: `@${user?.fullname}`, span: t("userName") },
    {
      icon: <CircleAlert />,
      include: user?.bio?.length > 0 ? user?.bio : "",
      span: t("bio"),
    },
  ];
  const listOpt = [
    {
      name: t("language"),
      icon: <Languages />,
      onClick: () => setonCloselg(!onCloselg),
    },
  ];

  return (
    <>
      {active ? (
        <div className={Styles.containerActive}>
          {" "}
          <div className={Styles.Header}>
            <div className={Styles.leftside}>
              <div className={Styles.leftside__arrow}>
                <button onClick={onOpen}>
                  <ArrowLeft color="gray" size={26} />
                </button>
              </div>
              <p>{t("settings")}</p>
            </div>
            <div className={Styles.rightside}>
              <div onClick={() => setClose(!onClose)} className={Styles.Pencil}>
                <Pencil size={20} />
              </div>
              <div onClick={() => setLogOut(!logOut)} className={Styles.dots}>
                <EllipsisVertical size={20} />
                {logOut ? (
                  <div
                    ref={ref}
                    onClick={() => signOut()}
                    className={Styles.dots__cont}
                  >
                    <i>
                      <LogOut />
                    </i>
                    {t("logout")}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className={Styles.containerActive__content}>
            <div className={Styles.MenuSelfProfile}>
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
                <div className={Styles.Info_User}>
                  <p>{user?.fullname}</p>
                  <span>{t("Online")}</span>
                </div>
              </div>
              <div className={Styles.info}>
                {list.map((item, index) => (
                  <div
                    key={index}
                    className={`${Styles.info__box} ${
                      item.span === "Bio" ? Styles.off : ""
                    }`}
                  >
                    {" "}
                    {item.icon}
                    <div className={Styles.info__box__text}>
                      <p>{item.include}</p>
                      <span>{item.span}</span>
                    </div>
                  </div>
                ))}{" "}
              </div>
            </div>
            <div className={Styles.AdditionalOptions}>
              {listOpt.map((item, i) => (
                <div
                  onClick={item.onClick}
                  className={Styles.AdditionalOptions__box}
                  key={i}
                >
                  {item.icon}
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={Styles.container}></div>
      )}
      <EditDrawer session={session} active={onClose} close={close} />
      <LanguageDrawer active={onCloselg} onOpen={closeLg} />
    </>
  );
};

export default SettingDrawer;
