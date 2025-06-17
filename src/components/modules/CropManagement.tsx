
import React, { useState, useEffect } from 'react';
import { FolderCheck, Plus, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Crop {
  id: string;
  name: string;
  area: number;
  planting_date: string;
  harvest_date: string;
  stage: string;
  progress: number;
  expected_yield: string;
}

const CropManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    area: '',
    planting_date: '',
    harvest_date: '',
    stage: 'Planejamento',
    expected_yield: ''
  });

  useEffect(() => {
    if (user) {
      fetchCrops();
    }
  }, [user]);

  const fetchCrops = async () => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedCrops = data?.map(crop => ({
        ...crop,
        planting_date: crop.planting_date,
        harvest_date: crop.harvest_date
      })) || [];

      setCrops(formattedCrops);
    } catch (error) {
      console.error('Erro ao buscar culturas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as culturas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      area: '',
      planting_date: '',
      harvest_date: '',
      stage: 'Planejamento',
      expected_yield: ''
    });
    setEditingCrop(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const cropData = {
        name: formData.name,
        area: parseFloat(formData.area),
        planting_date: formData.planting_date,
        harvest_date: formData.harvest_date,
        stage: formData.stage,
        progress: getProgressByStage(formData.stage),
        expected_yield: formData.expected_yield,
        user_id: user?.id
      };

      if (editingCrop) {
        const { error } = await supabase
          .from('crops')
          .update(cropData)
          .eq('id', editingCrop.id);
        
        if (error) throw error;
        
        toast({
          title: "Cultura atualizada",
          description: "A cultura foi atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('crops')
          .insert([cropData]);
        
        if (error) throw error;
        
        toast({
          title: "Cultura adicionada",
          description: "Nova cultura foi adicionada com sucesso.",
        });
      }
      
      resetForm();
      fetchCrops();
    } catch (error) {
      console.error('Erro ao salvar cultura:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a cultura.",
        variant: "destructive"
      });
    }
  };

  const getProgressByStage = (stage: string) => {
    switch (stage) {
      case 'Planejamento': return 0;
      case 'Plantio': return 25;
      case 'Crescimento': return 50;
      case 'Floração': return 75;
      case 'Colheita': return 100;
      default: return 0;
    }
  };

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      area: crop.area.toString(),
      planting_date: crop.planting_date,
      harvest_date: crop.harvest_date,
      stage: crop.stage,
      expected_yield: crop.expected_yield
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crops')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Cultura removida",
        description: "A cultura foi removida com sucesso.",
      });
      fetchCrops();
    } catch (error) {
      console.error('Erro ao deletar cultura:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a cultura.",
        variant: "destructive"
      });
    }
  };

  const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
  const averageProgress = crops.length > 0 ? crops.reduce((sum, crop) => sum + crop.progress, 0) / crops.length : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Culturas e Safras</h1>
        <div className="text-center py-8">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Culturas e Safras</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Cultura
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCrop ? 'Editar Cultura' : 'Nova Cultura'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Cultura</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área (ha)</label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Plantio</label>
              <input
                type="date"
                value={formData.plantingDate}
                onChange={(e) => setFormData({...formData, plantingDate: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Colheita</label>
              <input
                type="date"
                value={formData.harvestDate}
                onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estágio</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({...formData, stage: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Planejamento">Planejamento</option>
                <option value="Plantio">Plantio</option>
                <option value="Crescimento">Crescimento</option>
                <option value="Floração">Floração</option>
                <option value="Colheita">Colheita</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produtividade Esperada</label>
              <input
                type="text"
                value={formData.expectedYield}
                onChange={(e) => setFormData({...formData, expectedYield: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: 65 sc/ha"
                required
              />
            </div>
            
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {editingCrop ? 'Atualizar' : 'Adicionar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      
      {crops.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FolderCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma cultura cadastrada</h3>
          <p className="text-gray-600 mb-4">Comece adicionando suas primeiras culturas e safras.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Adicionar Primeira Cultura
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div key={crop.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <FolderCheck className="w-8 h-8 text-green-600" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(crop)}
                      className="p-1 text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(crop.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{crop.name}</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Área:</span>
                    <span className="font-medium">{crop.area} ha</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plantio:</span>
                    <span className="font-medium">{crop.plantingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Colheita:</span>
                    <span className="font-medium">{crop.harvestDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estágio:</span>
                    <span className="font-medium text-green-600">{crop.stage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Produtividade:</span>
                    <span className="font-medium">{crop.expectedYield}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium">{crop.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${crop.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Safra</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{totalArea.toFixed(1)} ha</div>
                <div className="text-sm text-green-700">Área Total Plantada</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{crops.length}</div>
                <div className="text-sm text-blue-700">Culturas Ativas</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{averageProgress.toFixed(0)}%</div>
                <div className="text-sm text-yellow-700">Progresso Médio</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">R$ 0</div>
                <div className="text-sm text-purple-700">Receita Estimada</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CropManagement;
