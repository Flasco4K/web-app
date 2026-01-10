const express = require("express");
const router = express.Router();

const db = require("../data/db");

router.use("/blogs/category/:categoryid", async function (req, res) {
  const id = req.params.categoryid;
  try {
    const [blogs] = await db.execute("select * from blog where categoryid=?", [
      id,
    ]);

    const [categories] = await db.execute("select * from category");
    res.render("users/blogs", {
      title: "Tüm Kurslar",
      blogs: blogs,
      categories: categories,
      selectedCategory: id,
    });
  } catch (err) {
    console.log(err);
  }
});

// BLOG DETAY
router.use("/blogs/:blogid", async (req, res) => {
  const id = req.params.blogid;
  try {
    const [blogs] = await db.execute("select * from blog where blogid=?", [id]);

    const blog = blogs[0];

    if (blog) {
      return res.render("users/blog-details", {
        title: blog.baslik,
        blog: blog,
      });
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// BLOG LİSTESİ
router.use("/blogs", async (req, res) => {
  try {
    const [blogs] = await db.execute(
      "select * from blog where onay=1 and anasayfa=1"
    );
    const [categories] = await db.execute("select * from category");
    res.render("users/blogs", {
      title: "Tüm Kurslar",
      blogs: blogs,
      categories: categories,
      selectedCategory: null,
    });
  } catch (err) {
    console.log(err);
  }
});

// ANASAYFA
router.use("/", async (req, res) => {
  try {
    const [blogs] = await db.execute("select * from blog where onay=1");
    const [categories] = await db.execute("select * from category");
    res.render("users/index", {
      title: "Popüler Kurslar",
      blogs: blogs,
      categories: categories,
      selectedCategory: null,
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router; //Dışarı Açma Komutu
