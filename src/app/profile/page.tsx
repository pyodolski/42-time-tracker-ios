"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, signOut, deleteAccount } = useAuth();
  const router = useRouter();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setErrorMsg(null);

    try {
      await deleteAccount();
      router.push("/login");
    } catch (error: any) {
      setErrorMsg(error?.message || "회원탈퇴 중 오류가 발생했습니다");
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-4xl text-white font-bold">
            {user.user_metadata?.full_name?.charAt(0) || "U"}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">프로필</h1>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          사용자 정보
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm">이름</p>
            <p className="font-medium">
              {user.user_metadata?.full_name || "이름 없음"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">이메일</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">가입일</p>
            <p className="font-medium">
              {new Date(user.created_at).toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">계정 관리</h2>
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition font-semibold"
          >
            로그아웃
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold"
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {/* 회원탈퇴 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">회원탈퇴 확인</h3>
            <p className="text-gray-600 mb-6">
              정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가
              삭제됩니다.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {errorMsg}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setErrorMsg(null);
                }}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? "처리 중..." : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
