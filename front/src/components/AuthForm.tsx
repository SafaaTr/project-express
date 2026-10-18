import { useState } from 'react';

export default function AuthForm({ type, onSubmit, error, loading }) {
  const isRegister = type === 'register';

  // حالة لتخزين البيانات لكل الحقول
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // إرسال البيانات للمكون الأب
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
          {isRegister ? 'Create Account' : 'Login'}
        </h2>

        {error && <p className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</p>}

        {/* حقل الاسم يظهر فقط في حالة التسجيل */}
        {isRegister && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="example@mail.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 ${
            isRegister ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : isRegister ? 'SignUp' : 'Login'}
        </button>
      </form>
    </div>
  );
}