/*
  ==============================
  แก้ข้อมูล Script ตรงนี้ได้เลย
  ==============================
  image: ใส่ชื่อไฟล์รูปในโฟลเดอร์ images เช่น "bloxfruit.jpg"
  ถ้ายังไม่มีรูป ให้เว้นเป็น "" ได้
  script: ใส่โค้ด Script ที่ต้องการแจก
*/
const scripts = [
    {
        name: "GAKURAN",
        game: "GAKURAN",
        image: "images/gakuran.png",
        status: "KEY SCRIPT",
        author: "@VOLTSCRIPTZ",
        tags: ["KEY"],
        views: 0,
        likes: 0,
        script: `loadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/4f3d18bc9dbd3e2969de560a450bc606.lua"))()`
    },

    {
        name: "Iron Soul Dungeon",
        game: "Iron Soul Dungeon",
        image: "images/Iron.png",
        status: "KEY SCRIPT",
        author: "@VOLTSCRIPTZ",
        tags: ["KEY"],
        views: 0,
        likes: 0,
        script: `loadstring(game:HttpGet("https://api.jnkie.com/api/v1/luascripts/public/fba02abdeed4f653e1893580b250544c13ff66f648cbc2bd3baeb1fa21e6f21e/download"))()`
    }
];

let activeFilter = "ALL";
let currentScript = null;

const cards = document.getElementById("cards");
const filters = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");


// ========================================
// สร้าง Filter
// ========================================

const filterList = [
    "ALL",
    ...new Set(scripts.flatMap(s => s.tags))
];

filterList.forEach(tag => {
    const btn = document.createElement("button");

    btn.className = "filter" + (tag === "ALL" ? " active" : "");
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
// แสดง Script Cards
// ========================================

function render() {

    const q = searchInput.value.toLowerCase().trim();

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


    cards.innerHTML = list.length
        ? list.map(s => `

            <article class="card">

                <div class="thumb">

                    ${
                        s.image
                            ? `<img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.name)}">`
                            : `<div class="no-image">◈</div>`
                    }

                    <div class="view">
                        ◉ ${Number(s.views) || 0}
                    </div>

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
                            .map(t => `<span>${escapeHtml(t)}</span>`)
                            .join("")}
                    </div>


                    <div class="card-foot">

                        <span class="author">
                            ● ${escapeHtml(s.author)}
                            · ♥ ${Number(s.likes) || 0}
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

        `).join("")

        : `
            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:70px;
                    color:#666
                "
            >
                ไม่พบ Script ที่ค้นหา
            </div>
        `;
}


// ========================================
// เปิดหน้าต่าง Script
// ========================================

function openScript(index) {

    currentScript = scripts[index];

    if (!currentScript) {
        return;
    }

    document.getElementById("modalTitle").textContent =
        currentScript.name;

    document.getElementById("modalGame").textContent =
        currentScript.game;

    document.getElementById("scriptCode").value =
        currentScript.script;

    document.getElementById("copyStatus").textContent = "";

    document
        .getElementById("scriptModal")
        .classList.remove("hidden");
}


// ========================================
// ปิดหน้าต่าง Script
// ========================================

function closeModal() {

    document
        .getElementById("scriptModal")
        .classList.add("hidden");
}


// ========================================
// Copy Script
// ========================================

async function copyScript() {

    if (!currentScript) {
        return;
    }

    try {

        await navigator.clipboard.writeText(
            currentScript.script
        );

        document.getElementById("copyStatus").textContent =
            "คัดลอก Script แล้ว ✓";

    } catch {

        const textarea =
            document.getElementById("scriptCode");

        textarea.select();

        document.execCommand("copy");

        document.getElementById("copyStatus").textContent =
            "คัดลอก Script แล้ว ✓";
    }
}


// ========================================
// Info
// ========================================

function showInfo() {

    alert(
        "หน้าเว็บนี้เป็น Static Website ไม่มีระบบหลังบ้าน\n" +
        "แก้ข้อมูล Script ได้ในไฟล์ script.js"
    );
}


// ========================================
// ป้องกัน HTML แปลก ๆ
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
// Search
// ========================================

searchInput.addEventListener("input", render);


// ========================================
// ปิด Modal เมื่อกดด้านนอก
// ========================================

document
    .getElementById("scriptModal")
    .addEventListener("click", e => {

        if (e.target.id === "scriptModal") {
            closeModal();
        }

    });


// ========================================
// เริ่มต้น
// ========================================

render();
