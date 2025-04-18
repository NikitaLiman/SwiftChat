"use client";
import React, { useEffect, useRef, useState } from "react";
import { User } from "./Search";
import Image from "next/image";
import Styles from "../../Sass/Search.module.scss";
import { instanseAxios } from "../../../servises/instance";

interface Props {
  users: User[];
  currentUserId: number;

  onNewChatCreated: () => Promise<void>;
}

const list = [{ name: "Chats" }];

const QueryBlock: React.FC<Props> = ({
  users,
  currentUserId,
  onNewChatCreated,
}) => {
  const [active, setActive] = useState<number>(0);
  const underlineRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<(HTMLLIElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current[active] && underlineRef.current) {
      const { offsetLeft, offsetWidth } = listRef.current[active]!;
      underlineRef.current.style.left = `${offsetLeft}px`;
      underlineRef.current.style.width = `${offsetWidth}px`;
    }
  }, [active]);

  const WheelScroll = (e: React.WheelEvent<HTMLUListElement>) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };
  const CreateChat = async (currentUserId: number, TargetUserId: number) => {
    await instanseAxios.post(`/ChatCreate`, {
      currentUserId: Number(currentUserId),
      TargetUserId,
    });
    await onNewChatCreated();
  };
  return (
    <div className={Styles.query_container}>
      <div className={Styles.query_container__choose_bar}>
        <ul ref={scrollContainerRef} onWheel={WheelScroll}>
          {list.map((item, i) => (
            <li
              ref={(el) => {
                listRef.current[i] = el;
              }}
              key={i}
              onClick={() => setActive(i)}
              className={active === i ? Styles.active : ""}
            >
              {item.name}
            </li>
          ))}
          <div ref={underlineRef} className={Styles.underline} />
        </ul>
      </div>
      <div className={Styles.query_container__content}>
        {users.map((item, i) => (
          <div
            onClick={() => CreateChat(currentUserId, Number(users[i].id))}
            key={i}
            className={Styles.box}
          >
            <div className={Styles.avatar}>
              {item.avatar ? (
                <Image width={80} height={80} src={item?.avatar} alt="" />
              ) : (
                <div className={Styles.avatar__box}>
                  {item.fullname.substring(0, 1)}
                </div>
              )}
            </div>
            <div className={Styles.User_info}>
              <h1>{item?.fullname}</h1>
              <p>last seen recently</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueryBlock;
