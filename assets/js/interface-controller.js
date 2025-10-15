document.addEventListener('DOMContentLoaded', () => {

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

});

// 폰트 선택 드롭다운 초기화
function initializeFontSelect() {
  const fontSelect = document.getElementById('fontSelect');
  if (!fontSelect) return;
  
  // 사용 가능한 폰트 목록
  const fonts = [
    { name: 'PyeonsanAA', displayName: '편산AA' },
    { name: 'PyeonsanBB', displayName: '편산BB' },
    { name: 'PyeonsanBetaAA', displayName: '편산베타AA' },
    { name: 'PyeonsanBetaBB', displayName: '편산베타BB' }
  ];
  
  // 옵션 추가
  fonts.forEach(font => {
    const option = document.createElement('option');
    option.value = font.name;
    option.textContent = font.displayName;
    fontSelect.appendChild(option);
  });
}

// 폰트 변경 함수
function changeFont(fontName) {
  if (!fontName) return;
  
  const textEditor = document.getElementById('textEditor');
  if (textEditor) {
    textEditor.style.fontFamily = fontName;
  }
}