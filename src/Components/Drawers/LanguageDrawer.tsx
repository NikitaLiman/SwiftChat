"use client";
import React from "react";
import Styles from "../../Sass/Drawerlg.module.scss";
import { ArrowLeft } from "lucide-react";
import { changeLanguage, t } from "i18next";

interface Props {
  active: boolean;
  onOpen: () => void;
}

const LanguageDrawer: React.FC<Props> = ({ active, onOpen }) => {
  const list = [
    { name: "English", title: "English", code: "en" },
    { name: "Русский", title: "Russian", code: "ru" },
  ];

  const savedLanguage = localStorage.getItem("language-select") || "en";

  const [activeIndex, setActiveIndex] = React.useState<number>(
    list.findIndex((item) => item.code === savedLanguage)
  );
  const handleSelect = (index: number, lang: string) => {
    localStorage.setItem("language-select", lang);
    setActiveIndex(index);
    changeLanguage(lang);
  };
  React.useEffect(() => {
    changeLanguage(savedLanguage);
  }, [savedLanguage]);
  return (
    <>
      {active ? (
        <div className={Styles.activeCont}>
          <div className={Styles.header}>
            <div className={Styles.leftside}>
              <div className={Styles.leftside__arrow}>
                <button onClick={onOpen}>
                  <ArrowLeft color="gray" size={26} />
                </button>
              </div>
              <p>{t("language")}</p>
            </div>
          </div>
          <div className={Styles.activeCont__content}>
            <h2>{t("IL")}</h2>
            <div className={Styles.activeCont__content__box}>
              <ul>
                {list.map((item, i) => (
                  <li
                    onClick={() => handleSelect(i, item.code)}
                    key={i}
                    className={Styles.radioOption}
                  >
                    <input
                      type="radio"
                      name="language"
                      id={`option-${i}`}
                      className={Styles.radioInput}
                      checked={activeIndex === i}
                      readOnly
                    />
                    <span className={Styles.customRadio}></span>
                    <section>
                      <span>{item.name}</span> <p>{item.title}</p>
                    </section>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className={Styles.container}></div>
      )}
    </>
  );
};

export default LanguageDrawer;
