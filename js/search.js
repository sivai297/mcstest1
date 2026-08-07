/* ==========================================
   MCS Search Controller
   Live Search for Products
========================================== */

"use strict";

const MCS_SEARCH_STATE = {
    initialized: false,
    query: ""
};

const dom = {
    searchInput: null,
    searchBtn: null
};

/* ==========================================
   PUBLIC API
========================================== */

window.MCSSearch = {
    init,
    applySearch,
    clearSearch,
    setSearchQuery,
    getSearchQuery
};

/* ==========================================
   DOM READY
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    init();
});

if (document.readyState !== "loading") {
    init();
}

/* ==========================================
   INIT
========================================== */

function init() {
    if (MCS_SEARCH_STATE.initialized) return;
    MCS_SEARCH_STATE.initialized = true;

    cacheDom();
    bindEvents();

    if (dom.searchInput) {
        setSearchQuery(dom.searchInput.value);
    }

    applySearch();
}

/* ==========================================
   CACHE DOM
========================================== */

function cacheDom() {
    dom.searchInput = document.getElementById("searchInput");
    dom.searchBtn = document.getElementById("searchBtn");
}

/* ==========================================
   EVENTS
========================================== */

function bindEvents() {
    if (!dom.searchInput) return;

    dom.searchInput.addEventListener("input", () => {
        setSearchQuery(dom.searchInput.value);
        applySearch();
    });

    dom.searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setSearchQuery(dom.searchInput.value);
            applySearch();
        }
    });

    if (dom.searchBtn) {
        dom.searchBtn.addEventListener("click", (e) => {
            e.preventDefault();
            setSearchQuery(dom.searchInput ? dom.searchInput.value : "");
            applySearch();
        });
    }
}

/* ==========================================
   QUERY
========================================== */

function setSearchQuery(value) {
    MCS_SEARCH_STATE.query = String(value || "").toLowerCase().trim();
}

function getSearchQuery() {
    return MCS_SEARCH_STATE.query;
}

/* ==========================================
   APPLY SEARCH
========================================== */

function applySearch() {
    cacheDom();

    if (dom.searchInput) {
        setSearchQuery(dom.searchInput.value);
    }

    if (
        window.MCSProducts &&
        typeof window.MCSProducts.setSearchQuery === "function"
    ) {
        window.MCSProducts.setSearchQuery(MCS_SEARCH_STATE.query);
    }

    if (
        window.MCSProducts &&
        typeof window.MCSProducts.applyAllFilters === "function"
    ) {
        window.MCSProducts.applyAllFilters();
        return;
    }

    fallbackSearch(MCS_SEARCH_STATE.query);
}

/* ==========================================
   FALLBACK SEARCH
========================================== */

function fallbackSearch(query) {
    const cards = document.querySelectorAll(".product-card");

    if (!cards.length) return;

    let visibleCount = 0;

    cards.forEach((card) => {
        const text = getCardSearchText(card);
        const match = !query || text.includes(query);

        card.style.display = match ? "" : "none";

        if (match) visibleCount++;
    });

    showNoResults(visibleCount === 0 && query !== "");
}

function getCardSearchText(card) {
    const parts = [
        card.dataset.name,
        card.dataset.brand,
        card.dataset.model,
        card.dataset.category,
        card.dataset.description,
        card.dataset.warranty,
        card.dataset.stock,
        card.dataset.price,
        card.innerText
    ];

    return parts
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

/* ==========================================
   CLEAR
========================================== */

function clearSearch() {
    MCS_SEARCH_STATE.query = "";

    if (dom.searchInput) {
        dom.searchInput.value = "";
    }

    applySearch();
}

/* ==========================================
   NO RESULTS
========================================== */

function showNoResults(show) {
    let emptyState = document.getElementById("searchEmptyState");

    if (!emptyState) {
        emptyState = document.createElement("div");
        emptyState.id = "searchEmptyState";
        emptyState.style.cssText = `
            display:none;
            width:100%;
            margin:20px 0;
            padding:16px 18px;
            border-radius:14px;
            background:#fff;
            color:#0f172a;
            text-align:center;
            font-weight:600;
            box-shadow:0 10px 25px rgba(0,0,0,.08);
        `;

        const target = document.getElementById("productsContainer") || document.body;

        if (target.parentElement) {
            target.parentElement.insertBefore(emptyState, target.nextSibling);
        } else {
            document.body.appendChild(emptyState);
        }
    }

    emptyState.textContent = "No matching products found";
    emptyState.style.display = show ? "block" : "none";
}
