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
    script: `loadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/4f3d18bc9dbd3e2969de560a450bc606.lua"))()`
  },
{
    name: "Iron Soul Dungeon",
    game: "Iron Soul Dungeon",
    image: "images/Iron.JPG",
    status: "KEY SCRIPT",
    author: "@VOLTSCRIPTZ",
    tags: ["KEY"],
    script: `loadstring(game:HttpGet("https://api.jnkie.com/api/v1/luascripts/public/fba02abdeed4f653e1893580b250544c13ff66f648cbc2bd3baeb1fa21e6f21e/download"))()`
  },
];

let activeFilter = "ALL";
let currentScript = null;

const cards = document.getElementById("cards");
const filters = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");

const filterList = ["ALL", ...new Set(scripts.flatMap(s => s.tags))];

filterList.forEach(tag => {
  const btn = document.createElement("button");
  btn.className = "filter" + (tag === "ALL" ? " active" : "");
  btn.textContent = tag;
  btn.onclick = () => {
    activeFilter = tag;
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  };
  filters.appendChild(btn);
});

function render() {
  const q = searchInput.value.toLowerCase().trim();

  const list = scripts.filter(s => {
    const matchesFilter = activeFilter === "ALL" || s.tags.includes(activeFilter);
    const text = [s.name, s.game, s.author, ...s.tags].join(" ").toLowerCase();
    return matchesFilter && text.includes(q);
  });

  resultCount.textContent = `${list.length} Script${list.length !== 1 ? "s" : ""}`;

  cards.innerHTML = list.length ? list.map((s, i) => `
    <article class="card">
      <div class="thumb">
        ${s.image ? `<img src="${s.image}" alt="">` : `<div class="thumb-placeholder">◈</div>`}
      </div>
      <div class="card-body">
        <div class="game">↗ ${escapeHtml(s.game)}</div>
        <h3>${escapeHtml(s.name)}</h3>
        <div class="tags">${s.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
        <div class="card-foot">
          <span class="author">● ${escapeHtml(s.author)}</span>
          <button class="get-btn" onclick="openScript(${scripts.indexOf(s)})">GET SCRIPT ↗</button>
        </div>
      </div>
    </article>
  `).join("") : `<div style="grid-column:1/-1;text-align:center;padding:70px;color:#666">ไม่พบ Script ที่ค้นหา</div>`;
}

function openScript(index) {
  currentScript = scripts[index];
  document.getElementById("modalTitle").textContent = currentScript.name;
  document.getElementById("modalGame").textContent = currentScript.game;
  document.getElementById("scriptCode").value = currentScript.script;
  document.getElementById("copyStatus").textContent = "";
  document.getElementById("scriptModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("scriptModal").classList.add("hidden");
}

async function copyScript() {
  try {
    await navigator.clipboard.writeText(currentScript.script);
    document.getElementById("copyStatus").textContent = "คัดลอก Script แล้ว ✓";
  } catch {
    document.getElementById("scriptCode").select();
    document.execCommand("copy");
    document.getElementById("copyStatus").textContent = "คัดลอก Script แล้ว ✓";
  }
}

function showInfo() {
  alert("หน้าเว็บนี้เป็น Static Website ไม่มีระบบหลังบ้าน\nแก้ข้อมูล Script ได้ในไฟล์ script.js");
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

searchInput.addEventListener("input", render);
document.getElementById("scriptModal").addEventListener("click", e => {
  if (e.target.id === "scriptModal") closeModal();
});
render();
