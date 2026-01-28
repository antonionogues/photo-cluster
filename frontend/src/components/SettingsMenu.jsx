import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Globe } from 'lucide-react';

const SettingsMenu = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--bg-secondary)',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            border: '1px solid var(--border-color)',
            zIndex: 1000
        }}>

            {/* Theme Toggle */}
            <button
                onClick={() => toggleTheme()}
                title={theme === 'dark' ? t('theme_light') : t('theme_dark')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Globe size={16} color="var(--text-muted)" />
                <select
                    onChange={(e) => changeLanguage(e.target.value)}
                    value={i18n.language}
                    style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        padding: '4px',
                        fontSize: '0.8rem'
                    }}
                >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                </select>
            </div>
        </div>
    );
};

export default SettingsMenu;
