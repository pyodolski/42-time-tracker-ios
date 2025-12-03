# iOS 앱 재심사 제출 가이드

## 1. 빌드 및 동기화

```bash
# Next.js 빌드
npm run build

# Capacitor 동기화
npx cap sync ios

# Xcode 열기
npx cap open ios
```

## 2. Xcode 설정

1. **프로젝트 선택** → App 타겟
2. **General 탭**:
   - Version: `1.0.1` (증가)
   - Build: `2` (증가)
3. **Signing & Capabilities**:
   - Team 선택
   - Bundle ID: `com.jupyo.timetracker`

## 3. Archive 생성

1. Product → Destination → **Any iOS Device (arm64)**
2. Product → **Archive**
3. Archive 완료 대기

## 4. 업로드

1. Organizer에서 **Distribute App**
2. **App Store Connect** → Upload
3. 기본 옵션으로 진행
4. **Upload** 클릭

## 5. App Store Connect

1. https://appstoreconnect.apple.com
2. My Apps → 42TimeTracker
3. **+ 버전 또는 플랫폼** → iOS → `1.0.1`
4. 빌드 추가 (처리 완료 후)
5. 새로운 기능 작성:

```
버전 1.0.1 업데이트:
- UI/UX 전면 개선으로 더욱 깔끔하고 사용하기 편한 디자인
- 출퇴근 기록 화면 개선
- 대시보드 및 스케줄 관리 화면 개선
- 프로필 페이지 개선
- 전반적인 성능 향상 및 버그 수정
```

6. **심사를 위해 제출**

## 주의사항

- Version과 Build 번호는 이전보다 높아야 함
- 빌드 처리에 10-30분 소요
- 심사는 보통 1-3일 소요
- 거부되면 이메일로 통보됨

## 문제 해결

### 빌드 실패

```bash
# 캐시 삭제
rm -rf node_modules .next out
npm install
npm run build
```

### 서명 오류

- Xcode → Signing & Capabilities
- Team 다시 선택
- Clean Build Folder (Cmd + Shift + K)

### 업로드 오류

- Xcode 최신 버전 확인
- Apple Developer 계정 상태 확인
- 인증서 유효성 확인
