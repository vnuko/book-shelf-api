import { Router } from "express";
import authorController from "../controllers/AuthorController";
import bookController from "../controllers/BookController";

const router: Router = Router();

router.get("/", authorController.getAuthors);
router.get("/:authorId", authorController.getAuthor);
router.get("/:authorId/books", bookController.getBooks);
router.get("/:authorId/books/:bookId", bookController.getBook);

export default router;
