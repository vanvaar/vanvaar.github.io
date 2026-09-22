/* =========================================================
   VANVAAR BLOG
   Frontend application

   IMPORTANT:
   This file currently uses localStorage as a temporary
   development database.

   Later:
   D1 + Cloudflare Worker will replace the local functions.
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const CONFIG = {

    /*
        Later replace this with your Cloudflare Worker API.

        Example:

        API_BASE:
        "https://api.vanvaar.com"

        For now keep null.
    */

    API_BASE: null,

    SITE_NAME: "VANVAAR"

};


/* =========================================================
   DEMO DATA
========================================================= */

const DEFAULT_BLOGS = [

    {
        id: 1,

        title:
            "Welcome to VANVAAR",

        publishedAt:
            "2026-09-22T10:00:00.000Z",

        views: 0,

        likes: [],

        comments: [],

        content: [

            {
                type: "text",

                value:
                    "Welcome to the official VANVAAR blog."
            },

            {
                type: "text",

                value:
                    "This is where VANVAAR will publish stories, announcements, production updates and original information."
            }

        ]

    },


    {
        id: 2,

        title:
            "Stories Beyond Imagination",

        publishedAt:
            "2026-09-22T12:00:00.000Z",

        views: 0,

        likes: [],

        comments: [],

        content: [

            {
                type: "text",

                value:
                    "VANVAAR is building an independent storytelling and media brand."
            },

            {
                type: "text",

                value:
                    "More original stories and projects will be published here."
            }

        ]

    }

];


/* =========================================================
   STATE
========================================================= */

let blogs = [];

let currentCommentBlogId = null;

let pendingAction = null;


/* =========================================================
   DOM
========================================================= */

const DOM = {

    blogs:
        document.getElementById(
            "blogsContainer"
        ),

    blogCount:
        document.getElementById(
            "blogCount"
        ),

    empty:
        document.getElementById(
            "emptyState"
        ),

    searchPanel:
        document.getElementById(
            "searchPanel"
        ),

    searchInput:
        document.getElementById(
            "blogNumberInput"
        ),

    searchMessage:
        document.getElementById(
            "searchMessage"
        ),

    menu:
        document.getElementById(
            "sideMenu"
        ),

    overlay:
        document.getElementById(
            "menuOverlay"
        ),

    mediaSection:
        document.getElementById(
            "mediaSection"
        ),

    mediaContainer:
        document.getElementById(
            "mediaContainer"
        )

};


/* =========================================================
   LOCAL STORAGE KEYS
========================================================= */

const STORAGE = {

    BLOGS:
        "vanvaar_blogs",

    USERNAME:
        "vanvaar_username",

    THEME:
        "vanvaar_theme",

    FONT_SIZE:
        "vanvaar_font_size"

};


/* =========================================================
   START APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


function initialize() {

    loadBlogs();

    loadSettings();

    setupEvents();

    renderBlogs();

}


/* =========================================================
   BLOG DATA
========================================================= */

function loadBlogs() {

    const saved =
        localStorage.getItem(
            STORAGE.BLOGS
        );


    if (!saved) {

        blogs =
            structuredClone(
                DEFAULT_BLOGS
            );

        saveBlogs();

        return;

    }


    try {

        blogs =
            JSON.parse(saved);

        if (!Array.isArray(blogs)) {

            throw new Error(
                "Invalid blog data"
            );

        }

    } catch (error) {

        console.error(error);

        blogs =
            structuredClone(
                DEFAULT_BLOGS
            );

        saveBlogs();

    }

}


function saveBlogs() {

    localStorage.setItem(
        STORAGE.BLOGS,
        JSON.stringify(blogs)
    );

}


/* =========================================================
   FUTURE API LAYER
========================================================= */

/*
    These functions are deliberately separated.

    Later, instead of rewriting the entire website,
    we replace these functions with Worker API calls.
*/


