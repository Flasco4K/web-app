const express = require("express");
const router = express.Router();

const userController = require("../controllers/user")

// KATEGORİ
router.get("/blogs/category/:slug", userController.blog_list);

// BLOG DETAY
router.get("/blogs/:slug", userController.blogs_details);

// BLOG LİSTESİ
router.get("/blogs", userController.blog_list);

// ANASAYFA
router.get("/", userController.index);

module.exports = router;
