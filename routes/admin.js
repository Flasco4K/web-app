const express = require("express");
const router = express.Router();

const imageUpload = require("../helpers/image-upload");
const adminController = require("../controllers/admin");
const isAuth = require("../middlewares/auth");
const csrf = require("../middlewares/csrf");

router.get("/blog/delete/:blogid", isAuth,csrf, adminController.get_blog_Delete);

router.post("/blog/delete/:blogid", isAuth, adminController.post_blog_Delete);

router.get("/category/delete/:categoryid", isAuth,csrf, adminController.get_Category_Delete);

router.post("/category/delete/:categoryid", isAuth, adminController.post_Category_Delete);

router.get("/blog/create", isAuth,csrf, adminController.get_blog_create);

router.post("/categories/remove", isAuth, adminController.get_category_remove)

router.post("/blog/create", isAuth, imageUpload.upload.single("resim"), adminController.post_blog_create);

router.get("/:category/create", isAuth,csrf, adminController.get_Category_create);

router.post("/category/create", isAuth, adminController.post_Category_create);

router.get("/blogs/:blogid", isAuth,csrf, adminController.get_blog_edit);

router.post("/blogs/:blogid", isAuth, imageUpload.upload.single("resim"), adminController.post_blog_edit);

router.get("/categories/:categoryid", isAuth, adminController.get_Category_edit);

router.post("/categories/:categoryid", isAuth, adminController.post_Category_edit);

router.get("/blogs", isAuth,csrf, adminController.get_blogs);

router.get("/categories", isAuth,csrf, adminController.get_categories);

router.get("/roles",isAuth,adminController.get_roles);
router.get("/roles/:roleid",isAuth,csrf,adminController.get_role_edit);
router.post("/roles/remove",isAuth,adminController.roles_remove);
router.post("/roles/:roleid",isAuth,csrf,adminController.post_role_edit);

module.exports = router;
