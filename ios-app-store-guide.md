# iOS App Store 배포 가이드

## ✅ 완료된 작업

- Capacitor 설치 및 설정 완료
- iOS 프로젝트 생성 완료
- Next.js 빌드 및 iOS 앱 연동 완료

## 📱 다음 단계

### 1. Xcode에서 프로젝트 열기

```bash
npx cap open ios
```

이 명령어로 Xcode가 자동으로 열립니다.

### 2. Apple Developer 계정 설정

1. **Apple Developer Program 가입** (필수)

   - https://developer.apple.com/programs/
   - 연간 $99 (약 13만원)
   - 개인 또는 조직 계정 선택

2. **Xcode에서 계정 추가**
   - Xcode 메뉴 → Settings (⌘,)
   - Accounts 탭
   - '+' 버튼 → Apple ID 추가

### 3. 앱 설정 (Xcode에서)

1. **프로젝트 선택**

   - 좌측 파일 트리에서 'App' 프로젝트 클릭
   - 'Signing & Capabilities' 탭 선택

2. **Bundle Identifier 변경**

   - 현재: `com.timetracker.app`
   - 고유한 ID로 변경 (예: `com.yourname.timetracker`)

3. **Team 선택**

   - Team 드롭다운에서 본인의 Apple Developer 계정 선택
   - 자동으로 Provisioning Profile 생성됨

4. **앱 정보 설정**
   - Display Name: `TimeTracker`
   - Version: `1.0.0`
   - Build: `1`

### 4. 앱 아이콘 설정

1. **아이콘 준비**

   - 1024x1024 PNG 파일 필요
   - 투명도 없어야 함
   - 둥근 모서리 자동 적용됨

2. **Xcode에서 설정**
   - `ios/App/App/Assets.xcassets/AppIcon.appiconset` 폴더
   - 또는 Xcode에서 Assets.xcassets → AppIcon 클릭
   - 1024x1024 이미지 드래그 앤 드롭

### 5. 로컬 테스트

```bash
# iOS 시뮬레이터에서 실행
npx cap run ios

# 또는 Xcode에서 직접 실행
# 상단 재생 버튼 클릭 (⌘R)
```

### 6. 실제 기기에서 테스트

1. **iPhone 연결**

   - USB로 Mac과 iPhone 연결
   - iPhone에서 "이 컴퓨터를 신뢰하시겠습니까?" → 신뢰

2. **Xcode에서 기기 선택**

   - 상단 기기 선택 드롭다운에서 본인 iPhone 선택
   - 재생 버튼 클릭 (⌘R)

3. **신뢰 설정 (처음만)**
   - iPhone 설정 → 일반 → VPN 및 기기 관리
   - 개발자 앱 → 신뢰

### 7. App Store Connect 설정

1. **App Store Connect 접속**

   - https://appstoreconnect.apple.com/
   - Apple Developer 계정으로 로그인

2. **새 앱 생성**

   - 'My Apps' → '+' 버튼 → 'New App'
   - Platform: iOS
   - Name: TimeTracker
   - Primary Language: Korean
   - Bundle ID: Xcode에서 설정한 것과 동일
   - SKU: 고유 식별자 (예: timetracker-001)

3. **앱 정보 입력**
   - 카테고리: Productivity
   - 스크린샷 (필수):
     - 6.7" (iPhone 15 Pro Max): 1290 x 2796
     - 6.5" (iPhone 11 Pro Max): 1242 x 2688
     - 최소 3장, 최대 10장
   - 앱 설명 (한국어)
   - 키워드
   - 지원 URL
   - 마케팅 URL (선택)
   - 개인정보 처리방침 URL (필수)

### 8. Archive 및 업로드

1. **Xcode에서 Archive 생성**

   - 상단 기기 선택 → 'Any iOS Device (arm64)' 선택
   - Product 메뉴 → Archive
   - 빌드 완료까지 대기 (수 분 소요)

2. **Archive 업로드**

   - Organizer 창이 자동으로 열림
   - 'Distribute App' 클릭
   - 'App Store Connect' 선택
   - 'Upload' 선택
   - 기본 옵션으로 진행
   - 업로드 완료까지 대기

3. **App Store Connect에서 확인**
   - 10-15분 후 App Store Connect에서 빌드 확인 가능
   - TestFlight 탭에서 빌드 상태 확인

### 9. TestFlight 베타 테스트 (선택)

1. **내부 테스터 추가**

   - TestFlight 탭 → Internal Testing
   - 테스터 추가 (최대 100명)
   - 자동으로 초대 이메일 발송

2. **외부 테스터 추가** (선택)
   - External Testing 그룹 생성
   - Apple 심사 필요 (1-2일 소요)
   - 최대 10,000명

### 10. App Store 심사 제출

1. **App Store Connect에서 설정**

   - 'App Store' 탭 선택
   - 빌드 선택 (TestFlight에서 업로드한 빌드)
   - 가격 및 판매 가능 여부 설정
   - 연령 등급 설정

2. **심사 정보 입력**

   - 심사 노트 (선택)
   - 연락처 정보
   - 데모 계정 (로그인 필요 시)

3. **제출**
   - 'Submit for Review' 클릭
   - 심사 대기 (평균 1-3일)

### 11. 심사 후

- **승인**: 자동 또는 수동으로 앱 출시
- **거절**: 거절 사유 확인 후 수정하여 재제출

## 🔄 앱 업데이트 시

```bash
# 1. 코드 수정 후
npm run build

# 2. iOS 프로젝트 동기화
npx cap sync ios

# 3. Xcode에서 버전 업데이트
# Version: 1.0.1 (마이너 업데이트)
# Build: 2 (매번 증가)

# 4. Archive 및 업로드 (위 8번 과정 반복)
```

## 📝 중요 체크리스트

### 필수 준비물

- [ ] Apple Developer 계정 ($99/년)
- [ ] Mac 컴퓨터 (Xcode 실행용)
- [ ] 1024x1024 앱 아이콘
- [ ] 스크린샷 (최소 3장)
- [ ] 개인정보 처리방침 URL
- [ ] 앱 설명 (한국어/영어)

### 심사 통과 팁

- [ ] 앱이 정상적으로 작동하는지 확인
- [ ] 크래시 없는지 테스트
- [ ] 로그인 필요 시 데모 계정 제공
- [ ] 개인정보 처리방침 명확히 작성
- [ ] 스크린샷이 실제 앱과 일치하는지 확인
- [ ] 앱 설명이 정확한지 확인

## 🚨 주의사항

1. **Bundle Identifier 변경 필수**

   - `com.timetracker.app`은 예시입니다
   - 고유한 ID로 변경하세요 (예: `com.yourname.timetracker`)

2. **Supabase 설정**

   - 현재 앱은 Supabase를 사용합니다
   - iOS 앱에서도 동일한 Supabase 프로젝트 사용 가능
   - 추가 설정 불필요

3. **API 키 보안**

   - 환경 변수는 빌드 시 포함됩니다
   - 민감한 정보는 서버 사이드에서 처리하세요

4. **네트워크 권한**
   - iOS는 기본적으로 HTTPS만 허용
   - HTTP 사용 시 Info.plist 수정 필요

## 🔗 유용한 링크

- [Apple Developer](https://developer.apple.com/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Capacitor 문서](https://capacitorjs.com/docs)
- [App Store 심사 가이드라인](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## 💡 문제 해결

### "No signing certificate found"

- Xcode → Settings → Accounts에서 Apple ID 추가
- Team 선택 후 'Download Manual Profiles' 클릭

### "Failed to register bundle identifier"

- Bundle ID가 이미 사용 중
- 다른 고유한 ID로 변경

### 빌드 실패

```bash
# Pod 재설치
cd ios/App
pod install
cd ../..
```

### 앱이 실행되지 않음

```bash
# 캐시 정리 후 재빌드
npm run build
npx cap sync ios
```
