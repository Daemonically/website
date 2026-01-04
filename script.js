const typingEl = document.querySelector(".typing");

document.querySelectorAll("img").forEach(img => {
  img.addEventListener("contextmenu", e => e.preventDefault());
});

document.querySelectorAll(".typing, .subtitle, .links a, .links a i, .links a .label")
  .forEach(el => {
    el.setAttribute("draggable", "false");
    el.addEventListener("dragstart", e => e.preventDefault());
  });

const graphemes = str => Array.from(str);

function typeText(el, text, speed = 100, cb, pause = 1200) {
  const chars = graphemes(text);
  let i = 0;

  (function typing() {
    if (i > 0) {
      const last = chars[i - 1];
      const before = chars.slice(0, i - 1).join("");
      el.innerHTML = before + `<span class="fade">${last}</span>`;
    } else {
      el.innerHTML = "";
    }

    if (i === 1) el.classList.add("active");
    i++;

    if (i <= chars.length) {
      setTimeout(typing, speed);
    } else if (cb) {
      setTimeout(cb, pause);
    }
  })();
}

function deleteText(el, keep = "", speed = 80, cb) {
  let current = graphemes(el.textContent);
  const keepLen = graphemes(keep).length;

  (function deleting() {
    if (current.length > keepLen) {
      current.pop();
      el.textContent = current.join("");
      setTimeout(deleting, speed);
    } else if (cb) {
      setTimeout(cb, 600);
    }
  })();
}

function startSequence() {
  typeText(typingEl, "hello!", 100, () => {
    deleteText(typingEl, "", 80, () => {
      typeText(typingEl, "i'm Negus 😏", 100, () => {
        deleteText(typingEl, "", 80, startSequence);
      }, 2500);
    });
  });
}

setTimeout(startSequence, 1000);
