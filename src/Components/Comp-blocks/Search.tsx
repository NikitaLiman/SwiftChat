"use client";
import React from "react";
import Styles from "../../Sass/Search.module.scss";
import { X } from "lucide-react";

import { useTranslation } from "react-i18next";
import { instanseAxios } from "../../../servises/instance";
import QueryBlock from "./queryBlock";
export interface User {
  id: number;
  fullname: string;
  avatar: string;
}

const Search = ({
  currentUserId,
  click,
  onClick,
  onNewChatCreated,
}: {
  currentUserId: number;
  click: boolean;
  onClick: React.Dispatch<React.SetStateAction<boolean>>;

  onNewChatCreated: () => Promise<void>;
}) => {
  const [isFocus, setFocus] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>("");
  const [users, setUsers] = React.useState<User[]>([]);
  const { t } = useTranslation();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const clearInput = () => {
    setQuery("");
  };
  const focused = () => setFocus(true);
  const unfocused = () => setFocus(false);

  React.useEffect(() => {
    const handleSearch = async () => {
      if (!query || !currentUserId) return;
      try {
        const { data } = await instanseAxios.get(
          `/users/search?q=${query}&userId=${currentUserId}`
        );
        setUsers(data);
      } catch (error) {
        console.error("Error fetch", error);
      }
    };
    handleSearch();
  }, [query, currentUserId]);

  return (
    <>
      {" "}
      <div
        className={`${Styles.container} ${
          isFocus ? Styles.containerActive : ""
        } `}
      >
        <svg
          onClick={() => onClick(false)}
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
            onClick={() => onClick(true)}
            style={isFocus ? { caretColor: "rgb(135, 116, 225)" } : {}}
            onFocus={focused}
            onBlur={unfocused}
            value={query}
            type="text"
            placeholder={`${t("search")}`}
            onChange={onChange}
          />
          {query ? (
            <X color="white" className={Styles.cross} onClick={clearInput} />
          ) : (
            ""
          )}
        </div>
      </div>
      {click ? (
        <QueryBlock
          onNewChatCreated={onNewChatCreated}
          users={users}
          currentUserId={currentUserId}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Search;
