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

});