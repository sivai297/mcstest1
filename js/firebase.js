
/* ==========================================
   MCS WEBSITE
   FIREBASE.JS
   Meenakshi Control System
========================================== */

"use strict";

/* ==========================================
   FIREBASE CONFIG
========================================== */

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_PROJECT.firebaseapp.com",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_PROJECT.appspot.com",

    messagingSenderId: "YOUR_SENDER_ID",

    appId: "YOUR_APP_ID"

};

/* ==========================================
   INITIALIZE FIREBASE
========================================== */

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const storage = firebase.storage();

/* ==========================================
   COLLECTIONS
========================================== */

const PRODUCTS = db.collection("products");

const REVIEWS = db.collection("reviews");

const ENQUIRIES = db.collection("enquiries");

const WARRANTIES = db.collection("warranties");

const ANALYTICS = db.collection("analytics");

/* ==========================================
   INITIALIZE DATABASE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeFirebase();

});

function initializeFirebase() {

    console.log("Firebase Connected");

    loadProducts();

    loadReviews();

    loadCounters();

}

/* ==========================================
   LOAD PRODUCTS
========================================== */

async function loadProducts() {

    try {

        const snapshot = await PRODUCTS.get();

        snapshot.forEach(doc => {

            console.log(doc.data());

        });

    }

    catch(error) {

        console.error(error);

    }

}

/* ==========================================
   LOAD REVIEWS
========================================== */

async function loadReviews() {

    try {

        const snapshot = await REVIEWS.get();

        snapshot.forEach(doc => {

            console.log(doc.data());

        });

    }

    catch(error) {

        console.error(error);

    }

}

/* ==========================================
   LOAD COUNTERS
========================================== */

