const Blog = require("../models/blog");
const Category = require("../models/category");

const { Op } = require("sequelize");

exports.blogs_details = async (req, res) => {
    const slug = req.params.slug;
    try {
        const blogs = await Blog.findOne({
            where: {
                url: slug
            },
            raw: true
        });

        if (blogs) {
            return res.render("users/blog-details", {
                title: blogs.baslik,
                blog: blogs,
            });
        }
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
}

exports.blog_list = async (req, res) => { //Blog Listesi 
    const size = 5; //Sayfa da Kaç tane görünsün
    const { page = 0 } = req.query; //page {} default değerinde 0 a eşit
    const slug = req.params.slug;

    try {

        const { rows, count } = await Blog.findAndCountAll({ //Blog Bilgileriyle Kaç Tane Kayıt Olduğunu Söylüyor
            where: { onay: { [Op.eq]: true } }, //onay = 1
            raw: true,
            include: slug ? { model: Category, where: { url: slug } } : null,
            limit: size,
            offset: page * size // 0*5 => 0
        });

        const categories = await Category.findAll({ raw: true });
        res.render("users/blogs", {
            title: "Tüm Kurslar",
            blogs: rows,
            totalItems: count, //Kaç tane ürün olduğunu
            totalPages: Math.ceil(count / size), //Toplam Sayfa Sayısı
            currentPage: page, //O an Hangi Sayfa Getiriliyor
            categories: categories,
            selectedCategory: slug
        });

    } catch (err) {
        console.log(err);
    }
}

exports.index = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            where: {
                [Op.and]: [ //anasayfa ve onay true ise çalıştır 
                    { anasayfa: true },
                    { onay: true }
                ]
            },
            raw: true //Sadece Verileri getirir
        });

        const categories = await Category.findAll({ raw: true });

        res.render("users/index", {
            title: "Popüler Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory: null
        });
    } catch (err) {
        console.log(err);
    }
}