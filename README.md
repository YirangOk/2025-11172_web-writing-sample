# 폰트 미리보기 도구 (Font Preview Tool)

폰트 디자이너를 위한 무료 미리보기 도구입니다.

## 🚀 빠른 시작

1. **폰트 파일 추가**
   - `assets/fonts/` 폴더에 폰트 파일을 추가하세요
   - 지원 형식: `.otf`, `.woff`, `.woff2`

2. **폰트 설정**
   - `assets/js/edit-here.js` 파일을 열어서 폰트 정보를 수정하세요
   - `fonts` 배열에 폰트 이름과 경로를 추가하세요

3. **예시 문구 설정**
   - `assets/js/edit-here.js` 파일의 `sampleText` 변수를 수정하세요

## 📁 파일 구조

```
├── index.html              # 메인 HTML 파일
├── edit-here.js            # 🔧 사용자 설정 파일 (이 파일을 수정하세요!)
├── assets/
│   ├── css/
│   │   └── style.css       # 스타일시트
│   ├── js/
│   │   ├── font-loader.js  # 폰트 로더
│   │   ├── glyph-converter.js # 글리프 변환기 (세로쓰기용)
│   │   └── interface-controller.js # UI 컨트롤러
│   └── fonts/              # 폰트 파일들
└── README.md
```

## ⚙️ 설정 방법

### 1. 폰트 추가하기

`edit-here.js` 파일을 열어서 `fonts` 배열을 수정하세요:

```javascript
const fonts = [
  {
    name: "내 폰트 이름",           // 사용자에게 보여질 이름
    url: "assets/fonts/my-font.otf" // 폰트 파일 경로
  },
  {
    name: "또 다른 폰트",
    url: "assets/fonts/another-font.woff"
  }
];
```

### 2. 예시 문구 변경하기

`edit-here.js` 파일의 `sampleText` 변수를 수정하세요:

```javascript
const sampleText = `여기에 원하는 예시 문구를 입력하세요.
여러 줄로 작성할 수 있습니다.`;
```

### 3. 초기 설정 변경하기

`edit-here.js` 파일의 `initialSettings` 객체를 수정하세요:

```javascript
const initialSettings = {
  textDirection: "0",    // 0: 가로쓰기, 1: 세로쓰기
  fontSize: 30,           // 초기 폰트 크기
  letterSpacing: 0,       // 초기 글자 간격
  lineHeight: 1.5         // 초기 줄 간격
};
```

### 4. 글리프 설정 변경하기

`edit-here.js` 파일의 `glyphs` 객체를 수정하세요:

```javascript
const glyphs = {
  punctuation: {
    title: "구두점 괄호",
    characters: [".", ",", ":", ";", "!", "?", "(", ")", "[", "]", "{", "}", "\"", "'", "-", "—", "…"]
  },
  // 새로운 카테고리 추가 가능
  numbers: {
    title: "숫자",
    characters: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
  }
};
```

## 🎨 기능

- **폰트 미리보기**: 실시간으로 폰트 변경 가능
- **쓰기 방향**: 가로쓰기/세로쓰기 전환
- **타이포그래피 조절**: 폰트 크기, 글자 간격, 줄 간격 조절
- **글리프 보기**: 한글 글리프와 구두점, 기호 등 확인
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 📱 배포하기

1. 모든 파일을 웹 서버에 업로드
2. `assets/js/edit-here.js` 파일만 수정하여 폰트와 설정 변경
3. 다른 JS 파일들은 수정하지 마세요

## 🔧 고급 설정

### 폰트 형식 지원
- OpenType (.otf)
- Web Open Font Format (.woff, .woff2)
- TrueType (.ttf)

### 브라우저 지원
- Chrome, Firefox, Safari, Edge 최신 버전
- 모바일 브라우저 지원

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 👨‍💻 개발자

- 개발: 옥이랑 (withok.kr)
- 문의: [GitHub Issues](https://github.com/your-repo/issues)