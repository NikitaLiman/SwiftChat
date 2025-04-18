import React from "react";
import Styles from "../../Sass/messagebar.module.scss";
import { Paperclip, SendHorizontal, Smile, X } from "lucide-react";
import EmojiPicker, {
  Theme as EmojiPickerTheme,
  Theme,
} from "emoji-picker-react";
import { useTheme } from "../client-page";
import { t } from "i18next";

interface Props {
  sendMessage: () => void;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  cancelReply?: () => void;
  setCurrentText: any;
  replyTo?: {
    id: number;
    text: string;
    sender: {
      fullname: string;
    };
  } | null;
}

const MessageBar: React.FC<Props> = ({
  sendMessage,
  newMessage,
  setNewMessage,
  cancelReply,
  replyTo,
  setCurrentText,
}) => {
  const [showEmoji, setShowEmoji] = React.useState<boolean>(false);
  const { theme } = useTheme();

  const emojiPickerTheme: EmojiPickerTheme =
    theme === Theme.DARK
      ? Theme.DARK
      : theme === Theme.LIGHT
      ? Theme.LIGHT
      : Theme.AUTO;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      setCurrentText(null);
      setShowEmoji(false);
    }
    if (e.key === "Escape" && replyTo && cancelReply) {
      cancelReply();
    }
  };

  const addEmoji = (emoji: any) => {
    setNewMessage((prev) => prev + emoji.emoji);
  };

  return (
    <div className={Styles.messageBar}>
      <div className={Styles.row}>
        <div className={Styles.container}>
          {replyTo && (
            <div className={Styles.replyContainer}>
              <div className={Styles.replyContent}>
                <div className={Styles.replyInfo}>
                  <span className={Styles.replyName}>
                    {replyTo.sender.fullname}
                  </span>
                  <p className={Styles.replyText}>{replyTo.text}</p>
                </div>
                <button className={Styles.closeReply} onClick={cancelReply}>
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
          <div className={Styles.container__content}>
            <div className={Styles.Smiles}>
              <Smile onClick={() => setShowEmoji(!showEmoji)} />
              {showEmoji && (
                <div className={Styles.emojiPickerBox}>
                  <EmojiPicker
                    theme={emojiPickerTheme}
                    className={Styles.emojiPicker}
                    onEmojiClick={addEmoji}
                  />
                </div>
              )}
            </div>
            <div className={Styles.typebar}>
              <input
                onKeyDown={handleKeyDown}
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                type="text"
                placeholder={replyTo ? t("Reply to message...") : t("messages")}
              />
            </div>
          </div>
          <div className={Styles.corner}></div>
        </div>
        <div className={Styles.send}>
          <button
            onClick={() => {
              sendMessage();
              setShowEmoji(false);
            }}
            className={newMessage.trim() ? Styles.active : ""}
          >
            <SendHorizontal />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBar;
