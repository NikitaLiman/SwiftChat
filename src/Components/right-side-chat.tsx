"use client";

import React from "react";
import Styles from "../Sass/RightSide.module.scss";
import Bar from "../Components/Comp-blocks/top-bar";
import MessageBar from "./Comp-blocks/message-bar";
import io from "socket.io-client";
import Image from "next/image";
import { useChatStore } from "@/Zustand/lastMessage";
import InfoDrawer from "./Drawers/infoDrawer";
import UserPopUp from "./Comp-blocks/userPopUp";
import { ChatStore } from "@/Zustand/fetchStore";
import { Copy, Reply, Trash2 } from "lucide-react";
import PopUpConfirm from "./Comp-blocks/popUpConfirm";
import animationData from "../../public/animation/Animation - 1744213483935.json";
import { t } from "i18next";
import Lottie from "lottie-react";
import { useUserStatus } from "@/Zustand/statusOnline";
interface Props {
  session: any;
}
const SocketIo = io("https://socket-server-pdz2.onrender.com");

const RightSide: React.FC<Props> = ({ session }) => {
  const [newMessage, setNewMessage] = React.useState("");
  const [ContextMenu, setContextMenu] = React.useState<number | null>(null);
  const [newMessagePopUp, setNewMessagePopUp] = React.useState("");
  const [lastMessageId, setLastMessageId] = React.useState<number | null>(null);
  const [activePopUpMessageId, setActivePopUpMessageId] = React.useState<
    number | null
  >(null);
  const getMessages = ChatStore((state) => state.fetchMessages);
  const { messages } = ChatStore();
  const currentChat = ChatStore((state) => state.selectedChat);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const [onDrawer, setDrawer] = React.useState<boolean>(false);
  const [popupStyles, setPopupStyles] = React.useState<React.CSSProperties>({});
  const [popUpDelete, setPopupDelete] = React.useState<boolean>(false);
  const messageRefs = React.useRef<{ [key: number]: HTMLDivElement | null }>(
    {}
  );
  const [messageDeleteId, setMessageDeleteId] = React.useState<number | null>(
    null
  );
  const [currentText, setCurrentText] = React.useState<{
    id: number;
    text: string;
    sender: {
      fullname: string;
    };
  } | null>(null);
  const [searchResults, setSearchResults] = React.useState<number[]>([]);

  const [currentResultIndex, setCurrentResultIndex] = React.useState<{
    index: number;
    messageId: number | null;
  }>({
    index: -1,
    messageId: null,
  });
  const [copied, setCopied] = React.useState<boolean>(false);
  const fetchMessages = async () => {
    try {
      getMessages(Number(currentChat?.id));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  console.log(currentChat, "currentChat");
  React.useEffect(() => {
    if (!currentChat || !currentChat.id) return;
    SocketIo.emit("userOnline", session.user.id);
    fetchMessages();
    SocketIo.emit("joinChat", currentChat.id);
    const handleUserStatusUpdate = ({ userId, isOnline, lastSeen }: any) => {
      console.log("Received status update:", userId, isOnline, lastSeen);
      useUserStatus.getState().setUseStatus(userId, isOnline);
    };
    const handleNewMessage = (message: any) => {
      setLastMessageId(message.id);
    };
    SocketIo.on("userStatusUpdate", handleUserStatusUpdate);
    SocketIo.on("newMessage", handleNewMessage);
    SocketIo.on("message", handleNewMessage);
    SocketIo.on("messageDeleted", async () => {
      await fetchMessages();
    });
    return () => {
      SocketIo.off("newMessage", handleNewMessage);
      SocketIo.off("userStatusUpdate", handleUserStatusUpdate);
    };
  }, [currentChat?.id, lastMessageId]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const data = {
      chatId: currentChat?.id,
      senderId: session.user.id,
      text: newMessage || newMessagePopUp,
      replyToId: currentText ? currentText.id : null,
    };

    if (newMessage.trim()) {
      SocketIo.emit("message", data);

      useChatStore.getState().setMesge(newMessage);
    }
    if (newMessagePopUp.trim()) {
      SocketIo.emit("message", data);
      useChatStore.getState().setMesge(newMessage);
    }
    setNewMessage("");
    setNewMessagePopUp("");
    setCurrentText(null);
  };
  const onCLose = () => {
    setDrawer(!onDrawer);
  };

  const toggleUserPopUp = (messageId: number) => {
    setActivePopUpMessageId(
      activePopUpMessageId === messageId ? null : messageId
    );
  };

  const deleteMessageAndUpdate = async (messageId: number, chatId: number) => {
    try {
      await SocketIo.emit("messageDeleted", {
        messageId,
        chatId,
      });
      await fetchMessages();
      useChatStore.getState().setMesge(newMessage);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleDeleteMessage = () => {
    if (messageDeleteId !== null && currentChat) {
      deleteMessageAndUpdate(messageDeleteId, Number(currentChat?.id));
      setMessageDeleteId(null);
    }
  };

  const toggleMessagesPopup = React.useCallback(
    (e: React.MouseEvent, messageId: number) => {
      e.preventDefault();
      setContextMenu(ContextMenu === messageId ? null : messageId);

      if (ContextMenu !== messageId) {
        const messageElement = messageRefs.current[messageId];
        if (messageElement) {
          const styles = calculatePopupPosition(messageElement);
          setPopupStyles(styles);
        }
      }
    },
    [ContextMenu]
  );

  const calculatePopupPosition = React.useCallback(
    (MessageElement: HTMLDivElement) => {
      const messageRect = MessageElement.getBoundingClientRect();
      const ContainerRect =
        messagesEndRef.current?.parentElement?.getBoundingClientRect();
      if (!ContainerRect) {
        return {};
      }
      const styles: React.CSSProperties = {
        position: "absolute",
      };

      const spaceBelow = ContainerRect.bottom - messageRect.bottom;
      const heightPopUp = 120;

      if (spaceBelow < heightPopUp) {
        styles.bottom = `${messageRect.height + 10}px`;
        styles.left = "0";
      } else {
        styles.top = `${messageRect.height + 10}px`;
        styles.left = "0";
      }

      return styles;
    },

    []
  );
  const CopyFunction = (text: string) => {
    console.log(text, "text");
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };
  const MessagesList = [
    { key: "Reply", icon: <Reply /> },
    { key: "Copy Text", icon: <Copy /> },
    { key: "Delete", icon: <Trash2 />, delete: deleteMessageAndUpdate },
  ];

  const onClose = () => {
    setPopupDelete(false);
  };

  const handleReply = (message: any) => {
    setCurrentText({
      id: message.id,
      text: message.text,
      sender: {
        fullname: message.sender.fullname,
      },
    });

    setContextMenu(null);
  };
  const cancelReply = () => {
    setCurrentText(null);
  };

  const scrollToMessage = (messageId: number) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      messageElement.classList.add(Styles.highlightMessage);

      setTimeout(() => {
        messageElement.classList.remove(Styles.highlightMessage);
      }, 2000);
    }
  };

  return (
    <>
      <div className={Styles.container}>
        {currentChat ? (
          <div className={Styles.flexContainer}>
            <Bar
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              currentResultIndex={currentResultIndex}
              setCurrentResultIndex={setCurrentResultIndex}
              scrollToMessage={scrollToMessage}
              session={session}
              setDrawer={onCLose}
              currentChat={currentChat || undefined}
            />
            {messages.length > 0 ? (
              <div className={Styles.flexContainer__content}>
                <div className={Styles.flexContainer__content__messages}>
                  {messages?.map((message, i) => (
                    <div className={Styles.messagegroup} key={i}>
                      <div
                        className={
                          String(message?.sender?.id) ===
                          String(session.user.id)
                            ? Styles.second
                            : Styles.first
                        }
                      >
                        <div
                          ref={(el) => {
                            if (el) {
                              messageRefs.current[message.id] = el;
                            }
                          }}
                          className={Styles.info}
                        >
                          <div
                            onClick={() => toggleUserPopUp(message.id)}
                            className={Styles.logo}
                          >
                            {message.sender?.avatar ? (
                              <Image
                                width={80}
                                height={80}
                                src={message?.sender?.avatar}
                                alt="avatar"
                              />
                            ) : (
                              <div className={Styles.logo__avatar}>
                                {message.sender?.fullname?.substring(0, 1)}
                              </div>
                            )}
                          </div>
                          <div
                            onContextMenu={(e) => {
                              toggleMessagesPopup(e, message.id);
                              setMessageDeleteId(message.id);
                            }}
                            className={Styles.user}
                          >
                            <h2>{message.sender.fullname}</h2>{" "}
                            {message.replyToId && (
                              <div className={Styles.replyInfo}>
                                <span className={Styles.replyName}>
                                  Reply to {message?.replyTo?.sender?.fullname}
                                </span>
                                <p className={Styles.replyText}>
                                  {" "}
                                  {message?.replyTo?.text}
                                </p>
                              </div>
                            )}
                            <p
                              className={`
                         ${
                           searchResults.some(
                             (item: any) => item.id === message.id
                           )
                             ? Styles.foundMessages
                             : ""
                         }
                         ${
                           currentResultIndex.messageId === message.id
                             ? Styles.curentFoundMessage
                             : ""
                         }
                       `}
                            >
                              <i className={Styles.corner}></i>
                              {message.text}
                            </p>
                          </div>{" "}
                          {activePopUpMessageId === message.id && (
                            <UserPopUp
                              session={session}
                              messageUser={message.sender}
                              onCLose={onCLose}
                              newMessage={newMessagePopUp}
                              setNewMessage={setNewMessagePopUp}
                              sendMessage={sendMessage}
                            />
                          )}
                          {ContextMenu === message.id && (
                            <div
                              style={popupStyles}
                              key={message.id}
                              className={Styles.MessagesPopUp}
                            >
                              <ul>
                                {MessagesList.map((item, i) => (
                                  <li
                                    onClick={() => {
                                      if (item.key === "Delete") {
                                        setPopupDelete(true);
                                        setContextMenu(null);
                                      } else if (item.key === "Copy Text") {
                                        CopyFunction(message.text);
                                      } else if (item.key === "Reply") {
                                        handleReply(message);
                                      }
                                    }}
                                    key={i}
                                  >
                                    <span>{item.icon}</span>
                                    {item.key}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            ) : (
              <div className={Styles.NoMessages}>
                <div className={Styles.NoMessages__content}>
                  <div className={Styles.NoMessages__content__text}>
                    <h1>{t("No messages here yet")}</h1>
                    <p>{t("Send a message")}</p>
                  </div>
                  <div className={Styles.NoMessages__content__gif}>
                    <Lottie
                      animationData={animationData}
                      loop
                      autoplay
                      style={{ width: 200 }}
                    />
                  </div>
                </div>
              </div>
            )}
            <MessageBar
              setCurrentText={setCurrentText}
              replyTo={currentText}
              cancelReply={cancelReply}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
            />
            {popUpDelete ? (
              <PopUpConfirm onDelete={handleDeleteMessage} onClose={onClose} />
            ) : null}
          </div>
        ) : null}
        {copied ? (
          <div className={Styles.copied}>
            <div className={Styles.copied__content}>
              <p>{t("Copied")}</p>
            </div>
          </div>
        ) : null}
        {currentChat?.id ? (
          <InfoDrawer onCLose={onCLose} onDrawer={onDrawer} session={session} />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default RightSide;
