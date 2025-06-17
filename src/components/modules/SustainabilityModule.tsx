
import React from 'react';
import { Leaf, Droplets, Zap, TrendingDown } from 'lucide-react';

const SustainabilityModule = () => {
  const sustainabilityData = {
    waterSaving: 25.6,
    energySaving: 18.2,
    carbonReduction: 12.4,
    wasteReduction: 30.1
  };

  const monthlyData = [
    { month: 'Jan', water: 120, energy: 85, carbon: 45 },
    { month: 'Fev', water: 110, energy: 80, carbon: 42 },
    { month: 'Mar', water: 105, energy: 75, carbon: 38 },
    { month: 'Abr', water: 95, energy: 70, carbon: 35 },
    { month: 'Mai', water: 88, energy: 65, carbon: 32 },
    { month: 'Jun', water: 82, energy: 58, carbon: 28 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Sustentabilidade e Economia de Recursos</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Gerar Relatório
        </button>
      </div>
      
      {/* Cards de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Economia de Água</p>
              <p className="text-2xl font-bold text-blue-600">{sustainabilityData.waterSaving}%</p>
              <p className="text-xs text-gray-500">vs período anterior</p>
            </div>
            <Droplets className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Economia de Energia</p>
              <p className="text-2xl font-bold text-yellow-600">{sustainabilityData.energySaving}%</p>
              <p className="text-xs text-gray-500">vs período anterior</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Redução de Carbono</p>
              <p className="text-2xl font-bold text-green-600">{sustainabilityData.carbonReduction}%</p>
              <p className="text-xs text-gray-500">vs período anterior</p>
            </div>
            <TrendingDown className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Redução de Resíduos</p>
              <p className="text-2xl font-bold text-purple-600">{sustainabilityData.wasteReduction}%</p>
              <p className="text-xs text-gray-500">vs período anterior</p>
            </div>
            <Leaf className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução da Economia de Água (L/mês)</h3>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.water / 120) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900 w-12">{data.water}L</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução da Economia de Energia (kWh/mês)</h3>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.energy / 85) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900 w-16">{data.energy}kWh</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Redução de Pegada de Carbono (toneladas CO2/mês)</h3>
        <div className="space-y-3">
          {monthlyData.map((data, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{data.month}</span>
              <div className="flex items-center space-x-2">
                <div className="w-48 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(data.carbon / 45) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-900 w-12">{data.carbon}t</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SustainabilityModule;
