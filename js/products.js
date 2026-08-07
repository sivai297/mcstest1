/* ==========================================
   MCS Products Controller
   Firebase Firestore + Render + Filter + Modal
========================================== */

"use strict";

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const MCS_WHATSAPP_NUMBER =
    window.MCS_WHATSAPP_NUMBER || "918190081807";

const state = {
    initialized: false,
    cards: [],
    modalData: null,
    emptyStateEl: null,
    observer: null,
    searchQuery: "",
    category: "all",
    brand: "all",
    sort: "default"
};

const dom = {
    productsContainer: document.getElementById("productsContainer"),
    categoryFilter: document.querySelector("#categoryFilter, .category-filter, [data-filter='category']"),
    brandFilter: document.querySelector("#brandFilter, .brand-filter, [data-filter='brand']"),
    sortFilter: document.querySelector("#sortFilter, .sort-filter, [data-sort]")
};

/* ==========================================
   PUBLIC API
========================================== */

window.MCSProducts = {
    init,
    loadProducts,
    refresh,
    renderProducts,
    applyAllFilters,
    setSearchQuery,
    openProductModal
};

/* ==========================================
   INIT
========================================== */

function init() {
    if (state.initialized) return;
    state.initialized = true;

    ensureEmptyState();
    ensureModal();
    bindOptionalFilters();
    bindDelegatedActions();
    loadProducts();
}

/* ==========================================
   HELPERS
========================================== */

function text(value) {
    return String(value || "").trim();
}

function lower(value) {
    return text(value).toLowerCase();
}

function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function extractNumber(value) {
    const match = String(value || "").replace(/,/g, "").match(/[\d.]+/);
    return match ? Number(match[0]) : 0;
}

function formatPrice(value) {
    const raw = text(value);
    if (!raw) return "Price on Request";

    const numeric = raw.replace(/[^0-9.]/g, "");
    if (!numeric) {
        return raw.startsWith("₹") ? raw : `₹${raw}`;
    }

    const number = Number(numeric);
    if (!Number.isFinite(number)) return raw;

    return `₹${number.toLocaleString("en-IN")}`;
}

function resolveImage(product) {
    return (
        text(product.image) ||
        text(product.imageUrl) ||
        text(product.photo) ||
        "assets/logo.png"
    );
}

function resolveValue(product, keys) {
    for (const key of keys) {
        if (product && product[key] !== undefined && product[key] !== null && text(product[key]) !== "") {
            return product[key];
        }
    }
    return "";
}

function refresh() {
    cacheCards();
    bindCardEffects();
    observeCards();
    applyAllFilters();
}

/* ==========================================
   FIRESTORE LOAD
========================================== */

async function loadProducts() {
    if (!dom.productsContainer) return;

    try {
        dom.productsContainer.innerHTML = `
            <div class="mcs-loading" style="padding:20px;text-align:center;">
                Loading products...
            </div>
        `;

        const snapshot = await getDocs(collection(db, "products"));
        const products = [];

        snapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });

        renderProducts(products);
    } catch (error) {
        console.error("Error loading products:", error);

        if (dom.productsContainer) {
            dom.productsContainer.innerHTML = `
                <div class="mcs-error" style="padding:20px;text-align:center;">
                    Failed to load products
                </div>
            `;
        }
    }
}

/* ==========================================
   SEARCH QUERY FROM SEARCH.JS
========================================== */

function setSearchQuery(query) {
    state.searchQuery = lower(query);
}

/* ==========================================
   RENDER PRODUCTS
========================================== */

function renderProducts(products) {
    const container = dom.productsContainer || document.querySelector("#productsContainer");
    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(products) || products.length === 0) {
        container.innerHTML = `
            <div class="mcs-products-note" style="padding:20px;text-align:center;">
                No products available.
            </div>
        `;
        refresh();
        return;
    }

    const fragment = document.createDocumentFragment();

    products.forEach((product) => {
        const name = text(resolveValue(product, ["name", "productName", "title"])) || "-";
        const brand = text(resolveValue(product, ["brand", "brandName"])) || "-";
        const model = text(resolveValue(product, ["model", "modelNumber"])) || "-";
        const category = text(resolveValue(product, ["category"])) || "-";
        const warranty = text(resolveValue(product, ["warranty"])) || "-";
        const stock = text(resolveValue(product, ["stock"])) || "Available";
        const description = text(resolveValue(product, ["description", "desc"])) || "";
        const priceValue = resolveValue(product, ["price", "amount", "mrp"]);
        const image = resolveImage(product);
        const phone = text(resolveValue(product, ["phone", "whatsapp", "contactNumber"]));

        const card = document.createElement("article");
        card.className = "product-card";

        card.dataset.id = text(product.id);
        card.dataset.name = name;
        card.dataset.brand = brand;
        card.dataset.model = model;
        card.dataset.category = category;
        card.dataset.warranty = warranty;
        card.dataset.stock = stock;
        card.dataset.description = description;
        card.dataset.price = text(priceValue);
        card.dataset.image = image;
        card.dataset.phone = phone;

        card.innerHTML = `
            <div class="product-image">
                <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}">
                <span class="stock">${escapeHtml(stock)}</span>
            </div>

            <div class="product-content">
                <span class="brand">${escapeHtml(brand)}</span>
                <span class="model">${escapeHtml(model)}</span>
                <span class="category">${escapeHtml(category)}</span>

                <h3 class="product-name">${escapeHtml(name)}</h3>
                <h4 class="price">${escapeHtml(formatPrice(priceValue))}</h4>

                <p class="description">${escapeHtml(description)}</p>

                <span class="warranty">${escapeHtml(warranty)}</span>

                <div class="product-buttons">
                    <a href="#" class="details-btn">Details</a>
                    <a href="#" class="whatsapp-btn">WhatsApp</a>
                </div>
            </div>
        `;

        fragment.appendChild(card);
    });

    container.appendChild(fragment);
    refresh();
}

