
import { signup } from '@/app/login/actions'
import { Background } from "@/components/Background";
import Link from 'next/link';

export default function SignupPage({
    searchParams,
}: {
    searchParams: { message: string; error: string }
}) {
    return (
        <div className="min-h-screen flex items-center justify-center relative p-4">
            <Background />
            <div className="glass-panel w-full max-w-md p-8 shadow-2xl animate-fade-in relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-2">Edupia Helper</h1>
                    <p className="text-[var(--text-secondary)]">Tạo tài khoản mới</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="full_name">
                            Họ và tên
                        </label>
                        <input
                            id="full_name"
                            name="full_name"
                            type="text"
                            required
                            className="w-full p-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all shadow-sm"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full p-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all shadow-sm"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="password">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full p-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all shadow-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {(searchParams?.error || searchParams?.message) && (
                        <div className={`p-4 rounded-lg text-sm text-center ${searchParams.error ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-green-500/10 text-green-500 border border-green-500/20"}`}>
                            {searchParams.error || searchParams.message}
                        </div>
                    )}

                    <button
                        formAction={signup}
                        className="w-full py-3 px-4 rounded-lg bg-[var(--primary-color)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Đăng ký
                    </button>

                    <div className="text-center text-sm text-[var(--text-secondary)] mt-4">
                        Đã có tài khoản?{" "}
                        <Link href="/login" className="text-[var(--primary-color)] hover:underline font-semibold">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
