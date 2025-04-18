"use client";
import React from "react";
import Styles from "../../Sass/topBar.module.scss";
import {
  Bookmark,
  EllipsisVertical,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Trash,
} from "lucide-react";
import { t } from "i18next";

import Image from "next/image";
import { instanseAxios } from "../../../servises/instance";
import {
  deleteContact,
  sendFriendRequest,
} from "../../../lib/SendContactRequest";
import { useUserStatus } from "@/Zustand/statusOnline";
import { Chat } from "../../../interfaces";

interface Props {
  currentChat?: Chat;
  setDrawer: () => void;
  session: any;
  scrollToMessage: (messageId: number) => void;
  currentResultIndex: { index: number; messageId: number | null };
  setCurrentResultIndex: ({
    index,
    messageId,
  }: {
    index: number;
    messageId: number | null;
  }) => void;
  setSearchResults: (results: number[]) => void;
  searchResults: any[];
}

const TopBar: React.FC<Props> = ({
  currentChat,
  setDrawer,
  session,
  scrollToMessage,
  currentResultIndex,
  setCurrentResultIndex,
  setSearchResults,
  searchResults,
}) => {
  const [isFocus, setFocus] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>("");
  const [pressed, setPressed] = React.useState<boolean>(false);
  const [PopUp, setPopUp] = React.useState<boolean>(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const userStatuses = useUserStatus((state) => state.useStatus);
  console.log(userStatuses, "userStatuses");
  const getSearchResults = async (chatId: number) => {
    try {
      if (!query.trim()) {
        setSearchResults([]);
        setCurrentResultIndex({ index: -1, messageId: null });
        return;
      }

      const res = await instanseAxios.get(
        `/Messages/search?q=${query}&chatId=${chatId}`
      );
      const results = res.data;
      setSearchResults(results);

      if (results.length > 0) {
        setCurrentResultIndex({
          index: 0,
          messageId: results[0].id,
        });
        scrollToMessage(results[0].id);
      } else {
        setCurrentResultIndex({ index: -1, messageId: null });
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setCurrentResultIndex({ index: -1, messageId: null });
    }
  };

  const goToNextResult = () => {
    if (searchResults.length === 0) return;

    const newIndex = (currentResultIndex.index + 1) % searchResults.length;
    console.log(newIndex);
    setCurrentResultIndex({
      index: newIndex,
      messageId: searchResults[newIndex].id,
    });
    scrollToMessage(searchResults[newIndex].id);
  };

  const goToPrevResult = () => {
    if (searchResults.length === 0) return;

    const newIndex =
      (currentResultIndex.index - 1 + searchResults.length) %
      searchResults.length;
    setCurrentResultIndex({
      index: newIndex,
      messageId: searchResults[newIndex].id,
    });
    scrollToMessage(searchResults[newIndex].id);
  };

  React.useEffect(() => {
    if (currentChat?.id) {
      getSearchResults(Number(currentChat.id));
    }
  }, [query, currentChat?.id]);

  React.useEffect(() => {
    if (pressed && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [pressed]);

  const handleSearchClick = () => {
    setPressed(!pressed);
    if (!pressed) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      goToNextResult();
    } else if (e.key === "Escape") {
      clearInput();
      setPressed(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const clearInput = () => {
    setQuery("");
    setSearchResults([]);
    setCurrentResultIndex({
      index: -1,
      messageId: null,
    });
  };

  const focused = () => setFocus(true);
  const unfocused = () => setFocus(false);

  const list = [
    { icon: <Search onClick={handleSearchClick} /> },
    { icon: <EllipsisVertical onClick={() => setPopUp(!PopUp)} /> },
  ];

  const otherUser = currentChat?.users.find(
    (user) => user.id !== session.user.id
  );
  const userId = currentChat?.users[0]?.user?.id;
  return (
    <div className={Styles.container}>
      <div className={Styles.container__content}>
        <div
          className={Styles.leftside}
          style={pressed ? { display: "none" } : {}}
        >
          <div className={Styles.logo}>
            {currentChat?.name === "Saved Messages" ? (
              <div className={Styles.logo__avatar}>
                <Bookmark />
              </div>
            ) : otherUser?.user?.avatar ? (
              <Image
                width={80}
                height={80}
                src={otherUser?.user.avatar}
                alt="User Avatar"
              />
            ) : (
              <div className={Styles.logo__avatar}>
                {otherUser?.user.fullname.substring(0, 1)}
              </div>
            )}
          </div>
          <div onClick={setDrawer} className={Styles.text_info}>
            {currentChat?.name === "Saved Messages" ? (
              <h1>{t("Saved Messages")}</h1>
            ) : (
              <h1>{otherUser?.user.fullname}</h1>
            )}
            {currentChat?.name === "Saved Messages" ? (
              ""
            ) : (
              <>
                {userId && userStatuses[userId] ? (
                  <p>{t("Online")}</p>
                ) : (
                  <p>{t("Offline")}</p>
                )}
              </>
            )}
          </div>
        </div>

        <div
          className={`${Styles.containerInput} ${
            pressed ? "" : Styles.nonactive
          }`}
        >
          <div className={Styles.row}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${isFocus ? Styles.SVGactive : ""}`}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>

            <div className={Styles.input}>
              <input
                ref={searchInputRef}
                style={isFocus ? { caretColor: "rgb(135, 116, 225)" } : {}}
                onFocus={focused}
                onBlur={unfocused}
                value={query}
                type="text"
                placeholder={`${t("Search messages")}`}
                onChange={onChange}
                onKeyDown={handleKeyDown}
              />
              <X
                className={Styles.cross}
                onClick={() => {
                  clearInput();
                  setPressed(false);
                }}
              />
            </div>

            {searchResults.length > 0 && (
              <div className={Styles.searchNavigation}>
                <span className={Styles.resultCount}>
                  {currentResultIndex.index + 1} of {searchResults.length}
                </span>
                <button
                  className={Styles.navButton}
                  onClick={goToPrevResult}
                  disabled={searchResults.length <= 1}
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  className={Styles.navButton}
                  onClick={goToNextResult}
                  disabled={searchResults.length <= 1}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className={Styles.rightside}
          style={pressed ? { display: "none" } : {}}
        >
          <ul>
            {list.map((item, index) => (
              <li key={index}>{item.icon}</li>
            ))}
          </ul>{" "}
          {PopUp ? (
            <div className={Styles.popup}>
              <ul>
                <ul>
                  {currentChat?.users?.[0]?.user?.contactsReceived?.[0]
                    ?.accepted ||
                  currentChat?.users?.[0]?.user?.contactsSent?.[0]?.accepted ? (
                    <li
                      onClick={() => {
                        deleteContact(
                          Number(session.user.id),
                          Number(currentChat?.users[0].user.id)
                        );
                        setPopUp(!PopUp);
                      }}
                    >
                      <Trash size={20} color="crimson" />
                      {t("Delete Contact")}
                    </li>
                  ) : (
                    <li
                      onClick={() => {
                        sendFriendRequest(
                          Number(session.user.id),
                          Number(currentChat?.users[0].user.id)
                        );
                        setPopUp(!PopUp);
                      }}
                    >
                      {t("Send a request")}
                    </li>
                  )}
                </ul>
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
