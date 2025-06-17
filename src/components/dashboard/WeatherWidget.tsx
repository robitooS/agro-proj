
import React from 'react';

const WeatherWidget = () => {
  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-sm text-white p-6">
      <h3 className="text-lg font-semibold mb-4">Condições Climáticas</h3>
      
      <div className="text-center">
        <div className="text-4xl font-bold">28°C</div>
        <div className="text-blue-100 text-sm mt-1">Parcialmente Nublado</div>
      </div>
      
      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-blue-100">Umidade</span>
          <span className="font-medium">72%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-100">Vento</span>
          <span className="font-medium">15 km/h</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-100">Probabilidade de Chuva</span>
          <span className="font-medium">30%</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-300">
        <div className="text-xs text-blue-100">Previsão IA: Condições favoráveis para irrigação</div>
      </div>
    </div>
  );
};

export default WeatherWidget;
