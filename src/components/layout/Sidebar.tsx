
import React from 'react';
import { 
  Calendar, 
  Database, 
  FolderCheck, 
  MapPin, 
  Search,
  Users,
  Leaf,
  LogOut,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: FolderCheck,
      description: 'Visão Geral'
    },
    {
      id: 'properties',
      title: 'Propriedades',
      icon: MapPin,
      description: 'Gestão de Fazendas'
    },
    {
      id: 'crops',
      title: 'Culturas',
      icon: FolderCheck,
      description: 'Gestão de Safras'
    },
    {
      id: 'inventory',
      title: 'Estoque',
      icon: Database,
      description: 'Insumos & Produtos'
    },
    {
      id: 'climate',
      title: 'Análise Climática',
      icon: Calendar,
      description: 'IA Preditiva'
    },
    {
      id: 'monitoring', // ID alterado
      title: 'Monitoramento (SATVeg)', // Título alterado
      icon: Search, // Ícone mantido
      description: 'Análise de Safras' // Descrição alterada
    },
    {
      id: 'zarc',
      title: 'Zoneamento (ZARC)',
      icon: ShieldCheck,
      description: 'Melhor Época de Plantio'
    },
    {
      id: 'reports',
      title: 'Relatórios',
      icon: FileText,
      description: 'Receitas & Despesas'
    },
    {
      id: 'sustainability',
      title: 'Sustentabilidade',
      icon: Leaf,
      description: 'Economia de Recursos'
    }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white shadow-2xl flex flex-col">
      <div className="p-6 border-b border-green-700">
        <h1 className="text-2xl font-bold text-green-100">AgroFácil</h1>
        <p className="text-green-300 text-sm mt-1">ERP Inteligente</p>
      </div>
      
      <nav className="mt-6 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center px-6 py-4 text-left transition-all duration-200 hover:bg-green-700/50 border-r-4 ${
                isActive 
                  ? 'bg-green-700 border-green-400 text-white' 
                  : 'border-transparent text-green-200 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{item.title}</div>
                <div className="text-xs opacity-75 truncate">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-green-700">
        <div className="bg-green-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 flex-1">
              <Users className="w-8 h-8 mr-3 text-green-300 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <p className="text-green-300 text-xs truncate">{user?.username}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="ml-2 p-1 text-green-300 hover:text-white transition-colors flex-shrink-0"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
