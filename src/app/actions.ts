"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/prisma-client";
import { hashSync } from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function CreateUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: { email: body.email },
    });
    if (!user) console.log("User not found");
    if (user) {
      if (!user.verified) {
        throw new Error("Post not registrated");
      }
      throw new Error("User registrated");
    }
    const newUser = await prisma.user.create({
      data: {
        fullname: body.fullname,
        password: hashSync(body.password ?? "", 10),
        email: body.email,
        verified: new Date(),
      },
    });
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function userSessionUpdate(body: Prisma.UserUpdateInput) {
  try {
    const currentSession = await getServerSession();
    if (!currentSession || !currentSession.user) {
      throw new Error("User not authenticated or session invalid");
    }

    const finduser = await prisma.user.findFirst({
      where: {
        email: currentSession.user.email,
      },
    });

    if (!finduser) {
      throw new Error("User not found");
    }
    const updatedUser = await prisma.user.update({
      where: { id: finduser?.id },
      data: {
        fullname: body.fullname,
        email: body.email,
        bio: body.bio,
        avatar: body.avatar,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error in userSessionUpdate:", error);
    throw new Error("Error updating user session");
  }
}

export async function CreateSavedChat(userId: number) {
  try {
    let findChat = await prisma.chat.findFirst({
      where: {
        savedChat: true,
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        users: true,
        messages: true,
      },
    });

    if (findChat) {
      const updatedChat = await prisma.chat.update({
        where: {
          id: findChat.id,
        },
        data: {
          name: "Saved Messages",
        },
      });
      return updatedChat;
    } else {
      let newChat = await prisma.chat.create({
        data: {
          savedChat: true,
          name: "Saved Messages",
          users: {
            create: {
              userId: userId,
            },
          },
        },
        include: {
          users: true,
          messages: true,
        },
      });
      return newChat;
    }
  } catch (error) {
    console.log(error, "error");
  }
}
