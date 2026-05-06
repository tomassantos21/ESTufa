import React, { useState, useCallback } from 'react';
import { useAzure } from '../context/AzureContext';
import { Upload, X, Loader2, Leaf, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';

export function Scan() {
  const { uploadImage, detectPlant, isLoading, user } = useAzure();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const processFile = async (file: File) => {
    setError(null);
    setResult(null);
    if (!file.type.startsWith('image/')) {
      setError('Por favor, carregue apenas arquivos de imagem.');
      return;
    }

    try {
      const imageUrl = await uploadImage(file);
      setSelectedImage(imageUrl);
    } catch (err) {
      setError('Erro ao carregar imagem. Tente novamente.');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    // Check if user is logged in
    if (!user) {
      // Allow guest scan but warn or redirect? Let's just allow it for demo but maybe warn.
      // Or auto-login as guest.
    }

    try {
      const plantResult = await detectPlant(selectedImage);
      setResult(plantResult);
    } catch (err) {
      setError('Falha na detecção. O serviço Azure pode estar indisponível.');
    }
  };

  const resetScan = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-serif text-green-900">Identificar Planta</h1>
        <p className="text-stone-500">Tire uma foto ou carregue uma imagem para descobrir a espécie.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white p-6 rounded-3xl shadow-lg border border-stone-100"
      >
        <AnimatePresence mode="wait">
          {!selectedImage ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center transition-colors ${
                isDragOver ? 'border-green-500 bg-green-50' : 'border-stone-300 hover:border-green-400 hover:bg-stone-50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3 w-full h-full justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="text-stone-700 font-medium">Clique para carregar</p>
                  <p className="text-stone-400 text-sm">ou arraste e solte aqui</p>
                </div>
              </label>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative rounded-2xl overflow-hidden aspect-video bg-black/5"
            >
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              {!isLoading && !result && (
                <button
                  onClick={resetScan}
                  className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-stone-600 shadow-sm backdrop-blur-sm"
                >
                  <X size={20} />
                </button>
              )}
              
              {isLoading && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  >
                    <Loader2 size={48} className="text-green-400" />
                  </motion.div>
                  <p className="mt-4 font-medium animate-pulse">Analisando com Azure AI...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Area */}
        <div className="mt-6 flex justify-center">
          {selectedImage && !result && !isLoading && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalyze}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-green-200/50 transition-all"
            >
              <Leaf size={20} />
              Identificar Espécie
            </motion.button>
          )}
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 border-t border-stone-100 pt-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-serif text-green-900">{result.plantName}</h2>
                      <p className="text-stone-500 italic">{result.scientificName}</p>
                    </div>
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-100">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                  
                  <p className="mt-4 text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">
                    {result.description}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => navigate('/')}
                      className="flex-1 border border-stone-300 text-stone-600 py-2.5 rounded-xl font-medium hover:bg-stone-50 transition-colors"
                    >
                      Ver no Feed
                    </button>
                    <button 
                      onClick={resetScan}
                      className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-md"
                    >
                      Nova Análise
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
