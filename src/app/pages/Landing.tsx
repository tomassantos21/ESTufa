import React, { useRef } from 'react';
import { NavLink } from 'react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Leaf, Search, User, ShieldCheck } from 'lucide-react';
import { useAzure } from '../context/AzureContext';

export function Landing() {
  const { user } = useAzure();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="relative bg-stone-50">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] flex items-start justify-center overflow-hidden pt-24" style={{ position: 'relative' }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-50 z-10" />
          <motion.img 
            style={{ y }}
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop" 
            alt="Greenhouse background" 
            className="w-full h-full object-cover scale-110 origin-bottom"
          />
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center text-white space-y-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-sm font-medium text-green-100 mb-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Versão Beta Disponível
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-tight">
              Descubra a Natureza <br />
              <span className="text-green-300 italic">Uma Planta de Cada Vez</span>
            </h1>
            
            <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed">
              A <span className="font-bold text-white">ESTufa</span> utiliza inteligência artificial avançada para identificar espécies de plantas instantaneamente.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1"
          >
            <NavLink
              to={user ? "/scan" : "/login"}
              className="group relative px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-green-500/30 flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Começar Agora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
            
            <NavLink
              to="/feed"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full font-bold text-lg transition-all flex items-center gap-2"
            >
              Explorar Feed
            </NavLink>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-green-900 flex flex-col items-center gap-2 animate-bounce z-20"
        >
          <span className="text-xs uppercase tracking-widest">Descobrir Mais</span>
          <ArrowRight className="rotate-90" size={20} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-bold">Porquê usar a ESTufa?</h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-lg">
              Combinamos tecnologia de ponta com a simplicidade que os amantes da natureza apreciam.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Search className="w-8 h-8 text-green-600" />,
                title: "Identificação Precisa",
                desc: "A nossa IA analisa padrões de folhas, flores e caules para fornecer resultados com alta confiança científica."
              },
              {
                icon: <User className="w-8 h-8 text-green-600" />,
                title: "Comunidade Ativa",
                desc: "Partilhe as suas descobertas e veja o que outros entusiastas estão a encontrar na sua região."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
                title: "Privacidade Primeiro",
                desc: "Os seus dados são protegidos. Focamo-nos nas plantas, não nos seus dados pessoais."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:shadow-lg hover:border-green-100 transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">{feature.title}</h3>
                <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <Leaf className="w-16 h-16 mx-auto text-green-400" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold">Pronto para começar a sua coleção?</h2>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Junte-se hoje e transforme cada passeio numa expedição botânica. É grátis e fácil de usar.
          </p>
          <div className="pt-4">
            <NavLink
              to="/register"
              className="inline-block px-10 py-4 bg-white text-green-900 rounded-full font-bold text-lg hover:bg-stone-100 transition-colors shadow-2xl hover:shadow-white/20 transform hover:-translate-y-1"
            >
              Criar Conta Gratuitamente
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4 border-t border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center text-white">
              <Leaf size={16} />
            </div>
            <span className="font-bold text-xl text-stone-200">ESTufa</span>
          </div>
          
          <div className="flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Sobre</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>

          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} ESTufa Project. Powered by Azure.
          </p>
        </div>
      </footer>
    </div>
  );
}
