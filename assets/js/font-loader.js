// edit-here.js에서 설정된 폰트와 초기 설정을 사용
document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById("fontSelect");
  const fontDots = document.querySelector('.font-dots');
  const editableDiv = document.getElementById("textEditor");

  // edit-here.js에서 설정된 폰트들 로드
  if (window.fonts) {
    for (let i = 0; i < window.fonts.length; i++) {
      const font = window.fonts[i];

      const style = document.createElement("style");
      style.appendChild(
        document.createTextNode(`
        @font-face {
          font-family: '${font.name}';
          src: url('${font.url}') format('opentype');
        }
      `)
      );
      document.head.appendChild(style);

      // dot button 생성 (왼쪽 점 + 오른쪽 라벨)
      if (fontDots) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dot';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-pressed', 'false');

        const dotCircle = document.createElement('span');
        dotCircle.className = 'dot-circle';

        const dotLabel = document.createElement('span');
        dotLabel.className = 'dot-label';
        dotLabel.textContent = font.name;

        btn.appendChild(dotCircle);
        btn.appendChild(dotLabel);

        btn.addEventListener('click', () => setFontByName(font.name));
        fontDots.appendChild(btn);
      }
    }
    
    // 폰트 로딩을 기다린 후 초기 설정 적용
    setTimeout(() => {
      applyInitialSettings();
    }, 500);
  } else {
    // 폰트 설정이 없을 때 기본 설정 적용
    setTimeout(() => {
      applyInitialSettings();
    }, 100);
  }

  function applyInitialSettings() {
    if (window.initialSettings) {
      setFontByIndex(0);
      
      // 초기 텍스트 설정
      if (window.sampleText && editableDiv) {
        editableDiv.innerHTML = window.sampleText;
      }
      
      // 초기 폰트 크기 설정
      if (window.initialSettings.fontSize) {
        editableDiv.style.fontSize = window.initialSettings.fontSize + "px";
      }
      
      // 초기 줄 간격 설정
      if (window.initialSettings.lineHeight) {
        updateLineHeight(window.initialSettings.lineHeight);
      }
      
      // 초기 글자 간격 설정
      if (window.initialSettings.letterSpacing) {
        showValueLetter(window.initialSettings.letterSpacing * 1000);
      }
    }
  }

  function applyFont(font) {
    if (editableDiv) {
      editableDiv.style.fontFamily = `"${font}", sans-serif`;
    }
    const glyphContainer = document.querySelector('.glyph-container');
    if (glyphContainer) {
      glyphContainer.style.fontFamily = `"${font}", sans-serif`;
    }
  }

  function setFontByIndex(index) {
    const font = window.fonts && window.fonts[index] ? window.fonts[index].name : null;
    if (!font) return;
    applyFont(font);
    updateFontDots(font);
  }

  function setFontByName(name) {
    applyFont(name);
    updateFontDots(name);
  }

  function updateFontDots(activeName) {
    if (!fontDots) return;
    const buttons = fontDots.querySelectorAll('.dot');
    buttons.forEach(btn => {
      const label = btn.querySelector('.dot-label');
      const isActive = label ? (label.textContent === activeName) : (btn.textContent === activeName);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  // 전역 함수로 등록
  window.setFontByName = setFontByName;
  window.setFontByIndex = setFontByIndex;

  // paste 이벤트 리스너
  if (editableDiv) {
    editableDiv.addEventListener("paste", function (e) {
      e.preventDefault();

      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData("text/plain");

      document.execCommand("insertHTML", false, pastedText);
    });
  }
});

const textDirectionSelect = document.getElementById("textDirection");
const contentEditableDiv = document.getElementById("textEditor");

function changetextDirection() {
  const selectedIndex = textDirectionSelect ? textDirectionSelect.selectedIndex : 0;
  const textDirection = ["horizontal-tb", "vertical-rl"];
  contentEditableDiv.style.writingMode = textDirection[selectedIndex];

  // 유지: 레이아웃 안정성 위해 스크롤 축은 고정
  contentEditableDiv.style.overflow = "auto";
}

// 전역 함수로 등록
window.changetextDirection = changetextDirection;

// Dot toggle support (no select)
function setTextDirection(dirIndex) {
  const textDirection = ["horizontal-tb", "vertical-rl"];
  contentEditableDiv.style.writingMode = textDirection[dirIndex];

  if (textDirection[dirIndex] === "vertical-rl") {
    if (window.convertText) convertText(contentEditableDiv);
    contentEditableDiv.style.overflowY = "hidden";
    contentEditableDiv.style.overflowX = "scroll";
  } else if (textDirection[dirIndex] === "horizontal-tb") {
    if (window.revertGlyphs) revertGlyphs(contentEditableDiv);
    contentEditableDiv.style.overflowY = "scroll";
    contentEditableDiv.style.overflowX = "hidden";
  }

  // update UI state
  const dots = document.querySelectorAll('.toggle-dots .dot');
  dots.forEach((d, i) => {
    const isActive = i === dirIndex;
    d.setAttribute('aria-pressed', String(isActive));
  });
}

window.setTextDirection = setTextDirection;



let lastHeightValue = 1.5;

function changeFontSize(sizeValue) {
  const editableDiv = document.getElementById("textEditor");
  editableDiv.style.fontSize = sizeValue + "px";
  updateLineHeight(lastHeightValue);
}

function updateLineHeight(heightValue) {
  lastHeightValue = heightValue;
  const editableDiv = document.getElementById("textEditor");
  const currentFontSize = parseFloat(getComputedStyle(editableDiv).fontSize);
  const lineHeightInPx = heightValue * currentFontSize;
  editableDiv.style.lineHeight = lineHeightInPx + "px";
}

function showValueLetter(letterValue) {
  const emValue = letterValue / 1000;
  document.getElementById("textEditor").style.letterSpacing = emValue + "em";
}

function showValueHeight(heightValue) {
  updateLineHeight(heightValue);
}

// 전역 함수로 등록
window.changeFontSize = changeFontSize;
window.updateLineHeight = updateLineHeight;
window.showValueLetter = showValueLetter;
window.showValueHeight = showValueHeight;
