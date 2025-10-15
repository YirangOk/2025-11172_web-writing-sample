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
      
      // edit-here.js의 값들을 중간값으로 만들기 위해 range 조정
      const targetFontSize = window.initialSettings.fontSize || 30;
      const targetLetterSpacing = window.initialSettings.letterSpacing || 0;
      const targetLineHeight = window.initialSettings.lineHeight || 1.5;
      
      // 폰트 크기 range 조정 (targetFontSize가 중간값이 되도록)
      const fontSizeRange = { min: targetFontSize - 15, max: targetFontSize + 15 };
      editableDiv.style.fontSize = targetFontSize + "px";
      
      // 줄 간격 range 조정 (targetLineHeight가 중간값이 되도록)
      const lineHeightRange = { min: targetLineHeight - 0.5, max: targetLineHeight + 0.5 };
      updateLineHeight(targetLineHeight);
      
      // 글자 간격 range 조정 (targetLetterSpacing이 중간값이 되도록)
      const letterSpacingRange = { min: targetLetterSpacing - 100, max: targetLetterSpacing + 100 };
      showValueLetter(targetLetterSpacing * 10);
      
      // HTML range input 요소들의 min/max 값 동적 조정
      const fontSizeSlider = document.querySelector('input[type="range"][oninput="changeFontSize(this.value)"]');
      if (fontSizeSlider) {
        fontSizeSlider.min = fontSizeRange.min;
        fontSizeSlider.max = fontSizeRange.max;
        fontSizeSlider.value = targetFontSize;
      }
      
      const lineHeightSlider = document.querySelector('input[type="range"][oninput="showValueHeight(this.value)"]');
      if (lineHeightSlider) {
        lineHeightSlider.min = lineHeightRange.min;
        lineHeightSlider.max = lineHeightRange.max;
        lineHeightSlider.value = targetLineHeight;
      }
      
      const letterSpacingSlider = document.querySelector('input[type="range"][oninput="showValueLetter(this.value)"]');
      if (letterSpacingSlider) {
        letterSpacingSlider.min = letterSpacingRange.min;
        letterSpacingSlider.max = letterSpacingRange.max;
        letterSpacingSlider.value = targetLetterSpacing * 10;
      }
      
      // 초기 텍스트 방향 설정 (함수 정의 후 실행)
      if (window.initialSettings.textDirection !== undefined) {
        setTimeout(() => {
          setTextDirection(parseInt(window.initialSettings.textDirection));
        }, 0);
      }
      
      // 해상도별 스케일링 적용
      setTimeout(() => {
        applyResolutionScaling();
      }, 100);
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

  // body에 data-direction 속성 추가 (아이콘 회전용)
  document.body.setAttribute('data-direction', dirIndex);

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

// 해상도별 스케일링 함수
function applyResolutionScaling() {
  if (!window.scaleSettings) {
    console.log('scaleSettings not found');
    return;
  }
  
  const { scale, breakpoint } = window.scaleSettings;
  const isHighResolution = window.innerWidth >= breakpoint;
  const scaleValue = isHighResolution ? scale : 1;
  
  console.log(`Resolution: ${window.innerWidth}px, Breakpoint: ${breakpoint}px, Scale: ${scaleValue}`);
  
  const textEditor = document.getElementById('textEditor');
  if (textEditor && window.initialSettings) {
    // 폰트 크기 스케일링
    const scaledFontSize = window.initialSettings.fontSize * scaleValue;
    textEditor.style.fontSize = scaledFontSize + 'px';
    
    // 줄 간격은 스케일링하지 않음 (원래 값 유지)
    textEditor.style.lineHeight = window.initialSettings.lineHeight;
    
    // range 조정 (스케일링된 값이 중간값이 되도록)
    const targetFontSize = window.initialSettings.fontSize;
    const fontSizeRange = { min: targetFontSize - 15, max: targetFontSize + 15 };
    
    const fontSizeSlider = document.querySelector('input[type="range"][oninput="changeFontSize(this.value)"]');
    if (fontSizeSlider) {
      fontSizeSlider.min = fontSizeRange.min;
      fontSizeSlider.max = fontSizeRange.max;
      fontSizeSlider.value = targetFontSize;
    }
  }
  
  // 글리프 padding-bottom 설정
  const glyphDivs = document.querySelectorAll('.glyphs-characters div');
  if (glyphDivs.length > 0 && window.initialSettings && window.initialSettings.glyphPaddingBottom !== undefined) {
    glyphDivs.forEach(div => {
      div.style.paddingBottom = window.initialSettings.glyphPaddingBottom + 'rem';
      // ::before 가상 요소에도 padding-bottom 적용 (em 단위)
      div.style.setProperty('--glyph-padding-bottom', window.initialSettings.glyphPaddingBottom);
    });
  }
}

// 윈도우 리사이즈 시 스케일링 재적용
window.addEventListener('resize', applyResolutionScaling);

// 페이지 로드 시 스케일링 적용
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    applyResolutionScaling();
  }, 200);
});

// CSS 변수 설정 함수
function setCSSScale() {
  if (!window.scaleSettings) return;
  
  const { scale, breakpoint } = window.scaleSettings;
  const isHighResolution = window.innerWidth >= breakpoint;
  const scaleValue = isHighResolution ? scale : 1;
  
  // CSS 변수로 스케일 값 설정
  document.documentElement.style.setProperty('--css-scale', scaleValue);
}

// CSS 스케일링 적용
setCSSScale();
window.addEventListener('resize', setCSSScale);



let lastHeightValue = 2;

function changeFontSize(sizeValue) {
  const editableDiv = document.getElementById("textEditor");
  
  // 해상도별 스케일링 적용
  if (window.scaleSettings) {
    const { scale, breakpoint } = window.scaleSettings;
    const isHighResolution = window.innerWidth >= breakpoint;
    const scaleValue = isHighResolution ? scale : 1;
    const scaledFontSize = sizeValue * scaleValue;
    editableDiv.style.fontSize = scaledFontSize + "px";
  } else {
    editableDiv.style.fontSize = sizeValue + "px";
  }
  
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
