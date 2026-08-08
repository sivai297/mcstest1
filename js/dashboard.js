import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut,
    verifyBeforeUpdateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    setDoc,
    getDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =====================================================
// GLOBAL VARIABLES
// =====================================================

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/rdokrz5u/image/upload";
const CLOUDINARY_PRESET = "mcs_upload03";

let currentProducts = [];
let editingProductId = null;

// =====================================================
// DOM READY
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initModal();
    initEvents();
    setupAuth();
});

// =====================================================
// AUTH
// =====================================================

function setupAuth() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.replace("index.html");
            return;
        }

        loadProductsLive();
        loadSettings();
    });
}
// =====================================================
// NAVIGATION
// =====================================================

function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".page-section");

    function showSection(targetId) {
        sections.forEach((section) => {
            section.classList.remove("active-page");
            section.style.display = "none";
        });

        navButtons.forEach((btn) => btn.classList.remove("active"));

        const activeSection = document.getElementById(targetId);
        if (activeSection) {
            activeSection.classList.add("active-page");
            activeSection.style.display = "block";
        }

        const activeBtn = document.querySelector(`.nav-link[data-target="${targetId}"]`);
        if (activeBtn) activeBtn.classList.add("active");
    }

    navButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
            showSection(target);
        });
    });

    // default page
    showSection("dashboardSection");
}

// =====================================================
// MODAL
// =====================================================

function initModal() {
    const modal = document.getElementById("editModal");
    const closeBtn = document.getElementById("closeEditModal");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            hideEditModal();
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                hideEditModal();
            }
        });
    }
}

function showEditModal() {
    const modal = document.getElementById("editModal");
    if (modal) {
        modal.classList.remove("hidden");
        modal.style.display = "flex";
    }
}

function hideEditModal() {
    const modal = document.getElementById("editModal");
    if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
    }
}

// =====================================================
// EVENTS
// =====================================================

function initEvents() {
    const logoutBtn = document.getElementById("logoutBtn");
    const addProductBtn = document.getElementById("addProduct");
    const updateProductBtn = document.getElementById("updateProductBtn");
    const saveSettingsBtn = document.getElementById("saveSettings");
    const changeEmailBtn = document.getElementById("changeAdminEmailBtn");
    const changePasswordBtn = document.getElementById("changeAdminPasswordBtn");
    const searchInput = document.getElementById("searchProduct");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }

    if (addProductBtn) {
        addProductBtn.addEventListener("click", handleAddProduct);
    }

    if (updateProductBtn) {
        updateProductBtn.addEventListener("click", handleUpdateProduct);
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener("click", handleSaveSettings);
    }

    if (changeEmailBtn) {
        changeEmailBtn.addEventListener("click", handleChangeEmail);
    }

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener("click", handleChangePassword);
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            renderProducts(filterProducts(searchInput.value.trim()));
        });
    }
}

// =====================================================
// LOGOUT
// =====================================================

async function handleLogout() {
    try {
        await signOut(auth);
        window.location.replace("index.html");
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}
// =====================================================
// CLOUDINARY IMAGE UPLOAD
// =====================================================

async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData
    });

    const result = await response.json();

    if (!result.secure_url) {
        throw new Error(result.error?.message || "Image upload failed");
    }

    return result.secure_url;
}

// =====================================================
// ADD PRODUCT
// =====================================================

async function handleAddProduct() {
    try {
        const productImage = document.getElementById("productImage");
        const brand = document.getElementById("brand").value.trim();
        const model = document.getElementById("model").value.trim();
        const name = document.getElementById("name").value.trim();
        const price = Number(document.getElementById("price").value);
        const category = document.getElementById("category").value.trim();
        const warranty = document.getElementById("warranty").value.trim();
        const stock = document.getElementById("stock").value;
        const description = document.getElementById("description").value.trim();

        if (!productImage.files[0]) {
            alert("Select Product Image");
            return;
        }

        if (!brand || !model || !name || !price || !category || !warranty || !description) {
            alert("Fill all product details");
            return;
        }

        const imageURL = await uploadImageToCloudinary(productImage.files[0]);

        await addDoc(collection(db, "products"), {
            image: imageURL,
            brand,
            model,
            name,
            price,
            category,
            warranty,
            stock,
            description,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        alert("Product Added Successfully");

        clearAddForm();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function clearAddForm() {
    const fields = ["productImage", "brand", "model", "name", "price", "category", "warranty", "description"];

    fields.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        if (el.type === "file") {
            el.value = "";
        } else {
            el.value = "";
        }
    });

    const stock = document.getElementById("stock");
    if (stock) stock.value = "Available";
}

// =====================================================
// LIVE PRODUCTS
// =====================================================

function loadProductsLive() {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        currentProducts = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
        }));

        const searchInput = document.getElementById("searchProduct");
        const filtered = filterProducts(searchInput ? searchInput.value.trim() : "");
        renderProducts(filtered);
        updateDashboardCards(currentProducts);
    });
}