/* ==========================================
   CACHE CARDS
========================================== */

function cacheCards() {
    state.cards = Array.from(document.querySelectorAll(".product-card"));

    state.cards.forEach((card) => {
        if (!card.dataset.mcsDisplay) {
            card.dataset.mcsDisplay = card.style.display || "";
        }

        card.dataset.mcsBound = card.dataset.mcsBound || "";
        card.dataset.mcsZoomBound = card.dataset.mcsZoomBound || "";
    });
}

/* ==========================================
   FILTER / SORT
========================================== */

function bindOptionalFilters() {
    const filters = [dom.categoryFilter, dom.brandFilter, dom.sortFilter].filter(Boolean);

    filters.forEach((el) => {
        el.addEventListener("change", () => {
            if (dom.categoryFilter) state.category = lower(dom.categoryFilter.value || "all");
            if (dom.brandFilter) state.brand = lower(dom.brandFilter.value || "all");
            if (dom.sortFilter) state.sort = lower(dom.sortFilter.value || "default");
            applyAllFilters();
        });
    });
}

function matchesSearch(card, keyword) {
    if (!keyword) return true;

    const searchable = [
        card.dataset.name,
        card.dataset.brand,
        card.dataset.model,
        card.dataset.category,
        card.dataset.warranty,
        card.dataset.description,
        card.dataset.price,
        card.dataset.stock,
        card.innerText
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return searchable.includes(keyword);
}

function matchesCategory(card, category) {
    if (!category || category === "all") return true;
    return lower(card.dataset.category) === category;
}

function matchesBrand(card, brand) {
    if (!brand || brand === "all") return true;
    return lower(card.dataset.brand) === brand;
}

function sortCards(list, sort) {
    const sorted = [...list];

    switch (sort) {
        case "price-low":
            sorted.sort((a, b) => extractNumber(a.dataset.price) - extractNumber(b.dataset.price));
            break;

        case "price-high":
            sorted.sort((a, b) => extractNumber(b.dataset.price) - extractNumber(a.dataset.price));
            break;

        case "name-a-z":
            sorted.sort((a, b) => lower(a.dataset.name).localeCompare(lower(b.dataset.name)));
            break;

        case "name-z-a":
            sorted.sort((a, b) => lower(b.dataset.name).localeCompare(lower(a.dataset.name)));
            break;

        default:
            break;
    }

    return sorted;
}

function setCardVisible(card, visible) {
    card.style.display = visible ? (card.dataset.mcsDisplay || "") : "none";
}

function applyAllFilters() {
    cacheCards();

    const keyword = lower(state.searchQuery);
    const currentCategory = lower(state.category || "all");
    const currentBrand = lower(state.brand || "all");
    const currentSort = lower(state.sort || "default");
    const container = dom.productsContainer || document.querySelector("#productsContainer");

    let visibleCards = state.cards.filter((card) => {
        return (
            matchesSearch(card, keyword) &&
            matchesCategory(card, currentCategory) &&
            matchesBrand(card, currentBrand)
        );
    });

    visibleCards = sortCards(visibleCards, currentSort);

    state.cards.forEach((card) => setCardVisible(card, false));

    visibleCards.forEach((card) => {
        setCardVisible(card, true);
        if (container) {
            container.appendChild(card);
        }
    });

    updateEmptyState(visibleCards.length === 0);
}

function updateEmptyState(show) {
    if (!state.emptyStateEl) return;
    state.emptyStateEl.style.display = show ? "block" : "none";
}

function ensureEmptyState() {
    if (document.getElementById("mcsProductsEmptyState")) {
        state.emptyStateEl = document.getElementById("mcsProductsEmptyState");
        return;
    }

    const target = dom.productsContainer || document.body;

    state.emptyStateEl = document.createElement("div");
    state.emptyStateEl.id = "mcsProductsEmptyState";
    state.emptyStateEl.style.cssText = `
        display:none;
        width:100%;
        padding:18px;
        margin:18px 0;
        border-radius:14px;
        background:rgba(255,255,255,.92);
        color:#0f172a;
        text-align:center;
        font-weight:600;
        box-shadow:0 10px 25px rgba(0,0,0,.08);
    `;
    state.emptyStateEl.textContent = "No products found";

    if (target.parentElement) {
        target.parentElement.insertBefore(state.emptyStateEl, target.nextSibling);
    } else {
        document.body.appendChild(state.emptyStateEl);
    }
}

/* ==========================================
   HOVER + IMAGE ZOOM
========================================== */

function bindCardEffects() {
    state.cards.forEach((card) => {
        if (card.dataset.mcsBound === "1") return;

        card.dataset.mcsBound = "1";
        card.style.transition = "transform .25s ease, box-shadow .25s ease";

        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-10px) scale(1.02)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0) scale(1)";
        });
    });

    document.querySelectorAll(".product-image img, .product-card img").forEach((img) => {
        if (img.dataset.mcsZoomBound === "1") return;

        img.dataset.mcsZoomBound = "1";
        img.style.transition = "transform .25s ease";

        img.addEventListener("mouseenter", () => {
            img.style.transform = "scale(1.08)";
        });

        img.addEventListener("mouseleave", () => {
            img.style.transform = "scale(1)";
        });
    });
}

