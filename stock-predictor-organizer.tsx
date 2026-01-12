import React, { useState } from 'react';
import { TrendingUp, RefreshCw, Star, AlertCircle, BarChart2 } from 'lucide-react';

const StockOrganizer = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topCount, setTopCount] = useState(10);
  const [timeframe, setTimeframe] = useState('1month');

  const stockPool = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'V', 'JNJ',
    'WMT', 'JPM', 'MA', 'PG', 'UNH', 'HD', 'DIS', 'BAC', 'COST', 'NFLX',
    'ADBE', 'CRM', 'PFE', 'KO', 'INTC', 'CSCO', 'PEP', 'TMO', 'ABT', 'NKE',
    'CVX', 'MRK', 'LLY', 'ORCL', 'AMD', 'AVGO', 'QCOM', 'TXN', 'UNP', 'HON'
  ];

  const calculatePrediction = (timeframe) => {
    const currentPrice = Math.random() * 400 + 50;
    const volatility = Math.random() * 25 + 5;
    
    // Time multiplier - longer = more potential growth but less accuracy
    const timeMultipliers = {
      '1month': { growth: 0.8, accuracy: 0.95 },
      '3months': { growth: 1.2, accuracy: 0.85 },
      '6months': { growth: 1.5, accuracy: 0.75 },
      '1year': { growth: 2.0, accuracy: 0.65 }
    };
    
    const multiplier = timeMultipliers[timeframe];
    
    // Generate predicted growth
    const baseGrowth = (Math.random() - 0.2) * 15 * multiplier.growth;
    const predictedPrice = currentPrice * (1 + baseGrowth / 100);
    
    // Calculate confidence based on volatility and timeframe
    const volatilityPenalty = Math.min(volatility / 30, 0.3);
    const baseAccuracy = multiplier.accuracy;
    const accuracy = (baseAccuracy - volatilityPenalty) * 100;
    
    return {
      currentPrice: currentPrice.toFixed(2),
      predictedPrice: predictedPrice.toFixed(2),
      expectedGrowth: baseGrowth.toFixed(2),
      accuracy: Math.max(60, Math.min(95, accuracy)).toFixed(1),
      volatility: volatility.toFixed(1)
    };
  };

  const analyzeStocks = () => {
    setLoading(true);
    
    setTimeout(() => {
      const predictions = stockPool.map(symbol => {
        const prediction = calculatePrediction(timeframe);
        
        return {
          symbol,
          ...prediction,
          score: parseFloat(prediction.expectedGrowth) * (parseFloat(prediction.accuracy) / 100)
        };
      });
      
      // Sort by score (growth weighted by accuracy) and filter positive growth
      const topStocks = predictions
        .filter(s => parseFloat(s.expectedGrowth) > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topCount);
      
      setStocks(topStocks);
      setLoading(false);
    }, 1500);
  };

  const getAccuracyColor = (accuracy) => {
    const acc = parseFloat(accuracy);
    if (acc >= 85) return 'text-green-400';
    if (acc >= 75) return 'text-blue-400';
    if (acc >= 65) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getGrowthColor = (growth) => {
    const g = parseFloat(growth);
    if (g >= 10) return 'text-green-400';
    if (g >= 5) return 'text-blue-400';
    return 'text-cyan-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <BarChart2 className="text-blue-400" size={40} />
                Predictive Stock Organizer
              </h1>
              <p className="text-blue-200">Find the best stocks projected to grow</p>
            </div>
            <TrendingUp className="text-green-400" size={48} />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white mb-2 font-semibold">Number of Stocks</label>
              <select 
                value={topCount}
                onChange={(e) => setTopCount(parseInt(e.target.value))}
                className="w-full bg-white/20 text-white rounded-lg px-4 py-3 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={5}>Top 5 Stocks</option>
                <option value={10}>Top 10 Stocks</option>
                <option value={15}>Top 15 Stocks</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-semibold">Time Horizon</label>
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-white/20 text-white rounded-lg px-4 py-3 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="1month">1 Month</option>
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={analyzeStocks}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={20} />
                {loading ? 'Analyzing...' : 'Find Top Stocks'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {stocks.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="text-yellow-400" />
              Top {topCount} Stocks for {timeframe === '1month' ? '1 Month' : timeframe === '3months' ? '3 Months' : timeframe === '6months' ? '6 Months' : '1 Year'}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-blue-300 font-semibold py-3 px-4 text-left">Rank</th>
                    <th className="text-blue-300 font-semibold py-3 px-4 text-left">Symbol</th>
                    <th className="text-blue-300 font-semibold py-3 px-4 text-right">Current Price</th>
                    <th className="text-blue-300 font-semibold py-3 px-4 text-right">Predicted Price</th>
                    <th className="text-blue-300 font-semibold py-3 px-4 text-right">Expected Growth</th>
                    <th className="text-blue-300 font-semibold py-3 px-4 text-right">Prediction Accuracy</th>
                    <th className="text-blue-300 font-semibold py-3 px-4 text-right">Volatility</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock, index) => (
                    <tr 
                      key={stock.symbol}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {index < 3 && <Star className="text-yellow-400" size={16} fill="currentColor" />}
                          <span className={`font-bold ${index < 3 ? 'text-yellow-400' : 'text-white'}`}>
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-bold text-lg">{stock.symbol}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-white font-mono">${stock.currentPrice}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-cyan-400 font-mono font-bold">${stock.predictedPrice}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-bold text-lg ${getGrowthColor(stock.expectedGrowth)}`}>
                          +{stock.expectedGrowth}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 bg-white/20 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                parseFloat(stock.accuracy) >= 85 ? 'bg-green-500' :
                                parseFloat(stock.accuracy) >= 75 ? 'bg-blue-500' :
                                parseFloat(stock.accuracy) >= 65 ? 'bg-yellow-500' : 'bg-orange-500'
                              }`}
                              style={{width: `${parseFloat(stock.accuracy)}%`}}
                            />
                          </div>
                          <span className={`font-bold ${getAccuracyColor(stock.accuracy)}`}>
                            {stock.accuracy}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-orange-400 font-semibold">{stock.volatility}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-300 mt-1" size={20} />
                <div className="text-white text-sm">
                  <p className="font-semibold mb-2">How Predictions Work:</p>
                  <ul className="space-y-1 text-white/80">
                    <li>• <strong>Expected Growth</strong>: Projected price increase over selected timeframe</li>
                    <li>• <strong>Prediction Accuracy</strong>: Confidence level based on volatility and timeframe</li>
                    <li>• <strong>Longer timeframes</strong> have higher growth potential but lower accuracy</li>
                    <li>• <strong>Volatility</strong>: Higher volatility = less predictable stock behavior</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {stocks.length === 0 && !loading && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-12 border border-white/20 text-center">
            <BarChart2 size={64} className="mx-auto mb-4 text-white/50" />
            <p className="text-white text-xl mb-2">Select your preferences and click "Find Top Stocks"</p>
            <p className="text-white/60">We'll analyze and rank the best opportunities for you</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 text-center">
          <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-xl p-4 inline-block">
            <p className="text-yellow-200 text-sm">
              ⚠️ <strong>Demo Tool</strong>: Uses simulated data for demonstration. Real trading requires actual market data and professional advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockOrganizer;