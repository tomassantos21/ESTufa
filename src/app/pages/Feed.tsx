import React, { useMemo } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useAzure } from '../context/AzureContext';
import { User, Heart, Sparkles, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export function Feed() {
  const { feed } = useAzure();

  // Sort feed by timestamp (newest first)
  const sortedFeed = useMemo(() => {
    return [...feed].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [feed]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-serif text-stone-800">Últimas Descobertas</h1>
          <p className="text-stone-500 text-sm">Plantas identificadas pela comunidade</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-colors"
        >
          <Filter size={14} />
          Filtrar
        </motion.button>
      </motion.div>

      <div className="relative">
        <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
          <Masonry gutter="1.5rem">
            {sortedFeed.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                <img 
                  src={post.imageUrl} 
                  alt={post.plantName} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-green-800 shadow-sm flex items-center gap-1">
                  <Sparkles size={12} className="text-green-600" />
                  {Math.round(post.confidence * 100)}% Confiança
                </div>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-serif text-lg text-stone-900 leading-tight">{post.plantName}</h3>
                  <p className="text-xs text-stone-500 italic font-medium">{post.scientificName}</p>
                </div>
                
                <p className="text-sm text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                  {post.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-medium text-stone-600">{post.username}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-stone-400">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </span>
                    <button className="text-stone-400 hover:text-red-500 transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
      </div>
    </div>
  );
}
