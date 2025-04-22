import React from "react";
import Styles from "../../Sass/userPopUp.module.scss";
import Image from "next/image";
interface Props {
  messageUser: any;
  session: any;
  onCLose: () => void;
  sendMessage: () => void;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
}

const UserPopUp: React.FC<Props> = ({
  messageUser,
  session,
  onCLose,
  sendMessage,
  newMessage,
  setNewMessage,
}) => {
  return (
    <>
      {parseInt(messageUser.id) === parseInt(session.user.id) ? null : (
        <div className={Styles.container}>
          <div className={Styles.banner}></div>
          <div className={Styles.wrapper}>
            <div className={Styles.logo}>
              {messageUser?.avatar ? (
                <Image
                  width={80}
                  height={80}
                  src={messageUser?.avatar}
                  alt="avatar"
                />
              ) : (
                <div className={Styles.logo__avatar}>
                  {messageUser.fullname?.substring(0, 1)}
                </div>
              )}
            </div>
            <div onClick={onCLose} className={Styles.UserInfo}>
              <h1>{messageUser?.fullname}</h1>
            </div>
            <div className={Styles.InputField}>
              <input
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message to @${messageUser.fullname}`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPopUp;
