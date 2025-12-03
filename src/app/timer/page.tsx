"use client";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  getTimeEntriesByDate,
  createCheckInEntry,
  updateCheckOutEntry,
  updateTimeEntry,
  deleteTimeEntry,
} from "../../lib/timeEntries";

interface TimeEntry {
  id: string;
  date: string;
  check_in: string;
  check_out: string | null;
  working_hours: number | null;
}

export default function AttendancePage() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [editCheckInTime, setEditCheckInTime] = useState<string>("");
  const [editCheckOutTime, setEditCheckOutTime] = useState<string>("");
  const [todayTotalWorkingHours, setTodayTotalWorkingHours] =
    useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadTodayRecords();
  }, []);

  const loadTodayRecords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const entries = await getTimeEntriesByDate(today);
      setTodayEntries(entries);

      let totalHours = 0;
      if (entries && entries.length > 0) {
        totalHours = entries.reduce((total, entry) => {
          if (entry.working_hours !== null) {
            return total + entry.working_hours;
          } else if (entry.check_in && !entry.check_out) {
            const checkInTime = new Date(entry.check_in);
            const now = new Date();
            const diffHours =
              (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
            return total + diffHours;
          }
          return total;
        }, 0);
      }
      setTodayTotalWorkingHours(totalHours);

      if (entries && entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        if (lastEntry && lastEntry.check_in && !lastEntry.check_out) {
          setIsCheckedIn(true);
          setCheckInTime(new Date(lastEntry.check_in));
        } else {
          setIsCheckedIn(false);
        }
      } else {
        setIsCheckedIn(false);
      }
    } catch (err: any) {
      setError(`기록을 불러오는 중 오류가 발생했습니다`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const now = new Date();
      const today = format(now, "yyyy-MM-dd");

      const newEntry = await createCheckInEntry(today, now.toISOString());

      if (newEntry) {
        setIsCheckedIn(true);
        setCheckInTime(now);
        await loadTodayRecords();
      }
    } catch (err: any) {
      setError(`출근 처리 중 오류가 발생했습니다`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!checkInTime) return;

    try {
      setIsLoading(true);
      setError(null);

      const now = new Date();
      const diffMs = now.getTime() - checkInTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (todayEntries.length > 0) {
        const lastEntry = todayEntries[todayEntries.length - 1];

        const updatedEntry = await updateCheckOutEntry(
          lastEntry.id,
          now.toISOString(),
          diffHours
        );

        if (updatedEntry) {
          setIsCheckedIn(false);
          loadTodayRecords();
        }
      }
    } catch (err) {
      setError("퇴근 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setEditDate(entry.date);
    setEditCheckInTime(
      entry.check_in ? format(parseISO(entry.check_in), "HH:mm") : ""
    );
    setEditCheckOutTime(
      entry.check_out ? format(parseISO(entry.check_out), "HH:mm") : ""
    );
  };

  const cancelEditing = () => {
    setEditingEntry(null);
  };

  const saveEditedEntry = async () => {
    if (!editingEntry) return;

    try {
      setIsLoading(true);
      setError(null);

      const [year, month, day] = editDate.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);

      const [checkInHours, checkInMinutes] = editCheckInTime
        .split(":")
        .map(Number);
      const checkInDate = new Date(dateObj);
      checkInDate.setHours(checkInHours, checkInMinutes, 0);

      let checkOutDate: Date | null = null;
      if (editCheckOutTime) {
        const [checkOutHours, checkOutMinutes] = editCheckOutTime
          .split(":")
          .map(Number);
        checkOutDate = new Date(dateObj);
        checkOutDate.setHours(checkOutHours, checkOutMinutes, 0);
      }

      let workingHoursValue = null;
      if (checkInDate && checkOutDate) {
        let diffMs = checkOutDate.getTime() - checkInDate.getTime();
        if (diffMs < 0) {
          const oneDayMs = 24 * 60 * 60 * 1000;
          diffMs += oneDayMs;
        }
        workingHoursValue = diffMs / (1000 * 60 * 60);
      }

      const updatedEntry = await updateTimeEntry(
        editingEntry.id,
        checkInDate.toISOString(),
        checkOutDate ? checkOutDate.toISOString() : null,
        workingHoursValue,
        editDate
      );

      if (updatedEntry) {
        setEditingEntry(null);
        loadTodayRecords();
      }
    } catch (err) {
      setError("기록 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntryHandler = async (entryId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const success = await deleteTimeEntry(entryId);

      if (success) {
        loadTodayRecords();
      }
    } catch (err) {
      setError("기록 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatWorkingHours = (hours: number | null) => {
    if (hours === null) return "-";
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}시간 ${minutes}분`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">출퇴근 기록</h1>
          <p className="text-gray-500 text-sm mt-1">
            오늘의 근무 시간을 관리하세요
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* 시계 카드 */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="text-center">
            <div className="text-gray-500 text-sm mb-2">
              {isClient
                ? format(currentTime || new Date(), "yyyy년 MM월 dd일 EEEE", {
                    locale: ko,
                  })
                : ""}
            </div>

            <div className="text-6xl font-bold text-gray-800 mb-8 font-mono">
              {isClient ? format(currentTime || new Date(), "HH:mm:ss") : ""}
            </div>

            <button
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                isCheckedIn
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
              }`}
            >
              {isLoading ? "처리 중..." : isCheckedIn ? "퇴근하기" : "출근하기"}
            </button>

            {isCheckedIn && checkInTime && (
              <div className="mt-4 text-sm text-gray-600">
                출근 시간: {format(checkInTime, "HH:mm")}
              </div>
            )}
          </div>
        </div>

        {/* 오늘의 근무 시간 요약 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm mb-1">오늘 총 근무시간</p>
              <p className="text-3xl font-bold">
                {formatWorkingHours(todayTotalWorkingHours)}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 오늘의 출퇴근 기록 목록 */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">오늘의 기록</h2>

          {todayEntries.length > 0 ? (
            <div className="space-y-3">
              {todayEntries.map((entry) => (
                <div key={entry.id}>
                  {editingEntry?.id === entry.id ? (
                    // 수정 모드
                    <div className="bg-blue-50 rounded-2xl p-4">
                      <div className="mb-3">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          날짜
                        </label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            출근
                          </label>
                          <input
                            type="time"
                            value={editCheckInTime}
                            onChange={(e) => setEditCheckInTime(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            퇴근
                          </label>
                          <input
                            type="time"
                            value={editCheckOutTime}
                            onChange={(e) =>
                              setEditCheckOutTime(e.target.value)
                            }
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={cancelEditing}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300"
                        >
                          취소
                        </button>
                        <button
                          onClick={saveEditedEntry}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 읽기 모드
                    <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {entry.check_in
                              ? format(parseISO(entry.check_in), "HH:mm")
                              : "-"}{" "}
                            ~{" "}
                            {entry.check_out
                              ? format(parseISO(entry.check_out), "HH:mm")
                              : "진행중"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entry.working_hours
                              ? formatWorkingHours(entry.working_hours)
                              : "-"}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(entry)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteEntryHandler(entry.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-3 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p>오늘의 출퇴근 기록이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
