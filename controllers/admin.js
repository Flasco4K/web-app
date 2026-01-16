const Blog = require("../models/blog")
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const sequelize = require("../data/db");
const slugField = require("../helpers/slugfield");

const { Op, Sequelize } = require("sequelize");

const fs = require("fs");
const slugfield = require("../helpers/slugfield");
const { group } = require("console");
const { raw } = require("express");
const { title } = require("process");

exports.get_blog_Delete = async function (req, res) { //Delete İşlemi Sorgusu
    const blogid = req.params.blogid;
    try {
        const blog = await Blog.findByPk(blogid);

        if (blog) {
            res.render("admin/blog-delete", {
                title: "delete blog",
                blog: blog
            });
        }
        res.redirect("/admin/blogs");

    }
    catch (err) {
        console.log(err)
    }
}

exports.post_blog_Delete = async function (req, res) { //Delete Sorgusunun Çalışması
    const blogid = req.body.blogid;
    try {
        const blog = await Blog.findByPk(blogid); //Silmek İstediğim Blog 
        if (blog) {
            await blog.destroy(); //Sequileze İLE silme Methodu 
            return res.redirect("/admin/blogs?action=delete") //Eğer yukardaki kodlar çalışmışsa admin bloga gönder RETURN ile aşağıdaki kodları çalıştırma
        }
        res.redirect("/admin/blogs") //Eğer Silmediyse Blog Sayfasına gönder
    }
    catch (err) {
        console.log(err)
    }
}

exports.get_Category_Delete = async function (req, res) { //Delete İşlemi
    const categoryid = req.params.categoryid;
    try {
        const category = await Category.findByPk(categoryid)

        res.render("admin/category-delete", {
            title: "delete category",
            category: category
        });
    }
    catch (err) {
        console.log(err)
    }
}

exports.post_Category_Delete = async function (req, res) { //Delete Sorgusu
    const categoryid = req.body.categoryid;
    try {
        await Category.destroy({
            where: {
                id: categoryid
            }
        });
        res.redirect("/admin/categories?action=delete")
    }
    catch (err) {
        console.log(err)
    }
}

exports.get_blog_create = async function (req, res) { //Add Blog
    try {
        const categories = await Category.findAll();

        res.render("admin/blog-create", {
            title: "add blog",
            categories: categories
        });
    } catch (err) {
        console.log(err);
    }
}

exports.post_blog_create = async function (req, res) { //Resim Güncellemesi
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    const resim = req.file.filename;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0; //Anasayfa Seçilmişse 1 True Seçilmemişse 0
    const onay = req.body.onay == "on" ? 1 : 0; //Anasayfa Seçilmişse 1 True Seçilmemişse 0
    const kategori = req.body.kategori;

    try {
        await Blog.create({
            baslik: baslik,
            url: slugField(baslik),
            aciklama: aciklama,
            resim: resim,
            anasayfa: anasayfa,
            onay: onay
        })
        res.redirect("/admin/blogs?action=create");
    } catch (err) {
        console.log(err);
    }
}

exports.get_Category_create = async (req, res) => {
    try {
        res.render("admin/category-create", {
            title: "add category"
        });
    } catch (err) {
        console.log(err);
    }
}

exports.post_Category_create = async function (req, res) {
    const name = req.body.name;
    try {
        await Category.create({ name: name })
        res.redirect("/admin/categories?action=create");
    }
    catch (err) {
        console.log(err);
    }
}

exports.get_blog_edit = async (req, res) => { //Blog Listesi
    const blogid = req.params.blogid;
    try {
        const blog = await Blog.findOne({
            where: {
                id: blogid
            },
            include: {
                model: Category,
                attributes: ["id"]
            }
        });
        const categories = await Category.findAll();

        if (blog) {
            return res.render("admin/blog-edit", {
                title: blog.dataValues.baslik,
                blog: blog.dataValues,
                categories: categories
            });
        }
        res.redirect("admin/blogs");
    }
    catch (err) {
        console.log(err)
    }
}