/* ==========================================
   DELEGATED ACTIONS
========================================== */

function bindDelegatedActions() {
    document.addEventListener("click", (e) => {
        const detailsBtn = e.target.closest(
            ".product-buttons a:first-child, .details-btn, [data-details]"
        );

        const whatsappBtn = e.target.closest(
            ".product-buttons a:last-child, .whatsapp-btn, [data-whatsapp]"
        );

        if (detailsBtn) {
            e.preventDefault();
            const card = detailsBtn.closest(".product-card");
            if (card) openProductModal(card);
            return;
        }

        if (whatsappBtn) {
            e.preventDefault();
            const card = whatsappBtn.closest(".product-card");
            if (card) openWhatsAppEnquiry(card);
        }
    });
}

/* ==========================================
   WHATSAPP ENQUIRY
========================================== */

function openWhatsAppEnquiry(card) {
    const phone =
        card.dataset.phone ||
        window.MCS_WHATSAPP_NUMBER ||
        MCS_WHATSAPP_NUMBER;

    const message = `
Hello MCS,

I am interested in this product.

Product : ${card.dataset.name || "-"}
Brand : ${card.dataset.brand || "-"}
Model : ${card.dataset.model || "-"}
Price : ${card.dataset.price || "-"}
Warranty : ${card.dataset.warranty || "-"}
Stock : ${card.dataset.stock || "-"}

Please send more details.
`.trim();

    window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer"
    );
}

/* ==========================================
   PRODUCT DETAILS MODAL
========================================== */

