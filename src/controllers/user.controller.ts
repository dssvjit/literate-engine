import { Request, Response } from "express";
import { db } from "../lib/config/prisma.config";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { userSchema, userIdSchema } from "../lib/schema/user.schema";

export const createUser = async (req: Request, res: Response) => {
  const { success, data, error } = userSchema.safeParse(req.body);

  if (!success) {
    res
      .status(400)
      .json(
        new ApiError(
          400,
          "Enter correct format of data",
          error.format?.() || error.message
        )
      );
    return;
  }

  const { name, email, imageUrl, role } = data;

  try {
    const userExists = await db.user.findUnique({ where: { email } });

    if (userExists) {
      res
        .status(400)
        .json(new ApiError(400, "User with this email already exists"));
      return;
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        imageUrl,
        role: role.toLocaleLowerCase() === "USER" ? "User" : "Admin",
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, user, "User created successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Cannot create user", error.message));
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany();
    res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Error fetching users", error));
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { success, data } = userIdSchema.safeParse(req.params);

  if (!success) {
    res.status(400).json(new ApiError(400, "Invalid user ID"));
    return;
  }

  try {
    const user = await db.user.findUnique({ where: { id: data.id } });

    if (!user) {
      res.status(404).json(new ApiError(404, "User not found"));
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error fetching user", error));
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json(new ApiError(404, "User not found"));

      return;
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
          role: user.role,
        },
        "User fetched successfully"
      )
    );
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error fetching user", error));
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { success, data } = userIdSchema.safeParse(req.params);

  if (!success) {
    res.status(400).json(new ApiError(400, "Invalid request data"));
    return;
  }
  const { id } = data;
  try {
    const updatedUser = await db.user.update({
      where: { id: data.id },
      data: req.body,
    });

    res.status(200).json(new ApiResponse(200, updatedUser, "User updated"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error updating user", error));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { success, data } = userIdSchema.safeParse(req.params);

  if (!success) {
    res.status(400).json(new ApiError(400, "Invalid user ID"));
    return;
  }

  try {
    await db.user.delete({ where: { id: data.id } });

    res
      .status(200)
      .json(new ApiResponse(200, null, "User deleted successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error deleting user", error));
  }
};
