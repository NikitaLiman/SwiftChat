import { instanseAxios } from "./instance";

export const fetchChats = async (userId: number) => {
  const { data } = await instanseAxios.get(`/ChatCreate?userId=${userId}`);
  return data;
};

export const deleteChat = async (chatId: number) => {
  const { data } = await instanseAxios.delete(`/ChatCreate/${Number(chatId)}`);
  return data;
};

export const fetchMessages = async (currentChat: number) => {
  const { data } = await instanseAxios.get(`/Messages?chatId=${currentChat}`);

  return data;
};
