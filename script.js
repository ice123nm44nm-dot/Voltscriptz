```js
/*
========================================
VOLTSCRIPTZ - SCRIPT DATABASE
========================================

เพิ่ม Script ใหม่ได้ในตัวแปร scripts ด้านบน

image:
ใส่ path ของรูป เช่น
"images/gakuran.png"

ถ้าไม่มีรูป:
image: ""

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
// ตัวแปรระบบ
// ========================================

let activeFilter = "ALL";
let currentScript = null;


// ========================================
// ดึง Element จาก HTML
// ========================================

const cards = document.getElementById("cards");
const filters = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");


// ========================================
// ตรวจสอบ HTML
// ========================================

if (!cards) {
    console.error("ไม่พบ #cards ใน index.html");
}

if (!filters) {
    console.error("ไม่พบ #filters ใน index.html");
}

if (!resultCount) {
    console.error("ไม่พบ #resultCount ใน index.html");
}


// ========================================
// สร้าง Filter
// ========================================

const filterList = [
    "ALL",
    ...new Set(
        scripts.flatMap(script => script.tags)
    )
];


if (filters) {

    filterList.forEach(tag => {

        const button =
            document.createElement("button");

        button.className =
            "filter" +
            (tag === "ALL" ? " active" : "");

        button.textContent = tag;


        button.addEventListener(
            "click",
            () => {

                activeFilter = tag;


                document
                    .querySelectorAll(".filter")
                    .forEach(btn => {
                        btn.classList.remove("active");
                    });


                button.classList.add("active");


                render();

            }
        );


        filters.appendChild(button);

    });

}


// ========================================
// แสดง Script
// ========================================

function render() {

    if (!cards || !resultCount) {
        return;
    }


    const query =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const list =
        scripts.filter(script => {

            const filterMatch =
                activeFilter === "ALL" ||
                script.tags.includes(activeFilter);


            const searchText = [

                script.name,
                script.game,
                script.author,
                ...script.tags

            ]
                .join(" ")
                .toLowerCase();


            return (
                filterMatch &&
                searchText.includes(query)
            );

        });


    // จำนวน Script

    resultCount.textContent =
        `${list.length} Script${list.length !== 1 ? "s" : ""}`;


    // ถ้าไม่พบ Script

    if (list.length === 0) {

        cards.innerHTML = `
            <div
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 70px;
                    color: #666;
                "
            >
                ไม่พบ Script ที่ค้นหา
            </div>
        `;

        return;
    }


    // สร้าง Card

    cards.innerHTML =
        list.map(script => {

            const index =
                scripts.indexOf(script);


            const imageHTML =
                script.image
                    ? `
                        <img
                            src="${escapeHtml(script.image)}"
                            alt="${escapeHtml(script.name)}"
                            onerror="this.style.display='none'"
                        >
                    `
                    : `
                        <div class="no-image">
                            ◈
                        </div>
                    `;


            const tagsHTML =
                script.tags
                    .map(tag => `
                        <span>
                            ${escapeHtml(tag)}
                        </span>
                    `)
                    .join("");


            return `

                <article class="card">

                    <div class="thumb">

                        ${imageHTML}

                        <div class="status">
                            ${escapeHtml(script.status)}
                        </div>

                    </div>


                    <div class="card-body">

                        <div class="game">
                            ↗ ${escapeHtml(script.game)}
                        </div>


                        <h3>
                            ${escapeHtml(script.name)}
                        </h3>


                        <div class="tags">
                            ${tagsHTML}
                        </div>


                        <div class="card-foot">

                            <span class="author">
                                ● ${escapeHtml(script.author)}
                            </span>


                            <button
                                class="get-btn"
                                onclick="openScript(${index})"
                            >
                                GET SCRIPT ↗
                            </button>

                        </div>

                    </div>

                </article>

            `;

        }).join("");

}


// ========================================
// เปิด Script
// ========================================

function openScript(index) {

    currentScript =
        scripts[index];


    if (!currentScript) {
        return;
    }


    const modal =
        document.getElementById("scriptModal");

    const title =
        document.getElementById("modalTitle");

    const game =
        document.getElementById("modalGame");

    const code =
        document.getElementById("scriptCode");

    const status =
        document.getElementById("copyStatus");


    if (title) {
        title.textContent =
            currentScript.name;
    }


    if (game) {
        game.textContent =
            currentScript.game;
    }


    if (code) {
        code.value =
            currentScript.script;
    }


    if (status) {
        status.textContent = "";
    }


    if (modal) {
        modal.classList.remove("hidden");
    }

}


// ========================================
// ปิด Modal
// ========================================

function closeModal() {

    const modal =
        document.getElementById("scriptModal");


    if (modal) {
        modal.classList.add("hidden");
    }

}


// ========================================
// Copy Script
// ========================================

async function copyScript() {

    if (!currentScript) {
        return;
    }


    const status =
        document.getElementById("copyStatus");


    try {

        await navigator.clipboard.writeText(
            currentScript.script
        );


        if (status) {
            status.textContent =
                "คัดลอก Script แล้ว ✓";
        }


    } catch (error) {

        const textarea =
            document.getElementById("scriptCode");


        if (textarea) {

            textarea.select();

            document.execCommand("copy");

        }


        if (status) {
            status.textContent =
                "คัดลอก Script แล้ว ✓";
        }

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
// ป้องกัน HTML
// ========================================

function escapeHtml(value) {

    return String(value).replace(
        /[&<>"']/g,
        character => {

            const entities = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            };


            return entities[character];

        }
    );

}


// ========================================
// Search
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        render
    );

}


// ========================================
// ปิด Modal เมื่อคลิกด้านนอก
// ========================================

const scriptModal =
    document.getElementById("scriptModal");


if (scriptModal) {

    scriptModal.addEventListener(
        "click",
        event => {

            if (
                event.target === scriptModal
            ) {

                closeModal();

            }

        }
    );

}


// ========================================
// เริ่มต้นเว็บไซต์
// ========================================

render();
```
