"use client";
import React from "react";
import Styles from "../../Sass/Ham.module.scss";
import {
  Bookmark,
  CircleHelp,
  Moon,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { useTheme } from "../client-page";
import { t } from "i18next";
import { CreateSavedChat } from "@/app/actions";
import ContactDrawer from "../Drawers/conctactDrawer";
import { Chat } from "../../../interfaces";

interface Props {
  onOpen: () => void;
  active: boolean;
  session: any;
  handleNewChatCreated: () => Promise<void>;
  contactReceived: any[];
  chat: Chat[];
}

const HamBurger: React.FC<Props> = ({
  onOpen,
  active,
  session,
  handleNewChatCreated,
  contactReceived,
  chat,
}) => {
  const [ham, setHam] = React.useState<boolean>(false);
  const [isFocus, setFocus] = React.useState<boolean>(false);
  const [isOn, setIsOn] = React.useState<boolean>(false);
  const [ActiveDrawer, setActiveDrawer] = React.useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const focused = () => setFocus(true);
  const unfocused = () => setFocus(false);

  const HandleCLick = () => {
    setHam(!ham);
  };

  React.useEffect(() => {
    if (!active) {
      setHam(false);
    }
  }, [active]);

  const SavedChat = async () => {
    await CreateSavedChat(Number(session.user.id));
    handleNewChatCreated();
  };

  const OnClose = () => {
    setActiveDrawer(false);
  };

  const hasPendingRequestsForUser = contactReceived.some(
    (contact) =>
      contact.accepted === false &&
      contact.contactId === Number(session.user.id)
  );

  React.useEffect(() => {
    if (hasPendingRequestsForUser) {
      console.log("Are new requests");
    }
  }, [contactReceived, session.user.id]);

  const list = [
    {
      title: t("settings"),
      icon: <Settings color="gray" size={20} />,
      onClick: onOpen,
    },
    {
      title: t("Saved Messages"),
      icon: <Bookmark color="gray" size={20} />,
      create: SavedChat,
    },
    {
      title: t("Contacts"),
      icon: <UserRound color="gray" size={20} />,
      open: () => setActiveDrawer(true),
    },
    {
      title: theme === "light" ? t("light Mode") : t("Dark Mode"),
      icon:
        theme === "light" ? (
          <Sun color="gray" size={20} />
        ) : (
          <Moon color="gray" size={20} />
        ),
      button: (
        <div
          className={`${Styles.toggleswitch} ${isOn ? Styles.on : Styles.off}`}
          onClick={() => {}}
        >
          <div className={Styles.togglethumb} />
        </div>
      ),
    },
    {
      title: t("SwiftChat Features"),
      icon: <CircleHelp color="gray" size={20} />,
    },
  ];

  return (
    <>
      <div className={Styles.container}>
        <div
          style={
            ham
              ? {
                  borderRadius: "50%",
                  backgroundColor: "var(--ham-hover)",
                }
              : {}
          }
          onClick={HandleCLick}
          className={Styles.Ham}
        >
          <span></span>
          <span></span>
          <span></span>
          {hasPendingRequestsForUser && <div className={Styles.addDots}></div>}
        </div>
        {ham && !active && (
          <div onFocus={focused} onBlur={unfocused} className={Styles.hamMenu}>
            <ul>
              {list.map((item, index) => (
                <li
                  style={
                    item.title === t("Contacts") && hasPendingRequestsForUser
                      ? { textDecoration: "underline" }
                      : {}
                  }
                  key={index}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    if (item.create) item.create();
                    if (index === 3) {
                      setIsOn((prev) => !prev);
                      toggleTheme();
                    }
                    if (item.open) item.open();
                  }}
                >
                  <i>{item.icon}</i>
                  {item.title}
                  {item.button}
                </li>
              ))}
              <p>SwiftChat Web A 1.0.0</p>
            </ul>
          </div>
        )}
      </div>
      <ContactDrawer
        handleNewChatCreated={handleNewChatCreated}
        chat={chat}
        session={session}
        OnClose={OnClose}
        active={ActiveDrawer}
      />
    </>
  );
};

export default HamBurger;