async function loadCounters() {

    try {

        const snapshot = await ANALYTICS.doc("website").get();

        if(snapshot.exists){

            console.log(snapshot.data());

        }

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   END OF PART 1
========================================== */
/* ==========================================
   FIREBASE.JS PART 2
========================================== */

/* ==========================================
   ADD PRODUCT
========================================== */

async function addProduct(product) {

    try {

        await PRODUCTS.add({

            name: product.name,

            brand: product.brand,

            category: product.category,

            model: product.model,

            price: product.price,

            warranty: product.warranty,

            stock: product.stock,

            image: product.image,

            description: product.description,

            createdAt: new Date()

        });

        console.log("Product Added Successfully");

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   UPDATE PRODUCT
========================================== */

async function updateProduct(id,data){

    try{

        await PRODUCTS.doc(id).update(data);

        console.log("Product Updated");

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   DELETE PRODUCT
========================================== */

async function deleteProduct(id){

    try{

        await PRODUCTS.doc(id).delete();

        console.log("Product Deleted");

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   GET SINGLE PRODUCT
========================================== */

async function getProduct(id){

    try{

        const product=

        await PRODUCTS.doc(id).get();

        if(product.exists){

            return product.data();

        }

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   GET ALL PRODUCTS
========================================== */

async function getAllProducts(){

    try{

        const snapshot=

        await PRODUCTS.orderBy("createdAt","desc").get();

        return snapshot.docs.map(doc=>({

            id:doc.id,

            ...doc.data()

        }));

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   PRODUCT SEARCH
========================================== */

async function searchProduct(keyword){

    try{

        const snapshot=

        await PRODUCTS.where("brand","==",keyword).get();

        snapshot.forEach(doc=>{

            console.log(doc.data());

        });

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   PRODUCT STOCK UPDATE
========================================== */

async function updateStock(id,stock){

    try{

        await PRODUCTS.doc(id).update({

            stock:stock

        });

    }

    catch(error){

        console.error(error);

    }

}

console.log("Firebase Part 2 Loaded");
/* ==========================================
   FIREBASE.JS PART 3
========================================== */

/* ==========================================
   SAVE CUSTOMER REVIEW
========================================== */

async function addReview(review) {

    try {

        await REVIEWS.add({

            customer: review.customer,

            rating: review.rating,

            comment: review.comment,

            product: review.product,

            createdAt: new Date()

        });

        console.log("Review Added");

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   REGISTER WARRANTY
========================================== */

async function registerWarranty(data){

    try{

        await WARRANTIES.doc(data.warrantyNumber).set({

            customer: data.customer,

            phone: data.phone,

            board: data.board,

            brand: data.brand,

            warrantyNumber: data.warrantyNumber,

            purchaseDate: data.purchaseDate,

            expiryDate: data.expiryDate,

            status: "Active"

        });

        console.log("Warranty Registered");

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   WARRANTY CHECK
========================================== */

async function checkWarranty(number){

    try{

        const warranty =

        await WARRANTIES.doc(number).get();

        if(warranty.exists){

            return warranty.data();

        }

        return null;

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   SAVE CUSTOMER ENQUIRY
========================================== */

async function saveEnquiry(data){

    try{

        await ENQUIRIES.add({

            name:data.name,

            phone:data.phone,

            message:data.message,

            product:data.product,

            createdAt:new Date(),

            status:"Pending"

        });

        console.log("Enquiry Saved");

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   PRODUCT VIEW COUNT
========================================== */

async function updateProductView(productId){

    try{

        await ANALYTICS.doc(productId).set({

            views: firebase.firestore.FieldValue.increment(1)

        },{

            merge:true

        });

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   WEBSITE VISIT COUNT
========================================== */

async function updateWebsiteVisit(){

    try{

        await ANALYTICS.doc("website").set({

            visitors: firebase.firestore.FieldValue.increment(1),

            lastVisit:new Date()

        },{

            merge:true

        });

    }

    catch(error){

        console.error(error);

    }

}

console.log("Firebase Part 3 Loaded");

/* ==========================================
   FIREBASE.JS PART 4
========================================== */

/* ==========================================
   FIREBASE AUTH
========================================== */

const auth = firebase.auth();

/* ==========================================
   ADMIN LOGIN
========================================== */

async function adminLogin(email, password) {

    try {

        const user = await auth.signInWithEmailAndPassword(
            email,
            password
        );

        console.log("Admin Login Success");

        return user;

    } catch (error) {

        console.error(error);

        return null;

    }

}

/* ==========================================
   ADMIN LOGOUT
========================================== */

async function adminLogout() {

    try {

        await auth.signOut();

        console.log("Admin Logout");

    } catch (error) {

        console.error(error);

    }

}

/* ==========================================
   AUTH STATE
========================================== */

auth.onAuthStateChanged(user => {

    if (user) {

        console.log("Logged In :", user.email);

    } else {

        console.log("Logged Out");

    }

});

/* ==========================================
   IMAGE UPLOAD
========================================== */

async function uploadProductImage(file) {

    try {

        const fileName =
            Date.now() + "_" + file.name;

        const reference =
            storage.ref("products/" + fileName);

        await reference.put(file);

        const url =
            await reference.getDownloadURL();

        return url;

    } catch (error) {

        console.error(error);

    }

}

/* ==========================================
   REAL TIME PRODUCTS
========================================== */

function liveProducts() {

    PRODUCTS.onSnapshot(snapshot => {

        console.log("Products Updated");

        snapshot.forEach(doc => {

            console.log(doc.data());

        });

    });

}

/* ==========================================
   REAL TIME ENQUIRIES
========================================== */

function liveEnquiries() {

    ENQUIRIES.onSnapshot(snapshot => {

        console.log("New Enquiries");

        snapshot.forEach(doc => {

            console.log(doc.data());

        });

    });

}

/* ==========================================
   DASHBOARD STATS
========================================== */

async function dashboardStats() {

    const productCount =
        await PRODUCTS.get();

    const reviewCount =
        await REVIEWS.get();

    const enquiryCount =
        await ENQUIRIES.get();

    console.log({

        products: productCount.size,

        reviews: reviewCount.size,

        enquiries: enquiryCount.size

    });

}

/* ==========================================
   INITIALIZE ADMIN
========================================== */

window.addEventListener("load", () => {

    liveProducts();

    liveEnquiries();

    dashboardStats();

});

console.log("Firebase Part 4 Loaded");


