
import React, { useState } from 'react';
import { Camera, Upload, Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AnalysisResult {
  id: string;
  imageName: string;
  date: string;
  results: {
    healthScore: number;
    issues: Array<{
      type: 'disease' | 'pest' | 'nutrition' | 'stress';
      severity: 'low' | 'medium' | 'high';
      description: string;
      recommendation: string;
    }>;
    estimatedYield: string;
    plantCount: number;
  };
}

const PlantationAnalysis = () => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const processImage = () => {
    if (!selectedImage) return;

    setUploading(true);

    // Simular processamento de IA
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        id: Date.now().toString(),
        imageName: selectedImage.name,
        date: new Date().toLocaleString('pt-BR'),
        results: {
          healthScore: Math.floor(Math.random() * 30) + 70, // 70-100
          issues: [
            {
              type: 'nutrition',
              severity: 'medium',
              description: 'Deficiência de nitrogênio detectada em 15% da área',
              recommendation: 'Aplicar fertilizante nitrogenado na dosagem de 100kg/ha'
            },
            {
              type: 'pest',
              severity: 'low',
              description: 'Presença de pragas em estágio inicial',
              recommendation: 'Monitoramento intensivo e aplicação preventiva de inseticida'
            }
          ],
          estimatedYield: `${Math.floor(Math.random() * 20) + 45} sc/ha`,
          plantCount: Math.floor(Math.random() * 1000) + 2000
        }
      };

      setAnalyses([mockResult, ...analyses]);
      setSelectedImage(null);
      setUploading(false);
    }, 2000);
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'disease': return <AlertTriangle className="w-5 h-5" />;
      case 'pest': return <Search className="w-5 h-5" />;
      case 'nutrition': return <Info className="w-5 h-5" />;
      case 'stress': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Análise de Plantação por IA</h1>
      </div>

      {/* Upload de Imagem */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Imagens</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {selectedImage ? (
            <div className="space-y-4">
              <img 
                src={URL.createObjectURL(selectedImage)} 
                alt="Preview" 
                className="max-h-48 mx-auto rounded-lg"
              />
              <div>
                <p className="text-sm text-gray-600 mb-4">Imagem selecionada: {selectedImage.name}</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={processImage}
                    disabled={uploading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    {uploading ? 'Processando...' : 'Analisar Imagem'}
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Faça upload de uma imagem</h4>
              <p className="text-gray-600 mb-4">
                Envie fotos aéreas ou terrestres da sua plantação para análise automática
              </p>
              <label className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Selecionar Imagem
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {analyses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma análise realizada</h3>
          <p className="text-gray-600 mb-4">
            Faça upload de imagens da sua plantação para receber análises detalhadas com IA.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {analyses.map((analysis) => (
            <div key={analysis.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{analysis.imageName}</h3>
                  <p className="text-sm text-gray-600">{analysis.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Índice de Saúde</div>
                  <div className={`text-2xl font-bold ${getHealthColor(analysis.results.healthScore)}`}>
                    {analysis.results.healthScore}%
                  </div>
                </div>
              </div>

              {/* Resumo dos Resultados */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analysis.results.plantCount}</div>
                  <div className="text-sm text-blue-700">Plantas Detectadas</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analysis.results.estimatedYield}</div>
                  <div className="text-sm text-green-700">Produtividade Estimada</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{analysis.results.issues.length}</div>
                  <div className="text-sm text-purple-700">Problemas Detectados</div>
                </div>
              </div>

              {/* Problemas Detectados */}
              {analysis.results.issues.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Problemas Detectados</h4>
                  <div className="space-y-3">
                    {analysis.results.issues.map((issue, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getSeverityColor(issue.severity)}`}>
                            {getIssueIcon(issue.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{issue.description}</span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(issue.severity)}`}>
                                {issue.severity === 'high' ? 'Alto' : issue.severity === 'medium' ? 'Médio' : 'Baixo'}
                              </span>
                            </div>
                            <div className="bg-green-50 border-l-4 border-l-green-400 p-3 rounded-r-lg">
                              <div className="text-sm text-green-800">
                                <strong>Recomendação:</strong> {issue.recommendation}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.results.issues.length === 0 && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800">Plantação Saudável</div>
                    <div className="text-sm text-green-700">Nenhum problema significativo detectado</div>
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

export default PlantationAnalysis;
