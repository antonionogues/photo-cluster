import { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';

export default function ProcessingStep({ eventId, onComplete }) {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState(t('starting'));

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await api.get(`/simple/status/${eventId}`);
                setProgress(res.data.percent);
                // Backend returns English status mostly. 
                // We rely on it for now, or could map it if needed.
                try {
                    const statusObj = JSON.parse(res.data.status);
                    setStatus(t(statusObj.key, statusObj));
                } catch (e) {
                    // Fallback for legacy strings or simple text
                    setStatus(t(res.data.status) || res.data.status);
                }

                if (res.data.percent >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 1000);
                }
            } catch (err) {
                console.error(err);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [eventId, onComplete]);

    return (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ color: 'var(--text-main)' }}>{t('processing_title')}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{status}</p>

            <div style={{
                height: '24px', background: 'var(--bg-tertiary)', borderRadius: '12px',
                overflow: 'hidden', maxWidth: '600px', margin: '0 auto',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{
                    height: '100%', width: `${progress}%`,
                    background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-hover))',
                    transition: 'width 0.5s ease'
                }}></div>
            </div>
            <h1 style={{ marginTop: '1rem', color: 'var(--accent-gold)' }}>{progress}%</h1>
        </div>
    );
}
