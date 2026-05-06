import React, { useState } from 'react';
import { useAzure } from '../context/AzureContext';
import { useNavigate, Link } from 'react-router';
import { User, Mail, ArrowRight, UserPlus, Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { motion } from 'motion/react';

export function Register() {
  const { register } = useAzure();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Password validation rules
  const passwordValidation = {
    minLength: formData.password.length >= 6,
    hasLowercase: /[a-z]/.test(formData.password),
    hasUppercase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert('A password não cumpre os requisitos de segurança.');
      return;
    }

    if (!passwordsMatch) {
      alert('As passwords não coincidem.');
      return;
    }

    if (formData.username.trim()) {
      register(formData.username, formData.password, {
        fullName: formData.fullName,
        email: formData.email,
        bio: formData.bio,
      });
      navigate('/scan');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <UserPlus size={32} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-serif text-stone-900"
        >
          Criar Conta
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-stone-500 text-sm"
        >
          Junte-se à comunidade ESTufa e comece a sua jornada botânica.
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <input
              type="text"
              name="username"
              placeholder="Nome de Utilizador *"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-10 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="relative"
          >
            <input
              type="text"
              name="fullName"
              placeholder="Nome Completo"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-10 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-10 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
            className="relative"
          >
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              className="w-full px-4 py-3 pl-10 pr-10 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>

          {passwordFocused && formData.password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left space-y-2"
            >
              <p className="text-xs font-medium text-stone-700 mb-2">Requisitos da Password:</p>
              <PasswordRequirement met={passwordValidation.minLength} text="Mínimo 6 caracteres" />
              <PasswordRequirement met={passwordValidation.hasLowercase} text="1 letra minúscula" />
              <PasswordRequirement met={passwordValidation.hasUppercase} text="1 letra maiúscula" />
              <PasswordRequirement met={passwordValidation.hasNumber} text="1 número" />
              <PasswordRequirement met={passwordValidation.hasSpecial} text="1 carácter especial (!@#$%^&*...)" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="relative"
          >
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmar Password *"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-10 pr-10 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formData.confirmPassword && (
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full ml-2">
                {passwordsMatch ? (
                  <Check size={20} className="text-green-600" />
                ) : (
                  <X size={20} className="text-red-600" />
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 }}
            className="relative"
          >
            <textarea
              name="bio"
              placeholder="Sobre mim (opcional)"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!isPasswordValid || !passwordsMatch}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-green-200/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
          >
            Criar Conta
            <ArrowRight size={18} />
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-4 border-t border-stone-100"
        >
          <p className="text-sm text-stone-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-medium transition-colors">
              Entrar
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-xs"
    >
      {met ? (
        <Check size={14} className="text-green-600 flex-shrink-0" />
      ) : (
        <X size={14} className="text-stone-400 flex-shrink-0" />
      )}
      <span className={met ? "text-green-700" : "text-stone-500"}>{text}</span>
    </motion.div>
  );
}
