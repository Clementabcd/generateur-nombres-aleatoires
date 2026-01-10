import React, { useState, useEffect } from 'react';
import { Shuffle, Sparkles, Lock, Copy, Check, Code, Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';

// Fonction de génération ultra-aléatoire (partagée)
const generateUltraRandomNumber = async (digits, setSteps = null) => {
  const stepsList = [];
  
  const timestamp = performance.now();
  stepsList.push(`🕐 Timestamp: ${timestamp}`);
  
  const mouseEntropy = Math.random() * timestamp;
  stepsList.push(`🖱️ Entropie souris: ${mouseEntropy}`);
  
  const cryptoArray = new Uint32Array(3);
  crypto.getRandomValues(cryptoArray);
  const cryptoEntropy = Array.from(cryptoArray).reduce((a, b) => a + b, 0);
  stepsList.push(`🔐 Crypto API: ${cryptoEntropy}`);
  
  let mathEntropy = 0;
  for (let i = 0; i < 10; i++) {
    mathEntropy += Math.random() * Math.pow(10, i);
  }
  stepsList.push(`🎲 Math entropy: ${mathEntropy}`);
  
  const now = new Date();
  const dateEntropy = now.getTime() + now.getMilliseconds() * now.getSeconds();
  stepsList.push(`📅 Date entropy: ${dateEntropy}`);
  
  let seed = (timestamp * mouseEntropy + cryptoEntropy) / (mathEntropy + dateEntropy);
  stepsList.push(`🧮 Seed initial: ${seed}`);
  
  seed = (seed * 9301 + 49297) % 233280;
  stepsList.push(`#️⃣ Hash 1: ${seed}`);
  
  seed = seed ^ Date.now();
  stepsList.push(`⚡ XOR timestamp: ${seed}`);
  
  const a = 16807;
  const m = 2147483647;
  seed = (a * seed) % m;
  stepsList.push(`🔢 Lehmer: ${seed}`);
  
  for (let i = 0; i < 5; i++) {
    seed = ((seed << 13) ^ seed) >>> 0;
    seed = ((seed >> 17) ^ seed) >>> 0;
    seed = ((seed << 5) ^ seed) >>> 0;
  }
  stepsList.push(`🔄 Rotations binaires: ${seed}`);
  
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  let primeHash = seed;
  primes.forEach((p, i) => {
    primeHash = (primeHash * p + i) % 999999999;
  });
  stepsList.push(`🔢 Prime hash: ${primeHash}`);
  
  const finalCrypto = new Uint32Array(1);
  crypto.getRandomValues(finalCrypto);
  const finalSeed = (primeHash + finalCrypto[0]) % Number.MAX_SAFE_INTEGER;
  stepsList.push(`🎯 Seed final: ${finalSeed}`);
  
  let finalNumber = '';
  let currentSeed = finalSeed;
  
  for (let i = 0; i < digits; i++) {
    const cryptoDigit = new Uint8Array(1);
    crypto.getRandomValues(cryptoDigit);
    
    currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
    const mathDigit = Math.floor((currentSeed / 2147483648) * 10);
    const cryptoMod = cryptoDigit[0] % 10;
    
    const digit = (mathDigit + cryptoMod) % 10;
    finalNumber += digit;
    stepsList.push(`✨ Génération chiffre ${i + 1}: ${digit}`);
    
    if (setSteps) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setSteps([...stepsList]);
    }
  }
  
  stepsList.push(`✅ Nombre final: ${finalNumber}`);
  if (setSteps) {
    setSteps(stepsList);
  }
  
  return finalNumber;
};

