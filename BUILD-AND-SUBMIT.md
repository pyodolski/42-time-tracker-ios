# iOS 앱 빌드 및 제출 가이드

## ⚠️ 중요: 터미널 재시작 필요

환경 변수 문제로 인해 **터미널을 완전히 닫고 새로 열어야 합니다**.

## 1. 새 터미널에서 빌드

```bash
cd ~/Desktop/time-tracknig

# Next.js 빌드
npm run build

# Capacitor 동기화
npx cap sync ios

# Xcode 열기
npx cap open ios
```

## 2. Xcode에서 설정

1. **프로젝트 선택** → App 타겟
2. **General 탭**:
   - Version: `1.0.1`
   - Build: `2`
3. **Signing & Capabilities**:
   - Team 선택
   - Bundle ID 확인: `com.jupyo.timetracker`

## 3. Archive 생성

1. Product → Destination → **Any iOS Device (arm64)**
2. Product → **Archive**
3. 완료 대기 (5-10분)

## 4. App Store Connect 업로드

1. Organizer에서 **Distribute App**
2. **App Store Connect** 선택
3. **Upload** 선택
4. 기본 옵션으로 진행
5. **Upload** 클릭

## 5. App Store Connect에서 제출

1. https://appstoreconnect.apple.com
2. My Apps → 42TimeTracker
3. **+ 버전 또는 플랫폼** → iOS → `1.0.1`
4. 빌드 처리 완료 대기 (10-30분)
5. 빌드 추가
6. 새로운 기능 작성:

```
버전 1.0.1 업데이트:
- UI/UX 전면 개선으로 더욱 깔끔하고 사용하기 편한 디자인
- 출퇴근 기록 화면 개선
- 대시보드 및 스케줄 관리 화면 개선
- 프로필 페이지 개선
- 전반적인 성능 향상 및 버그 수정
```

7. **심사를 위해 제출**

## 문제 해결

### 빌드 실패 시

```bash
rm -rf .next out node_modules
npm install
npm run build
```

### 환경 변수 오류 시

- 터미널 완전히 종료 후 재시작
- .env.local 파일 확인

### Xcode 서명 오류 시

- Xcode → Preferences → Accounts에서 Apple ID 확인
- Signing & Capabilities에서 Team 다시 선택
- Clean Build Folder (Cmd + Shift + K)

## 심사 상태

- **Waiting for Review**: 1-3일
- **In Review**: 몇 시간~1일
- **Ready for Sale**: 승인 완료! 🎉
