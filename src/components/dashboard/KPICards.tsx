
import React, { useState, useEffect } from 'react';
import { MapPin, Database, Calendar, FolderCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const KPICards = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState({
    totalArea: 0,
    avgProductivity: 0,
    activeCrops: 0,
    totalInventoryValue: 0
  });

  useEffect(() => {
    if (user) {
      fetchKPIData();
    }
  }, [user]);

  const fetchKPIData = async () => {
    try {
      // Buscar área total das propriedades
      const { data: properties } = await supabase
        .from('properties')
        .select('area');
      
      const totalArea = properties?.reduce((sum, prop) => sum + Number(prop.area), 0) || 0;

      // Buscar culturas ativas
      const { data: crops } = await supabase
        .from('crops')
        .select('*');
      
      const activeCrops = crops?.length || 0;

      // Buscar valor total do estoque
      const { data: inventory } = await supabase
        .from('inventory')
        .select('quantity, cost_per_unit');
      
      const totalInventoryValue = inventory?.reduce((sum, item) => 
        sum + (Number(item.quantity) * Number(item.cost_per_unit)), 0) || 0;

      setKpis({
        totalArea,
        avgProductivity: 0, // Calculado baseado em dados futuros
        activeCrops,
        totalInventoryValue
      });
    } catch (error) {
      console.error('Erro ao buscar dados dos KPIs:', error);
    }
  };

  const kpiData = [
    {
      title: 'Área Total Plantada',
      value: `${kpis.totalArea.toFixed(1)} ha`,
      change: '0%',
      trend: 'stable',
      icon: MapPin,
      color: 'bg-green-500'
    },
    {
      title: 'Produtividade Média',
      value: `${kpis.avgProductivity} sc/ha`,
      change: '0%',
      trend: 'stable',
      icon: FolderCheck,
      color: 'bg-blue-500'
    },
    {
      title: 'Culturas Ativas',
      value: kpis.activeCrops.toString(),
      change: '0%',
      trend: 'stable',
      icon: Calendar,
      color: 'bg-yellow-500'
    },
    {
      title: 'Valor do Estoque',
      value: `R$ ${kpis.totalInventoryValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '0%',
      trend: 'stable',
      icon: Database,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {kpi.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-600 text-sm font-medium">{kpi.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;
