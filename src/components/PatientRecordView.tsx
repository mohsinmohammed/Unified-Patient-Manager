// Patient record view component
interface PatientRecordViewProps {
  patient: any;
}

export default function PatientRecordView({ patient }: PatientRecordViewProps) {
  return (
    <div className="space-y-6">
      {/* Patient Info Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900">
            {patient.firstName} {patient.lastName}
          </h2>
          <p className="text-sm text-gray-600 mt-1">Patient ID: {patient.id}</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Email</h3>
            <p className="mt-1 text-gray-900">{patient.email}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Phone</h3>
            <p className="mt-1 text-gray-900">{patient.phone || 'Not provided'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Date of Birth</h3>
            <p className="mt-1 text-gray-900">
              {patient.dateOfBirth
                ? new Date(patient.dateOfBirth).toLocaleDateString()
                : 'Not provided'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Address</h3>
            <p className="mt-1 text-gray-900">{patient.address || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Vitals Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Vital Signs</h3>
        </div>
        <div className="p-6">
          {patient.vitals ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {patient.vitals.bloodPressure && (
                <div className="border rounded p-3">
                  <p className="text-xs text-gray-500">Blood Pressure</p>
                  <p className="text-lg font-semibold">{patient.vitals.bloodPressure}</p>
                </div>
              )}
              {patient.vitals.heartRate && (
                <div className="border rounded p-3">
                  <p className="text-xs text-gray-500">Heart Rate</p>
                  <p className="text-lg font-semibold">{patient.vitals.heartRate} bpm</p>
                </div>
              )}
              {patient.vitals.temperature && (
                <div className="border rounded p-3">
                  <p className="text-xs text-gray-500">Temperature</p>
                  <p className="text-lg font-semibold">{patient.vitals.temperature}°F</p>
                </div>
              )}
              {patient.vitals.weight && (
                <div className="border rounded p-3">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-lg font-semibold">{patient.vitals.weight} lbs</p>
                </div>
              )}
              {patient.vitals.height && (
                <div className="border rounded p-3">
                  <p className="text-xs text-gray-500">Height</p>
                  <p className="text-lg font-semibold">{patient.vitals.height} in</p>
                </div>
              )}
              {patient.vitals.respiratoryRate && (
                <div className="border rounded p-3">
                  <p className="text-xs text-gray-500">Respiratory Rate</p>
                  <p className="text-lg font-semibold">{patient.vitals.respiratoryRate}/min</p>
                </div>
              )}
              {patient.vitals.oxygenSaturation && (
                <div className="border rounded p-3">
                  <p className="text-xs text-gray-500">O₂ Saturation</p>
                  <p className="text-lg font-semibold">{patient.vitals.oxygenSaturation}%</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No vital signs recorded</p>
          )}
        </div>
      </div>

      {/* Medical Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visit Summary */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Visit Summary</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-wrap">
              {patient.visitSummary || 'No visit summary available'}
            </p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Diagnosis</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-wrap">
              {patient.diagnosis || 'No diagnosis recorded'}
            </p>
          </div>
        </div>

        {/* Treatment */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Treatment Plan</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-wrap">
              {patient.treatment || 'No treatment plan available'}
            </p>
          </div>
        </div>
      </div>

      {/* Lab Results */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lab Results</h3>
        </div>
        <div className="p-6">
          {patient.labResults && patient.labResults.length > 0 ? (
            <div className="space-y-4">
              {patient.labResults.map((lab: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{lab.testName}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(lab.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">{lab.result}</span>
                  </div>
                  {lab.normalRange && (
                    <p className="text-sm text-gray-500 mt-2">Normal Range: {lab.normalRange}</p>
                  )}
                  {lab.notes && <p className="text-sm text-gray-700 mt-2">{lab.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No lab results available</p>
          )}
        </div>
      </div>

      {/* Medications */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
        </div>
        <div className="p-6">
          {patient.medications && patient.medications.length > 0 ? (
            <div className="space-y-4">
              {patient.medications.map((med: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{med.name}</h4>
                      <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                      Active
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Started: {new Date(med.startDate).toLocaleDateString()}</p>
                    {med.endDate && <p>End: {new Date(med.endDate).toLocaleDateString()}</p>}
                    {med.prescribedBy && <p>Prescribed by: {med.prescribedBy}</p>}
                  </div>
                  {med.notes && <p className="text-sm text-gray-700 mt-2">{med.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No medications on record</p>
          )}
        </div>
      </div>
    </div>
  );
}
