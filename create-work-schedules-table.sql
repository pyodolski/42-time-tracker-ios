-- work_schedules 테이블 생성 (근무 계획)
CREATE TABLE IF NOT EXISTS work_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  planned_hours NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- work_schedules 테이블에 대한 RLS 정책
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;

-- 기존 정책이 있다면 삭제
DROP POLICY IF EXISTS "사용자는 자신의 근무 계획만 볼 수 있음" ON work_schedules;
DROP POLICY IF EXISTS "사용자는 자신의 근무 계획만 생성할 수 있음" ON work_schedules;
DROP POLICY IF EXISTS "사용자는 자신의 근무 계획만 수정할 수 있음" ON work_schedules;
DROP POLICY IF EXISTS "사용자는 자신의 근무 계획만 삭제할 수 있음" ON work_schedules;

-- 새 정책 생성
CREATE POLICY "Users can view own work schedules" ON work_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own work schedules" ON work_schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work schedules" ON work_schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own work schedules" ON work_schedules
  FOR DELETE USING (auth.uid() = user_id);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_work_schedules_user_id ON work_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_work_schedules_date ON work_schedules(date);
