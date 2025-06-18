import React, { useState } from 'react';
import { Cloud, Wind, Thermometer, Droplets, Layers } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Simulando a resposta da API para uma variável, como descrito no PDF da ClimAPI 
const mockApiCall = (variableName: string) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let values: number[] = [];
      if (variableName === 'tmax2m') values = [28, 30, 25, 22, 26, 29, 31];
      if (variableName === 'rh2m') values = [65, 70, 80, 85, 75, 60, 55];
      if (variableName === 'apcpsfc') values = [0, 2, 15, 20, 10, 0, 0];
      if (variableName === 'soill0_10cm') values = [0.25, 0.24, 0.35, 0.40, 0.32, 0.28, 0.22];
      
      const response = values.map((v, i) => ({ horas: (i + 1) * 24, valor: v }));
      resolve(response);
    }, 500 + Math.random() * 500);
  });
};

const ClimateAnalysis = () => {
  const [selectedLocation, setSelectedLocation] = useState('Ribeirão Preto');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [forecastData, setForecastData] = useState<any[]>([]);

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;

    setLoading(true);
    
    // Simula múltiplas chamadas, uma para cada variável, como faríamos com a ClimAPI
    const variablesToFetch = ['tmax2m', 'rh2m', 'apcpsfc', 'soill0_10cm'];
    const promises = variablesToFetch.map(v => mockApiCall(v));
    
    const [tempData, humidityData, rainData, soilData] = await Promise.all(promises);

    // Processa e combina os dados recebidos das várias "chamadas"
    const combinedData = (tempData as any[]).map((tempPoint, index) => ({
      day: ['Hoje', 'Amanhã', 'Quinta', 'Sexta', 'Sábado', 'Domingo', 'Segunda'][index],
      temp: tempPoint.valor,
      humidity: (humidityData as any[])[index].valor,
      rain: (rainData as any[])[index].valor,
      soil_moisture: ((soilData as any[])[index].valor * 100).toFixed(0), // Convertendo para %
    }));

    setForecastData(combinedData);

    setWeatherData({
      location: selectedLocation,
      current: {
        temperature: combinedData[0].temp,
        humidity: combinedData[0].humidity,
        windSpeed: 12, // Valor estático, pois não simulamos a chamada para vento
        condition: 'Parcialmente nublado'
      },
      soil: {
        moisture: combinedData[0].soil_moisture
      },
      alerts: [
        {
          type: 'warning',
          title: 'Alerta de Baixa Umidade do Solo',
          message: `Umidade do solo atingindo níveis baixos. Considere irrigação em 48h se não houver chuva.`,
        }
      ]
    });
    setLoading(false);
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
            placeholder="Digite Lat/Lon ou Cidade. Ex: -21.17, -47.81"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Análise Climática Detalhada</h3>
          <p className="text-gray-600 mb-4">
            Utilize dados da ClimAPI para receber previsões e insights para sua propriedade.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Condições Atuais - Adicionado Card de Umidade do Solo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <Thermometer className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{weatherData.current.temperature}°C</div>
              <div className="text-sm text-gray-600">Temperatura do Ar</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{weatherData.current.humidity}%</div>
              <div className="text-sm text-gray-600">Umidade do Ar</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <Layers className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{weatherData.soil.moisture}%</div>
              <div className="text-sm text-gray-600">Umidade do Solo (0-10cm)</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <Wind className="w-8 h-8 text-gray-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{weatherData.current.windSpeed} km/h</div>
              <div className="text-sm text-gray-600">Vento</div>
            </div>
          </div>

          {/* Previsão de 7 Dias com Gráfico Atualizado */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Previsão para 7 Dias</h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" orientation="left" unit="°C" />
                  <YAxis yAxisId="right" orientation="right" unit="mm" />
                  <Tooltip formatter={(value, name) => [`${value}${name === 'Chuva (mm)' ? 'mm' : '%'}`, name]} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#EF4444" strokeWidth={2} name="Temperatura" unit="°C" />
                  <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#3B82F6" strokeWidth={2} name="Umidade Ar" unit="%" />
                  <Line yAxisId="left" type="monotone" dataKey="soil_moisture" stroke="#F59E0B" strokeWidth={2} name="Umidade Solo" unit="%" />
                  <Line yAxisId="right" type="monotone" dataKey="rain" stroke="#10B981" strokeWidth={2} name="Chuva (mm)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alertas Climáticos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas e Insights</h3>
            <div className="space-y-3">
              {weatherData.alerts.map((alert: any, index: number) => (
                <div key={index} className="p-3 bg-yellow-50 border-l-4 border-l-yellow-400 rounded-r-lg">
                  <div className="font-medium text-yellow-800">{alert.title}</div>
                  <div className="text-sm text-yellow-700">{alert.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClimateAnalysis;