import { Request, Response } from "express";
import { db } from "../lib/config/prisma.config";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, description, readme, userId } = req.body;

    const blog = await db.blog.create({
      data: {
        title,
        description,
        readme,
        userId,
      },
      include: {
        author: true,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, blog, "Blog created successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error creating blog"));
  }
};

export const getAllBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await db.blog.findMany({
      include: {
        author: true,
      },
    });

    res.status(200).json(new ApiResponse(200, blogs, "Fetched all blogs"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error fetching blogs"));
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await db.blog.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!blog) return res.status(404).json(new ApiError(404, "Blog not found"));

    res
      .status(200)
      .json(new ApiResponse(200, blog, "Blog fetched successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error fetching blog"));
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, readme, userId } = req.body;

    const updatedBlog = await db.blog.update({
      where: { id },
      data: { title, description, readme, userId },
      include: {
        author: true,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error updating blog"));
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.blog.delete({ where: { id } });

    res
      .status(200)
      .json(new ApiResponse(200, null, "Blog deleted successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error deleting blog"));
  }
};