// =====================================================
// FILTER
// =====================================================

function filterProducts(keyword) {
    if (!keyword) return currentProducts;

    const lower = keyword.toLowerCase();

    return currentProducts.filter((item) => {
        return (
            (item.name && item.name.toLowerCase().includes(lower)) ||
            (item.brand && item.brand.toLowerCase().includes(lower)) ||
            (item.model && item.model.toLowerCase().includes(lower)) ||
            (item.category && item.category.toLowerCase().includes(lower)) ||
            (item.stock && item.stock.toLowerCase().includes(lower))
        );
    });
}

// =====================================================
// RENDER TABLE
// =====================================================

function renderProducts(products) {
    const list = document.getElementById("productList");
    if (!list) return;

    list.innerHTML = "";

    if (!products.length) {
        list.innerHTML = `
            <tr>
                <td colspan="8" style="padding:20px; text-align:center;">
                    No products found
                </td>
            </tr>
        `;
        return;
    }

    products.forEach((item) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <img class="product-img" src="${item.image || ""}" alt="${item.name || "Product"}">
            </td>
            <td>${item.brand || "-"}</td>
            <td>${item.model || "-"}</td>
            <td>${item.name || "-"}</td>
            <td>₹${Number(item.price || 0).toLocaleString("en-IN")}</td>
            <td>${item.warranty || "-"}</td>
            <td>${item.stock || "-"}</td>
            <td>
                <button class="edit-btn" type="button" data-edit-id="${item.id}">
                    Edit
                </button>
                <button class="delete-btn" type="button" data-delete-id="${item.id}">
                    Delete
                </button>
            </td>
        `;

        list.appendChild(tr);
    });

    bindTableButtons();
}

// =====================================================
// TABLE BUTTONS
// =====================================================

function bindTableButtons() {
    document.querySelectorAll("[data-edit-id]").forEach((btn) => {
        btn.onclick = () => openEditProduct(btn.getAttribute("data-edit-id"));
    });

    document.querySelectorAll("[data-delete-id]").forEach((btn) => {
        btn.onclick = () => deleteProduct(btn.getAttribute("data-delete-id"));
    });
}

// =====================================================
// EDIT PRODUCT
// =====================================================

function openEditProduct(id) {
    const product = currentProducts.find((item) => item.id === id);
    if (!product) return;

    editingProductId = id;

    document.getElementById("editProductId").value = id;
    document.getElementById("editBrand").value = product.brand || "";
    document.getElementById("editModel").value = product.model || "";
    document.getElementById("editName").value = product.name || "";
    document.getElementById("editPrice").value = product.price || "";
    document.getElementById("editCategory").value = product.category || "";
    document.getElementById("editWarranty").value = product.warranty || "";
    document.getElementById("editStock").value = product.stock || "Available";
    document.getElementById("editDescription").value = product.description || "";

    document.getElementById("editProductImage").value = "";

    showEditModal();
}

async function handleUpdateProduct() {
    try {
        if (!editingProductId) {
            alert("Select a product to edit");
            return;
        }

        const brand = document.getElementById("editBrand").value.trim();
        const model = document.getElementById("editModel").value.trim();
        const name = document.getElementById("editName").value.trim();
        const price = Number(document.getElementById("editPrice").value);
        const category = document.getElementById("editCategory").value.trim();
        const warranty = document.getElementById("editWarranty").value.trim();
        const stock = document.getElementById("editStock").value;
        const description = document.getElementById("editDescription").value.trim();
        const imageFile = document.getElementById("editProductImage").files[0];

        if (!brand || !model || !name || !price || !category || !warranty || !description) {
            alert("Fill all edit fields");
            return;
        }

        const updateData = {
            brand,
            model,
            name,
            price,
            category,
            warranty,
            stock,
            description,
            updatedAt: serverTimestamp()
        };

        if (imageFile) {
            updateData.image = await uploadImageToCloudinary(imageFile);
        }

        await updateDoc(doc(db, "products", editingProductId), updateData);

        alert("Product Updated Successfully");

        editingProductId = null;
        hideEditModal();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// =====================================================
// DELETE PRODUCT
// =====================================================

async function deleteProduct(id) {
    try {
        const confirmDelete = confirm("Delete this product?");
        if (!confirmDelete) return;

        await deleteDoc(doc(db, "products", id));

        alert("Deleted Successfully");
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// =====================================================
// DASHBOARD CARDS
// =====================================================

function updateDashboardCards(products) {
    const totalProducts = document.getElementById("totalProducts");
    const availableProducts = document.getElementById("availableProducts");
    const outProducts = document.getElementById("outProducts");
    const totalCategories = document.getElementById("totalCategories");

    const total = products.length;
    const available = products.filter((p) => (p.stock || "").toLowerCase() === "available").length;
    const out = products.filter((p) => (p.stock || "").toLowerCase() === "out of stock").length;
    const categories = new Set(products.map((p) => p.category).filter(Boolean)).size;

    if (totalProducts) totalProducts.textContent = total;
    if (availableProducts) availableProducts.textContent = available;
    if (outProducts) outProducts.textContent = out;
    if (totalCategories) totalCategories.textContent = categories;
}

// =====================================================
// SETTINGS
// =====================================================

async function loadSettings() {
    try {
        const settingsRef = doc(db, "settings", "company");
        const snap = await getDoc(settingsRef);

        if (!snap.exists()) return;

        const data = snap.data();

        setValue("companyName", data.companyName);
        setValue("companyPhone", data.companyPhone);
        setValue("companyEmail", data.companyEmail);
        setValue("companyAddress", data.companyAddress);
        setValue("businessHours", data.businessHours);
    } catch (error) {
        console.error(error);
    }
}

function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || "";
}

async function handleSaveSettings() {
    try {
        const data = {
            companyName: document.getElementById("companyName").value.trim(),
            companyPhone: document.getElementById("companyPhone").value.trim(),
            companyEmail: document.getElementById("companyEmail").value.trim(),
            companyAddress: document.getElementById("companyAddress").value.trim(),
            businessHours: document.getElementById("businessHours").value.trim(),
            updatedAt: serverTimestamp()
        };

        await setDoc(doc(db, "settings", "company"), data, { merge: true });

        alert("Settings Saved Successfully");
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// =====================================================
// CHANGE ADMIN EMAIL
// =====================================================
async function handleChangeEmail() {
    try {
        const user = auth.currentUser;

        if (!user) {
            alert("Admin session expired. Please login again.");
            window.location.href = "index.html";
            return;
        }

        const newEmail = document
            .getElementById("adminNewEmail")
            .value
            .trim();

        const currentPassword = document
            .getElementById("adminCurrentPassword")
            .value;

        if (!newEmail) {
            alert("Enter New Admin Email");
            return;
        }

        if (!currentPassword) {
            alert("Enter Current Password");
            return;
        }

        if (newEmail.toLowerCase() === user.email.toLowerCase()) {
            alert("New email is same as current email.");
            return;
        }

        const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
        );

        await reauthenticateWithCredential(user, credential);

        await verifyBeforeUpdateEmail(user, newEmail);

        alert("Verification email sent to: " + newEmail + "\n\nOpen that mail and verify it first.");

        document.getElementById("adminNewEmail").value = "";
        document.getElementById("adminCurrentPassword").value = "";

    } catch (error) {
        console.error("EMAIL CHANGE ERROR:", error);

        switch (error.code) {
            case "auth/wrong-password":
            case "auth/invalid-credential":
                alert("Current password is incorrect.");
                break;

            case "auth/invalid-email":
                alert("Enter a valid email address.");
                break;

            case "auth/email-already-in-use":
                alert("This email is already used by another account.");
                break;

            case "auth/requires-recent-login":
                alert("Please logout and login again, then try changing email.");
                break;

            case "auth/network-request-failed":
                alert("Network error. Check your internet connection.");
                break;

            default:
                alert("Email change failed: " + error.message);
        }
    }
}



// =====================================================
// CHANGE ADMIN PASSWORD
// =====================================================

async function handleChangePassword() {
    try {
        const user = auth.currentUser;

        if (!user) {
            alert("Admin session expired. Please login again.");
            window.location.href = "index.html";
            return;
        }

        const currentPassword = document
            .getElementById("adminCurrentPassword")
            .value;

        const newPassword = document
            .getElementById("adminNewPassword")
            .value;

        if (!currentPassword) {
            alert("Enter Current Password");
            return;
        }

        if (!newPassword) {
            alert("Enter New Password");
            return;
        }

        if (newPassword.length < 6) {
            alert("New password must be at least 6 characters.");
            return;
        }

        // Re-authenticate the currently logged-in admin
        const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
        );

        await reauthenticateWithCredential(user, credential);

        // Update Firebase Authentication password
        await updatePassword(user, newPassword);

alert("Admin Password Changed Successfully.\n\nPlease login again with your new password.");

document.getElementById("adminCurrentPassword").value = "";
document.getElementById("adminNewPassword").value = "";

await signOut(auth);
window.location.replace("index.html");

    } catch (error) {
        console.error("PASSWORD CHANGE ERROR:", error);

        switch (error.code) {
            case "auth/wrong-password":
            case "auth/invalid-credential":
                alert("Current password is incorrect.");
                break;

            case "auth/weak-password":
                alert("New password is too weak.");
                break;

            case "auth/requires-recent-login":
                alert("Please logout and login again, then try changing the password.");
                break;

            case "auth/network-request-failed":
                alert("Network error. Check your internet connection.");
                break;

            default:
                alert("Password change failed: " + error.message);
        }
    }
}

// =====================================================
// GLOBALS FOR INLINE SUPPORT
// =====================================================

window.deleteProduct = deleteProduct;
window.openEditProduct = openEditProduct;
