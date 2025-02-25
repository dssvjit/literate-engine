import { ApiError } from "../utils/ApiError";
import { Request, Response } from "express";
import { db } from "../lib/config/prisma.config";
import { ApiResponse } from "../utils/ApiResponse";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, imageUrl, oAuthId, role } = req.body;
    if (
      [name, email, imageUrl, oAuthId].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const userExists = await db.user.findUnique({
      where: { email },
    });
    if (userExists) {
      return res
        .status(400)
        .json(new ApiError(400, "User with this email already exists"));
    }
    const user = await db.user.create({
      data: { name, email, imageUrl, role },
      select: {
        name: true,
        email: true,
        imageUrl: true,
        refreshToken: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, user, "User created successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Cannot create user", error));
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany();
    res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error fetching users", error));
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
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
  try {
    const { id } = req.params;
    const { name, email, imageUrl, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, imageUrl, role },
    });

    res.status(200).json(new ApiResponse(200, updatedUser, "User updated"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error updating user", error));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });

    res.status(200).json(new ApiResponse(200, "User deleted"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error deleting user", error));
  }
};
