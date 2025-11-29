# Supabase 새로 만들기 가이드

## 1. Supabase 프로젝트 생성

1. **Supabase 접속**

   - https://supabase.com/
   - 'Start your project' 클릭

2. **로그인/회원가입**

   - GitHub 계정으로 로그인 (권장)
   - 또는 이메일로 가입

3. **새 프로젝트 생성**
   - 'New Project' 클릭
   - Organization 선택 (없으면 자동 생성)
4. **프로젝트 정보 입력**

   - Name: `timetracker` (원하는 이름)
   - Database Password: 강력한 비밀번호 생성 (저장해두세요!)
   - Region: `Northeast Asia (Seoul)` 선택 (한국 서버)
   - Pricing Plan: `Free` (무료)
   - 'Create new project' 클릭

5. **프로젝트 생성 대기**
   - 약 2-3분 소요
   - 완료되면 대시보드로 이동

## 2. API 키 확인

1. **Settings 메뉴**

   - 좌측 사이드바 하단 톱니바퀴 아이콘 클릭
   - 'API' 메뉴 선택

2. **필요한 정보 복사**

   - `Project URL`: https://xxxxx.supabase.co
   - `anon public` 키: eyJhbGc... (긴 문자열)

   **이 두 개를 복사해서 저장해두세요!**

## 3. 데이터베이스 테이블 생성

1. **SQL Editor 열기**

   - 좌측 사이드바에서 'SQL Editor' 클릭
   - 'New query' 클릭

2. **아래 SQL 복사해서 붙여넣기**

```sql
-- 사용자 프로필 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 근무 기록 테이블
CREATE TABLE work_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- 초 단위
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 스케줄 테이블
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  title TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Row Level Security (RLS) 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 프로필 정책
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 근무 기록 정책
CREATE POLICY "Users can view own work sessions"
  ON work_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own work sessions"
  ON work_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work sessions"
  ON work_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own work sessions"
  ON work_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- 스케줄 정책
CREATE POLICY "Users can view own schedules"
  ON schedules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules"
  ON schedules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON schedules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON schedules FOR DELETE
  USING (auth.uid() = user_id);

-- 사용자 생성 시 자동으로 프로필 생성하는 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

3. **실행**
   - 'Run' 버튼 클릭 (또는 Ctrl/Cmd + Enter)
   - 'Success' 메시지 확인

## 4. 인증 설정

1. **Authentication 메뉴**

   - 좌측 사이드바에서 'Authentication' 클릭
   - 'Providers' 탭 선택

2. **Email 설정**

   - 'Email' 토글이 켜져 있는지 확인
   - 'Enable email confirmations' 끄기 (테스트용)
     - 나중에 프로덕션에서는 켜는 것 권장

3. **Google 로그인 비활성화**
   - 'Google' 찾아서 토글 끄기

## 5. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**위에서 복사한 값으로 교체하세요!**

## 6. 테스트

1. **테이블 확인**

   - 'Table Editor' 메뉴 클릭
   - profiles, work_sessions, schedules 테이블이 보이는지 확인

2. **앱에서 회원가입 테스트**
   - 앱 실행 후 회원가입
   - 'Authentication' → 'Users' 메뉴에서 사용자 확인

## 완료!

이제 새로운 Supabase 프로젝트가 준비되었습니다.

## 무료 플랜 제한

- 데이터베이스: 500MB
- 파일 저장소: 1GB
- 월간 대역폭: 5GB
- 월간 활성 사용자: 50,000명

개인 프로젝트나 소규모 앱에는 충분합니다!
