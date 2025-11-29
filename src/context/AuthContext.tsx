"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// AuthContext에서 제공할 값들의 타입 정의
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 이메일 로그인
  const signIn = async (
    email: string,
    password: string,
    rememberMe: boolean = true
  ) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Supabase는 기본적으로 localStorage에 세션을 저장하여 자동 로그인 지원
  };

  // 회원가입
  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }
  };

  // 로그아웃 함수
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  // 회원탈퇴 함수
  const deleteAccount = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("로그인된 사용자가 없습니다");
      }

      // Supabase Admin API를 사용하여 사용자 삭제
      // 주의: 이 방법은 RLS 정책에 따라 작동하지 않을 수 있습니다
      // 대신 Edge Function이나 서버 사이드에서 처리하는 것이 좋습니다

      // 현재는 클라이언트에서 직접 삭제할 수 없으므로
      // 프로필과 관련 데이터만 삭제하고 로그아웃
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileError) {
        console.error("프로필 삭제 오류:", profileError);
      }

      // 로그아웃
      await supabase.auth.signOut();
    } catch (error) {
      console.error("회원탈퇴 오류:", error);
      throw error;
    }
  };

  // 사용자 세션 변경 감지 (자동 로그인)
  useEffect(() => {
    // 현재 세션 가져오기 - localStorage에 저장된 세션 자동 복원
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 세션 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Context Provider 반환
  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signUp, signOut, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다");
  }
  return context;
}
