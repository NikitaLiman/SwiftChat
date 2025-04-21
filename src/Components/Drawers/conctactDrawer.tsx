"use client";
import React from "react";
import Styles from "../../Sass/contactDrawer.module.scss";
import { ArrowLeft } from "lucide-react";
import { t } from "i18next";
import { instanseAxios } from "../../../servises/instance";
import Image from "next/image";
import { deleteContact } from "../../../lib/SendContactRequest";
import { ChatStore } from "@/Zustand/fetchStore";
import { Chat } from "../../../interfaces";

interface Props {
  active: boolean;
  OnClose: () => void;
  session: any;
  chat: Chat[];
  handleNewChatCreated: () => Promise<void>;
  setIsOpen: (boolean: boolean) => void;
}

const ContactDrawer: React.FC<Props> = ({
  active,
  OnClose,
  session,
  chat,
  handleNewChatCreated,
  setIsOpen,
}) => {
  const [contacts, setContacts] = React.useState<{
    send: any[];
    received: any[];
  }>({ send: [], received: [] });
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  React.useEffect(() => {
    const mobileBreakpoint = 768;
    const mobileView = window.innerWidth <= mobileBreakpoint;
    if (mobileView) {
      setIsMobile(true);
    }
  }, []);
  const selectedChat = ChatStore((state) => state.useChatset);
  const acceptRequest = async (userId: number, contactId: number) => {
    try {
      await instanseAxios.patch(`/Contacts/accept`, {
        userId,
        contactId,
      });
      getContacts();
    } catch (error) {
      console.log(error);
    }
  };

  const getContacts = async () => {
    try {
      const res = await instanseAxios.get(
        `/Contacts?userId=${Number(session.user.id)}`
      );
      setContacts(res.data);
      console.log(res.data, "contacts data");
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (active) {
      getContacts();
    }
  }, [active, session]);
  const closeDrawer = () => {
    OnClose();
    setIsOpen(false);
  };
  const pendingRequests =
    contacts.received?.filter((item) => !item.accepted) || [];
  const acceptedContacts = [
    ...(contacts.send?.filter((item) => item.accepted) || []),
    ...(contacts.received?.filter((item) => item.accepted) || []),
  ];
  console.log(contacts, "chatchat");
  console.log(chat, "chatchatchatchat");

  const TargetUsersId = contacts.send.map((item) => item.contact.id);
  const filteredChats = chat.filter((chat) =>
    chat.users.some((u) => TargetUsersId.includes(u.user.id))
  );

  const CreateChat = async (currentUserId: number, TargetUserId: number) => {
    await instanseAxios.post(`/ChatCreate`, {
      currentUserId: Number(currentUserId),
      TargetUserId,
    });
  };
  return (
    <>
      {active ? (
        <div className={Styles.container}>
          <div className={Styles.Header}>
            <div className={Styles.leftside}>
              <div className={Styles.leftside__arrow}>
                <button onClick={OnClose}>
                  <ArrowLeft color="gray" size={26} />
                </button>
              </div>
              <p>{t("contacts")}</p>
            </div>
          </div>

          <div className={Styles.section}>
            <h2 className={Styles.sectionTitle}>{t("contactRequests")}</h2>
            <div className={Styles.requests}>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((item, i) => (
                  <div key={i} className={Styles.requests__box}>
                    <div className={Styles.requests__content}>
                      <div className={Styles.logo}>
                        {item.user.avatar ? (
                          <Image
                            width={54}
                            height={54}
                            src={item.user.avatar}
                            alt="User Avatar"
                            className={Styles.logo__img}
                          />
                        ) : (
                          <div className={Styles.logo__avatar}>
                            {item.user.fullname.substring(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className={Styles.text_info}>
                        <h1>{item.user.fullname}</h1>
                      </div>
                      <div className={Styles.actionButtons}>
                        <button
                          onClick={() =>
                            acceptRequest(
                              Number(item.userId),
                              Number(item.contactId)
                            )
                          }
                          className={Styles.acceptButton}
                        >
                          {t("accept")}
                        </button>
                        <button
                          onClick={() =>
                            deleteContact(
                              Number(item.userId),
                              Number(item.contactId)
                            )
                          }
                          className={Styles.declineButton}
                        >
                          {t("decline")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={Styles.emptyState}>
                  {t("noContactRequests")}
                </div>
              )}
            </div>
          </div>

          <div className={Styles.section}>
            <h2 className={Styles.sectionTitle}>{t("myContacts")}</h2>
            <div className={Styles.contacts}>
              {acceptedContacts.length > 0 ? (
                acceptedContacts.map((item, i) => (
                  <div key={i} className={Styles.contact__box}>
                    <div
                      onClick={async () => {
                        const contactId = item.contact
                          ? item.contact.id
                          : item.user.id;
                        const OpenChat = filteredChats?.find((chat) =>
                          chat.users.some((u) => u.user.id === contactId)
                        );
                        if (OpenChat) {
                          selectedChat(OpenChat);
                        }
                        if (!OpenChat) {
                          await CreateChat(
                            session?.user?.id,
                            item?.contact?.id
                          );
                          await handleNewChatCreated();

                          const updatedChat = ChatStore.getState().chats;
                          const newChat = updatedChat.find((chat) =>
                            chat.users.some((u) => u.user.id === contactId)
                          );
                          if (newChat) {
                            selectedChat(newChat);
                          }
                        }
                        if (isMobile) {
                          closeDrawer();
                        }
                      }}
                      className={Styles.contact__content}
                    >
                      <div className={Styles.logo}>
                        {item.contact ? (
                          item.contact.avatar ? (
                            <Image
                              width={54}
                              height={54}
                              src={item.contact.avatar}
                              alt="Contact Avatar"
                              className={Styles.logo__img}
                            />
                          ) : (
                            <div className={Styles.logo__avatar}>
                              {item.contact.fullname
                                .substring(0, 1)
                                .toUpperCase()}
                            </div>
                          )
                        ) : item.user.avatar ? (
                          <Image
                            width={54}
                            height={54}
                            src={item.user.avatar}
                            alt="Contact Avatar"
                            className={Styles.logo__img}
                          />
                        ) : (
                          <div className={Styles.logo__avatar}>
                            {item.user.fullname.substring(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className={Styles.text_info}>
                        <h1>
                          {item.contact
                            ? item.contact.fullname
                            : item.user.fullname}
                        </h1>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={Styles.emptyState}>{t("noContacts")}</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={Styles.containerUnActive}></div>
      )}
    </>
  );
};

export default ContactDrawer;
