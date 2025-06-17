
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const AlertsPanel = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      checkLowStock();
    }
  }, [user]);

  const checkLowStock = async () => {
    try {
      const { data: inventory } = await supabase
        .from('inventory')
        .select('*')
        .lt('quantity', supabase.raw('min_stock'));

      const lowStockAlerts = inventory?.map(item => ({
        type: 'warning',
        title: 'Alerta de Estoque Baixo',
        message: `${item.name} está com estoque baixo (${item.quantity} ${item.unit})`,
        time: 'Agora',
        priority: 'alta'
      })) || [];

      if (lowStockAlerts.length === 0) {
        setAlerts([{
          type: 'info',
          title: 'Sistema Atualizado',
          message: 'Todos os estoques estão em níveis adequados.',
          time: 'Agora',
          priority: 'baixa'
        }]);
      } else {
        setAlerts(lowStockAlerts);
      }
    } catch (error) {
      console.error('Erro ao verificar estoque baixo:', error);
      setAlerts([{
        type: 'info',
        title: 'Sistema Pronto',
        message: 'AgroFácil está pronto para uso.',
        time: 'Agora',
        priority: 'baixa'
      }]);
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-400 bg-yellow-50';
      case 'info': return 'border-l-blue-400 bg-blue-50';
      case 'success': return 'border-l-green-400 bg-green-50';
      default: return 'border-l-gray-400 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'média': return 'text-yellow-600 bg-yellow-100';
      case 'baixa': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Alertas e Notificações</h3>
      
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className={`border-l-4 p-4 rounded-r-lg ${getAlertColor(alert.type)}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
