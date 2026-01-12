const express = require("express");
const router = express.Router();
const fs = require("fs")

const db = require("../data/db");
const imageUpload = require("../helpers/image-upload")

router.get("/blog/delete/:blogid", async function (req, res) { //Delete İşlemi
    const blogid = req.params.blogid;
    try {
        const [blogs,] = await db.execute("select * from  blog where blogid=?", [blogid]);
        const blog = blogs[0];

        res.render("admin/blog-delete", {
            title: "delete blog",
            blog: blog
        });
    }
    catch (err) {
        console.log(err)
    }
});

router.post("/blog/delete/:blogid", async function (req, res) { //Delete Sorgusu
    const blogid = req.body.blogid;
    try {
        await db.execute("delete from blog where blogid=?", [blogid]) //Silmek İstediğim Blog 
        res.redirect("/admin/blogs?action=delete")
    }
    catch (err) {
        console.log(err)
    }
});

//category delete
router.get("/category/delete/:categoryid", async function (req, res) { //Delete İşlemi
    const categoryid = req.params.categoryid;
    try {
        const [categories,] = await db.execute("select * from  category where categoryid=?", [categoryid]);
        const category = categories[0];

        res.render("admin/category-delete", {
            title: "delete category",
            category: category
        });
    }
    catch (err) {
        console.log(err)
    }
});

router.post("/category/delete/:categoryid", async function (req, res) { //Delete Sorgusu
    const categoryid = req.body.categoryid;
    try {
        await db.execute("delete from category where categoryid=?", [categoryid]) //Silmek İstediğim Blog 
        res.redirect("/admin/categories?action=delete")
    }
    catch (err) {
        console.log(err)
    }
});

router.get("/blog/create", async (req, res) => {
    try {
        const [categories,] = await db.execute("select * from category");
        res.render("admin/blog-create", {
            title: "add blog",
            categories: categories,
        });
    } catch (err) {
        console.log(err);
    }
});
 
router.post("/blog/create",imageUpload.upload.single("resim"), async function (req, res) { //Resim Güncellemesi
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    const resim = req.file.filename;
    const kategori = req.body.kategori;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0; //Anasayfa Seçilmişse 1 True Seçilmemişse 0
    const onay = req.body.onay == "on" ? 1 : 0; //Anasayfa Seçilmişse 1 True Seçilmemişse 0

    try {
        await db.execute(
            "INSERT INTO blog(baslik,aciklama,resim,anasayfa,onay,categoryid) VALUES (?,?,?,?,?,?)",
            [baslik, aciklama, resim, anasayfa, onay, kategori]
        );
        res.redirect("/admin/blogs?action=create");
    } catch (err) {
        console.log(err);
    }
});

router.get("/:category/create", async (req, res) => {
    try {
        res.render("admin/category-create", {
            title: "add category"
        });
    } catch (err) {
        console.log(err);
    }
});

router.post("/category/create", async function (req, res) {
    const name = req.body.name;
    try {
        await db.execute(
            "INSERT INTO category(name) VALUES(?)", [name]);
        res.redirect("/admin/categories?action=create");
    }
    catch (err) {
        console.log(err);
    }
});

router.get("/blogs/:blogid", async (req, res) => {
    const blogid = req.params.blogid;
    try {
        const [blogs,] = await db.execute("select * from blog where blogid=?", [blogid]);
        const [categories,] = await db.execute("select * from category");
        const blog = blogs[0];

        if (blog) {
            return res.render("admin/blog-edit", {
                title: blog.baslik,
                blog: blog,
                categories: categories
            });
        }
        res.redirect("admin/blogs");
    }
    catch (err) {
        console.log(err)
    }
});

router.post("/blogs/:blogid", imageUpload.upload.single("resim") ,async function (req, res) { //Güncelleme Sorgusu
    const blogid = req.body.blogid;
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    let resim = req.body.resim;

    if(req.file) { //Resim Seçilmişse Veri Tabanında Güncellenecek
        resim=req.file.filename;

        fs.unlink("./public/images/" + req.body.resim,err => { //Resim Silinmişse Veri Tabanından da Silinir
            console.log(err); //Hata varsa terminalde gösterir
        })

    }

    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;
    const kategoriid = req.body.kategori;
    try {
        await db.execute("UPDATE blog SET baslik=?, aciklama=?, resim=?, anasayfa=?, onay=?, categoryid=? WHERE blogid=?",
            [baslik, aciklama, resim, anasayfa, onay, kategoriid, blogid]);
        res.redirect("/admin/blogs?action=edit&&blogid=" + blogid)
    }
    catch (err) {
        console.log(err)
    }
});

//categories edit
router.get("/categories/:categoryid", async (req, res) => {
    const categoryid = req.params.categoryid;
    try {
        const [categories,] = await db.execute("select * from category where categoryid=?", [categoryid]);
        const category = categories[0];

        if (category) {
            return res.render("admin/category-edit", {
                title: category.name,
                category: category
            });
        }
        res.redirect("admin/categories");
    }
    catch (err) {
        console.log(err)
    }
});

router.post("/categories/:categoryid", async function (req, res) { //Güncelleme Sorgusu
    const categoryid = req.body.categoryid;
    const name = req.body.name;
    try {
        await db.execute("UPDATE category SET name=? where categoryid=?",
            [name, categoryid]);
        res.redirect("/admin/categories?action=edit&&categoryid=" + categoryid)
    }
    catch (err) {
        console.log(err)
    }
});

router.get("/blogs", async (req, res) => {
    try {
        const [blogs,] = await db.execute("select blogid,baslik,resim from blog");
        res.render("admin/blog-list", {
            title: "blog list",
            blogs: blogs,
            action: req.query.action,
            blogid: req.query.blogid
        });
    } catch (err) {
        console.log(err);
    }
});

router.get("/categories", async (req, res) => {
    try {
        const [categories,] = await db.execute("select * from category");
        res.render("admin/category-list", {
            title: "blog list",
            categories: categories,
            action: req.query.action,
            categoryid: req.query.categoryid
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
