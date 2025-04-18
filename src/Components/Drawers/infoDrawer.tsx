"use client";
import Styles from "../../Sass/infoDrawer.module.scss";
import React from "react";

import { AtSign, Bookmark, CircleAlert, Phone, X } from "lucide-react";

import { t } from "i18next";
import log from "../../img/623db209553ff3994165289505307556.png";
import Image from "next/image";
import { ChatStore } from "@/Zustand/fetchStore";
import { useUserStatus } from "@/Zustand/statusOnline";
import { Chat } from "../../../interfaces";

interface Props {
  session: any;
  onDrawer: boolean;
  onCLose: () => void;
}

const InfoDrawer: React.FC<Props> = ({
  session,
  onDrawer = false,
  onCLose,
}) => {
  const { chats } = ChatStore();
  const fetchChat = ChatStore((state) => state.fetchChat);
  const currentChat = ChatStore((state) => state.selectedChat);
  const fetchUsers = async () => {
    try {
      await fetchChat(session.user.id);
    } catch (error) {
      console.error("Ошибка при загрузке чатов:", error);
    }
  };
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const otherUser1 = React.useMemo(() => {
    return chats.find((id) => id.id === currentChat?.id);
  }, [chats, currentChat]);
  const user = otherUser1?.users?.[0]?.user;
  const userStatuses = useUserStatus((state) => state.useStatus);
  const list = [
    { icon: <Phone />, include: "+11 111 111 111", span: t("Phone") },
    {
      icon: <AtSign />,
      include: user?.fullname ? `@${user.fullname}` : "",
      span: t("userName"),
    },
    {
      icon: <CircleAlert />,
      include: user?.bio?.length ? user.bio : "",
      span: t("bio"),
    },
  ];
  const userId = currentChat?.users?.[0]?.user?.id;
  return (
    <>
      {onDrawer ? (
        <div className={Styles.containerActive}>
          <div className={Styles.containerActive__header}>
            <div onClick={onCLose} className={Styles.cross}>
              <X size={25} />
            </div>
            <div className={Styles.Pencil}>
              <p>{t("information")}</p>
            </div>
          </div>
          <div className={Styles.Avatar}>
            {otherUser1?.name === "Saved Messages" ? (
              <div className={Styles.Avatar__avatar}>
                <Image src={log} alt="" width={20000} height={20000} />
                <p>
                  <Bookmark size={50} />
                </p>
              </div>
            ) : otherUser1?.users?.[0]?.user?.avatar ? (
              <Image
                src={otherUser1.users[0]?.user.avatar}
                width={20000}
                height={20000}
                alt="Profile Image"
              />
            ) : (
              <div className={Styles.Avatar__avatar}>
                <Image src={log} alt="" width={20000} height={20000} />
                <p>{otherUser1?.users?.[0]?.user?.fullname?.substring(0, 1)}</p>
              </div>
            )}

            {otherUser1?.name === "Saved Messages" ? null : (
              <div className={Styles.infoUser}>
                <h1>{otherUser1?.users?.[0]?.user?.fullname}</h1>
                <>
                  {userId && userStatuses[userId] ? (
                    <p className="online">{t("Online")}</p>
                  ) : (
                    <p className="offline">{t("Offline")}</p>
                  )}
                </>
              </div>
            )}
          </div>
          {otherUser1?.name === "Saved Messages" ? (
            ""
          ) : (
            <div className={Styles.info}>
              {list?.map((item, index) => (
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
          )}
        </div>
      ) : (
        <div className={Styles.containerNull}></div>
      )}
    </>
  );
};

export default InfoDrawer;
