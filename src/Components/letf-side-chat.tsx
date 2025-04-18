"use client";
// eslint-disable-next-line react-hooks/rules-of-hooks
import React from "react";
import Styles from "../Sass/Chat.module.scss";
import Search from "./Comp-blocks/Search";
import HamBurger from "./Comp-blocks/ham-bur";
import ChatBLock from "./Comp-blocks/chat-block";
import SettingDrawer from "./Drawers/Setting-drawer";
import { ArrowLeft, MessageSquare, Trash2 } from "lucide-react";
import { useChatStore } from "@/Zustand/lastMessage";
import { ChatStore } from "@/Zustand/fetchStore";
import { t } from "i18next";

interface Props {
  session: any;
}

const Chat: React.FC<Props> = ({ session }) => {
  const { chats } = ChatStore();
  console.log(chats, "awda");
  const fetchChat = ChatStore((state) => state.fetchChat);
  const deleteChat = ChatStore((state) => state.deleteChat);
  const contactReceived = ChatStore((state) => state.contactReceived);
  const contactSent = ChatStore((state) => state.contactSent);
  console.log(contactReceived, "contactReceived");
  console.log(contactSent, "contactSent");
  const [onClose, setClose] = React.useState<boolean>(false);
  const [width, setWidth] = React.useState(450);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [pressed, setpressed] = React.useState<boolean>(false);
  const [menuPosition, setMenuPosition] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedChatId, setSelectedChatId] = React.useState<number | null>(
    null
  );
  const selectedChat = ChatStore((state) => state.useChatset);
  const messages = useChatStore((state) => state.Mesge);
  const [click, useClicked] = React.useState<boolean>(false);
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  const isResizing = React.useRef(false);
  const initialX = React.useRef(0);
  const initialWidth = React.useRef(0);

  React.useEffect(() => {
    const handleResize = () => {
      const mobileBreakpoint = 768;
      const isMobileView = window.innerWidth <= mobileBreakpoint;
      setIsMobile(isMobileView);

      if (isMobileView) {
        if (isOpen) {
          setWidth(window.innerWidth);
        } else {
          setWidth(0);
        }
      } else {
        setWidth(Math.min(450, Math.max(300, window.innerWidth * 0.3)));
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const startHandle = (e: React.MouseEvent) => {
    if (isMobile) return;

    isResizing.current = true;
    initialX.current = e.clientX;
    initialWidth.current = width;

    e.preventDefault();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;

    const newWidth = initialWidth.current + (e.clientX - initialX.current);

    const maxWidth = Math.min(850, window.innerWidth * 0.8);
    if (newWidth >= 300 && newWidth <= maxWidth) {
      setWidth(newWidth);
    }
  };

  const deleteChat1 = async (chatId: number) => {
    try {
      deleteChat(chatId);
      ChatStore.setState({ selectedChat: null });
    } catch (error) {
      console.log(error);
    }
  };

  const onMouseUp = () => {
    isResizing.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const RequestChat = async () => {
    await fetchChat(session.user.id);
  };

  const handleNewChatCreated = async () => {
    await fetchChat(session.user.id);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  React.useEffect(() => {
    try {
      if (session?.user?.id) {
        RequestChat();
      }
    } catch (error) {
      console.error("Error", error);
    }
  }, [session.user.id, session.user.name, session.user?.avatar, messages]);

  const handlePosition = (e: MouseEvent, chatId: number) => {
    e.preventDefault();
    setpressed(!pressed);
    const { clientX, clientY } = e;
    setSelectedChatId(chatId);
    setMenuPosition({ x: clientX, y: clientY });
  };

  const listofrcm = [
    {
      icon: <Trash2 size={20} color="#DC143C" />,
      name: "Delete Chat",
      click: deleteChat1,
    },
  ];
  const HandleToogle = () => {
    useClicked(!click);
  };
  return (
    <div
      className={`${Styles.resizeCustom} ${isMobile ? Styles.mobileView : ""}`}
    >
      <div
        ref={containerRef}
        style={{
          width: isMobile ? (isOpen ? "100%" : "0px") : `${width}px`,
          transform:
            isMobile && !isOpen ? "translateX(-100%)" : "translateX(0)",
        }}
        className={Styles.container}
      >
        <div className={Styles.container__bar}>
          {click ? (
            <div className={Styles.arrow}>
              <button onClick={() => HandleToogle()}>
                <ArrowLeft color="rgb(170, 170, 170)" size={26} />
              </button>
            </div>
          ) : (
            <HamBurger
              chat={chats}
              contactReceived={contactReceived}
              handleNewChatCreated={handleNewChatCreated}
              session={session}
              onOpen={() => setClose((prev) => !prev)}
              active={onClose}
            />
          )}
          <Search
            onNewChatCreated={handleNewChatCreated}
            click={click}
            onClick={useClicked}
            currentUserId={session.user.id}
          />
        </div>
        <div className={Styles.container__content}>
          {chats.length > 0 ? (
            chats.map((chatItem, i) => (
              <div
                onContextMenu={(e) =>
                  handlePosition(e.nativeEvent, chatItem.id)
                }
                onClick={() => {
                  selectedChat(chatItem);
                  if (isMobile) {
                    toggleSidebar();
                  }
                }}
                key={i}
              >
                <ChatBLock chat={chatItem} />
                {pressed && menuPosition && (
                  <div
                    className={Styles.rcm}
                    style={{
                      position: "absolute",
                      left: menuPosition.x,
                      top: menuPosition.y,
                    }}
                  >
                    <ul>
                      {listofrcm.map((item, i) => (
                        <li
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (selectedChatId !== null) {
                              deleteChat1(selectedChatId);
                              setpressed(false);
                            }
                          }}
                          key={i}
                        >
                          <span>{item.icon}</span> {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={Styles.NoChats}>
              <div className={Styles.NoChats__icon}>
                <MessageSquare />
              </div>
              <h3 className={Styles.NoChats__title}>
                {t("No chats available")}
              </h3>
              <p className={Styles.NoChats__message}>{t("noMessages")}</p>
            </div>
          )}
        </div>
      </div>

      <SettingDrawer
        active={onClose}
        onOpen={() => setClose((prev) => !prev)}
        session={session}
      />

      {isMobile && !isOpen && (
        <button className={Styles.closeMobileBtn} onClick={toggleSidebar}>
          <ArrowLeft color="rgb(170, 170, 170)" size={20} />
        </button>
      )}

      {!isMobile && (
        <div onMouseDown={startHandle} className={Styles.resizeHandle}></div>
      )}
    </div>
  );
};

export default Chat;
