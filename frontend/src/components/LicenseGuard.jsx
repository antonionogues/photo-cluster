import { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { Lock, Key, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SettingsMenu from './SettingsMenu'; // Import Settings

export default function LicenseGuard({ children }) {
    const { t } = useTranslation();
    const [licenseKey, setLicenseKey] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingStart, setIsCheckingStart] = useState(true);

    // 1. Check local storage on startup
    useEffect(() => {
        const savedKey = localStorage.getItem('license_key');
        if (savedKey) {
            validateLicense(savedKey, true); // Silent check
        } else {
            setIsCheckingStart(false);
        }
    }, []);

    const validateLicense = async (key, silent = false) => {
        if (!key) return;
        setIsLoading(true);

        try {
            // Mock Validation Call
            // In real life: await api.post('/auth/validate', { key });
            const res = await api.post('/simple/validate-license', { key });

            if (res.data.valid) {
                localStorage.setItem('license_key', key);
                setIsAuthenticated(true);
                if (!silent) toast.success("¡Licencia Válida! Bienvenido.");
            } else {
                localStorage.removeItem('license_key'); // Clear bad key
                if (!silent) toast.error(res.data.message || "Licencia inválida o expirada.");
            }
        } catch (error) {
            console.error(error);
            if (!silent) toast.error("Error conectando con el servidor de licencias.");
        } finally {
            setIsLoading(false);
            setIsCheckingStart(false);
        }
    };

    const handleDemo = async () => {
        setIsLoading(true);
        try {
            const res = await api.post('/simple/start-demo');
            if (res.data.valid) {
                localStorage.setItem('license_key', 'DEMO_MODE_ACTIVE');
                setIsAuthenticated(true);
                toast.success("¡Modo Demo Activado! (Máx 50 fotos)");
                toast.info("No cierres la app o perderás tu sesión de prueba.");
            } else {
                toast.warning(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error iniciando demo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        validateLicense(licenseKey);
    };

    if (isCheckingStart) {
        return (
            <div style={{
                height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
                background: 'var(--bg-primary)', color: 'var(--text-muted)'
            }}>
                <p>{t('verifying')}</p>
            </div>
        );
    }

    if (isAuthenticated) {
        return children;
    }

    // Locked Screen
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'radial-gradient(circle at 50% -20%, var(--bg-primary, #2a2a40), var(--bg-tertiary, #000) 90%)',
            fontFamily: 'Inter, system-ui, sans-serif',
            position: 'relative' // relative for SettingsMenu absolute positioning
        }}>
            <SettingsMenu />

            <div style={{
                background: 'var(--bg-secondary)', // Theme adaptable
                backdropFilter: 'blur(10px)',
                padding: '3rem',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                width: '400px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{
                    background: 'rgba(46, 160, 67, 0.2)',
                    width: '64px', height: '64px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                }}>
                    <Lock size={32} color="#2ea043" />
                </div>

                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('welcome')}</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    {t('license_prompt')}
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                        <Key size={18} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder={t('license_placeholder')}
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                            style={{
                                width: '100%',
                                boxSizing: 'border-box', // Fix overflow
                                padding: '12px 16px 12px 48px',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                color: 'var(--text-main)',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#2ea043'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: isLoading ? '#333' : '#2ea043',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: isLoading ? 'wait' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                    >
                        {isLoading ? t('verifying') : (
                            <>{t('verify_access')} <CheckCircle size={18} /></>
                        )}
                    </button>

                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }}></div>
                        <span style={{ color: '#555', fontSize: '0.8rem' }}>O</span>
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }}></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleDemo}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#aaa',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            cursor: isLoading ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.target.style.background = 'var(--bg-tertiary)'; e.target.style.color = 'var(--text-main)'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-muted)'; }}
                    >
                        <Play size={16} /> {t('try_demo')}
                    </button>

                    {/* Mock Hint for prototype */}
                    <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {t('demo_hint')}
                    </div>
                </form>
            </div>
        </div>
    );
}