async function getBlogs() {

    if (CONFIG.API_BASE) {

        const response =
            await fetch(
                `${CONFIG.API_BASE}/blogs`
            );

        if (!response.ok) {

            throw new Error(
                "Could not load blogs"
            );

        }

        return await response.json();

    }


    return blogs;

}


async function sendLike(blogId) {

    if (CONFIG.API_BASE) {

        return await fetch(
            `${CONFIG.API_BASE}/blogs/${blogId}/like`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                }
            }
        );

    }


    return null;

}


async function sendComment(
    blogId,
    text
) {

    if (CONFIG.API_BASE) {

        return await fetch(
            `${CONFIG.API_BASE}/blogs/${blogId}/comments`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        text
                    })
            }
        );

    }


    return null;

}


/* =========================================================
   RENDER BLOGS
========================================================= */

function renderBlogs(
    scrollToId = null
) {

    DOM.blogs.innerHTML = "";

    DOM.blogCount.textContent =
        blogs.length;


    if (blogs.length === 0) {

        DOM.empty.classList.remove(
            "hidden"
        );

        return;

    }


    DOM.empty.classList.add(
        "hidden"
    );


    /*
        Smaller blog number stays first:

        #1
        #2
        #3
        #4
    */

    const sorted =
        [...blogs].sort(
            (a, b) =>
                a.id - b.id
        );


    sorted.forEach(
        blog => {

            DOM.blogs.appendChild(
                createBlogElement(blog)
            );

        }
    );


    if (scrollToId !== null) {

        setTimeout(
            () => {

                const target =
                    document.getElementById(
                        `blog-${scrollToId}`
                    );


                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            },
            80
        );

    }

}


/* =========================================================
   CREATE BLOG
========================================================= */

function createBlogElement(blog) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "blog";


    article.id =
        `blog-${blog.id}`;


    /*
        Number
    */

    const number =
        document.createElement(
            "div"
        );


    number.className =
        "blog-number";


    number.textContent =
        `Blog #${blog.id}`;


    /*
        Title
    */

    const title =
        document.createElement(
            "h2"
        );


    title.className =
        "blog-title";


    title.textContent =
        blog.title;


    /*
        Date / views
    */

    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "blog-meta";


    meta.textContent =
        `${formatDate(blog.publishedAt)} · ${formatNumber(blog.views || 0)} views`;


    /*
        Content
    */

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "blog-content";


    renderContentBlocks(
        content,
        blog.content || []
    );


    /*
        Actions
    */

    const actions =
        createBlogActions(blog);


    /*
        Comments
    */

    const comments =
        createComments(blog);


    article.appendChild(
        number
    );

    article.appendChild(
        title
    );

    article.appendChild(
        meta
    );

    article.appendChild(
        content
    );

    article.appendChild(
        actions
    );

    article.appendChild(
        comments
    );


    return article;

}


/* =========================================================
   CONTENT BLOCKS
========================================================= */

function renderContentBlocks(
    container,
    blocks
) {

    blocks.forEach(
        block => {

            if (!block) {
                return;
            }


            /*
                TEXT
            */

            if (
                block.type === "text"
            ) {

                const paragraph =
                    document.createElement(
                        "p"
                    );


                paragraph.className =
                    "content-paragraph";


                paragraph.textContent =
                    block.value || "";


                container.appendChild(
                    paragraph
                );

            }


            /*
                IMAGE
            */

            else if (
                block.type === "image"
            ) {

                const image =
                    document.createElement(
                        "img"
                    );


                image.className =
                    "content-image";


                image.src =
                    block.url;


                image.alt =
                    block.alt ||
                    "VANVAAR";


                image.loading =
                    "lazy";


                image.decoding =
                    "async";


                container.appendChild(
                    image
                );

            }


            /*
                VIDEO
            */

            else if (
                block.type === "video"
            ) {

                const video =
                    document.createElement(
                        "video"
                    );


                video.className =
                    "content-video";


                video.controls =
                    true;


                video.preload =
                    "metadata";


                if (
                    block.poster
                ) {

                    video.poster =
                        block.poster;

                }


                const source =
                    document.createElement(
                        "source"
                    );


                source.src =
                    block.url;


                if (
                    block.mime
                ) {

                    source.type =
                        block.mime;

                }


                video.appendChild(
                    source
                );


                container.appendChild(
                    video
                );

            }

        }
    );

}


