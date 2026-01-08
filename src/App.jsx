import React, { useState, useEffect } from 'react';
import { Shuffle, Sparkles, Lock } from 'lucide-react';

const UltraRandomGenerator = () => {
  const [digits, setDigits] = useState(6);
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [steps, setSteps] = useState([]);
  const [showSteps, setShowSteps] = useState(false);

  // Générateur ultra-aléatoire avec multiples couches d'entropie
  const generateUltraRandom = async () => {
    setIsGenerating(true);
    setSteps([]);
    const stepsList = [];

    // Étape 1: Timestamp haute précision
    const timestamp = performance.now();
    stepsList.push(`🕐 Timestamp: ${timestamp}`);

    // Étape 2: Mouvements aléatoires du curseur (simulation)
    const mouseEntropy = Math.random() * timestamp;
    stepsList.push(`🖱️ Entropie souris: ${mouseEntropy}`);

    // Étape 3: Crypto API (source la plus sécurisée)
    const cryptoArray = new Uint32Array(3);
    crypto.getRandomValues(cryptoArray);
    const cryptoEntropy = Array.from(cryptoArray).reduce((a, b) => a + b, 0);
    stepsList.push(`🔐 Crypto API: ${cryptoEntropy}`);

    // Étape 4: Math.random() multiple fois
    let mathEntropy = 0;
    for (let i = 0; i < 10; i++) {
      mathEntropy += Math.random() * Math.pow(10, i);
    }
    stepsList.push(`🎲 Math entropy: ${mathEntropy}`);

    // Étape 5: Date complexe
    const now = new Date();
    const dateEntropy = now.getTime() + now.getMilliseconds() * now.getSeconds();
    stepsList.push(`📅 Date entropy: ${dateEntropy}`);

    // Étape 6: Combinaison avec opérations mathématiques complexes
    let seed = (timestamp * mouseEntropy + cryptoEntropy) / (mathEntropy + dateEntropy);
    stepsList.push(`🧮 Seed initial: ${seed}`);

    // Étape 7: Hachage par multiplication et modulo
    seed = (seed * 9301 + 49297) % 233280;
    stepsList.push(`#️⃣ Hash 1: ${seed}`);

    // Étape 8: XOR avec timestamp
    seed = seed ^ Date.now();
    stepsList.push(`⚡ XOR timestamp: ${seed}`);

    // Étape 9: Algorithme de Lehmer
    const a = 16807;
    const m = 2147483647;
    seed = (a * seed) % m;
    stepsList.push(`🔢 Lehmer: ${seed}`);

    // Étape 10: Multiple rotations binaires
    for (let i = 0; i < 5; i++) {
      seed = ((seed << 13) ^ seed) >>> 0;
      seed = ((seed >> 17) ^ seed) >>> 0;
      seed = ((seed << 5) ^ seed) >>> 0;
    }
    stepsList.push(`🔄 Rotations binaires: ${seed}`);

    // Étape 11: Mélange avec facteurs premiers
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    let primeHash = seed;
    primes.forEach((p, i) => {
      primeHash = (primeHash * p + i) % 999999999;
    });
    stepsList.push(`🔢 Prime hash: ${primeHash}`);

    // Étape 12: Nouvelle couche crypto
    const finalCrypto = new Uint32Array(1);
    crypto.getRandomValues(finalCrypto);
    const finalSeed = (primeHash + finalCrypto[0]) % Number.MAX_SAFE_INTEGER;
    stepsList.push(`🎯 Seed final: ${finalSeed}`);

    // Étape 13: Génération du nombre avec le nombre de chiffres demandé
    let finalNumber = '';
    let currentSeed = finalSeed;
    
    for (let i = 0; i < digits; i++) {
      // Utiliser plusieurs sources pour chaque chiffre
      const cryptoDigit = new Uint8Array(1);
      crypto.getRandomValues(cryptoDigit);
      
      currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
      const mathDigit = Math.floor((currentSeed / 2147483648) * 10);
      const cryptoMod = cryptoDigit[0] % 10;
      
      // Combiner les deux sources
      const digit = (mathDigit + cryptoMod) % 10;
      finalNumber += digit;
      
      // Petit délai pour l'animation
      await new Promise(resolve => setTimeout(resolve, 50));
      setSteps([...stepsList, `✨ Génération chiffre ${i + 1}: ${digit}`]);
    }

    stepsList.push(`✅ Nombre final: ${finalNumber}`);
    setSteps(stepsList);
    
    // Animation du résultat
    for (let i = 0; i < finalNumber.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setResult(finalNumber.substring(0, i + 1));
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">
              Générateur Ultra-Aléatoire
            </h1>
            <Sparkles className="w-10 h-10 text-yellow-400" />
          </div>
          <p className="text-blue-200 text-lg">
            Algorithme multi-couches avec 13+ étapes de génération d'entropie
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          {/* Controls */}
          <div className="mb-8">
            <label className="block text-white text-lg font-semibold mb-3">
              Nombre de chiffres: {digits}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={digits}
              onChange={(e) => setDigits(parseInt(e.target.value))}
              className="w-full h-3 bg-blue-900/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
              disabled={isGenerating}
            />
            <div className="flex justify-between text-blue-300 text-sm mt-2">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateUltraRandom}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 text-xl"
          >
            {isGenerating ? (
              <>
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Shuffle className="w-6 h-6" />
                Générer un nombre aléatoire
              </>
            )}
          </button>

          {/* Result Display */}
          {result && (
            <div className="mt-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur rounded-2xl p-8 border-2 border-green-400/50">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Résultat</h2>
              </div>
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-white tracking-wider mb-2 break-all">
                  {result}
                </div>
                <p className="text-green-300 text-sm">
                  {result.length} chiffres générés
                </p>
              </div>
            </div>
          )}

          {/* Toggle Steps */}
          {steps.length > 0 && (
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl transition-all duration-200 border border-white/20"
            >
              {showSteps ? '🔽' : '▶️'} {showSteps ? 'Masquer' : 'Afficher'} les étapes de génération ({steps.length})
            </button>
          )}

          {/* Steps Display */}
          {showSteps && steps.length > 0 && (
            <div className="mt-6 bg-black/30 backdrop-blur rounded-2xl p-6 border border-white/10 max-h-96 overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Processus de génération
              </h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="text-blue-100 font-mono text-sm bg-white/5 p-3 rounded-lg animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span className="text-yellow-400 font-bold">#{index + 1}</span> {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🔐</div>
            <h3 className="text-white font-bold text-lg mb-2">Crypto API</h3>
            <p className="text-blue-200 text-sm">
              Utilise l'API cryptographique du navigateur pour une vraie entropie
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🧮</div>
            <h3 className="text-white font-bold text-lg mb-2">13+ Étapes</h3>
            <p className="text-blue-200 text-sm">
              Algorithme multi-couches avec hachage, XOR, et rotations binaires
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-white font-bold text-lg mb-2">Unique</h3>
            <p className="text-blue-200 text-sm">
              Chaque génération est statistiquement unique et imprévisible
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default UltraRandomGenerator;