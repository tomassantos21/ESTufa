import React, { useState } from 'react';
import { useAzure } from '../context/AzureContext';
import { Login } from './Login';
import { LogOut, User as UserIcon, Settings, Calendar, AtSign, Mail, MapPin } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileEditor } from '../components/ProfileEditor';

export function Profile() {
  const { user, logout, feed } = useAzure();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return <Login />;
  }

  const userPosts = feed.filter(post => post.userId === user.id || post.username === user.username);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <AnimatePresence>
        {isEditing && (
          <ProfileEditor onClose={() => setIsEditing(false)} />
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden"
      >
        {/* Cover Image Placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="h-32 bg-gradient-to-r from-green-50 to-green-100 relative"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        </motion.div>

        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar & Action Button Row */}
          <div className="flex justify-between items-end -mt-12 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-white p-1 rounded-full shadow-md"
            >
              <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center text-green-700 overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={40} />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 px-4 py-2 rounded-xl transition-all text-sm font-medium shadow-sm"
              >
                <Settings size={16} />
                Editar Perfil
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-xl transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                Sair
              </motion.button>
            </motion.div>
          </div>

          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div>
              <h1 className="text-2xl font-serif font-bold text-stone-900">{user.fullName || user.username}</h1>
              <p className="text-stone-500 font-medium">@{user.username}</p>
            </div>

            {user.bio && (
              <p className="text-stone-600 max-w-2xl leading-relaxed">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-stone-400 pt-2">
              {user.email && (
                <div className="flex items-center gap-1.5">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>Membro desde {new Date().getFullYear()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                <span>Portugal</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 py-4 border-t border-stone-100 mt-4">
              <div className="text-center sm:text-left">
                <span className="block text-xl font-bold text-stone-900">{userPosts.length}</span>
                <span className="text-xs text-stone-500 uppercase tracking-wide">Descobertas</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block text-xl font-bold text-stone-900">0</span>
                <span className="text-xs text-stone-500 uppercase tracking-wide">Seguidores</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block text-xl font-bold text-stone-900">0</span>
                <span className="text-xs text-stone-500 uppercase tracking-wide">Seguindo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Posts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-serif text-stone-800 mb-6 flex items-center gap-2">
          <span className="bg-green-100 text-green-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
            {userPosts.length}
          </span>
          Minhas Coleções
        </h2>
        
        {userPosts.length > 0 ? (
          <div className="relative">
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
              <Masonry gutter="1.5rem">
                {userPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 group hover:shadow-md transition-all"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.plantName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                      <p className="text-white font-medium">{post.plantName}</p>
                      <p className="text-white/80 text-xs italic">{post.scientificName}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-stone-400">{new Date(post.timestamp).toLocaleDateString()}</span>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {Math.round(post.confidence * 100)}% Confiança
                      </span>
                    </div>
                  </div>
                </motion.div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        ) : (
          <div className="text-center py-16 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
              <Calendar size={32} />
            </div>
            <h3 className="text-lg font-medium text-stone-900">Ainda sem descobertas</h3>
            <p className="text-stone-500 max-w-sm mx-auto mt-2">
              Comece a identificar plantas para construir a sua coleção digital.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
