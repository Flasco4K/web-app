const express = require("express");
const router = express.Router();
const imageUpload = require("../helpers/image-upload");
const adminController = require("../controllers/admin");
const isAuth = require("../middlewares/auth");
const csrf = require("../middlewares/csrf");

router.get("/blog/delete/:blogid", isAuth,csrf, adminController.get_blog_Delete);

router.post("/blog/delete/:blogid", isAuth, adminController.post_blog_Delete);

router.get("/category/delete/:categoryid",csrf, isAuth, adminController.get_Category_Delete);

router.post("/category/delete/:categoryid", isAuth, adminController.post_Category_Delete);

router.get("/blog/create",csrf, isAuth, adminController.get_blog_create);

router.post("/categories/remove", isAuth, adminController.get_category_remove)

router.post("/blog/create", isAuth, imageUpload.upload.single("resim"), adminController.post_blog_create);

router.get("/:category/create",csrf, isAuth, adminController.get_Category_create);

router.post("/category/create", isAuth, adminController.post_Category_create);

router.get("/blogs/:blogid",csrf, isAuth, adminController.get_blog_edit);

router.post("/blogs/:blogid", isAuth, imageUpload.upload.single("resim"), adminController.post_blog_edit);

router.get("/categories/:categoryid",csrf, isAuth, adminController.get_Category_edit);

router.post("/categories/:categoryid", isAuth, adminController.post_Category_edit);

router.get("/blogs",isAuth, adminController.get_blogs);

router.get("/categories",isAuth, adminController.get_categories);

module.exports = router;
