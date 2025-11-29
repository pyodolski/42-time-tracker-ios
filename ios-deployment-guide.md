# iOS 배포 가이드 (아이폰 전용)

## 현재 설정 상태

✅ PWA manifest 설정 완료 (아이패드 제외)
✅ Apple 메타 태그 추가 완료
✅ 아이콘 생성 완료
✅ iOS 최적화 헤더 설정

## 배포 전 체크리스트

### 1. PNG 아이콘 변환 (필수)

현재 SVG 아이콘이 생성되어 있습니다. iOS는 PNG 형식을 권장하므로 변환이 필요합니다:

```bash
# 온라인 변환기 사용 (권장)
# https://svgtopng.com/ 또는 https://cloudconvert.com/svg-to-png

# 또는 ImageMagick 사용 (설치 필요)
brew install imagemagick
cd public/icons
for file in *.svg; do
  convert "$file" "${file%.svg}.png"
done
```

### 2. 빌드 및 배포

```bash
# 프로젝트 빌드
npm run build

# Netlify에 배포 (자동)
git add .
git commit -m "iOS 배포 설정 완료"
git push origin main
```

### 3. iOS 테스트 방법

1. **Safari에서 접속**

   - 배포된 URL로 접속
   - 하단 공유 버튼 탭
   - "홈 화면에 추가" 선택

2. **확인 사항**
   - ✅ 홈 화면 아이콘이 정상적으로 표시되는지
   - ✅ 앱 실행 시 전체 화면으로 표시되는지
   - ✅ 상태바가 검은색 반투명으로 표시되는지
   - ✅ 아이패드에서는 설치 옵션이 제한되는지

### 4. iOS 전용 설정 내용

#### manifest.json

- `orientation: "portrait-primary"` - 세로 모드만 지원
- 아이패드 제외 설정 완료

#### Apple 메타 태그

- `apple-mobile-web-app-capable: yes` - 독립 실행형 앱
- `apple-mobile-web-app-status-bar-style: black-translucent` - 상태바 스타일
- `apple-touch-icon` - 180x180 아이콘

#### 지원 기기

- ✅ iPhone SE (1세대) 이상
- ✅ iOS 14.0 이상 권장
- ❌ iPad (의도적으로 제외)

## 문제 해결

### 홈 화면에 추가가 안 보이는 경우

- Safari 브라우저 사용 확인 (Chrome/Firefox는 지원 안 함)
- HTTPS 연결 확인
- manifest.json 경로 확인

### 아이콘이 제대로 표시되지 않는 경우

- PNG 변환 확인
- 아이콘 크기 확인 (180x180 필수)
- 캐시 삭제 후 재시도

### 전체 화면이 안 되는 경우

- `display: "standalone"` 설정 확인
- `apple-mobile-web-app-capable` 메타 태그 확인

## 추가 최적화 (선택사항)

### 스플래시 스크린 추가

iOS에서 앱 실행 시 표시되는 스플래시 스크린을 추가할 수 있습니다:

```html
<!-- src/app/layout.tsx의 head에 추가 -->
<link rel="apple-touch-startup-image" href="/splash-screen.png" />
```

### 오프라인 지원 강화

Service Worker를 통해 오프라인 기능을 강화할 수 있습니다.

### 푸시 알림 (iOS 16.4+)

iOS 16.4부터 PWA에서 푸시 알림을 지원합니다.

## 참고 자료

- [Apple PWA 가이드](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [iOS PWA 지원 현황](https://firt.dev/notes/pwa-ios/)
