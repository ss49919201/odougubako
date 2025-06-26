document.addEventListener("DOMContentLoaded", function () {
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const encodeBtn = document.getElementById("encodeBtn");
  const decodeBtn = document.getElementById("decodeBtn");
  const clearBtn = document.getElementById("clearBtn");
  const copyBtn = document.getElementById("copyBtn");
  const errorMsg = document.getElementById("errorMsg");

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add("show");
    setTimeout(() => {
      errorMsg.classList.remove("show");
    }, 5000);
  }

  function hideError() {
    errorMsg.classList.remove("show");
  }

  function encodeToBase64() {
    const text = inputText.value.trim();

    if (!text) {
      showError("エンコードするテキストを入力してください");
      return;
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(text)));
      outputText.value = encoded;
      hideError();
    } catch (error) {
      showError("エンコードに失敗しました: " + error.message);
    }
  }

  function decodeFromBase64() {
    const text = inputText.value.trim();

    if (!text) {
      showError("デコードするBase64文字列を入力してください");
      return;
    }

    try {
      if (!isValidBase64(text)) {
        throw new Error("有効なBase64文字列ではありません");
      }

      const decoded = decodeURIComponent(escape(atob(text)));
      outputText.value = decoded;
      hideError();
    } catch (error) {
      showError("デコードに失敗しました: 有効なBase64文字列を入力してください");
    }
  }

  function isValidBase64(str) {
    try {
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(str)) {
        return false;
      }

      if (str.length % 4 !== 0) {
        return false;
      }

      atob(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearAll() {
    inputText.value = "";
    outputText.value = "";
    hideError();
    inputText.focus();
  }

  async function copyToClipboard() {
    const text = outputText.value.trim();

    if (!text) {
      showError("コピーする内容がありません");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);

      const originalText = copyBtn.textContent;
      copyBtn.textContent = "コピー完了!";
      copyBtn.style.background = "#38a169";

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = "#805ad5";
      }, 2000);

      hideError();
    } catch (error) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        const originalText = copyBtn.textContent;
        copyBtn.textContent = "コピー完了!";
        copyBtn.style.background = "#38a169";

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = "#805ad5";
        }, 2000);

        hideError();
      } catch (fallbackError) {
        showError("クリップボードへのコピーに失敗しました");
      }
    }
  }

  encodeBtn.addEventListener("click", encodeToBase64);
  decodeBtn.addEventListener("click", decodeFromBase64);
  clearBtn.addEventListener("click", clearAll);
  copyBtn.addEventListener("click", copyToClipboard);

  inputText.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "Enter") {
        e.preventDefault();
        encodeToBase64();
      }
    }
  });

  inputText.addEventListener("input", function () {
    if (errorMsg.classList.contains("show")) {
      hideError();
    }
  });

  inputText.focus();
});
