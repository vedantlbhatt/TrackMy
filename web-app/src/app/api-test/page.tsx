'use client';

import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api';

export default function ApiTestPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    // Log environment variables for debugging
    console.log('Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
        (process.env.NODE_ENV === 'production' 
          ? 'https://backend-production-df0a.up.railway.app' 
          : 'http://localhost:8000')
    });
    
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://backend-production-df0a.up.railway.app' 
        : 'http://localhost:8000'));
  }, []);

  const testApiCall = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Testing API call...');
      const response = await userApi.getAllLostReports();
      console.log('✅ API Response:', response.data);
      setReports(response.data);
    } catch (err: unknown) {
      console.error('❌ API Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'API call failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>API URL:</strong> {apiUrl}</p>
            <p><strong>Has NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Test</h2>
          <button
            onClick={testApiCall}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API Call'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {reports.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">API Response ({reports.length} reports)</h2>
            <div className="space-y-4">
              {reports.slice(0, 5).map((report: Record<string, unknown>, index: number) => (
                <div key={index} className="border rounded p-4">
                  <h3 className="font-semibold">{String(report.title || 'Untitled')}</h3>
                  <p className="text-gray-600">{String(report.description || 'No description')}</p>
                  <p className="text-sm text-gray-500">
                    Bounty: ${String(report.bounty || 0)} | Location: {String(report.latitude || 0)}, {String(report.longitude || 0)}
                  </p>
                </div>
              ))}
              {reports.length > 5 && (
                <p className="text-gray-500 text-sm">... and {reports.length - 5} more reports</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
