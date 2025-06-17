
import React from 'react';
import { Calendar, MapPin, Database, FolderCheck } from 'lucide-react';

const RecentActivities = () => {
  const activities = [
    {
      type: 'plantation',
      title: 'Plantio realizado no Talhão 12',
      description: 'Soja BRS 1010 - 45 hectares',
      timestamp: '08:30 - Hoje',
      icon: FolderCheck,
      color: 'text-green-600'
    },
    {
      type: 'analysis',
      title: 'Análise climática atualizada',
      description: 'Previsão para os próximos 14 dias disponível',
      timestamp: '07:15 - Hoje',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      type: 'inventory',
      title: 'Recebimento de insumos',
      description: 'Fertilizante NPK 10-10-10 - 2.500 kg',
      timestamp: '16:45 - Ontem',
      icon: Database,
      color: 'text-purple-600'
    },
    {
      type: 'maintenance',
      title: 'Manutenção preventiva realizada',
      description: 'Trator John Deere 6120 - Troca de óleo',
      timestamp: '14:20 - Ontem',
      icon: MapPin,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Atividades Recentes</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-2">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-sm text-green-600 hover:text-green-700 font-medium">
        Ver histórico completo
      </button>
    </div>
  );
};

export default RecentActivities;