function ensureModalStyles() {
    if (document.getElementById("mcsProductsModalStyles")) return;

    const style = document.createElement("style");
    style.id = "mcsProductsModalStyles";
    style.textContent = `
        .mcs-modal{
            position:fixed;
            inset:0;
            background:rgba(15,23,42,.72);
            display:none;
            align-items:center;
            justify-content:center;
            z-index:9999;
            padding:18px;
        }
        .mcs-modal.show{ display:flex; }
        .mcs-modal-box{
            width:min(920px,100%);
            max-height:90vh;
            overflow:auto;
            background:#fff;
            border-radius:18px;
            box-shadow:0 25px 70px rgba(0,0,0,.35);
            display:grid;
            grid-template-columns:1fr 1fr;
            position:relative;
        }
        .mcs-modal-media{
            background:#f8fafc;
            padding:18px;
            display:flex;
            align-items:center;
            justify-content:center;
        }
        .mcs-modal-media img{
            width:100%;
            max-height:420px;
            object-fit:cover;
            border-radius:14px;
        }
        .mcs-modal-content{
            padding:24px;
        }
        .mcs-modal-close{
            position:absolute;
            top:14px;
            right:18px;
            width:42px;
            height:42px;
            border:none;
            border-radius:50%;
            background:#16a34a;
            color:#fff;
            font-size:22px;
            cursor:pointer;
            box-shadow:0 0 18px rgba(22,163,74,.35);
        }
        .mcs-modal-content h3{
            font-size:28px;
            color:#0f172a;
            margin-bottom:10px;
        }
        .mcs-meta{
            display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:12px;
            margin:18px 0;
        }
        .mcs-meta div{
            background:#f8fafc;
            border:1px solid #e5e7eb;
            border-radius:12px;
            padding:12px;
        }
        .mcs-meta span{
            display:block;
            font-size:12px;
            color:#64748b;
            margin-bottom:4px;
        }
        .mcs-meta strong{
            color:#0f172a;
        }
        .mcs-description{
            line-height:1.7;
            color:#334155;
            margin-top:8px;
        }
        .mcs-modal-actions{
            display:flex;
            gap:12px;
            flex-wrap:wrap;
            margin-top:22px;
        }
        .mcs-btn{
            border:none;
            padding:12px 18px;
            border-radius:10px;
            font-weight:700;
            cursor:pointer;
            text-decoration:none;
            display:inline-flex;
            align-items:center;
            justify-content:center;
        }
        .mcs-btn-primary{
            background:#16a34a;
            color:#fff;
        }
        .mcs-btn-secondary{
            background:#e2e8f0;
            color:#0f172a;
        }
        @media (max-width: 768px){
            .mcs-modal-box{
                grid-template-columns:1fr;
            }
            .mcs-meta{
                grid-template-columns:1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

function ensureModal() {
    ensureModalStyles();

    if (document.getElementById("mcsProductModal")) return;

    const modal = document.createElement("div");
    modal.id = "mcsProductModal";
    modal.className = "mcs-modal";

    modal.innerHTML = `
        <div class="mcs-modal-box">
            <div class="mcs-modal-media">
                <img id="mcsModalImage" src="" alt="Product Image">
            </div>

            <div class="mcs-modal-content">
                <button type="button" class="mcs-modal-close" id="mcsModalClose">×</button>
                <h3 id="mcsModalTitle">Product Name</h3>
                <p id="mcsModalBrand" style="color:#16a34a;font-weight:700;"></p>

                <div class="mcs-meta">
                    <div>
                        <span>Price</span>
                        <strong id="mcsModalPrice"></strong>
                    </div>
                    <div>
                        <span>Stock</span>
                        <strong id="mcsModalStock"></strong>
                    </div>
                    <div>
                        <span>Model</span>
                        <strong id="mcsModalModel"></strong>
                    </div>
                    <div>
                        <span>Warranty</span>
                        <strong id="mcsModalWarranty"></strong>
                    </div>
                    <div>
                        <span>Category</span>
                        <strong id="mcsModalCategory"></strong>
                    </div>
                    <div>
                        <span>Brand</span>
                        <strong id="mcsModalBrand2"></strong>
                    </div>
                </div>

                <p class="mcs-description" id="mcsModalDescription"></p>

                <div class="mcs-modal-actions">
                    <a href="#" class="mcs-btn mcs-btn-primary" id="mcsModalWhatsApp">WhatsApp Enquiry</a>
                    <button type="button" class="mcs-btn mcs-btn-secondary" id="mcsModalClose2">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => hideProductModal();

    document.getElementById("mcsModalClose").addEventListener("click", close);
    document.getElementById("mcsModalClose2").addEventListener("click", close);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
    });

    document.getElementById("mcsModalWhatsApp").addEventListener("click", (e) => {
        e.preventDefault();
        if (state.modalData?.card) {
            openWhatsAppEnquiry(state.modalData.card);
        }
    });
}

function openProductModal(card) {
    ensureModal();

    state.modalData = { card };

    document.getElementById("mcsModalImage").src = card.dataset.image || "assets/logo.png";
    document.getElementById("mcsModalImage").alt = card.dataset.name || "Product Image";
    document.getElementById("mcsModalTitle").textContent = card.dataset.name || "Product";
    document.getElementById("mcsModalBrand").textContent = card.dataset.brand ? card.dataset.brand : "";
    document.getElementById("mcsModalBrand2").textContent = card.dataset.brand || "-";
    document.getElementById("mcsModalPrice").textContent = card.dataset.price ? formatPrice(card.dataset.price) : "-";
    document.getElementById("mcsModalStock").textContent = card.dataset.stock || "-";
    document.getElementById("mcsModalModel").textContent = card.dataset.model || "-";
    document.getElementById("mcsModalWarranty").textContent = card.dataset.warranty || "-";
    document.getElementById("mcsModalCategory").textContent = card.dataset.category || "-";
    document.getElementById("mcsModalDescription").textContent =
        card.dataset.description || "No description available for this product.";

    document.getElementById("mcsProductModal").classList.add("show");
}

function hideProductModal() {
    const modal = document.getElementById("mcsProductModal");
    if (modal) modal.classList.remove("show");
    state.modalData = null;
}

/* ==========================================
   ANIMATION
========================================== */

function observeCards() {
    if (!("IntersectionObserver" in window)) return;

    if (state.observer) {
        state.observer.disconnect();
    }

    state.observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2
        }
    );

    state.cards.forEach((card) => {
        state.observer.observe(card);
    });
       }
