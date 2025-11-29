# EAS Build로 iOS 앱 빌드하기 (Mac 없이!)

## ✅ 완료된 작업

- EAS CLI 설치 완료
- eas.json 설정 파일 생성 완료
- Capacitor iOS 프로젝트 준비 완료

## 📱 EAS Build 사용 방법

### 1. Expo 계정 생성 및 로그인

```bash
# 로그인 (계정 없으면 자동으로 생성 안내)
eas login
```

브라우저가 열리면 Expo 계정으로 로그인하세요.

- 무료 계정으로 시작 가능
- 월 30분 빌드 시간 무료 제공

### 2. 프로젝트 설정

```bash
# EAS 프로젝트 초기화
eas build:configure
```

질문이 나오면:

- "Would you like to automatically create an EAS project?" → **Yes**

### 3. iOS 빌드 실행

#### 옵션 A: 시뮬레이터용 빌드 (테스트용)

```bash
eas build --platform ios --profile preview
```

- Mac 없이도 다운로드 가능
- .app 파일 생성
- 시뮬레이터에서만 실행 가능

#### 옵션 B: 실제 기기용 빌드 (배포용)

```bash
eas build --platform ios --profile production
```

- .ipa 파일 생성
- App Store 제출 가능
- 실제 iPhone에 설치 가능

### 4. Apple Developer 자격증명 입력

빌드 중에 다음 정보를 물어봅니다:

1. **Apple ID**

   - Apple Developer 계정 이메일
   - 무료 계정도 가능 (테스트용)

2. **App-specific password** (필요 시)

   - https://appleid.apple.com/account/manage
   - 로그인 → 보안 → 앱 암호 생성
   - 생성된 암호 입력

3. **Bundle Identifier 확인**
   - 현재: `com.timetracker.app`
   - 고유한 ID로 변경 권장

### 5. 빌드 진행 확인

```bash
# 빌드 상태 확인
eas build:list
```

또는 웹에서 확인:

- https://expo.dev/accounts/[your-username]/projects/time-tracker-web/builds

빌드 시간: 약 10-20분

### 6. 빌드 완료 후

#### 시뮬레이터 빌드 (.app)

```bash
# 다운로드 링크가 제공됨
# Mac에서 시뮬레이터로 실행
```

#### 프로덕션 빌드 (.ipa)

```bash
# .ipa 파일 다운로드
# App Store Connect에 업로드 가능
```

## 🚀 App Store 제출 방법

### 방법 1: EAS Submit (자동)

```bash
eas submit --platform ios
```

필요한 정보:

- Apple ID
- App-specific password
- App Store Connect에 앱이 미리 생성되어 있어야 함

### 방법 2: 수동 업로드

1. **Transporter 앱 사용** (Mac 또는 Windows)

   - App Store에서 'Transporter' 다운로드
   - .ipa 파일 드래그 앤 드롭
   - 업로드

2. **App Store Connect에서 확인**
   - https://appstoreconnect.apple.com/
   - 빌드가 나타날 때까지 10-15분 대기

## 💰 비용

### Expo EAS Build

- **무료 플랜**: 월 30분 빌드 시간
- **Production 플랜**: $29/월 (무제한 빌드)
- iOS 빌드 1회: 약 10-20분 소요

### Apple Developer

- **필수**: $99/년 (App Store 제출용)
- 테스트만 할 경우: 무료 계정 가능

## 📝 Bundle Identifier 변경

현재 `com.timetracker.app`은 예시입니다. 변경하려면:

```bash
# capacitor.config.ts 파일 수정
```

```typescript
const config: CapacitorConfig = {
  appId: "com.yourname.timetracker", // 여기 변경
  appName: "TimeTracker",
  // ...
};
```

변경 후:

```bash
npm run build
npx cap sync ios
```

## 🔧 문제 해결

### "No bundle identifier found"

```bash
# iOS 프로젝트 재생성
npx cap sync ios
```

### "Apple ID authentication failed"

- App-specific password 생성 확인
- 2단계 인증 활성화 확인

### "Provisioning profile error"

- Apple Developer 계정 확인
- Bundle ID가 고유한지 확인

### 빌드 실패

```bash
# 로그 확인
eas build:list
# 실패한 빌드 클릭하여 로그 확인
```

## 📱 실제 iPhone에 테스트 설치

### 방법 1: TestFlight (권장)

1. EAS Build로 .ipa 생성
2. App Store Connect에 업로드
3. TestFlight에서 내부 테스터로 본인 추가
4. iPhone에서 TestFlight 앱 다운로드
5. 앱 설치 및 테스트

### 방법 2: Ad Hoc 배포

```bash
eas build --platform ios --profile preview
```

- UDID 등록 필요
- 최대 100대 기기

## 🎯 전체 워크플로우

```bash
# 1. 코드 수정
# 2. 빌드
npm run build

# 3. iOS 동기화
npx cap sync ios

# 4. EAS 빌드
eas build --platform ios --profile production

# 5. 빌드 완료 대기 (10-20분)

# 6. App Store 제출
eas submit --platform ios
```

## 💡 팁

1. **첫 빌드는 시간이 오래 걸립니다**

   - 의존성 다운로드 및 캐싱
   - 두 번째부터는 더 빠름

2. **로컬 빌드 vs 클라우드 빌드**

   - 로컬: Mac + Xcode 필요, 빠름
   - 클라우드: Mac 불필요, 느림

3. **무료 플랜 활용**

   - 월 30분이면 2-3회 빌드 가능
   - 테스트 후 프로덕션 빌드만 EAS 사용

4. **Bundle Identifier는 신중하게**
   - 한 번 App Store에 등록하면 변경 불가
   - 도메인 역순 사용 권장 (com.yourname.app)

## 🔗 유용한 링크

- [EAS Build 문서](https://docs.expo.dev/build/introduction/)
- [EAS Submit 문서](https://docs.expo.dev/submit/introduction/)
- [Expo 대시보드](https://expo.dev/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Apple Developer](https://developer.apple.com/)

## 다음 단계

1. `eas login` 실행
2. `eas build --platform ios --profile production` 실행
3. 빌드 완료 대기
4. .ipa 다운로드 또는 자동 제출
