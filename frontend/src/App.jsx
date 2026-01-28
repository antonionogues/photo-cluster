import { useState, useEffect } from 'react';
import api from './api';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Hook
import SettingsMenu from './components/SettingsMenu'; // New Component

import UploadStep from './components/UploadStep';
import ProcessingStep from './components/ProcessingStep';
import ResultsStep from './components/ResultsStep';
import ClusterDetail from './components/ClusterDetail';

import LicenseGuard from './components/LicenseGuard';
import PreviewApp from './PreviewApp.jsx';

function App() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [eventId, setEventId] = useState(null);

  if (import.meta.env.VITE_PAGES_PREVIEW === 'true') {
    return <PreviewApp />;
  }

  // For navigation between list and detail
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [selectedClusterId, setSelectedClusterId] = useState(null); // ID or 'unclassified'

  // Reset flow
  const handleReset = () => {
    setStep(0);
    setEventId(null);
    setView('list');
    setSelectedClusterId(null);
  };

  const handleProcessingFinish = () => {
    setStep(2);
  };

  return (
    <LicenseGuard>
      <div className="container">
        <SettingsMenu />
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '40px' }}>
          {t('app_title')} <span style={{ fontSize: '0.8rem', color: '#2ea043', border: '1px solid #2ea043', borderRadius: '4px', padding: '2px 6px', verticalAlign: 'middle' }}>PRO</span>
        </h1>

        {step === 0 && (
          <UploadStep
            onUploadComplete={(id) => {
              setEventId(id);
              setStep(1);
            }}
            onLoadSession={(id) => {
              setEventId(id);
              setStep(2);
            }}
          />
        )}

        {step === 1 && eventId && (
          <ProcessingStep
            eventId={eventId}
            onComplete={handleProcessingFinish}
          />
        )}

        {step === 2 && eventId && (
          <>
            {view === 'list' && (
              <ResultsStep
                eventId={eventId}
                onOpenCluster={(id) => {
                  setSelectedClusterId(id);
                  setView('detail');
                }}
                onReset={handleReset}
              />
            )}

            {view === 'detail' && selectedClusterId && (
              <ClusterDetail
                eventId={eventId}
                clusterId={selectedClusterId}
                onBack={() => {
                  setView('list');
                  setSelectedClusterId(null);
                }}
              />
            )}
          </>
        )}
      </div>
    </LicenseGuard>
  );
}

export default App;
