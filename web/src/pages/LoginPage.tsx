import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/utils/cn';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-surface-container rounded-full opacity-60" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-surface-container-low rounded-full opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-on-surface uppercase font-display">
            WorkX
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Không gian làm việc số
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-ambient">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-on-surface">
              Đăng nhập
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Nhập thông tin tài khoản để tiếp tục
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError();
                }}
                placeholder="your.email@company.com"
                required
                autoComplete="email"
                className={cn(
                  'w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface',
                  'border border-outline-variant/15 outline-none',
                  'focus:border-primary focus:shadow-[0_0_0_2px_rgba(0,0,0,0.1)]',
                  'placeholder:text-on-surface-variant/50',
                  'transition-all duration-200',
                )}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className={cn(
                    'w-full bg-surface-container-low rounded-lg px-4 py-3 pr-12 text-sm text-on-surface',
                    'border border-outline-variant/15 outline-none',
                    'focus:border-primary focus:shadow-[0_0_0_2px_rgba(0,0,0,0.1)]',
                    'placeholder:text-on-surface-variant/50',
                    'transition-all duration-200',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error-container/50 text-on-error-container text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className={cn(
                'w-full primary-gradient text-on-primary font-semibold py-3 rounded-lg',
                'text-sm tracking-tight',
                'hover:opacity-90 active:scale-[0.98]',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
                'flex items-center justify-center gap-2',
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-on-surface-variant/60 mt-8">
          © 2026 WorkX — Hệ thống nội bộ doanh nghiệp
        </p>
      </div>
    </div>
  );
}