// Composant principal UI
const UltraRandomGenerator = () => {
  const [digits, setDigits] = useState(6);
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [steps, setSteps] = useState([]);
  const [showSteps, setShowSteps] = useState(false);

  // Détecter le thème système
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeQuery.matches);

    const handler = (e) => setIsDark(e.matches);
    darkModeQuery.addEventListener('change', handler);
    return () => darkModeQuery.removeEventListener('change', handler);
  }, []);

  // Vérifier si on est sur /api
  useEffect(() => {
    if (window.location.pathname === '/api') {
      handleApiRequest();
    }
  }, []);

  const handleApiRequest = async () => {
    const params = new URLSearchParams(window.location.search);
    const apiDigits = parseInt(params.get('nmb')) || 6;
    
    if (apiDigits < 1 || apiDigits > 50) {
      document.body.innerHTML = `<pre style="font-family: monospace; padding: 20px; background: #1a1a1a; color: white; margin: 20px;">${JSON.stringify({
        error: "Le paramètre 'nmb' doit être entre 1 et 50",
        code: 400
      }, null, 2)}</pre>`;
      return;
    }
    
    const number = await generateUltraRandomNumber(apiDigits);
    const response = {
      success: true,
      number: number,
      digits: apiDigits,
      timestamp: new Date().toISOString()
    };
    
    document.body.innerHTML = `<pre style="font-family: monospace; padding: 20px; background: #1a1a1a; color: white; margin: 20px;">${JSON.stringify(response, null, 2)}</pre>`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCopied(false);
    setResult('');
    setSteps([]);
    
    const finalNumber = await generateUltraRandomNumber(digits, setSteps);
    
    // Animation du résultat
    for (let i = 0; i < finalNumber.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setResult(finalNumber.substring(0, i + 1));
    }
    
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950' 
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
  
  const cardClass = isDark
    ? 'bg-gray-800/90 border-gray-700'
    : 'bg-white/90 border-gray-200';
    
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = isDark ? 'text-gray-300' : 'text-gray-600';
  const buttonClass = isDark
    ? 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800'
    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700';

  return (
    <div className={`min-h-screen ${bgClass} p-8 transition-colors duration-300 relative`}>
      {/* Bouton de thème (coin supérieur droit, discret) */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-2 rounded-full ${
          isDark ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-white/50 hover:bg-white/70'
        } backdrop-blur-sm transition-all duration-200 opacity-40 hover:opacity-100 z-50`}
        title="Changer de thème"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className={`w-10 h-10 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <h1 className={`text-5xl font-bold ${textClass}`}>
              Générateur Ultra-Aléatoire
            </h1>
            <Sparkles className={`w-10 h-10 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
          </div>
          <p className={`${textSecondaryClass} text-lg`}>
            Algorithme multi-couches avec 13+ étapes de génération d'entropie
          </p>
        </div>

        {/* Main Card */}
        <div className={`${cardClass} backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border-2`}>
          {/* Controls */}
          <div className="mb-8">
            <label className={`block ${textClass} text-lg font-semibold mb-3`}>
              Nombre de chiffres: {digits}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={digits}
              onChange={(e) => setDigits(parseInt(e.target.value))}
              className={`w-full h-3 rounded-lg appearance-none cursor-pointer ${
                isDark ? 'bg-gray-700 accent-blue-500' : 'bg-gray-300 accent-purple-500'
              }`}
              disabled={isGenerating}
            />
            <div className={`flex justify-between ${textSecondaryClass} text-sm mt-2`}>
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full ${buttonClass} text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 text-xl`}
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
            <div className={`mt-8 ${
              isDark 
                ? 'bg-green-900/30 border-green-500/50' 
                : 'bg-green-50 border-green-400'
            } backdrop-blur rounded-2xl p-8 border-2`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Lock className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <h2 className={`text-2xl font-bold ${textClass}`}>Résultat</h2>
              </div>
              <div className="text-center">
                <div className={`text-6xl font-mono font-bold ${textClass} tracking-wider mb-4 break-all`}>
                  {result}
                </div>
                <p className={`${isDark ? 'text-green-300' : 'text-green-600'} text-sm mb-4`}>
                  {result.length} chiffres générés
                </p>
                <button
                  onClick={handleCopy}
                  className={`${
                    copied
                      ? isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                      : isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copier le nombre
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Toggle Steps (bouton discret) */}
          {steps.length > 0 && (
            <button
              onClick={() => setShowSteps(!showSteps)}
              className={`w-full mt-6 ${
                isDark ? 'bg-gray-700/50 hover:bg-gray-700/70' : 'bg-gray-100 hover:bg-gray-200'
              } ${textSecondaryClass} py-2 px-4 rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-2 opacity-60 hover:opacity-100`}
            >
              {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showSteps ? 'Masquer' : 'Afficher'} les étapes de génération ({steps.length})
            </button>
          )}

          {/* Steps Display */}
          {showSteps && steps.length > 0 && (
            <div className={`mt-4 ${
              isDark ? 'bg-gray-900/50' : 'bg-gray-50'
            } backdrop-blur rounded-2xl p-6 border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            } max-h-96 overflow-y-auto`}>
              <h3 className={`text-lg font-bold ${textClass} mb-4 flex items-center gap-2`}>
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                Processus de génération
              </h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`${textSecondaryClass} font-mono text-xs ${
                      isDark ? 'bg-gray-800/50' : 'bg-white/50'
                    } p-3 rounded-lg`}
                  >
                    <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'} font-bold`}>
                      #{index + 1}
                    </span> {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* API Documentation */}
        <div className={`${cardClass} backdrop-blur rounded-2xl p-6 border-2 mb-8`}>
          <div className="flex items-center gap-3 mb-4">
            <Code className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-xl font-bold ${textClass}`}>Documentation API</h3>
          </div>
          <div className={`${textSecondaryClass} space-y-3`}>
            <p>Utilisez l'API pour générer des nombres aléatoires dans vos applications :</p>
            <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg font-mono text-sm overflow-x-auto`}>
              <div className="mb-2">
                <span className={isDark ? 'text-green-400' : 'text-green-600'}>GET</span> /api
              </div>
              <div className="mb-2">
                <span className={isDark ? 'text-green-400' : 'text-green-600'}>GET</span> /api?nmb=10
              </div>
            </div>
            <p className="text-sm">
              <strong>Paramètre :</strong> <code className={`${isDark ? 'bg-gray-700' : 'bg-gray-200'} px-2 py-1 rounded`}>nmb</code> - Nombre de chiffres (1-50, défaut: 6)
            </p>
            <p className="text-sm">
              <strong>Réponse JSON :</strong>
            </p>
            <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg font-mono text-xs overflow-x-auto`}>
              {`{
  "success": true,
  "number": "847291",
  "digits": 6,
  "timestamp": "2026-01-10T..."
}`}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`${cardClass} backdrop-blur rounded-2xl p-6 border-2`}>
            <div className="text-4xl mb-3">🔐</div>
            <h3 className={`${textClass} font-bold text-lg mb-2`}>Crypto API</h3>
            <p className={`${textSecondaryClass} text-sm`}>
              Utilise l'API cryptographique du navigateur pour une vraie entropie
            </p>
          </div>
          <div className={`${cardClass} backdrop-blur rounded-2xl p-6 border-2`}>
            <div className="text-4xl mb-3">🧮</div>
            <h3 className={`${textClass} font-bold text-lg mb-2`}>13+ Étapes</h3>
            <p className={`${textSecondaryClass} text-sm`}>
              Algorithme multi-couches avec hachage, XOR, et rotations binaires
            </p>
          </div>
          <div className={`${cardClass} backdrop-blur rounded-2xl p-6 border-2`}>
            <div className="text-4xl mb-3">✨</div>
            <h3 className={`${textClass} font-bold text-lg mb-2`}>API REST</h3>
            <p className={`${textSecondaryClass} text-sm`}>
              Accédez à /api pour une intégration facile dans vos projets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltraRandomGenerator;
