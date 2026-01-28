import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../api';
import { toast } from 'react-toastify';
import { Upload, Users, Image as ImageIcon, HelpCircle, X, CheckCircle, Trash2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UploadStep({ onUploadComplete, onLoadSession }) {
    const { t } = useTranslation();
    const [mode, setMode] = useState('auto'); // 'auto' or 'search'
    const [eventFiles, setEventFiles] = useState([]);
    const [targetFiles, setTargetFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // History Logic
    const [history, setHistory] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    useEffect(() => {
        api.get('/simple/history')
            .then(res => setHistory(res.data))
            .catch(err => console.error("Error fetching history", err));
    }, []);

    // Dropzone for Event Photos
    const onDropEvent = useCallback(acceptedFiles => {
        setEventFiles(prev => {
            const newFiles = acceptedFiles.filter(file => !prev.some(p => p.name === file.name));
            if (newFiles.length < acceptedFiles.length) {
                toast.warning("Ignored duplicates");
            }
            return [...prev, ...newFiles];
        });
    }, []);
    const { getRootProps: getEventProps, getInputProps: getEventInputProps, isDragActive: isEventDrag } = useDropzone({ onDrop: onDropEvent });

    // Dropzone for Targets
    const onDropTarget = useCallback(acceptedFiles => {
        setTargetFiles(prev => {
            const newFiles = acceptedFiles.filter(file => !prev.some(p => p.name === file.name));
            if (newFiles.length < acceptedFiles.length) {
                toast.warning("Ignored duplicates");
            }
            return [...prev, ...newFiles];
        });
    }, []);
    const { getRootProps: getTargetProps, getInputProps: getTargetInputProps, isDragActive: isTargetDrag } = useDropzone({ onDrop: onDropTarget });

    const handleStart = async () => {
        if (eventFiles.length === 0) return toast.error(t('upload_error_event'));
        if (mode === 'search' && targetFiles.length === 0) return toast.error(t('upload_error_search'));

        setIsUploading(true);
        const toastId = toast.loading(t('uploading'));

        try {
            // 1. Upload Event
            const formData = new FormData();
            eventFiles.forEach(f => formData.append("files", f));

            const res = await api.post('/simple/upload', formData);
            const eventId = res.data.id;

            // 2. Upload Targets
            if (mode === 'search') {
                const fd = new FormData();
                targetFiles.forEach(f => fd.append("files", f));
                await api.post(`/simple/upload_targets/${eventId}`, fd);
            }

            // 3. Start Process
            await api.post(`/simple/process/${eventId}`);

            toast.update(toastId, { render: t('upload_start_msg'), type: "success", isLoading: false, autoClose: 2000 });
            onUploadComplete(eventId);

        } catch (err) {
            console.error(err);
            toast.update(toastId, { render: t('upload_fail_msg'), type: "error", isLoading: false, autoClose: 3000 });
            setIsUploading(false);
        }
    };

    return (
        <div className="card" style={{ position: 'relative' }}>
            {history.length > 0 && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
                    <button
                        onClick={() => setIsHistoryOpen(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                            padding: '6px 12px', borderRadius: '20px',
                            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem'
                        }}
                    >
                        <Clock size={14} /> {t('history_btn')}
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, color: 'var(--text-main)' }}>{t('mode_help_title')}</h2>
                <button
                    onClick={() => setIsInfoOpen(true)}
                    style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center'
                    }}
                    title={t('mode_help_title')}
                >
                    <HelpCircle size={20} />
                </button>
            </div>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setMode('auto')}
                    style={{
                        background: mode === 'auto' ? '#646cff' : 'var(--bg-tertiary)',
                        border: 'none', padding: '1rem 2rem', borderRadius: '8px',
                        color: mode === 'auto' ? 'white' : 'var(--text-muted)', fontWeight: 'bold',
                        transition: 'all 0.2s'
                    }}
                >
                    <Users size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                    {t('auto_mode')}
                </button>
                <button
                    onClick={() => setMode('search')}
                    style={{
                        background: mode === 'search' ? '#646cff' : 'var(--bg-tertiary)',
                        border: 'none', padding: '1rem 2rem', borderRadius: '8px',
                        color: mode === 'search' ? 'white' : 'var(--text-muted)', fontWeight: 'bold',
                        transition: 'all 0.2s'
                    }}
                >
                    <ImageIcon size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                    {t('search_mode')}
                </button>
            </div>

            {/* Target Upload Area */}
            {mode === 'search' && (
                <div style={{ marginBottom: '2rem', animation: 'fadeIn 0.5s' }}>
                    <h3>{t('ref_photos_title')}</h3>
                    <div
                        {...getTargetProps()}
                        style={{
                            padding: targetFiles.length > 0 ? '1rem' : '3rem',
                            borderRadius: '16px',
                            border: targetFiles.length > 0 ? '2px solid #646cff' : '2px dashed #646cff',
                            background: targetFiles.length > 0 ? 'rgba(100, 108, 255, 0.1)' : 'var(--bg-tertiary)',
                            cursor: 'pointer', transition: 'all 0.3s',
                            position: 'relative', overflow: 'hidden'
                        }}
                    >
                        <input {...getTargetInputProps()} />

                        {targetFiles.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 1rem' }}>
                                {/* Header Row: Title + Delete Action */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            background: '#646cff', width: 50, height: 50, borderRadius: '12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <CheckCircle color="white" size={28} />
                                        </div>
                                        <div style={{ textAlign: 'left' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                                                {targetFiles.length} {targetFiles.length === 1 ? t('ref_count_singular') : t('ref_count_plural')}
                                            </h4>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('people_to_find')}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); setTargetFiles([]); }}
                                        style={{
                                            background: 'transparent', border: '1px solid #555', borderRadius: '6px',
                                            color: '#ff4444',
                                            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem',
                                            transition: 'all 0.2s', whiteSpace: 'nowrap'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <Trash2 size={16} /> {t('remove_all')}
                                    </button>
                                </div>

                                {/* Content Row: Photo Grid */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '1.5rem', width: '100%' }}>
                                    {targetFiles.map((file, i) => (
                                        <div key={i} style={{
                                            width: 70, height: 70, borderRadius: '12px', border: '1px solid #444',
                                            overflow: 'hidden', position: 'relative', flexShrink: 0,
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                        }}>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTargetFiles(prev => prev.filter((_, idx) => idx !== i));
                                                }}
                                                style={{
                                                    position: 'absolute', top: 0, right: 0,
                                                    background: 'rgba(0,0,0,0.6)', color: 'white',
                                                    border: 'none', cursor: 'pointer', padding: '4px',
                                                    borderBottomLeftRadius: '6px', display: 'flex'
                                                }}
                                                title="Eliminar foto"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('drag_target')}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('click_to_explore')}</p>
                                <p style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', marginTop: '4px' }}>{t('supported_formats')}</p>
                                <small style={{ color: 'var(--text-muted)' }}>{targetFiles.length} {t('photos_count_plural')}</small>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Event Upload Area */}
            <div style={{ marginBottom: '2rem' }}>
                <h3>{t('event_photos_title')}</h3>
                <div
                    {...getEventProps()}
                    style={{
                        padding: eventFiles.length > 0 ? '1rem' : '3rem',
                        borderRadius: '16px',
                        border: eventFiles.length > 0 ? '2px solid #2ea043' : '2px dashed #666',
                        background: eventFiles.length > 0 ? 'rgba(46, 160, 67, 0.1)' : 'var(--bg-tertiary)',
                        cursor: 'pointer', transition: 'all 0.3s',
                        position: 'relative', overflow: 'hidden'
                    }}
                >
                    <input {...getEventInputProps()} />

                    {eventFiles.length > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    background: '#2ea043', width: 50, height: 50, borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <CheckCircle color="white" size={28} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                                        {eventFiles.length} {eventFiles.length === 1 ? t('photos_count_singular') : t('photos_count_plural')}
                                    </h4>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('ready_to_process')}</p>
                                </div>
                            </div>

                            {/* Micro Thumbnails Preview */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '-10px' }}>
                                    {eventFiles.slice(0, 5).map((file, i) => (
                                        <div key={i} style={{
                                            width: 40, height: 40, borderRadius: '8px', border: '2px solid #1a1a1a',
                                            overflow: 'hidden', marginLeft: i > 0 ? -15 : 0, zIndex: 5 - i
                                        }}>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                                            />
                                        </div>
                                    ))}
                                    {eventFiles.length > 5 && (
                                        <div style={{
                                            width: 40, height: 40, borderRadius: '8px', background: '#333', color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
                                            fontWeight: 'bold', marginLeft: -15, zIndex: 0, border: '2px solid #1a1a1a'
                                        }}>
                                            +{eventFiles.length - 5}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setEventFiles([]); }}
                                    title="Eliminar todas"
                                    style={{
                                        background: '#333', border: '1px solid #555', borderRadius: '8px',
                                        padding: '0.5rem', cursor: 'pointer', color: '#ff4444', display: 'flex'
                                    }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <Upload size={48} color="#666" style={{ marginBottom: '1rem' }} />
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{t('drag_event')}</p>
                            <p style={{ color: 'var(--text-muted)' }}>{t('click_to_explore')}</p>
                            <p style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', marginTop: '6px' }}>{t('supported_formats')}</p>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={handleStart}
                        disabled={isUploading}
                        className="btn-primary"
                        style={{ width: '100%', maxWidth: '300px', fontSize: '1.1rem', marginTop: '2rem' }}
                    >
                        {isUploading ? t('uploading') : t('upload_button')}
                    </button>
                </div>
            </div>

            {/* Info Modal */}
            {isInfoOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 999,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backdropFilter: 'blur(5px)', animation: 'fadeIn 0.2s'
                }} onClick={() => setIsInfoOpen(false)}>
                    <div style={{
                        background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px',
                        maxWidth: '500px', width: '90%', border: '1px solid var(--border-color)',
                        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }} onClick={e => e.stopPropagation()}>

                        <button
                            onClick={() => setIsInfoOpen(false)}
                            style={{
                                position: 'absolute', top: '1rem', right: '1rem',
                                background: 'transparent', border: 'none', color: '#666', cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{ marginTop: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                            <HelpCircle size={24} color="#646cff" />
                            {t('mode_help_title')}
                        </h3>

                        <div style={{ marginTop: '1.5rem' }}>
                            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users size={18} color="#646cff" /> {t('mode_auto_title')}
                            </h4>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                                {t('mode_auto_desc')}
                                <br /><small style={{ color: 'var(--text-muted)' }}>{t('mode_auto_result')}</small>
                            </p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ImageIcon size={18} color="#646cff" /> {t('mode_search_title')}
                            </h4>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                                {t('mode_search_desc')}
                                <br /><small style={{ color: 'var(--text-muted)' }}>{t('mode_search_result')}</small>
                            </p>
                        </div>

                        <button
                            onClick={() => setIsInfoOpen(false)}
                            style={{
                                width: '100%', marginTop: '2rem', padding: '12px',
                                background: 'var(--bg-tertiary)', color: 'var(--text-main)', border: 'none', borderRadius: '8px',
                                cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            {t('understood')}
                        </button>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {isHistoryOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 999,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backdropFilter: 'blur(5px)', animation: 'fadeIn 0.2s'
                }} onClick={() => setIsHistoryOpen(false)}>
                    <div style={{
                        background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px',
                        maxWidth: '400px', width: '90%', border: '1px solid var(--border-color)',
                        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }} onClick={e => e.stopPropagation()}>

                        <button
                            onClick={() => setIsHistoryOpen(false)}
                            style={{
                                position: 'absolute', top: '1rem', right: '1rem',
                                background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{ marginTop: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                            <Clock size={24} color="#2ea043" />
                            {t('history')}
                        </h3>

                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {history.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>{t('no_sessions')}</p>
                            ) : (
                                history.map(h => (
                                    <button
                                        key={h.id}
                                        onClick={() => onLoadSession(h.id)}
                                        style={{
                                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px',
                                            cursor: 'pointer', textAlign: 'left', color: 'var(--text-main)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 'bold' }}>{h.label}</span>
                                        </div>
                                        <Users size={16} color="var(--text-muted)" />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
