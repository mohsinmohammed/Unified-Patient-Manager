'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import PatientRecordView from '@/components/PatientRecordView';
import PatientRecordEdit from '@/components/PatientRecordEdit';

export default function PatientRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/provider/login');
      return;
    }

    fetchPatient();
  }, [id, router]);

  const fetchPatient = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/patients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          router.push('/provider/login');
          return;
        }
        if (response.status === 404) {
          throw new Error('Patient not found');
        }
        throw new Error('Failed to fetch patient record');
      }

      const data = await response.json();
      setPatient(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (updatedData: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update patient record');
      }

      const data = await response.json();
      setPatient(data);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save changes');
    }
  };

  if (isLoading) {
    return (
      <Layout userType="provider">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading patient record...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout userType="provider">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => router.push('/provider/dashboard')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
      </Layout>
    );
  }

  return (
    <Layout userType="provider">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/provider/dashboard')}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Dashboard
          </button>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Record
            </button>
          )}
        </div>

        {isEditing ? (
          <PatientRecordEdit
            patient={patient}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <PatientRecordView patient={patient} />
        )}
      </div>
    </Layout>
  );
}
