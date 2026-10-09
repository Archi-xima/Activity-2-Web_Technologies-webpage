/* =========================================================================
   ICT251 Web Technologies - Activity 3
   js/script.js - all interactive behaviour for this personal website.

   Features:
     1. Contact form validation + on-page preview (compulsory)
     2. Projects filter with search, reset and a "no matches" message
     3. Light / dark theme switch
     4. Mobile navigation toggle
     5. Expandable ("Read more") content
   ========================================================================= */

/* Signal to the stylesheet that JavaScript is available, so the mobile menu
   is only hidden when we can show it again. */
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
    initContactForm();
    initProjectFilter();
    initThemeSwitch();
    initMobileNav();
    initExpandableContent();
});

/* -------------------------------------------------------------------------
   1. CONTACT FORM: validation + preview (no page reload, nothing is sent)
   ------------------------------------------------------------------------- */

function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const topicInput = document.getElementById("contact-topic");
    const messageInput = document.getElementById("contact-message");

    const preview = document.getElementById("form-preview");
    const previewNote = document.getElementById("preview-note");

    const fields = [
        { input: nameInput, error: "name-error" },
        { input: emailInput, error: "email-error" },
        { input: messageInput, error: "message-error" }
    ];

    /* Simple, deliberately strict email check: something@something.tld */
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    /* Show one error message under a field and flag it for screen readers. */
    function setError(field, message) {
        const box = document.getElementById(field.error);
        box.textContent = message;              // textContent, never innerHTML
        field.input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    /* Clear every error before validating again. */
    function clearErrors() {
        fields.forEach(function (field) { setError(field, ""); });
    }

    /* Hide the preview as soon as the visitor edits the form again. */
    function resetPreview() {
        preview.hidden = true;
        previewNote.textContent = "";
    }

    /* Validate all fields. Returns an array of error messages (empty = valid). */
    function validateForm() {
        const errors = [];
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (name === "") {
            errors.push({ field: fields[0], message: "Please enter your full name. Spaces alone are not accepted." });
        }

        if (email === "") {
            errors.push({ field: fields[1], message: "Please enter your email address." });
        } else if (!isValidEmail(email)) {
            errors.push({ field: fields[1], message: "Please enter a valid email address, for example name@example.com." });
        }

        if (message === "") {
            errors.push({ field: fields[2], message: "Please enter a message. Spaces alone are not accepted." });
        }

        return errors;
    }

    /* Build the summary using textContent only (safe for any characters). */
    function showPreview(name, email, topic, message) {
        document.getElementById("preview-name").textContent = name;
        document.getElementById("preview-email").textContent = email;
        document.getElementById("preview-topic").textContent = topic;
        document.getElementById("preview-message").textContent = message;

        const stamp = new Date().toLocaleString();
        previewNote.textContent = "Form validated successfully in your browser on " + stamp +
                                  ". Your message was NOT sent.";
        preview.hidden = false;
        preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    /* Clear a field's error while the visitor is typing. */
    fields.forEach(function (field) {
        field.input.addEventListener("input", function () {
            setError(field, "");
            resetPreview();
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();          // stop the browser submitting/reloading
        clearErrors();
        resetPreview();

        const errors = validateForm();

        if (errors.length > 0) {
            errors.forEach(function (item) { setError(item.field, item.message); });
            errors[0].field.input.focus();   // send the keyboard to the first problem
            return;
        }

        /* Everything is valid - show the on-page summary. */
        showPreview(
            nameInput.value.trim(),
            emailInput.value.trim(),
            topicInput.value,
            messageInput.value.trim()
        );
    });
}

/* -------------------------------------------------------------------------
   2. PROJECTS FILTER: category buttons + search box + reset + "no matches"
   ------------------------------------------------------------------------- */

function initProjectFilter() {
    const grid = document.getElementById("project-grid");
    if (!grid) return;

    const buttons = Array.from(document.querySelectorAll(".filter-btn"));
    const searchInput = document.getElementById("project-search");
    const resetButton = document.getElementById("filter-reset");
    const status = document.getElementById("filter-status");
    const noMatches = document.getElementById("no-matches");
    const cards = Array.from(grid.querySelectorAll(".project-card"));

    let activeCategory = "all";

    /* Show/hide cards for the current category and search text. */
    function applyFilter() {
        const query = searchInput.value.trim().toLowerCase();
        let visible = 0;

        cards.forEach(function (card) {
            const category = card.dataset.category;
            const haystack = (card.dataset.tags + " " + card.textContent).toLowerCase();

            const matchesCategory = activeCategory === "all" || category === activeCategory;
            const matchesSearch = query === "" || haystack.indexOf(query) !== -1;
            const show = matchesCategory && matchesSearch;

            card.hidden = !show;
            if (show) visible++;
        });

        noMatches.hidden = visible !== 0;
        status.textContent = visible === 0
            ? "Showing 0 of " + cards.length + " projects."
            : "Showing " + visible + " of " + cards.length + " projects.";
    }

    /* Keep the button styling and aria-pressed state in step with the filter. */
    function setActiveButton(category) {
        activeCategory = category;
        buttons.forEach(function (button) {
            const isActive = button.dataset.filter === category;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            setActiveButton(button.dataset.filter);
            applyFilter();
        });
    });

    searchInput.addEventListener("input", applyFilter);

    resetButton.addEventListener("click", function () {
        searchInput.value = "";
        setActiveButton("all");
        applyFilter();
        searchInput.focus();
    });

    setActiveButton("all");
    applyFilter();
}

/* -------------------------------------------------------------------------
   3. LIGHT / DARK THEME SWITCH (choice remembered in localStorage)
   ------------------------------------------------------------------------- */

function initThemeSwitch() {
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    const label = button.querySelector(".theme-toggle-label");

    /* localStorage can throw in private browsing, so always use try/catch. */
    function readStoredTheme() {
        try {
            return window.localStorage.getItem("site-theme");
        } catch (err) {
            return null;
        }
    }

    function storeTheme(theme) {
        try {
            window.localStorage.setItem("site-theme", theme);
        } catch (err) {
            /* Storage unavailable - the switch still works for this visit. */
        }
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";
        document.documentElement.dataset.theme = isDark ? "dark" : "light";
        button.setAttribute("aria-pressed", String(isDark));
        label.textContent = isDark ? "Light theme" : "Dark theme";
        storeTheme(isDark ? "dark" : "light");
    }

    const stored = readStoredTheme();
    const prefersDark = window.matchMedia &&
                        window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(stored || (prefersDark ? "dark" : "light"));

    button.addEventListener("click", function () {
        const isDark = document.documentElement.dataset.theme === "dark";
        applyTheme(isDark ? "light" : "dark");
    });
}

/* -------------------------------------------------------------------------
   4. MOBILE NAVIGATION TOGGLE
   ------------------------------------------------------------------------- */

function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    function setOpen(isOpen) {
        menu.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
    }

    toggle.addEventListener("click", function () {
        setOpen(!menu.classList.contains("is-open"));
    });

    /* Close the menu after a link is chosen (mobile only). */
    menu.addEventListener("click", function (event) {
        if (event.target.tagName === "A") setOpen(false);
    });

    /* Escape always closes the menu. */
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") setOpen(false);
    });

    /* Reset the state if the window grows back to desktop width. */
    window.addEventListener("resize", function () {
        if (window.innerWidth > 820) setOpen(false);
    });
}

/* -------------------------------------------------------------------------
   5. EXPANDABLE CONTENT ("Read more" / "Show less")
   ------------------------------------------------------------------------- */

function initExpandableContent() {
    const button = document.getElementById("about-toggle");
    const panel = document.getElementById("about-more");
    if (!button || !panel) return;

    button.addEventListener("click", function () {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;
        button.textContent = isOpen ? "Read more" : "Show less";
    });
}
