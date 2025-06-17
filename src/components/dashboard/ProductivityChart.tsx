
import React from 'react';

const ProductivityChart = () => {
  const monthlyData = [
    { month: 'Jan', productivity: 45 },
    { month: 'Fev', productivity: 52 },
    { month: 'Mar', productivity: 48 },
    { month: 'Abr', productivity: 61 },
    { month: 'Mai', productivity: 55 },
    { month: 'Jun', productivity: 58 }
  ];

  const maxProductivity = Math.max(...monthlyData.map(d => d.productivity));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Produtividade por Mês (sc/ha)</h3>
      
      <div className="flex items-end space-x-3 h-40">
        {monthlyData.map((data, index) => {
          const height = (data.productivity / maxProductivity) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-md transition-all duration-500 hover:from-green-600 hover:to-green-500"
                style={{ height: `${height}%` }}
              ></div>
              <div className="text-xs text-gray-600 mt-2 font-medium">{data.month}</div>
              <div className="text-xs text-gray-500">{data.productivity}</div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-700">
          <span className="font-medium">Tendência:</span> Crescimento de 8% em relação ao período anterior
        </p>
      </div>
    </div>
  );
};

export default ProductivityChart;
