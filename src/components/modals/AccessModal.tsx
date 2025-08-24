import React, { useMemo, useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: { name: string; email: string; nif: string }) => void;
  initialTab?: 'login' | 'register';
}

const AccessModal: React.FC<AccessModalProps> = ({ isOpen, onClose, onAuthSuccess, initialTab = 'login' }) => {
  const { login, register, resetPassword } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: '',
    registerName: '',
    registerEmail: '',
    registerNif: '',
    registerPassword: '',
    registerConfirmPassword: '',
    rememberMe: false,
    acceptTerms: false,
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const passwordStrength = useMemo(() => {
    const pwd = formData.registerPassword || '';
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0-5
  }, [formData.registerPassword]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await login(formData.loginEmail, formData.loginPassword, formData.rememberMe);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onAuthSuccess?.({ name: '', email: formData.loginEmail, nif: '' });
    onClose();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.acceptTerms) {
      setError('Deve aceitar os Termos e a Política de Privacidade.');
      return;
    }
    if (formData.registerPassword !== formData.registerConfirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    if ((passwordStrength || 0) < 3) {
      setError('A palavra-passe é fraca. Use 8+ caracteres com maiúsculas, minúsculas, números e símbolos.');
      return;
    }
    const res = await register({
      name: formData.registerName,
      email: formData.registerEmail,
      nif: formData.registerNif,
      password: formData.registerPassword,
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onAuthSuccess?.({ name: formData.registerName, email: formData.registerEmail, nif: formData.registerNif });
    onClose();
  };

  const handleResetPassword = async () => {
    setError(null);
    if (!formData.loginEmail) {
      setError('Informe o email para redefinir a palavra-passe.');
      return;
    }
    if (!formData.loginPassword) {
      setError('Defina uma nova palavra-passe no campo de palavra-passe.');
      return;
    }
    const res = await resetPassword(formData.loginEmail, formData.loginPassword);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError('Palavra-passe redefinida. Agora pode iniciar sessão.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Aceder à Plataforma</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'border-[#2c7873] text-[#2c7873]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'register'
                  ? 'border-[#2c7873] text-[#2c7873]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Registar
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-2 rounded bg-red-100 text-red-700 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  title='Email'
                  type="email"
                  value={formData.loginEmail}
                  onChange={(e) => handleInputChange('loginEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palavra-passe
                </label>
                <div className="relative">
                  <input
                    title='Palavra-passe'
                    type={showLoginPassword ? 'text' : 'password'}
                    value={formData.loginPassword}
                    onChange={(e) => handleInputChange('loginPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                    required
                  />
                  <button type="button" onClick={() => setShowLoginPassword(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button type="button" onClick={handleResetPassword} className="text-xs text-[#2c7873] hover:underline mt-1">Esqueci a palavra-passe (definir nova)</button>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-700">
                  Lembrar-me
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-[#2c7873] hover:bg-[#1f5a56] text-white py-2 px-4 rounded-lg transition-colors"
              >
                Entrar
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-2 rounded bg-red-100 text-red-700 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  title='Nome Completo'
                  type="text"
                  value={formData.registerName}
                  onChange={(e) => handleInputChange('registerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  title='Email'
                  type="email"
                  value={formData.registerEmail}
                  onChange={(e) => handleInputChange('registerEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIF <span className="text-red-500">*</span>
                </label>
                <input
                  title='NIF'
                  type="text"
                  value={formData.registerNif}
                  onChange={(e) => handleInputChange('registerNif', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palavra-passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    title='Palavra-passe'
                    type={showRegisterPassword ? 'text' : 'password'}
                    value={formData.registerPassword}
                    onChange={(e) => handleInputChange('registerPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                    required
                  />
                  <button type="button" onClick={() => setShowRegisterPassword(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                    {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="h-1 mt-1 bg-gray-200 rounded">
                  <div className={`h-1 rounded ${passwordStrength <= 2 ? 'bg-red-500 w-1/3' : passwordStrength === 3 ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-full'}`}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Use 8+ caracteres com maiúsculas, minúsculas, números e símbolos.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Palavra-passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    title='Confirmar Palavra-passe'
                    type={showRegisterConfirmPassword ? 'text' : 'password'}
                    value={formData.registerConfirmPassword}
                    onChange={(e) => handleInputChange('registerConfirmPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                    required
                  />
                  <button type="button" onClick={() => setShowRegisterConfirmPassword(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                    {showRegisterConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="acceptTerms" checked={formData.acceptTerms} onChange={(e) => handleInputChange('acceptTerms', e.target.checked)} />
                <label htmlFor="acceptTerms">Aceito os Termos e Condições e a Política de Privacidade</label>
              </div>
              <button
                type="submit"
                className="w-full bg-[#2c7873] hover:bg-[#1f5a56] text-white py-2 px-4 rounded-lg transition-colors"
              >
                Registar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessModal;