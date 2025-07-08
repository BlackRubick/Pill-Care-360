import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RefreshCw, Bug } from 'lucide-react';
import apiService from '../../services/api';

export const TreatmentsPage: React.FC = () => {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const user = apiService.getStoredUser();
      setCurrentUser(user);
      
      console.log('🔍 Cargando tratamientos...');
      const data = await apiService.getUserTreatments();
      
      console.log('📊 Datos recibidos:', data);
      console.log('📊 Tipo de datos:', typeof data);
      console.log('📊 Es array:', Array.isArray(data));
      console.log('📊 Longitud:', data?.length);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('📋 Primer tratamiento completo:', data[0]);
        console.log('📋 Campos disponibles:', Object.keys(data[0]));
        
        // Analizar cada campo importante
        const firstTreatment = data[0];
        console.log('🔍 Análisis de campos:');
        console.log('- ID:', firstTreatment.id);
        console.log('- Patient:', firstTreatment.patient);
        console.log('- Patient ID:', firstTreatment.patient_id);
        console.log('- Medication:', firstTreatment.medication);
        console.log('- Medication ID:', firstTreatment.medication_id);
        console.log('- Status:', firstTreatment.status);
        console.log('- Start Date:', firstTreatment.start_date || firstTreatment.startDate);
        console.log('- End Date:', firstTreatment.end_date || firstTreatment.endDate);
        console.log('- Dosage:', firstTreatment.dosage);
        console.log('- Frequency:', firstTreatment.frequency);
        console.log('- Duration:', firstTreatment.duration);
        console.log('- Alarms:', firstTreatment.alarms);
      }
      
      setRawData(data);
      setTreatments(data || []);
      
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
  };

  if (loading) {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin" size={20} />
          <span className="ml-2">Cargando...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Debug Tratamientos</h1>
          <Button onClick={loadData} className="flex items-center space-x-2">
            <RefreshCw size={16} />
            <span>Recargar</span>
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50 p-4">
            <div className="text-red-700">Error: {error}</div>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Información de Debug</h2>
          <div className="space-y-4">
            <div>
              <strong>Usuario:</strong> {currentUser?.name || 'N/A'} ({currentUser?.role || 'N/A'})
            </div>
            <div>
              <strong>Tratamientos encontrados:</strong> {treatments.length}
            </div>
            <div>
              <strong>Tipo de datos:</strong> {typeof rawData} {Array.isArray(rawData) ? '(Array)' : ''}
            </div>
          </div>
        </Card>

        {treatments.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Estructura de Datos Completa</h2>
            <div className="space-y-6">
              {treatments.map((treatment, index) => (
                <div key={index} className="border border-gray-200 rounded p-4">
                  <h3 className="font-medium mb-2">Tratamiento {index + 1}</h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(treatment, null, 2)}
                  </pre>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>ID:</strong> {treatment.id}
                    </div>
                    <div>
                      <strong>Status:</strong> {treatment.status}
                    </div>
                    <div>
                      <strong>Patient ID:</strong> {treatment.patient_id}
                    </div>
                    <div>
                      <strong>Patient Name:</strong> {treatment.patient?.name || 'N/A'}
                    </div>
                    <div>
                      <strong>Medication ID:</strong> {treatment.medication_id}
                    </div>
                    <div>
                      <strong>Medication Name:</strong> {treatment.medication?.name || 'N/A'}
                    </div>
                    <div>
                      <strong>Dosage:</strong> {treatment.dosage}
                    </div>
                    <div>
                      <strong>Frequency:</strong> {treatment.frequency}
                    </div>
                    <div>
                      <strong>Start Date:</strong> {treatment.start_date || treatment.startDate || 'N/A'}
                    </div>
                    <div>
                      <strong>End Date:</strong> {treatment.end_date || treatment.endDate || 'N/A'}
                    </div>
                    <div>
                      <strong>Duration:</strong> {treatment.duration}
                    </div>
                    <div>
                      <strong>Alarms:</strong> {treatment.alarms ? `${treatment.alarms.length} alarmas` : 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {treatments.length === 0 && (
          <Card className="p-6 text-center">
            <Bug size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No hay tratamientos</h3>
            <p className="text-gray-600">
              No se encontraron tratamientos o hay un problema con la estructura de datos
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};