import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app_theme') || 'dark';
    });

    useEffect(() => {
        document.body.className = theme; // Apply class to body
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    const toggleTheme = (newTheme) => {
        if (newTheme) {
            setTheme(newTheme);
        } else {
            setTheme(prev => prev === 'dark' ? 'light' : 'dark');
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
