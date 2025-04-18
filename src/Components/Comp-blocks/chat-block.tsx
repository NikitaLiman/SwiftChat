"use client";
import React from "react";
import Styles from "../../Sass/ChatBlock.module.scss";

import Image from "next/image";

import { useChatStore } from "@/Zustand/lastMessage";
import { Bookmark } from "lucide-react";
import { t } from "i18next";
import { Chat } from "../../../interfaces";
interface Props {
  chat: Chat;
}

const ChatBLock: React.FC<Props> = ({ chat }) => {
  const lastMessage = useChatStore((state) => state.lastMessage[chat.id]);
  console.log(lastMessage, "lastMessage");
  React.useEffect(() => {}, [chat]);
  return (
    <div className={Styles.container}>
      <div className={Styles.container__content}>
        <div className={Styles.logo}>
          {chat?.name === "Saved Messages" ? (
            <div className={Styles.logo__avatar}>
              <Bookmark />
            </div>
          ) : chat?.users?.[0]?.user?.avatar ? (
            <Image
              width={80}
              height={80}
              src={chat?.users?.[0]?.user.avatar}
              alt="User Avatar"
            />
          ) : (
            <div className={Styles.logo__avatar}>
              {chat?.users?.[0]?.user.fullname.substring(0, 1)}
            </div>
          )}
        </div>

        <div className={Styles.text_info}>
          {chat?.name === "Saved Messages" ? (
            <h1>{t("Saved Messages")}</h1>
          ) : (
            <h1>{chat?.users?.[0]?.user.fullname}</h1>
          )}
          <p>{lastMessage || t("No messages yet")}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBLock;
