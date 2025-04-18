import { instanseAxios } from "../servises/instance";

export const sendFriendRequest = async (
  currentUserId: number,
  targetUserId: number
) => {
  try {
    const res = await instanseAxios.post(`/Contacts/send`, {
      currentUserId,
      targetUserId,
    });
    console.log(res, "res");
  } catch (error) {
    console.log(error);
  }
};

export const deleteContact = async (userId: number, contactId: number) => {
  try {
    await instanseAxios.delete(
      `/Contacts/delete?userId=${userId}&contactId=${contactId}`
    );
  } catch (error) {
    console.log(error);
  }
};
