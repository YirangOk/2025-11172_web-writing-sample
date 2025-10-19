// ===========================================
// 폰트 미리보기 도구 - 사용자 설정 파일
// ===========================================
// 이 파일을 수정하여 폰트와 예시 문구를 설정하세요.

// 1. 폰트 설정
// name: 웹 페이지에 표시될 폰트의 이름
// url: 폰트 파일의 경로 (assets/fonts/ 폴더 기준)
const fonts = [
  {
    name: "A",
    url: "assets/fonts/PyeonsanBetaAA-Regular.otf",
  },
  {
    name: "B", 
    url: "assets/fonts/PyeonsanBetaBB-Regular.otf",
  },
  {
    name: "1A",
    url: "assets/fonts/PyeonsanBetaAA_0-Regular.otf",
  },
  {
    name: "2B",
    url: "assets/fonts/PyeonsanBetaBB_0-Regular.otf",
  }
];

// 2. 예시 문구 설정
const sampleText = `포스트스크립트(PostScript, PS)는 어도비 시스템을 설립한 존 워낙(John Warnock)과 찰스 게시케(Charlse Geschke)가 만든 페이지 기술 언어의 일종이다. 포스트스크립트 파일은 사람이 읽을 수 있게끔 되어있으며, PCL 언어와는 달리 바이너리화되어있지 않아 텍스트편집기 등에서 ISOLatin1 언어 포맷으로 읽을 수 있고, 장치에 독립적일 수도 있다. 그러나 포스트스크립트를 지원하는 프린터나, 드라이버를 제작하는 것이 비교적 어렵고, 또한 프린터 내부적으로 해석과정을 거친 후에 바이너리화를 해야 하기 때문에 프린터 내부 프로세싱이 많이 요구된다. 1985년 애플이 처음으로 포스트스크립트 엔진을 포함한 프린터 레이저라이터를 출시했으며, 이로부터 탁상 출판의 혁명이 시작되었다. 한때는 그래픽 처리의 사실상 표준이었으나 최근에는 PDF에게 점점 그 자리를 내주고 있다. 또한 운영 체제나 응용 프로그램에서 포스트스크립트 파일을 처리하는 경우가 많기 때문에, 프린터에 포스트스크립트 엔진을 포함하는 경우도 줄고 있다.`;

// 3. 초기 설정
// textDirectionSelect.value: 화면 로드시 세로쓰기를 먼저 마주하고싶을 때 '1' 작성
const initialSettings = {
  textDirection: "0", // 0: 가로쓰기, 1: 세로쓰기
  fontSize: 30, // range: 15-45, 중간값: 30
  letterSpacing: 0, // range: -100~100, 중간값: 0
  lineHeight: 1.5, // range: 1.0~2.0, 중간값: 1.5
  glyphPaddingBottom: 0.5 // 글리프 padding-bottom 설정 (rem 단위)
};

// 4. 해상도별 스케일링 설정
const scaleSettings = {
  scale: 3.5, // 2560px 이상에서 적용될 스케일 (JavaScript + CSS 공통)
  breakpoint: 2560 // 적용될 해상도
};

// 4. 글리프 설정
// 글리프 섹션을 수정하려면 아래 설정을 변경하세요
// - title: 섹션 제목
// - characters: 해당 섹션에 표시할 글리프들 (배열)
const glyphs = {
  punctuation: {
    title: "구두점 괄호",
    characters: [".", ",", ":", ";", "!", "?", "(", ")", "[", "]", "{", "}", "\"", "'", "-", "—", "…"]
  },
  symbols: {
    title: "기호",
    characters: ["@", "#", "$", "%", "&", "*", "+", "=", "/", "\\", "|", "~", "`", "^", "°", "§", "¶"]
  },
  brackets: {
    title: "문장부호",
    characters: ["「", "」", "『", "』", "〈", "〉", "《", "》", "〔", "〕", "【", "】", "〈", "〉", "「", "」", "『"]
  },
  korean: {
    title: "한글 글리프",
    characters: ["강", "결", "곶", "굴", "근", "깜", "껄", "꽤", "꾀", "낚", "내", "넓", "뇌", "능", "늡", "덕", "돌", "뒤", "딘", "땀", "딱", "뜸", "랜", "랩", "론", "룬", "밥", "버", "보", "분", "븜", "밧", "병", "붕", "비", "빨", "뽈", "빙", "삽", "석", "샐", "쉿", "식", "싸", "싹", "쓴", "암", "어", "옆", "웃", "욥", "왁", "잠", "점", "종", "줍", "질", "쫀", "꽤", "찍", "찬", "춤", "휠", "칫", "컵", "과", "쿨", "탐", "텟", "틀", "티", "틸", "팅", "퓨", "평", "꽤", "폴", "푼", "함", "혁", "홍", "훈", "훌", "휙"]
  }
};

// 5. 전역 변수로 내보내기
window.fonts = fonts;
window.sampleText = sampleText;
window.initialSettings = initialSettings;
window.scaleSettings = scaleSettings;
window.glyphs = glyphs;
