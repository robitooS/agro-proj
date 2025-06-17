
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  name: string;
  location: string;
  area: string;
  crops: string[];
  status: string;
  productivity: string;
}

const PropertiesModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    area: '',
    crops: '',
    status: 'Ativa',
    productivity: ''
  });

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProperties = data?.map(prop => ({
        id: prop.id,
        name: prop.name,
        location: prop.location,
        area: prop.area.toString(),
        crops: prop.crops || [],
        status: prop.status,
        productivity: prop.productivity
      })) || [];

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as propriedades.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const propertyData = {
        name: formData.name,
        location: formData.location,
        area: parseFloat(formData.area),
        crops: formData.crops.split(',').map(crop => crop.trim()).filter(crop => crop),
        status: formData.status,
        productivity: formData.productivity,
        user_id: user?.id
      };

      if (editingProperty) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Propriedade atualizada com sucesso!"
        });
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Propriedade adicionada com sucesso!"
        });
      }

      setFormData({
        name: '',
        location: '',
        area: '',
        crops: '',
        status: 'Ativa',
        productivity: ''
      });
      setIsAddingProperty(false);
      setEditingProperty(null);
      fetchProperties();
    } catch (error) {
      console.error('Erro ao salvar propriedade:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a propriedade.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      location: property.location,
      area: property.area,
      crops: property.crops.join(', '),
      status: property.status,
      productivity: property.productivity
    });
    setIsAddingProperty(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Propriedade removida com sucesso!"
      });
      fetchProperties();
    } catch (error) {
      console.error('Erro ao deletar propriedade:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a propriedade.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Propriedades</h1>
        <div className="text-center py-8">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Propriedades</h1>
        <Button 
          onClick={() => setIsAddingProperty(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Propriedade
        </Button>
      </div>
      
      {isAddingProperty && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingProperty ? 'Editar Propriedade' : 'Adicionar Nova Propriedade'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome da Propriedade</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Fazenda São José"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Ex: Sorriso, MT"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="area">Área Total (ha)</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  placeholder="Ex: 1250"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="productivity">Produtividade</Label>
                <Input
                  id="productivity"
                  value={formData.productivity}
                  onChange={(e) => setFormData({...formData, productivity: e.target.value})}
                  placeholder="Ex: 62 sc/ha"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="crops">Culturas (separadas por vírgula)</Label>
                <Input
                  id="crops"
                  value={formData.crops}
                  onChange={(e) => setFormData({...formData, crops: e.target.value})}
                  placeholder="Ex: Soja, Milho, Algodão"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Preparação">Preparação</option>
                  <option value="Inativa">Inativa</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {editingProperty ? 'Atualizar' : 'Adicionar'} Propriedade
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddingProperty(false);
                  setEditingProperty(null);
                  setFormData({
                    name: '',
                    location: '',
                    area: '',
                    crops: '',
                    status: 'Ativa',
                    productivity: ''
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {properties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma propriedade cadastrada</h3>
          <p className="text-gray-600 mb-4">Comece adicionando sua primeira propriedade para gerenciar suas fazendas.</p>
          <Button 
            onClick={() => setIsAddingProperty(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeira Propriedade
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    property.status === 'Ativa' ? 'bg-green-100 text-green-700' : 
                    property.status === 'Preparação' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {property.status}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(property)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(property.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{property.area} ha</div>
                  <div className="text-xs text-gray-600">Área Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{property.productivity}</div>
                  <div className="text-xs text-gray-600">Produtividade</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{property.crops.length}</div>
                  <div className="text-xs text-gray-600">Culturas</div>
                </div>
              </div>
              
              {property.crops.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {property.crops.map((crop, cropIndex) => (
                      <span key={cropIndex} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesModule;
