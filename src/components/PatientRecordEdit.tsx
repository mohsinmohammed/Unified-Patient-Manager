// Patient record edit form component
import { useState } from 'react';

interface PatientRecordEditProps {
  patient: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function PatientRecordEdit({ patient, onSave, onCancel }: PatientRecordEditProps) {
  const [formData, setFormData] = useState({
    firstName: patient.firstName || '',
    lastName: patient.lastName || '',
    phone: patient.phone || '',
    address: patient.address || '',
    vitals: {
      bloodPressure: patient.vitals?.bloodPressure || '',
      heartRate: patient.vitals?.heartRate || '',
      temperature: patient.vitals?.temperature || '',
      weight: patient.vitals?.weight || '',
      height: patient.vitals?.height || '',
      respiratoryRate: patient.vitals?.respiratoryRate || '',
      oxygenSaturation: patient.vitals?.oxygenSaturation || '',
    },
    visitSummary: patient.visitSummary || '',
    diagnosis: patient.diagnosis || '',
    treatment: patient.treatment || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateVitals = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      vitals: { ...prev.vitals, [field]: value },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Vitals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
            <input
              type="text"
              placeholder="120/80"
              value={formData.vitals.bloodPressure}
              onChange={(e) => updateVitals('bloodPressure', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
            <input
              type="number"
              value={formData.vitals.heartRate}
              onChange={(e) => updateVitals('heartRate', e.target.value ? Number(e.target.value) : '')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Temperature (°F)</label>
            <input
              type="number"
              step="0.1"
              value={formData.vitals.temperature}
              onChange={(e) => updateVitals('temperature', e.target.value ? Number(e.target.value) : '')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (lbs)</label>
            <input
              type="number"
              value={formData.vitals.weight}
              onChange={(e) => updateVitals('weight', e.target.value ? Number(e.target.value) : '')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Height (in)</label>
            <input
              type="number"
              value={formData.vitals.height}
              onChange={(e) => updateVitals('height', e.target.value ? Number(e.target.value) : '')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Respiratory Rate</label>
            <input
              type="number"
              value={formData.vitals.respiratoryRate}
              onChange={(e) => updateVitals('respiratoryRate', e.target.value ? Number(e.target.value) : '')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">O₂ Saturation (%)</label>
            <input
              type="number"
              value={formData.vitals.oxygenSaturation}
              onChange={(e) => updateVitals('oxygenSaturation', e.target.value ? Number(e.target.value) : '')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Visit Summary</label>
            <textarea
              rows={4}
              value={formData.visitSummary}
              onChange={(e) => updateField('visitSummary', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the visit, symptoms, and observations..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
            <textarea
              rows={3}
              value={formData.diagnosis}
              onChange={(e) => updateField('diagnosis', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter diagnosis..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Treatment Plan</label>
            <textarea
              rows={4}
              value={formData.treatment}
              onChange={(e) => updateField('treatment', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the treatment plan..."
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
