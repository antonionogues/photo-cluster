import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowLeft, Download, Edit2, Image as ImageIcon, Key, Lock, Play, Upload, Users } from 'lucide-react';

function svgPlaceholderDataUri(label, accent = '#2ea043') {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#0b0f1a"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="48" y="48" width="1104" height="704" rx="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)"/>
  <circle cx="120" cy="120" r="18" fill="${accent}"/>
  <text x="160" y="128" font-family="Inter,system-ui,sans-serif" font-size="28" fill="rgba(255,255,255,0.85)">PhotoCluster Preview</text>
  <text x="96" y="220" font-family="Inter,system-ui,sans-serif" font-size="56" font-weight="700" fill="rgba(255,255,255,0.92)">${label}</text>
  <text x="96" y="280" font-family="Inter,system-ui,sans-serif" font-size="26" fill="rgba(255,255,255,0.65)">Static UI only • no uploads • no processing</text>
  <g opacity="0.9">
    <rect x="96" y="360" width="300" height="220" rx="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)"/>
    <rect x="428" y="360" width="300" height="220" rx="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)"/>
    <rect x="760" y="360" width="300" height="220" rx="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)"/>
    <circle cx="246" cy="470" r="42" fill="rgba(255,255,255,0.08)"/>
    <circle cx="578" cy="470" r="42" fill="rgba(255,255,255,0.08)"/>
    <circle cx="910" cy="470" r="42" fill="rgba(255,255,255,0.08)"/>
  </g>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function PreviewBanner() {
  return (
    <div style={{
      border: '1px solid var(--border-color)',
      background: 'rgba(255,255,255,0.03)',
      color: 'var(--text-muted)',
      padding: '10px 12px',
      borderRadius: 12,
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Lock size={16} />
        <span style={{ fontSize: 13 }}>
          Preview estático (GitHub Pages). Backend desactivado: interfaz solo demostración.
        </span>
      </div>
      <button
        onClick={() => toast.info('Preview estático: no hay backend conectado.')}
        style={{
          background: 'transparent',
          border: '1px solid var(--border-color)',
          color: 'var(--text-muted)',
          borderRadius: 999,
          padding: '6px 10px',
          cursor: 'pointer',
          fontSize: 12
        }}
      >
        ¿Por qué?
      </button>
    </div>
  );
}

export default function PreviewApp() {
  const [licenseKey, setLicenseKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [screen, setScreen] = useState('upload'); // upload | results | detail
  const [selectedClusterId, setSelectedClusterId] = useState('c1');

  const clusters = useMemo(() => ([
    { id: 'c1', name: '📁 Novia', thumb: svgPlaceholderDataUri('Bride', '#f59e0b') },
    { id: 'c2', name: '📁 Novio', thumb: svgPlaceholderDataUri('Groom', '#2ea043') },
    { id: 'c3', name: '📁 Familia', thumb: svgPlaceholderDataUri('Family', '#646cff') },
    { id: 'c4', name: '📁 Amigos', thumb: svgPlaceholderDataUri('Friends', '#22c55e') },
    { id: 'c5', name: '📁 Invitados', thumb: svgPlaceholderDataUri('Guests', '#60a5fa') },
    { id: 'u', name: '❓ No clasificadas', thumb: svgPlaceholderDataUri('Unclassified', '#9ca3af') },
  ]), []);

  const photos = useMemo(() => {
    const base = selectedClusterId === 'u' ? 'Unclassified' : 'Cluster';
    return Array.from({ length: 12 }).map((_, i) => ({
      id: `${selectedClusterId}-${i}`,
      src: svgPlaceholderDataUri(`${base} Photo ${i + 1}`, '#2ea043'),
    }));
  }, [selectedClusterId]);

  const unlock = (value) => {
    const normalized = (value || '').trim().toUpperCase();
    if (normalized === 'DEMO' || normalized.startsWith('DEMO-')) {
      setIsUnlocked(true);
      toast.success('Modo demo (preview) activado.');
      return;
    }
    toast.info('Preview: escribe DEMO para entrar.');
  };

  if (!isUnlocked) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'radial-gradient(circle at 50% -20%, var(--bg-primary, #2a2a40), var(--bg-tertiary, #000) 90%)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <h1 style={{ textAlign: 'center', marginBottom: 18 }}>
            PhotoCluster <span style={{ fontSize: '0.8rem', color: '#2ea043', border: '1px solid #2ea043', borderRadius: '4px', padding: '2px 6px', verticalAlign: 'middle' }}>PREVIEW</span>
          </h1>

          <PreviewBanner />

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(46, 160, 67, 0.2)',
              width: 64, height: 64, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <Lock size={32} color="#2ea043" />
            </div>

            <h2 style={{ marginTop: 0, color: 'var(--text-main)' }}>Acceso (demo)</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
              Esto es un escaparate para LinkedIn. Para “entrar” a la interfaz, escribe <b>DEMO</b>.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                unlock(licenseKey);
              }}
              style={{ marginTop: 16 }}
            >
              <div style={{ position: 'relative' }}>
                <Key size={18} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="Escribe DEMO para entrar"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 16px 12px 48px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  marginTop: 12,
                  padding: 12,
                  background: '#2ea043',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Entrar
              </button>

              <button
                type="button"
                onClick={() => unlock('DEMO')}
                style={{
                  width: '100%',
                  marginTop: 10,
                  padding: 12,
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                <Play size={16} /> Probar demo (preview)
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '40px' }}>
        PhotoCluster <span style={{ fontSize: '0.8rem', color: '#2ea043', border: '1px solid #2ea043', borderRadius: '4px', padding: '2px 6px', verticalAlign: 'middle' }}>PREVIEW</span>
      </h1>

      <PreviewBanner />

      {screen === 'upload' && (
        <div className="card">
          <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-main)' }}>
            <Upload size={18} /> Subir fotos
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginTop: 16
          }}>
            <div style={{ border: '1px dashed var(--border-color)', borderRadius: 14, padding: 18, background: 'var(--bg-tertiary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-main)', fontWeight: 700 }}>
                <Users size={18} /> Referencias (modo búsqueda)
              </div>
              <p style={{ color: 'var(--text-muted)', margin: '10px 0 0 0', lineHeight: 1.5 }}>
                Desactivado en preview.
              </p>
            </div>
            <div style={{ border: '1px dashed var(--border-color)', borderRadius: 14, padding: 18, background: 'var(--bg-tertiary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-main)', fontWeight: 700 }}>
                <ImageIcon size={18} /> Fotos del evento
              </div>
              <p style={{ color: 'var(--text-muted)', margin: '10px 0 0 0', lineHeight: 1.5 }}>
                Desactivado en preview.
              </p>
            </div>
          </div>

          <button
            onClick={() => setScreen('results')}
            style={{
              width: '100%',
              marginTop: 18,
              padding: 12,
              background: '#2ea043',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10
            }}
          >
            Ver ejemplo de resultados
          </button>

          <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 13, textAlign: 'center' }}>
            Este botón solo cambia de pantalla (no procesa nada).
          </p>
        </div>
      )}

      {screen === 'results' && (
        <div style={{ paddingBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: 'var(--text-main)' }}>Resultados (ejemplo)</h2>
            <button
              onClick={() => setScreen('upload')}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 999,
                padding: '8px 12px',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              Nueva sesión
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem',
          }}>
            {clusters.map((c) => (
              <div
                key={c.id}
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedClusterId(c.id);
                  setScreen('detail');
                }}
              >
                <div style={{
                  width: '100%',
                  height: 150,
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginBottom: 12,
                  background: 'var(--bg-tertiary)'
                }}>
                  <img src={c.thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', wordBreak: 'break-word' }}>{c.name}</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toast.info('Preview: acción desactivada.'); }}
                      title="Renombrar"
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: 4, cursor: 'pointer' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toast.info('Preview: descarga desactivada.'); }}
                      title="Descargar ZIP"
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: 4, cursor: 'pointer' }}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
                <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: 13 }}>
                  Click para abrir la galería (mock).
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {screen === 'detail' && (
        <div style={{ paddingBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setScreen('results')}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
              title="Volver"
            >
              <ArrowLeft />
            </button>
            <h2 style={{ margin: 0, color: 'var(--text-main)' }}>Galería (ejemplo)</h2>
            <span style={{ color: 'var(--text-muted)' }}>({photos.length} fotos)</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {photos.map((p) => (
              <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden', height: 250 }}>
                <img src={p.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
