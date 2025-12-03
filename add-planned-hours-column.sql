-- work_schedules 테이블에 planned_hours 칼럼 추가
ALTER TABLE work_schedules 
ADD COLUMN IF NOT EXISTS planned_hours NUMERIC(5,2) DEFAULT 0;

-- 기존 데이터가 있다면 start_time과 end_time으로 planned_hours 계산
UPDATE work_schedules
SET planned_hours = EXTRACT(EPOCH FROM (end_time - start_time)) / 3600
WHERE planned_hours IS NULL OR planned_hours = 0;
