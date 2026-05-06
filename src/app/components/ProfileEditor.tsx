import React, { useState } from 'react';
import { useAzure, User } from '../context/AzureContext';
import { Save, X, User as UserIcon, Mail, AtSign, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileEditorProps {
  onClose: () => void;
}

export function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { user, updateUser } = useAzure();
  
  // Local state for form fields
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="text-xl font-serif text-stone-800">Editar Perfil</h2>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto relative">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Avatar Section (Placeholder) */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-700 border-4 border-white shadow-sm">
                <UserIcon size={40} />
              </div>
              <button type="button" className="text-sm text-green-600 font-medium hover:text-green-700">
                Alterar Foto
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="fullName" className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <UserIcon size={14} className="text-stone-400" />
                  Nome Próprio
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="username" className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <AtSign size={14} className="text-stone-400" />
                  Nome de Utilizador
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  placeholder="username"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <Mail size={14} className="text-stone-400" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  placeholder="exemplo@email.com"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="bio" className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <FileText size={14} className="text-stone-400" />
                  Sobre Mim
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all resize-none"
                  placeholder="Conte um pouco sobre a sua paixão por plantas..."
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-stone-100 bg-stone-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="profile-form"
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Save size={18} />
            Guardar Alterações
          </button>
        </div>
      </motion.div>
    </div>
  );
}
