const editor = document.getElementById("editor");
const statusText = document.getElementById("status-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const lineCount = document.getElementById("line-count");
const newButton = document.getElementById("new-btn");
const saveButton = document.getElementById("save-btn");
const fileInput = document.getElementById("file-input");

const STORAGE_KEY = "simple-text-editor-content";
let autosaveTimer = null;

const updateCounts = () => {
  const text = editor.value;
  charCount.textContent = text.length.toString();

  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  wordCount.textContent = (text.trim() ? words.length : 0).toString();

  const lines = text.split(/\n/).length || 1;
  lineCount.textContent = lines.toString();
};

const setStatus = (message) => {
  statusText.textContent = message;
};

const scheduleAutosave = () => {
  if (autosaveTimer) {
    clearTimeout(autosaveTimer);
  }

  autosaveTimer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, editor.value);
    setStatus("自動保存しました");
  }, 5000);
};

const handleInput = () => {
  updateCounts();
  setStatus("編集中...");
  scheduleAutosave();
};

const restoreDraft = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    editor.value = saved;
    updateCounts();
    setStatus("前回の内容を復元しました");
  }
};

const handleNew = () => {
  if (editor.value && !confirm("内容をクリアしますか？")) {
    return;
  }
  editor.value = "";
  updateCounts();
  setStatus("新規メモを開始しました");
};

const handleSave = () => {
  const blob = new Blob([editor.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "memo.txt";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  setStatus("ファイルを保存しました");
};

const handleFileOpen = (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (readerEvent) => {
    editor.value = readerEvent.target.result || "";
    updateCounts();
    setStatus("ファイルを読み込みました");
  };
  reader.readAsText(file);
  event.target.value = "";
};

editor.addEventListener("input", handleInput);
newButton.addEventListener("click", handleNew);
saveButton.addEventListener("click", handleSave);
fileInput.addEventListener("change", handleFileOpen);

updateCounts();
restoreDraft();
