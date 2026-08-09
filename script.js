```js
/*
========================================
VOLTSCRIPTZ SCRIPT DATABASE
========================================

แก้ข้อมูล Script ได้ตรงนี้

image:
ใส่ชื่อไฟล์รูปในโฟลเดอร์ images
เช่น "images/gakuran.png"

ถ้ายังไม่มีรูป:
image: ""

script:
ใส่โค้ด Script ที่ต้องการแจก
========================================
*/

const scripts = [
    {
        name: "GAKURAN",
        game: "GAKURAN",
        image: "images/gakuran.png",
        status: "KEY SCRIPT",
        author: "@VOLTSCRIPTZ",
        tags: ["KEY"],
        script: `loadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/4f3d18bc9dbd3e2969de560a450bc606.lua"))()`
    },

    {
        name: "Iron Soul Dungeon",
        game: "Iron Soul Dungeon",
        image: "images/iron.png",
        status: "KEY SCRIPT",
        author: "@VOLTSCRIPTZ",
        tags: ["KEY"],
        script: `loadstring(game:HttpGet("https://api.jnkie.com/api/v1/luascripts/public/fba02abdeed4f653e1893580b250544c13ff66f648cbc2bd3baeb1fa21e6f21e/download"))()`
    }
];


// ========================================
// SYSTEM
// ========================================

let activeFilter = "ALL";
let currentScript = null;

const cards = document.getElementById("cards");
const filters = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");


// ========================================
// FILTER
// ========================================

const filterList = [
    "ALL",
    ...new Set(scripts.flatMap(s => s.tags))
];

filterList.forEach(tag => {

    const btn = document.createElement("button");

    btn.className =
        "filter" + (tag === "ALL" ? " active" : "");

    btn.textContent = tag;

    btn.onclick = () => {

        activeFilter = tag;

        document
            .querySelectorAll(".filter")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        render();
    };

    filters.appendChild(btn);
});


// ========================================
// RENDER CARDS
// ========================================

function render() {

    const q = searchInput.value
        .toLowerCase()
        .trim();


    const list = scripts.filter(s => {

        const matchesFilter =
            activeFilter === "ALL" ||
            s.tags.includes(activeFilter);


        const text = [
            s.name,
            s.game,
            s.author,
            ...s.tags
        ]
            .join(" ")
            .toLowerCase();


        return matchesFilter && text.includes(q);
    });


    resultCount.textContent =
        `${list.length} Script${list.length !== 1 ? "s" : ""}`;


    if (list.length === 0) {

        cards.innerHTML = `
            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:70px;
                    color:#666;
                "
            >
                ไม่พบ Script ที่ค้นหา
            </div>
        `;

        return;
    }


    cards.innerHTML = list.map(s => `

        <article class="card">

            <div class="thumb">

                ${
                    s.image
                        ? `
                            <img
                                src="${escapeHtml(s.image)}"
                                alt="${escapeHtml(s.name)}"
                            >
                          `
                        : `
                            <div class="no-image">
                                ◈
                            </div>
                          `
                }

                <div class="status">
                    ${escapeHtml(s.status)}
                </div>

            </div>


            <div class="card-body">

                <div class="game">
                    ↗ ${escapeHtml(s.game)}
                </div>


                <h3>
                    ${escapeHtml(s.name)}
                </h3>


                <div class="tags">

                    ${s.tags
                        .map(tag => `
                            <span>
                                ${escapeHtml(tag)}
                            </span>
                        `)
                        .join("")}

                </div>


                <div class="card-foot">

                    <span class="author">
                        ● ${escapeHtml(s.author)}
                    </span>


                    <button
                        class="get-btn"
                        onclick="openScript(${scripts.indexOf(s)})"
                    >
                        GET SCRIPT ↗
                    </button>

                </div>

            </div>

        </article>

    `).join("");
}


// ========================================
// OPEN SCRIPT MODAL
// ========================================

function openScript(index) {

    currentScript = scripts[index];

    if (!currentScript) {
        return;
    }


    const modalTitle =
        document.getElementById("modalTitle");

    const modalGame =
        document.getElementById("modalGame");

    const scriptCode =
        document.getElementById("scriptCode");

    const copyStatus =
        document.getElementById("copyStatus");

    const scriptModal =
        document.getElementById("scriptModal");


    if (modalTitle) {
        modalTitle.textContent =
            currentScript.name;
    }


    if (modalGame) {
        modalGame.textContent =
            currentScript.game;
    }


    if (scriptCode) {
        scriptCode.value =
            currentScript.script;
    }


    if (copyStatus) {
        copyStatus.textContent = "";
    }


    if (scriptModal) {
        scriptModal.classList.remove("hidden");
    }
}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    const modal =
        document.getElementById("scriptModal");

    if (modal) {
        modal.classList.add("hidden");
    }
}


// ========================================
// COPY SCRIPT
// ========================================

async function copyScript() {

    if (!currentScript) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            currentScript.script
        );


        const copyStatus =
            document.getElementById("copyStatus");


        if (copyStatus) {

            copyStatus.textContent =
                "คัดลอก Script แล้ว ✓";

        }

    } catch {

        const textarea =
            document.getElementById("scriptCode");


        if (textarea) {

            textarea.select();

            document.execCommand("copy");

        }


        const copyStatus =
            document.getElementById("copyStatus");


        if (copyStatus) {

            copyStatus.textContent =
                "คัดลอก Script แล้ว ✓";

        }
    }
}


// ========================================
// INFO
// ========================================

function showInfo() {

    alert(
        "หน้าเว็บนี้เป็น Static Website ไม่มีระบบหลังบ้าน\n" +
        "แก้ข้อมูล Script ได้ในไฟล์ script.js"
    );
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(text) {

    return String(text).replace(
        /[&<>"']/g,
        function (c) {

            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[c];

        }
    );
}


// ========================================
// SEARCH
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        render
    );

}


// ========================================
// CLOSE MODAL WHEN CLICK OUTSIDE
// ========================================

const scriptModal =
    document.getElementById("scriptModal");


if (scriptModal) {

    scriptModal.addEventListener(
        "click",
        e => {

            if (
                e.target.id === "scriptModal"
            ) {

                closeModal();

            }

        }
    );

}


// ========================================
// START
// ========================================

render();
```
