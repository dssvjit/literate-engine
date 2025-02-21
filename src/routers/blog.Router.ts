import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller";

const blogRouter: Router = Router();

blogRouter.post("/", createBlog);
blogRouter.get("getAllBlogs/", getAllBlogs);
blogRouter.get("getBlog/:id", getBlogById as any);
blogRouter.put("updateBlog/:id", updateBlog);
blogRouter.delete("deleteBlog/:id", deleteBlog);

export default blogRouter;
