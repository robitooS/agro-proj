import React, { useState } from 'react';
import { ShieldCheck, CalendarDays, Wind, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ZarcResult {
  solo: string;
  risco: number;
  janela: string;
}

const ZarcAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ZarcResult[] | null>(null);

  const [formData, setFormData] = useState({
    cultura: 'SOJA',
    municipio: 'Ribeirão Preto',
    risco: '20'
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    // Simulação da chamada da API e recebimento dos dados
    setTimeout(() => {
      const mockResults: ZarcResult[] = [
        {
          solo: 'ARGILOSO',
          risco: 20,
          janela: '01 de Outubro a 31 de Dezembro'
        },
        {
          solo: 'TEXTURA MEDIA',
          risco: 20,
          janela: '11 de Outubro a 20 de Dezembro'
        },
        {
          solo: 'ARENOSO',
          risco: 20,
          janela: '21 de Outubro a 10 de Dezembro'
        }
      ];
      setResults(mockResults);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Análise de Zoneamento Agrícola (Zarc)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna do Formulário */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Parâmetros da Análise</h3>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <Label htmlFor="cultura">Cultura</Label>
              <Select value={formData.cultura} onValueChange={(value) => setFormData({...formData, cultura: value})}>
                <SelectTrigger id="cultura">
                  <SelectValue placeholder="Selecione a cultura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOJA">Soja</SelectItem>
                  <SelectItem value="MILHO">Milho</SelectItem>
                  <SelectItem value="FEIJAO">Feijão</SelectItem>
                  <SelectItem value="ARROZ">Arroz</SelectItem>
                  <SelectItem value="TRIGO">Trigo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="municipio">Município</Label>
              <Input
                id="municipio"
                value={formData.municipio}
                onChange={(e) => setFormData({...formData, municipio: e.target.value})}
                placeholder="Ex: Ribeirão Preto"
                required
              />
            </div>
            <div>
              <Label htmlFor="risco">Nível de Risco de Perda</Label>
              <Select value={formData.risco} onValueChange={(value) => setFormData({...formData, risco: value})}>
                <SelectTrigger id="risco">
                  <SelectValue placeholder="Selecione o risco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20% (Menor Risco)</SelectItem>
                  <SelectItem value="30">30% (Risco Médio)</SelectItem>
                  <SelectItem value="40">40% (Maior Risco)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
              {loading ? 'Analisando...' : 'Analisar Janela de Plantio'}
            </Button>
          </form>
        </div>
        
        {/* Coluna de Resultados */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-green-600" />
              Janelas de Plantio com Menor Risco Climático
            </h3>
            {!results && !loading && (
              <div className="text-center py-10 text-gray-500">
                <p>Preencha os parâmetros ao lado e clique em "Analisar" para ver as janelas de plantio ideais.</p>
              </div>
            )}
            {loading && (
              <div className="text-center py-10 text-gray-500">
                <p>Buscando dados no Zoneamento Agrícola... um momento.</p>
              </div>
            )}
            {results && (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="font-semibold text-gray-800">Tipo de Solo: <span className="text-blue-600">{result.solo}</span></p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays className="w-4 h-4 text-green-600"/>
                        <span>Janela de Plantio Ideal:</span>
                        <span className="font-bold text-gray-900">{result.janela}</span>
                      </div>
                      <span className="text-xs font-medium text-white bg-red-500 px-2 py-1 rounded-full">
                        Risco de {result.risco}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZarcAnalysis;