export const lightTheme = {
  colors: {
    background: '#f1f5f9',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    text: {
      primary: '#1e293b',
      secondary: '#475569',
      muted: '#94a3b8',
    },
    border: '#e2e8f0',
    borderFocus: '#3b82f6',
    primary: {
      main: '#2563eb',
      hover: '#1d4ed8',
      light: '#eff6ff',
      contrastText: '#ffffff',
    },
    status: {
      success: '#10b981',
      successBg: '#dcfce7',
      error: '#ef4444',
      errorBg: '#fee2e2',
      warning: '#f59e0b',
      warningBg: '#fef3c7',
      info: '#3b82f6',
      infoBg: '#dbeafe',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },
};

export const darkTheme = {
  colors: {
    background: '#0f172a',
    surface: '#1e293b',
    surfaceAlt: '#334155',
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      muted: '#64748b',
    },
    border: '#334155',
    borderFocus: '#60a5fa',
    primary: {
      main: '#3b82f6',
      hover: '#60a5fa',
      light: '#1e3a8a',
      contrastText: '#ffffff',
    },
    status: {
      success: '#10b981',
      successBg: '#064e3b',
      error: '#ef4444',
      errorBg: '#7f1d1d',
      warning: '#f59e0b',
      warningBg: '#78350f',
      info: '#3b82f6',
      infoBg: '#1e3a8a',
    },
  },
  shadows: lightTheme.shadows,
  radii: lightTheme.radii,
};
