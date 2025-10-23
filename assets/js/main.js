(function () {
  const PARENT_ORIGIN = '*'; // 가능하면 부모 도메인으로 제한하세요: 'https://yourdomain.com'

  // 화면 크기에 따른 textEditor 높이 조정
  function adjustTextEditorHeight() {
    const textEditor = document.getElementById('textEditor');
    if (textEditor) {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 568) {
        textEditor.style.height = '400px';
      } else {
        textEditor.style.height = '550px';
      }
      
      // 크기 고정 강제 적용
      textEditor.style.width = '100%';
      textEditor.style.maxWidth = '100%';
      textEditor.style.minWidth = '100%';
      textEditor.style.boxSizing = 'border-box';
      textEditor.style.margin = '0';
      textEditor.style.padding = '1rem';
      textEditor.style.overflow = 'auto';
    }
  }


  function postHeight() {
    // 문서 유형에 따라 두 값 중 큰 값 사용(브라우저별 편차 대응)
    const h1 = document.body ? document.body.scrollHeight : 0;
    const h2 = document.documentElement ? document.documentElement.scrollHeight : 0;
    const h3 = document.documentElement ? document.documentElement.clientHeight : 0;
    
    // 스케일링이 적용된 경우를 고려하여 최대 높이 제한
    const rawHeight = Math.max(h1, h2);
    const maxHeight = Math.min(rawHeight, window.innerHeight * 2); // 최대 2배 높이로 제한
    
    // 스케일링이 적용된 경우 원래 높이로 복원
    let height = rawHeight;
    if (window.scaleSettings && window.scaleSettings.scale > 1) {
      const { scale, breakpoint } = window.scaleSettings;
      const isHighResolution = window.innerWidth >= breakpoint;
      if (isHighResolution) {
        height = rawHeight / scale; // 스케일링 역산
      }
    }
    
    // 최대 높이 제한 적용
    height = Math.min(height, maxHeight);
    
    console.log('Height calculation:', { h1, h2, h3, rawHeight, maxHeight, finalHeight: height });
    window.parent.postMessage({ type: 'IFRAME_HEIGHT', height }, PARENT_ORIGIN);
  }

  // 부모가 요청하면 응답
  window.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type === 'GET_IFRAME_HEIGHT') postHeight();
  });


  // 글리프 로드 및 표시
  function loadGlyphs(retryCount = 0) {
    const maxRetries = 10;
    const glyphsContainer = document.querySelector('.glyphs-contents');
    const previewBox = document.querySelector('.preview span');
    
    console.log('loadGlyphs called, retry count:', retryCount);
    console.log('window.glyphs:', window.glyphs);
    console.log('glyphsContainer:', glyphsContainer);
    
    // 최대 재시도 횟수 초과 시 중단
    if (retryCount >= maxRetries) {
      console.error('Maximum retry count reached for loadGlyphs');
      return;
    }
    
    // glyphsContainer가 없으면 재시도
    if (!glyphsContainer) {
      console.log('glyphsContainer not found, retrying...');
      setTimeout(() => {
        loadGlyphs(retryCount + 1);
      }, 100);
      return;
    }
    
    // window.glyphs가 없으면 재시도
    if (!window.glyphs) {
      console.log('window.glyphs not found, retrying...');
      setTimeout(() => {
        loadGlyphs(retryCount + 1);
      }, 100);
      return;
    }
    
    if (window.glyphs && glyphsContainer) {
      // 각 분류별로 섹션 생성
      Object.entries(window.glyphs).forEach(([key, section]) => {
        // 그룹 컨테이너 생성
        const groupDiv = document.createElement('div');
        groupDiv.className = 'glyph-group';
        
        // 섹션 제목 생성
        const titleDiv = document.createElement('div');
        titleDiv.className = 'glyphs-title';
        titleDiv.textContent = section.title;
        groupDiv.appendChild(titleDiv);
        
        // 글리프 컨테이너 생성
        const charactersDiv = document.createElement('div');
        charactersDiv.className = 'glyphs-characters';
        
        // 글리프 요소들 생성
        section.characters.forEach(glyph => {
          const div = document.createElement('div');
          div.innerHTML = `<span>${glyph}</span>`;
          
          // 초기 padding-bottom 적용
          if (window.initialSettings && window.initialSettings.glyphPaddingBottom !== undefined) {
            div.style.paddingBottom = window.initialSettings.glyphPaddingBottom + 'rem';
            div.style.setProperty('--glyph-padding-bottom', window.initialSettings.glyphPaddingBottom);
          }
          
          div.addEventListener('click', () => {
            if (previewBox) {
              previewBox.textContent = glyph;
              previewBox.style.fontSize = '10rem';
              previewBox.style.paddingBottom = `${(window.initialSettings?.glyphPaddingBottom || 0.5) * 5}rem`;
              // 현재 선택된 폰트를 미리보기에 적용
              const textEditor = document.getElementById('textEditor');
              if (textEditor) {
                previewBox.style.fontFamily = textEditor.style.fontFamily || getComputedStyle(textEditor).fontFamily;
              }
            }
          });
          charactersDiv.appendChild(div);
        });
        
        groupDiv.appendChild(charactersDiv);
        glyphsContainer.appendChild(groupDiv);
      });
      
      // 슬라이드 정보 업데이트
      updateSlideInfo();
      
      // 글리프 padding-bottom 적용 (이미 생성 시 적용되었지만 재확인)
      applyGlyphPaddingBottom();
    }
  }

  // 폰트 변경 시 글리프들도 업데이트
  function updateGlyphFonts() {
    const textEditor = document.getElementById('textEditor');
    const glyphElements = document.querySelectorAll('.glyphs-characters div span');
    
    if (textEditor && glyphElements.length > 0) {
      const currentFont = textEditor.style.fontFamily || getComputedStyle(textEditor).fontFamily;
      glyphElements.forEach(span => {
        span.style.fontFamily = currentFont;
      });
    }
  }

  // 슬라이드 기능
  let currentSlide = 0;
  let totalSlides = 0;

  function updateSlideInfo() {
    const groups = document.querySelectorAll('.glyph-group');
    totalSlides = groups.length;
  }

  function slideLeft() {
    if (currentSlide > 0) {
      currentSlide--;
      const container = document.querySelector('.glyphs-contents');
      if (container) {
        container.scrollTo({
          left: currentSlide * container.clientWidth,
          behavior: 'smooth'
        });
      }
    }
  }

  function slideRight() {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      const container = document.querySelector('.glyphs-contents');
      if (container) {
        container.scrollTo({
          left: currentSlide * container.clientWidth,
          behavior: 'smooth'
        });
      }
    }
  }

  // 글리프 padding-bottom 적용 함수
  function applyGlyphPaddingBottom() {
    if (window.initialSettings && window.initialSettings.glyphPaddingBottom !== undefined) {
      const glyphDivs = document.querySelectorAll('.glyphs-characters div');
      if (glyphDivs.length > 0) {
        glyphDivs.forEach(div => {
          div.style.paddingBottom = window.initialSettings.glyphPaddingBottom + 'rem';
          // ::before 가상 요소에도 padding-bottom 적용 (em 단위)
          div.style.setProperty('--glyph-padding-bottom', window.initialSettings.glyphPaddingBottom);
        });
        console.log('Applied glyphPaddingBottom:', window.initialSettings.glyphPaddingBottom + 'rem');
      }
    }
  }

  // 전역 함수로 등록
  window.slideLeft = slideLeft;
  window.slideRight = slideRight;
  window.applyGlyphPaddingBottom = applyGlyphPaddingBottom;
  window.loadGlyphs = loadGlyphs;

  // 폰트 변경 감지
  function setupFontChangeListener() {
    const textEditor = document.getElementById('textEditor');
    if (textEditor) {
      // MutationObserver로 스타일 변경 감지
      const observer = new MutationObserver(() => {
        updateGlyphFonts();
      });
      observer.observe(textEditor, { 
        attributes: true, 
        attributeFilter: ['style'] 
      });
    }
  }

  // 슬라이드 버튼 이벤트 리스너 설정
  function setupSlideListeners() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', slideLeft);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', slideRight);
    }
  }

  // 폰트 로딩 완료 후 초기화
  function initializeAfterFontsLoaded() {
    console.log('Initializing after fonts loaded');
    adjustTextEditorHeight();
    loadGlyphs();
    setupFontChangeListener();
    setupSlideListeners();
    postHeight();
    
    // interface-controller 초기화
    if (window.initializeInterfaceController) {
      window.initializeInterfaceController();
    }
  }

  // 폰트 로딩 대기
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      console.log('All fonts loaded');
      initializeAfterFontsLoaded();
    }).catch((error) => {
      console.error('Font loading error:', error);
      // 폰트 로딩 실패 시에도 초기화 진행
      initializeAfterFontsLoaded();
    });
  } else {
    // 폰트 API가 지원되지 않는 경우 일반 로드 이벤트 사용
    window.addEventListener('load', () => {
      console.log('Window loaded (fonts API not supported)');
      initializeAfterFontsLoaded();
    });
  }
  
  // DOM이 완전히 로드된 후에도 글리프 로딩 재시도
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (window.glyphs && document.querySelector('.glyphs-contents')) {
        console.log('DOM loaded, ensuring glyphs are loaded');
        loadGlyphs();
      }
    }, 500);
  });
  window.addEventListener('resize', () => {
    // 리사이즈시 약간 디바운스
    clearTimeout(window.__rhTo);
    window.__rhTo = setTimeout(() => {
      adjustTextEditorHeight();
      postHeight();
    }, 100);
  });

  // DOM 구조 변화에도 반응
  const ro = new ResizeObserver(() => postHeight());
  ro.observe(document.documentElement);
  
  // textEditor 스타일 변화 감지하여 크기 고정
  const textEditor = document.getElementById('textEditor');
  if (textEditor) {
    const observer = new MutationObserver(() => {
      adjustTextEditorHeight();
    });
    observer.observe(textEditor, { 
      attributes: true, 
      attributeFilter: ['style'] 
    });
  }
})();
