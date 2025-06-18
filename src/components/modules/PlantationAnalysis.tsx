import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

// Simula uma resposta da API SATVeg, que é uma série temporal
const mockSatVegApiCall = () => {
  return new Promise<any[]>(resolve => {
    setTimeout(() => {
      const series = [
        { date: '2024-01-15', ndvi: 0.21 },
        { date: '2024-02-01', ndvi: 0.35 },
        { date: '2024-02-17', ndvi: 0.55 },
        { date: '2024-03-04', ndvi: 0.78 }, // Pico de Vigor
        { date: '2024-03-20', ndvi: 0.85 }, // Pico de Vigor
        { date: '2024-04-05', ndvi: 0.72 }, // Início da senescência
        { date: '2024-04-21', ndvi: 0.54 },
        { date: '2024-05-07', ndvi: 0.31 }, // Ponto de colheita
      ];
      resolve(series);
    }, 1500);
  });
};

const PlantationAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string>('soja_safra_23_24');
  const [timeSeries, setTimeSeries] = useState<any[] | null>(null);

  // Simula as culturas cadastradas pelo usuário
  const userCrops = [
    { id: 'soja_safra_23_24', name: 'Soja 2023/24 - Talhão 04' },
    { id: 'milho_safrinha_24', name: 'Milho Safrinha 2024 - Pivô Central' },
  ];

  const handleAnalysis = async () => {
    if (!selectedCrop) return;
    setLoading(true);
    setTimeSeries(null);

    // LINHA CORRIGIDA ABAIXO
    const result = await mockSatVegApiCall(); 
    setTimeSeries(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Monitoramento de Safra (SATVeg)</h1>

      {/* Parâmetros de Análise */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Série Temporal de NDVI</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Selecione a Cultura/Safra</label>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a safra para analisar" />
              </SelectTrigger>
              <SelectContent>
                {userCrops.map(crop => (
                  <SelectItem key={crop.id} value={crop.id}>{crop.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAnalysis} disabled={loading} className="bg-green-600 hover:bg-green-700 w-full">
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Analisando...' : 'Analisar Histórico'}
          </Button>
        </div>
      </div>

      {!timeSeries && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <LineChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acompanhe a Evolução da Lavoura</h3>
          <p className="text-gray-600 mb-4">
            Selecione uma safra para visualizar a curva de desenvolvimento da vegetação (NDVI) ao longo do tempo.
          </p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p>Buscando e processando série temporal de imagens de satélite... um momento.</p>
        </div>
      )}

      {timeSeries && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Curva de Saúde da Lavoura (NDVI) - {userCrops.find(c=>c.id === selectedCrop)?.name}</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeries} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ndvi" stroke="#10B981" strokeWidth={3} name="Índice de Vigor (NDVI)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-3 bg-blue-50 border-l-4 border-l-blue-400 rounded-r-lg">
                    <div className="font-medium text-blue-800">Diagnóstico da Curva</div>
                    <div className="text-sm text-blue-700">O pico de vigor (NDVI 0.85) foi atingido em 20/03, o que é excelente para o estágio de enchimento de grãos.</div>
                </div>
                 <div className="p-3 bg-green-50 border-l-4 border-l-green-400 rounded-r-lg">
                    <div className="font-medium text-green-800">Recomendação IA</div>
                    <div className="text-sm text-green-700">A senescência (queda do NDVI) está ocorrendo dentro do esperado. Planejar a aplicação de dessecante para a primeira semana de Maio.</div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PlantationAnalysis;