/* =========================================================
   BLOG ACTIONS
========================================================= */

function createBlogActions(blog) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "blog-actions";


    /*
        LIKE
    */

    const like =
        document.createElement(
            "button"
        );


    like.className =
        "blog-action";


    const username =
        getUsername();


    if (
        username &&
        Array.isArray(blog.likes) &&
        blog.likes.includes(username)
    ) {

        like.classList.add(
            "liked"
        );

    }


    like.textContent =
        `♥ ${formatNumber(
            Array.isArray(blog.likes)
                ? blog.likes.length
                : 0
        )}`;


    like.addEventListener(
        "click",
        () => {

            requireUsername(
                () => {

                    toggleLike(
                        blog.id
                    );

                }
            );

        }
    );


    /*
        COMMENT
    */

    const comment =
        document.createElement(
            "button"
        );


    comment.className =
        "blog-action";


    comment.textContent =
        `💬 ${formatNumber(
            Array.isArray(blog.comments)
                ? blog.comments.length
                : 0
        )}`;


    comment.addEventListener(
        "click",
        () => {

            requireUsername(
                () => {

                    openCommentModal(
                        blog.id
                    );

                }
            );

        }
    );


    wrapper.appendChild(
        like
    );

    wrapper.appendChild(
        comment
    );


    return wrapper;

}


/* =========================================================
   LIKE
========================================================= */

async function toggleLike(
    blogId
) {

    const blog =
        blogs.find(
            item =>
                item.id === blogId
        );


    if (!blog) {
        return;
    }


    const username =
        getUsername();


    if (!username) {
        return;
    }


    if (!Array.isArray(blog.likes)) {

        blog.likes = [];

    }


    const index =
        blog.likes.indexOf(
            username
        );


    if (index === -1) {

        blog.likes.push(
            username
        );

    } else {

        blog.likes.splice(
            index,
            1
        );

    }


    saveBlogs();

    renderBlogs(
        blogId
    );


    /*
        Later this call will go to Worker/D1.
    */

    if (CONFIG.API_BASE) {

        try {

            await sendLike(
                blogId
            );

        } catch (error) {

            console.error(
                "Like API error:",
                error
            );

        }

    }

}


/* =========================================================
   COMMENTS
========================================================= */

function createComments(blog) {

    const wrapper =
        document.createElement(
            "div"
        );


    if (
        !Array.isArray(blog.comments) ||
        blog.comments.length === 0
    ) {

        return wrapper;

    }


    wrapper.className =
        "comments";


    blog.comments.forEach(
        comment => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "comment";


            const user =
                document.createElement(
                    "span"
                );


            user.className =
                "comment-user";


            user.textContent =
                `@${comment.username}`;


            const date =
                document.createElement(
                    "span"
                );


            date.className =
                "comment-date";


            date.textContent =
                formatDate(
                    comment.createdAt
                );


            const text =
                document.createElement(
                    "div"
                );


            text.className =
                "comment-text";


            text.textContent =
                comment.text;


            item.appendChild(
                user
            );

            item.appendChild(
                date
            );

            item.appendChild(
                text
            );


            wrapper.appendChild(
                item
            );

        }
    );


    return wrapper;

}


function openCommentModal(
    blogId
) {

    currentCommentBlogId =
        blogId;


    document.getElementById(
        "commentInput"
    ).value = "";


    document.getElementById(
        "commentError"
    ).textContent = "";


    openModal(
        "commentModal"
    );

}


async function submitComment() {

    const input =
        document.getElementById(
            "commentInput"
        );


    const error =
        document.getElementById(
            "commentError"
        );


    const text =
        input.value.trim();


    if (!text) {

        error.textContent =
            "Please write a comment.";

        return;

    }


    if (text.length > 1000) {

        error.textContent =
            "Comment is too long.";

        return;

    }


    const username =
        getUsername();


    if (!username) {

        closeModal(
            "commentModal"
        );

        requireUsername(
            () => {}
        );

        return;

    }


    const blog =
        blogs.find(
            item =>
                item.id ===
                currentCommentBlogId
        );


    if (!blog) {
        return;
    }


    if (
        !Array.isArray(
            blog.comments
        )
    ) {

        blog.comments = [];

    }


    blog.comments.push({

        username,

        text,

        createdAt:
            new Date().toISOString()

    });


    saveBlogs();

    closeModal(
        "commentModal"
    );


    renderBlogs(
        blog.id
    );


    /*
        Future Worker API
    */

    if (CONFIG.API_BASE) {

        try {

            await sendComment(
                blog.id,
                text
            );

        } catch (error) {

            console.error(
                "Comment API error:",
                error
            );

        }

    }

}


/* =========================================================
   USERNAME
========================================================= */

function getUsername() {

    return localStorage.getItem(
        STORAGE.USERNAME
    );

}


function requireUsername(
    callback
) {

    const username =
        getUsername();


    if (username) {

        callback();

        return;

    }


    pendingAction =
        callback;


    openModal(
        "signupModal"
    );

}


function saveUsername() {

    const input =
        document.getElementById(
            "usernameInput"
        );


    const error =
        document.getElementById(
            "usernameError"
        );


    const username =
        input.value.trim();


    /*
        Username rules:

        3-30 characters
        letters
        numbers
        underscore
    */

    if (
        !/^[A-Za-z0-9_]{3,30}$/.test(
            username
        )
    ) {

        error.textContent =
            "Use 3–30 letters, numbers or underscore.";

        return;

    }


    localStorage.setItem(
        STORAGE.USERNAME,
        username
    );


    closeModal(
        "signupModal"
    );


    if (
        typeof pendingAction ===
        "function"
    ) {

        const action =
            pendingAction;

        pendingAction =
            null;

        action();

    }

}


/* =========================================================
   SEARCH
========================================================= */

function searchBlog() {

    const input =
        DOM.searchInput;


    const message =
        DOM.searchMessage;


    const number =
        Number(
            input.value
        );


    message.textContent =
        "";


    if (
        !Number.isInteger(number) ||
        number < 1
    ) {

        message.textContent =
            "Enter a valid blog number.";

        return;

    }


    const blog =
        blogs.find(
            item =>
                item.id === number
        );


    if (!blog) {

        message.textContent =
            `Blog #${number} was not found.`;

        return;

    }


    closeSearch();

    renderBlogs(
        number
    );

}


function openSearch() {

    DOM.searchPanel.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(
        () => {

            DOM.searchInput.focus();

        },
        50
    );

}


function closeSearch() {

    DOM.searchPanel.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   MENU
========================================================= */

function openMenu() {

    DOM.menu.classList.add(
        "open"
    );

    DOM.overlay.classList.add(
        "open"
    );


    DOM.menu.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function closeMenu() {

    DOM.menu.classList.remove(
        "open"
    );

    DOM.overlay.classList.remove(
        "open"
    );


    DOM.menu.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   MENU ACTIONS
========================================================= */

function handleMenuAction(
    action
) {

    closeMenu();


    switch (action) {

        case "signup":

            openModal(
                "signupModal"
            );

            break;


        case "signin":

            openModal(
                "signinModal"
            );

            break;


        case "settings":

            openModal(
                "settingsModal"
            );

            break;


        case "media":

            openMedia();

            break;


        case "about":

            openModal(
                "aboutModal"
            );

            break;

    }

}


/* =========================================================
   MEDIA
========================================================= */

function openMedia() {

    document
        .getElementById(
            "mainContent"
        )
        .classList.add(
            "hidden"
        );


    DOM.mediaSection.classList.remove(
        "hidden"
    );


    renderMedia();

    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


function closeMedia() {

    DOM.mediaSection.classList.add(
        "hidden"
    );


    document
        .getElementById(
            "mainContent"
        )
        .classList.remove(
            "hidden"
        );

}


function renderMedia() {

    DOM.mediaContainer.innerHTML =
        "";


    const media = [];


    /*
        Collect media from blogs.

        Later this will come from R2.
    */

    blogs.forEach(
        blog => {

            (blog.content || [])
                .forEach(
                    block => {

                        if (
                            block.type ===
                            "image" ||
                            block.type ===
                            "video"
                        ) {

                            media.push({

                                ...block,

                                blogId:
                                    blog.id,

                                blogTitle:
                                    blog.title

                            });

                        }

                    }
                );

        }
    );


    if (media.length === 0) {

        const message =
            document.createElement(
                "p"
            );


        message.textContent =
            "No media available yet.";


        message.style.color =
            "var(--muted)";


        DOM.mediaContainer.appendChild(
            message
        );


        return;

    }


    media.forEach(
        item => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "media-card";


            if (
                item.type ===
                "image"
            ) {

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    item.url;


                image.loading =
                    "lazy";


                image.alt =
                    item.alt ||
                    item.blogTitle;


                card.appendChild(
                    image
                );

            }


            if (
                item.type ===
                "video"
            ) {

                const video =
                    document.createElement(
                        "video"
                    );


                video.controls =
                    true;


                video.preload =
                    "metadata";


                const source =
                    document.createElement(
                        "source"
                    );


                source.src =
                    item.url;


                video.appendChild(
                    source
                );


                card.appendChild(
                    video
                );

            }


            const title =
                document.createElement(
                    "div"
                );


            title.className =
                "media-card-title";


            title.textContent =
                `Blog #${item.blogId} · ${item.blogTitle}`;


            card.appendChild(
                title
            );


            DOM.mediaContainer.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   MODALS
========================================================= */

function openModal(
    id
) {

    const modal =
        document.getElementById(
            id
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";

}


function closeModal(
    id
) {

    const modal =
        document.getElementById(
            id
        );


    if (!modal) {
        return;
    }


    modal.classList.add(
        "hidden"
    );


    /*
        Only restore scrolling when
        no other modal is open.
    */

    const anyOpen =
        document.querySelector(
            ".modal:not(.hidden)"
        );


    if (!anyOpen) {

        document.body.style.overflow =
            "";

    }

}


/* =========================================================
   SETTINGS
========================================================= */

function loadSettings() {

    const theme =
        localStorage.getItem(
            STORAGE.THEME
        ) || "system";


    const fontSize =
        Number(
            localStorage.getItem(
                STORAGE.FONT_SIZE
            ) || 17
        );


    applyTheme(
        theme
    );


    applyFontSize(
        fontSize
    );


    document.getElementById(
        "themeSelect"
    ).value =
        theme;


    document.getElementById(
        "fontSizeRange"
    ).value =
        fontSize;


    document.getElementById(
        "fontSizeValue"
    ).textContent =
        `${fontSize}px`;

}


function applyTheme(
    theme
) {

    document.body.classList.remove(
        "theme-light",
        "theme-dark"
    );


    if (
        theme === "light"
    ) {

        document.body.classList.add(
            "theme-light"
        );

    }


    if (
        theme === "dark"
    ) {

        document.body.classList.add(
            "theme-dark"
        );

    }


    updateThemeColor();

}


function applyFontSize(
    size
) {

    document.documentElement.style
        .setProperty(
            "font-size",
            `${size}px`
        );


    document.getElementById(
        "fontSizeValue"
    ).textContent =
        `${size}px`;

}


function updateThemeColor() {

    const meta =
        document.getElementById(
            "themeColor"
        );


    const theme =
        localStorage.getItem(
            STORAGE.THEME
        );


    if (
        theme === "dark"
    ) {

        meta.content =
            "#000000";

    } else {

        meta.content =
            "#ffffff";

    }

}


/* =========================================================
   DATE / NUMBER HELPERS
========================================================= */

function formatDate(
    date
) {

    const value =
        new Date(date);


    if (
        Number.isNaN(
            value.getTime()
        )
    ) {

        return "Date unavailable";

    }


    return value.toLocaleString(
        undefined,
        {
            dateStyle:
                "medium",

            timeStyle:
                "short"
        }
    );

}


function formatNumber(
    number
) {

    return new Intl.NumberFormat(
        "en-US"
    ).format(
        Number(number) || 0
    );

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

    /*
        Search
    */

    document
        .getElementById(
            "searchOpen"
        )
        .addEventListener(
            "click",
            openSearch
        );


    document
        .getElementById(
            "searchButton"
        )
        .addEventListener(
            "click",
            searchBlog
        );


    DOM.searchInput
        .addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    searchBlog();

                }

            }
        );


    /*
        Menu
    */

    document
        .getElementById(
            "menuOpen"
        )
        .addEventListener(
            "click",
            openMenu
        );


    document
        .getElementById(
            "menuClose"
        )
        .addEventListener(
            "click",
            closeMenu
        );


    DOM.overlay
        .addEventListener(
            "click",
            closeMenu
        );


    /*
        Menu buttons
    */

    document
        .querySelectorAll(
            "[data-menu-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        handleMenuAction(
                            button.dataset
                                .menuAction
                        );

                    }
                );

            }
        );


    /*
        Modals
    */

    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        closeModal(
                            button.dataset.close
                        );

                    }
                );

            }
        );


    /*
        Signup
    */

    document
        .getElementById(
            "usernameContinue"
        )
        .addEventListener(
            "click",
            saveUsername
        );


    document
        .getElementById(
            "usernameInput"
        )
        .addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    saveUsername();

                }

            }
        );


    /*
        Comment
    */

    document
        .getElementById(
            "commentSubmit"
        )
        .addEventListener(
            "click",
            submitComment
        );


    /*
        Settings
    */

    document
        .getElementById(
            "themeSelect"
        )
        .addEventListener(
            "change",
            event => {

                const theme =
                    event.target.value;


                localStorage.setItem(
                    STORAGE.THEME,
                    theme
                );


                applyTheme(
                    theme
                );

            }
        );


    document
        .getElementById(
            "fontSizeRange"
        )
        .addEventListener(
            "input",
            event => {

                const size =
                    Number(
                        event.target.value
                    );


                localStorage.setItem(
                    STORAGE.FONT_SIZE,
                    size
                );


                applyFontSize(
                    size
                );

            }
        );


    /*
        Media back
    */

    document
        .getElementById(
            "mediaBack"
        )
        .addEventListener(
            "click",
            closeMedia
        );


    /*
        Existing username / sign in
    */

    document
        .getElementById(
            "existingUsernameButton"
        )
        .addEventListener(
            "click",
            () => {

                closeModal(
                    "signinModal"
                );


                const username =
                    getUsername();


                if (username) {

                    alert(
                        `Signed in as @${username}`
                    );

                } else {

                    openModal(
                        "signupModal"
                    );

                }

            }
        );


    /*
        Escape key
    */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            closeMenu();

            closeSearch();


            document
                .querySelectorAll(
                    ".modal:not(.hidden)"
                )
                .forEach(
                    modal => {

                        closeModal(
                            modal.id
                        );

                    }
                );

        }
    );

}


/* =========================================================
   FUTURE REAL-TIME REFRESH
========================================================= */

/*
    Later, when D1 + Worker is connected,
    this function can periodically or
    through WebSocket/SSE refresh data.

    For now it does nothing.
*/

async function refreshFromBackend() {

    if (!CONFIG.API_BASE) {

        return;

    }


    try {

        const remoteBlogs =
            await getBlogs();


        if (
            Array.isArray(
                remoteBlogs
            )
        ) {

            blogs =
                remoteBlogs;

            renderBlogs();

        }

    } catch (error) {

        console.error(
            "Backend refresh failed:",
            error
        );

    }

}
