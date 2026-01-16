const Category = require("../models/category");
const Blog = require("../models/blog");
const slugField = require("../helpers/slugfield");
const User = require("../models/user");
const bcrypt = require("bcrypt");


//Database Tablosu Oluşturma
async function populate() {
    const count = await Category.count();

    if (count == 0) {

        const categories = await Category.bulkCreate([
            { name: "Web Geliştirme", url: slugField("Web Geliştirme"), },
            { name: "Mobil Geliştirme", url: slugField("Mobil Geliştirme"), },
            { name: "Programlama", url: slugField("Programlama"), }
        ]);

        const blogs = await Blog.bulkCreate([
            {
                baslik: "Komple Uygulamali Web Geliştirme Eğitimi",
                url: slugField("Komple Uygulamali Web Geliştirme Eğitimi"),
                altbaslik: "Sifirdan ileri seviyeye 'Web Geliştirme': Html, Css, Sass, Flexbox, Bootstrap, Javascript, Angular, JQuery, Asp.Net Mvc&Core Mvc",
                aciklama: "Web geliştirme komple bir web sitesinin hem web tasarim (html,css,javascript), hem de web programlama (asp.net mvc) konularinin kullanilarak geliştirilmesidir Sadece html css kullanarak statik bir site tasarlayabilirizancak işin içine bir web programlama dilini de katarsak dinamik bir web uygulamasi geliştirmiş oluruz",
                resim: "1.jpg",
                anasayfa: true,
                onay: true
            },
            {
                baslik: "Python Django ile RestFull API Geliştirme",
                url: slugField("Python Django ile RestFull API Geliştirme"),
                altbaslik: "Django REST Framework ve JWT ile güvenli, ölçeklenebilir e-ticaret APIsi kurun; ürün, sepet, sipariş ve kullanici yönet",
                aciklama: "Bu kurs, Python Django ve Django REST Framework kullanarak modern bir e-ticaret APIsi geliştirmeyi öğrenmek isteyenler için hazirlandi. Adim adim ilerleyen derslerde ürün, kategori, kullanici, sepet ve sipariş yönetimi gibi gerçek bir e-ticaret sitesinde ihtiyaç duyulan tüm özellikleri sifirdan inşa edeceksiniz.",
                resim: "2.jpg",
                anasayfa: true,
                onay: true
            },
            {
                baslik: "Sıfırdan İleri Seviye Modern JavaSciprt Dersleri ES7+",
                url: slugField("Sıfırdan İleri Seviye Modern JavaSciprt Dersleri ES7+"),
                altbaslik: "Django REST Framework ve JWT ile güvenli, ölçeklenebilir e-ticaret APIsi kurun; ürün, sepet, sipariş ve kullanici yönet",
                aciklama: "Bu kurs, Python Django ve Django REST Framework kullanarak modern bir e-ticaret APIsi geliştirmeyi öğrenmek isteyenler için hazirlandi. Adim adim ilerleyen derslerde ürün, kategori, kullanici, sepet ve sipariş yönetimi gibi gerçek bir e-ticaret sitesinde ihtiyaç duyulan tüm özellikleri sifirdan inşa edeceksiniz.",
                resim: "3.jpeg",
                anasayfa: true,
                onay: true
            },
            {
                baslik: "Node.js İle Sıfırdan İleri Seviye Web Geliştirme",
                url: slugField("Node.js İle Sıfırdan İleri Seviye Web Geliştirme"),
                altbaslik: "Django REST Framework ve JWT ile güvenli, ölçeklenebilir e-ticaret APIsi kurun; ürün, sepet, sipariş ve kullanici yönet",
                aciklama: "Bu kurs, Python Django ve Django REST Framework kullanarak modern bir e-ticaret APIsi geliştirmeyi öğrenmek isteyenler için hazirlandi. Adim adim ilerleyen derslerde ürün, kategori, kullanici, sepet ve sipariş yönetimi gibi gerçek bir e-ticaret sitesinde ihtiyaç duyulan tüm özellikleri sifirdan inşa edeceksiniz.",
                resim: "4.png",
                anasayfa: true,
                onay: true
            },
            {
                baslik: "Node.js İle Sıfırdan İleri Seviye Web Geliştirme",
                url: slugField("Node.js İle Sıfırdan İleri Seviye Web Geliştirme"),
                altbaslik: "Django REST Framework ve JWT ile güvenli, ölçeklenebilir e-ticaret APIsi kurun; ürün, sepet, sipariş ve kullanici yönet",
                aciklama: "Bu kurs, Python Django ve Django REST Framework kullanarak modern bir e-ticaret APIsi geliştirmeyi öğrenmek isteyenler için hazirlandi. Adim adim ilerleyen derslerde ürün, kategori, kullanici, sepet ve sipariş yönetimi gibi gerçek bir e-ticaret sitesinde ihtiyaç duyulan tüm özellikleri sifirdan inşa edeceksiniz.",
                resim: "4.png",
                anasayfa: true,
                onay: true
            }, 
            {
                baslik: "Node.js İle Sıfırdan İleri Seviye Web Geliştirme",
                url: slugField("Node.js İle Sıfırdan İleri Seviye Web Geliştirme"),
                altbaslik: "Django REST Framework ve JWT ile güvenli, ölçeklenebilir e-ticaret APIsi kurun; ürün, sepet, sipariş ve kullanici yönet",
                aciklama: "Bu kurs, Python Django ve Django REST Framework kullanarak modern bir e-ticaret APIsi geliştirmeyi öğrenmek isteyenler için hazirlandi. Adim adim ilerleyen derslerde ürün, kategori, kullanici, sepet ve sipariş yönetimi gibi gerçek bir e-ticaret sitesinde ihtiyaç duyulan tüm özellikleri sifirdan inşa edeceksiniz.",
                resim: "4.png",
                anasayfa: true,
                onay: true
            },
            {
                baslik: "Node.js İle Sıfırdan İleri Seviye Web Geliştirme",
                url: slugField("Node.js İle Sıfırdan İleri Seviye Web Geliştirme"),
                altbaslik: "Django REST Framework ve JWT ile güvenli, ölçeklenebilir e-ticaret APIsi kurun; ürün, sepet, sipariş ve kullanici yönet",
                aciklama: "Bu kurs, Python Django ve Django REST Framework kullanarak modern bir e-ticaret APIsi geliştirmeyi öğrenmek isteyenler için hazirlandi. Adim adim ilerleyen derslerde ürün, kategori, kullanici, sepet ve sipariş yönetimi gibi gerçek bir e-ticaret sitesinde ihtiyaç duyulan tüm özellikleri sifirdan inşa edeceksiniz.",
                resim: "4.png",
                anasayfa: true,
                onay: true
            },
            {
                baslik: "Node.js İle Sıfırdan İleri Seviye Web Geliştirme",
                url: slugField("Node.js İle Sıfırdan İleri Seviye Web Geliştirme"),
                altbaslik: "Django REST Framework ve JWT ile güvenli, ölçeklenebilir e-ticaret APIsi kurun; ürün, sepet, sipariş ve kullanici yönet",
                aciklama: "Bu kurs, Python Django ve Django REST Framework kullanarak modern bir e-ticaret APIsi geliştirmeyi öğrenmek isteyenler için hazirlandi. Adim adim ilerleyen derslerde ürün, kategori, kullanici, sepet ve sipariş yönetimi gibi gerçek bir e-ticaret sitesinde ihtiyaç duyulan tüm özellikleri sifirdan inşa edeceksiniz.",
                resim: "4.png",
                anasayfa: true,
                onay: true
            },
            {
                baslik: "Node.js İle Sıfırdan İleri Seviye Web Geliştirme",
                url: slugField("Node.js İle Sıfırdan İleri Seviye Web Geliştirme"),
                altbaslik: "Django REST Framework ve JWT ile güvenli, ölçeklenebilir e-ticaret APIsi kurun; ürün, sepet, sipariş ve kullanici yönet",
                aciklama: "Bu kurs, Python Django ve Django REST Framework kullanarak modern bir e-ticaret APIsi geliştirmeyi öğrenmek isteyenler için hazirlandi. Adim adim ilerleyen derslerde ürün, kategori, kullanici, sepet ve sipariş yönetimi gibi gerçek bir e-ticaret sitesinde ihtiyaç duyulan tüm özellikleri sifirdan inşa edeceksiniz.",
                resim: "4.png",
                anasayfa: true,
                onay: true
            }
        ]);

        const users = await User.bulkCreate([
            {fullname: "emirhan demirhan",email: "emirhan.bda0@gmail.com", password: await bcrypt.hash("emirhan",10)},
            {fullname: "alex pereira",email: "alex.pereira0@gmail.com", password: await bcrypt.hash("alex",10)}
        ])

        await categories[0].addBlog(blogs[0]);
        await categories[0].addBlog(blogs[1]);
        await categories[0].addBlog(blogs[2]);
        await categories[0].addBlog(blogs[3]);
        await categories[0].addBlog(blogs[4]);
        await categories[0].addBlog(blogs[5]);
        await categories[1].addBlog(blogs[6]);
        await categories[1].addBlog(blogs[7]);

        await categories[1].addBlog(blogs[2]);
        await categories[1].addBlog(blogs[3]);

        await categories[2].addBlog(blogs[2]);
        await categories[2].addBlog(blogs[3]);

        await blogs[0].addCategory(categories[1]);


    }
}
module.exports = populate;