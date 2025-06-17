
import React, { useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Thermometer, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ClimateAnalysis = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Dados simulados para demonstração
  const forecastData = [
    { day: 'Hoje', temp: 28, humidity: 65, rain: 0 },
    { day: 'Amanhã', temp: 30, humidity: 70, rain: 5 },
    { day: 'Quinta', temp: 25, humidity: 80, rain: 15 },
    { day: 'Sexta', temp: 22, humidity: 85, rain: 20 },
    { day: 'Sábado', temp: 26, humidity: 75, rain: 10 },
    { day: 'Domingo', temp: 29, humidity: 60, rain: 0 },
    { day: 'Segunda', temp: 31, humidity: 55, rain: 0 }
  ];

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;

    setLoading(true);
    
    // Simular chamada de API
    setTimeout(() => {
      setWeatherData({
        location: selectedLocation,
        current: {
          temperature: 28,
          humidity: 65,
          windSpeed: 12,
          condition: 'Parcialmente nublado'
        },
        alerts: [
          {
            type: 'warning',
            title: 'Alerta de Chuva',
            message: 'Previsão de chuvas intensas nos próximos 3 dias',
            recommendation: 'Considere proteção das culturas expostas'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Análise Climática Preditiva</h1>
      </div>

      {/* Formulário de Localização */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecionar Localização</h3>
        
        <form onSubmit={handleLocationSubmit} className="flex gap-4">
          <input
            type="text"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            placeholder="Digite o nome da cidade ou coordenadas"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Carregando...' : 'Analisar'}
          </button>
        </form>
      </div>

      {!weatherData ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Cloud className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Análise Climática com IA</h3>
          <p className="text-gray-600 mb-4">
            Digite uma localização para receber previsões climáticas detalhadas e recomendações personalizadas para sua propriedade.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Condições Atuais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <Thermometer className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{weatherData.current.temperature}°C</div>
              <div className="text-sm text-gray-600">Temperatura</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{weatherData.current.humidity}%</div>
              <div className="text-sm text-gray-600">Umidade</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <Wind className="w-8 h-8 text-gray-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{weatherData.current.windSpeed} km/h</div>
              <div className="text-sm text-gray-600">Vento</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-lg font-bold text-gray-900">{weatherData.current.condition}</div>
              <div className="text-sm text-gray-600">Condição</div>
            </div>
          </div>

          {/* Previsão de 7 Dias */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Previsão para 7 Dias</h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="temp" orientation="left" />
                  <YAxis yAxisId="rain" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="temp"
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#EF4444" 
                    strokeWidth={2} 
                    name="Temperatura (°C)" 
                  />
                  <Line 
                    yAxisId="temp"
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    name="Umidade (%)" 
                  />
                  <Line 
                    yAxisId="rain"
                    type="monotone" 
                    dataKey="rain" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    name="Chuva (mm)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alertas e Recomendações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas Climáticos</h3>
              
              <div className="space-y-3">
                {weatherData.alerts.map((alert: any, index: number) => (
                  <div key={index} className="p-3 bg-yellow-50 border-l-4 border-l-yellow-400 rounded-r-lg">
                    <div className="font-medium text-yellow-800">{alert.title}</div>
                    <div className="text-sm text-yellow-700">{alert.message}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações IA</h3>
              
              <div className="space-y-3">
                {weatherData.alerts.map((alert: any, index: number) => (
                  <div key={index} className="p-3 bg-green-50 border-l-4 border-l-green-400 rounded-r-lg">
                    <div className="font-medium text-green-800">Ação Recomendada</div>
                    <div className="text-sm text-green-700">{alert.recommendation}</div>
                  </div>
                ))}
                
                <div className="p-3 bg-blue-50 border-l-4 border-l-blue-400 rounded-r-lg">
                  <div className="font-medium text-blue-800">Irrigação</div>
                  <div className="text-sm text-blue-700">
                    Com base na previsão de chuva, reduza a irrigação nos próximos 3 dias
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 border-l-4 border-l-purple-400 rounded-r-lg">
                  <div className="font-medium text-purple-800">Aplicação de Defensivos</div>
                  <div className="text-sm text-purple-700">
                    Janela ideal para aplicação: hoje até às 16h, antes da frente fria
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClimateAnalysis;
