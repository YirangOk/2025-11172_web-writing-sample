// 폰트 로딩 완료 후 초기화
function initializeInterfaceController() {
  console.log('Initializing interface controller after fonts loaded');
  
  /* 글리프 동적 생성 ------------------------------------------------ */
  function generateGlyphs() {
    if (!window.glyphs) return;
    
    const glyphsContainer = document.querySelector('.glyphs-content');
    if (!glyphsContainer) return;
    
    // 기존 내용 제거
    glyphsContainer.innerHTML = '';
    
    // 각 글리프 카테고리 생성
    Object.values(window.glyphs).forEach(category => {
      // 제목 생성
      const titleDiv = document.createElement('div');
      titleDiv.className = 'glyphs-title noto-sans';
      titleDiv.textContent = category.title;
      glyphsContainer.appendChild(titleDiv);
      
      // 글리프 컨테이너 생성
      const charactersDiv = document.createElement('div');
      charactersDiv.className = 'glyphs-characters';
      
      // 각 글리프 생성
      category.characters.forEach(char => {
        const glyphDiv = document.createElement('div');
        const span = document.createElement('span');
        span.textContent = char;
        glyphDiv.appendChild(span);
        charactersDiv.appendChild(glyphDiv);
      });
      
      glyphsContainer.appendChild(charactersDiv);
    });
    
    // 새로 생성된 글리프에 이벤트 리스너 추가
    addGlyphHoverEvents();
  }
  
  function addGlyphHoverEvents() {
    document.querySelectorAll('.glyphs-content .glyphs-characters div').forEach(g => {
      // data-glyph 속성 추가
      g.setAttribute('data-glyph', g.textContent.trim());
      
      // 호버 시 중앙에 큰 글리프 표시
      g.addEventListener('mouseenter', () => {
        g.style.zIndex = '1001';
      });
      
      g.addEventListener('mouseleave', () => {
        g.style.zIndex = 'auto';
      });
    });
  }
  
  // 글리프 생성 실행
  generateGlyphs();

  // 글리프 호버 이벤트는 addGlyphHoverEvents()에서 처리

  // 폰트 선택 드롭다운 초기화
  initializeFontSelect();
}

// 폰트 로딩 대기
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    console.log('Fonts ready for interface controller');
    initializeInterfaceController();
  }).catch((error) => {
    console.error('Font loading error in interface controller:', error);
    initializeInterfaceController();
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded for interface controller (fonts API not supported)');
    initializeInterfaceController();
  });
}

// 전역 함수로 등록
window.changeFont = changeFont;

// 폰트 선택 드롭다운 초기화
function initializeFontSelect() {
  const fontSelect = document.getElementById('fontSelect');
  if (!fontSelect || !window.fonts) {
    console.log('fontSelect or window.fonts not found');
    return;
  }
  
  console.log('Initializing font select with window.fonts:', window.fonts);
  
  // 기존 옵션들 제거 (첫 번째 기본 옵션 제외)
  while (fontSelect.children.length > 1) {
    fontSelect.removeChild(fontSelect.lastChild);
  }
  
  // window.fonts에서 폰트 옵션 생성
  window.fonts.forEach(font => {
    const option = document.createElement('option');
    option.value = font.name;
    option.textContent = font.name;
    fontSelect.appendChild(option);
    console.log('Added font option:', font.name);
  });
}

// 폰트 변경 함수
function changeFont(fontName) {
  if (!fontName) return;
  
  console.log('changeFont called with:', fontName);
  
  // window.fonts에서 해당 폰트 찾기
  const selectedFont = window.fonts ? window.fonts.find(font => font.name === fontName) : null;
  if (!selectedFont) {
    console.error('Font not found:', fontName);
    return;
  }
  
  console.log('Using font:', selectedFont);
  
  const textEditor = document.getElementById('textEditor');
  if (textEditor) {
    textEditor.style.fontFamily = `'${fontName}', sans-serif`;
    console.log('Applied font to textEditor:', fontName);
  }
  
  // 글리프들에도 폰트 적용
  const glyphElements = document.querySelectorAll('.glyphs-characters div span');
  glyphElements.forEach(span => {
    span.style.fontFamily = `'${fontName}', sans-serif`;
  });
  console.log('Applied font to glyphs:', fontName);
  
  // 미리보기에도 폰트 적용
  const previewBox = document.querySelector('.preview span');
  if (previewBox) {
    previewBox.style.fontFamily = `'${fontName}', sans-serif`;
    console.log('Applied font to preview:', fontName);
  }
}