exports.post_blog_edit = async function (req, res) { //Blog Listesi
    const blogid = req.body.blogid;
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    const kategoriIds = req.body.categories;
    const url = req.body.url;

    let resim = req.body.resim;

    if (req.file) { //Resim Seçilmişse Veri Tabanında Güncellenecek
        resim = req.file.filename;

        fs.unlink("./public/images/" + req.body.resim, err => { //Resim Silinmişse Veri Tabanından da Silinir
            console.log(err);
        });
    }

    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;

    try {
        const blog = await Blog.findOne({
            where: {
                id: blogid
            },
            include: {
                model: Category,
                attributes: ["id"]
            }
        });
        if (blog) {
            blog.baslik = baslik;
            blog.aciklama = aciklama;
            blog.resim = resim;
            blog.anasayfa = anasayfa;
            blog.onay = onay;
            blog.url = url;

            if (kategoriIds == undefined) {
                await blog.removeCategories(blog.categories); //Listeyi Sil 
            } else {
                await blog.removeCategories(blog.categories); //Listeyi Sil 
                const selectedCategories = await Category.findAll({
                    where: {
                        id: {
                            [Op.in]: kategoriIds
                        }
                    }
                });
                await blog.addCategories(selectedCategories);
            }

            await blog.save();
            return res.redirect("/admin/blogs?action=edit&&blogid=" + blogid) //Yukardaki İşlemler Tamamlandıysa Blog Listesi Sayfasına Gönderir
        }
        res.redirect("/admin/blogs") //Yukardaki İşlemler TAMAMLAMADIYSA DA Blog Listesi Sayfasına Gönderir

    }
    catch (err) {
        console.log(err)
    }
}

exports.get_category_remove = async function (req, res) { //Kategoriden Çıkar Butonu
    const blogid = req.body.blogid;
    const categoryid = req.body.categoryid;

    await sequelize.query(`delete from blogCategories where blogId=${blogid} and categoryId=${categoryid}`);
    res.redirect("/admin/categories/" + categoryid);

}

exports.get_Category_edit = async (req, res) => { //Add Category
    const categoryid = req.params.categoryid;
    try {
        const category = await Category.findByPk(categoryid);
        const blogs = await category.getBlogs(); //Blog içinde olan Kategorileri getirir
        const countBlog = await category.countBlogs() //Blog İçinde Kaç Tane Kategori olduğunu Söyler

        if (category) {
            return res.render("admin/category-edit", {
                title: category.dataValues.name,
                category: category.dataValues,
                blogs: blogs,
                countBlog: countBlog
            });
        }
        res.redirect("admin/categories");
    }
    catch (err) {
        console.log(err)
    }
}

exports.post_Category_edit = async function (req, res) { //Add Category //Category Güncelleme Sorgusu
    const categoryid = req.body.categoryid;
    const name = req.body.name;

    try {
        await Category.update({ name: name }, {
            where: {
                id: categoryid
            }
        });
        return res.redirect("/admin/categories?action=edit&categoryid=" + categoryid);
    }
    catch (err) {
        console.log(err)
    }
}

exports.get_blogs = async (req, res) => { //Admin Blogs
    try {
        const blogs = await Blog.findAll({
            attributes: ["id", "baslik", "resim"],//attributes = Hangileri Gelsin
            include: { //Kategorilerin Sadece Name `i ni Al
                model: Category,
                attributes: ["name"]
            }
        });
        res.render("admin/blog-list", {
            title: "blog list",
            blogs: blogs,
            action: req.query.action,
            blogid: req.query.blogid
        });



    } catch (err) {
        console.log(err);
    }
}

exports.get_categories = async (req, res) => { // 
    try {
        const categories = await Category.findAll();

        res.render("admin/category-list", {
            title: "blog list",
            categories: categories,
            action: req.query.action,
            categoryid: req.query.categoryid
        });
    } catch (err) {
        console.log(err);
    }
}

exports.get_roles = async (req, res) => { // 
    try {
        const roles = await Role.findAll({
            attributes: {
                include: ['role.id', 'role.rolename', [sequelize.fn('COUNT', sequelize.col('users.id')), "user_count"]]
            },
            include: [
                { model: User, attributes: ['id'] }
            ],
            group: ['role.id'],
            raw: true,
            includeIgnoreAttributes: false
        });

        res.render("admin/role-list", {
            title: "role list",
            roles: roles
        });
    } catch (err) {
        console.log(err);
    }
}

exports.get_role_edit = async (req, res) => { //Rolleri Ekrana Çıkarma 
    const roleid = req.params.roleid;
    try {
        const role = await Role.findByPk(roleid);
        const users = await role.getUsers();
        if (role) {
            return res.render("admin/role-edit", {
                title: role.rolename,
                role: role,
                users: users
            })
        }
        res.redirect("admin/roles")
    } catch (err) {
        console.log(err);
    }
}

exports.post_role_edit = async (req, res) => { //Rolleri İsmini Değiştirme 
    const roleid = req.body.roleid;
    const rolename = req.body.rolename;
    try {

        await Role.update({ rolename: rolename }, {
            where: {
                id: roleid
            }
        });
        return res.redirect("/admin/roles")

    } catch (err) {
        console.log(err);
    }
}

exports.roles_remove = async (req, res) => { // Rolleri Silme 
    const roleid = req.body.roleid;
    const userid = req.body.userid;
    try {
        await sequelize.query(`delete from userRoles where userId=${userid} and roleId=${roleid}`); //DELETE YAPILACAK İŞLEM
        return res.redirect("/admin/roles/" + roleid);

    } catch (err) {
        console.log(err);
    }
}
