import React, { useState, useEffect } from 'react';
import { Shuffle, Sparkles, Lock, Copy, Check, Code } from 'lucide-react';

// Fonction de génération ultra-aléatoire (partagée)
const generateUltraRandomNumber = async (digits) => {
  const timestamp = performance.now();
  const mouseEntropy = Math.random() * timestamp;
  
  const cryptoArray = new Uint32Array(3);
  crypto.getRandomValues(cryptoArray);
  const cryptoEntropy = Array.from(cryptoArray).reduce((a, b) => a + b, 0);
  
  let mathEntropy = 0;
  for (let i = 0; i < 10; i++) {
    mathEntropy += Math.random() * Math.pow(10, i);
  }
  
  const now = new Date();
  const dateEntropy = now.getTime() + now.getMilliseconds() * now.getSeconds();
  
  let seed = (timestamp * mouseEntropy + cryptoEntropy) / (mathEntropy + dateEntropy);
  seed = (seed * 9301 + 49297) % 233280;
  seed = seed ^ Date.now();
  
  const a = 16807;
  const m = 2147483647;
  seed = (a * seed) % m;
  
  for (let i = 0; i < 5; i++) {
    seed = ((seed << 13) ^ seed) >>> 0;
    seed = ((seed >> 17) ^ seed) >>> 0;
    seed = ((seed << 5) ^ seed) >>> 0;
  }
  
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  let primeHash = seed;
  primes.forEach((p, i) => {
    primeHash = (primeHash * p + i) % 999999999;
  });
  
  const finalCrypto = new Uint32Array(1);
  crypto.getRandomValues(finalCrypto);
  const finalSeed = (primeHash + finalCrypto[0]) % Number.MAX_SAFE_INTEGER;
  
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
  }
  
  return finalNumber;
};

// Composant API
const ApiView = () => {
  const [apiResult, setApiResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleApiRequest = async () => {
      const params = new URLSearchParams(window.location.search);
      const digits = parseInt(params.get('nmb')) || 6;
      
      if (digits < 1 || digits > 50) {
        setApiResult({
          error: "Le paramètre 'nmb' doit être entre 1 et 50",
          code: 400
        });
        setLoading(false);
        return;
      }
      
      const number = await generateUltraRandomNumber(digits);
      setApiResult({
        success: true,
        number: number,
        digits: digits,
        timestamp: new Date().toISOString()
      });
      setLoading(false);
    };

    handleApiRequest();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Génération...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono p-4">
      <pre className="max-w-2xl mx-auto mt-20 bg-gray-800 p-6 rounded-lg overflow-auto">
        {JSON.stringify(apiResult, null, 2)}
      </pre>
    </div>
  );
};

// Composant principal UI
const UltraRandomGenerator = () => {
  const [digits, setDigits] = useState(6);
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Détecter le thème système
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeQuery.matches);

    const handler = (e) => setIsDark(e.matches);
    darkModeQuery.addEventListener('change', handler);
    return () => darkModeQuery.removeEventListener('change', handler);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCopied(false);
    setResult('');
    
    const finalNumber = await generateUltraRandomNumber(digits);
    
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
    <div className={`min-h-screen ${bgClass} p-8 transition-colors duration-300`}>
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

// Router simple
const App = () => {
  const isApiRoute = window.location.pathname === '/api';
  
  return isApiRoute ? <ApiView /> : <UltraRandomGenerator />;
};

export default App;
