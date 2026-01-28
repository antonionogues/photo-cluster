import { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { ArrowLeft, Move, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ClusterDetail({ eventId, clusterId, onBack }) {
    const { t } = useTranslation();
    const [photos, setPhotos] = useState([]);
    const [info, setInfo] = useState({ name: t('loading') });
    const [allClusters, setAllClusters] = useState([]); // For move destination

    // Lightbox
    const [lightboxIndex, setLightboxIndex] = useState(null);

    // Modal for Move
    const [movingPhoto, setMovingPhoto] = useState(null); // {id, ...}
    const [showMoveModal, setShowMoveModal] = useState(false);

    const isUnclassified = clusterId === 'unclassified';

    const loadData = async () => {
        try {
            if (isUnclassified) {
                const res = await api.get(`/simple/unclassified/${eventId}`);
                setPhotos(res.data);
                setInfo({ name: t('unclassified'), isUnclassified: true });
            } else {
                const res = await api.get(`/simple/cluster/${clusterId}`);
                setPhotos(res.data.photos);
                setInfo({ name: res.data.folder_name, id: res.data.id });
            }

            // Load list of all clusters for the "Move" dropdown
            const clustersRes = await api.get(`/simple/results/${eventId}`);
            setAllClusters(clustersRes.data);

        } catch (err) {
            toast.error(t('error_photos'));
        }
    };

    useEffect(() => {
        loadData();
    }, [eventId, clusterId]);

    const handleMove = async (targetClusterId) => {
        if (!movingPhoto) return;

        try {
            await api.post('/simple/photo/move', {
                photo_id: movingPhoto.id,
                target_cluster_id: targetClusterId // null for unclassified
            });
            toast.success(t('move_success'));
            setShowMoveModal(false);
            setMovingPhoto(null);
            loadData(); // Refresh grid
        } catch (e) {
            toast.error(t('error_move'));
        }
    };

    // Lightbox Navigation
    const nextPhoto = (e) => {
        e && e.stopPropagation();
        setLightboxIndex((prev) => (prev + 1) % photos.length);
    };
    const prevPhoto = (e) => {
        e && e.stopPropagation();
        setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    // Keyboard support
    useEffect(() => {
        const handleKey = (e) => {
            if (lightboxIndex === null) return;
            if (e.key === "ArrowRight") nextPhoto();
            if (e.key === "ArrowLeft") prevPhoto();
            if (e.key === "Escape") setLightboxIndex(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxIndex]);

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={onBack} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
                    <ArrowLeft />
                </button>
                <h2 style={{ margin: 0, color: 'var(--text-main)' }}>{info.name}</h2>
                <span style={{ color: 'var(--text-muted)' }}>({photos.length} {t('photos_count_plural')})</span>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem'
            }}>
                {photos.map((photo, idx) => (
                    <div
                        key={photo.id}
                        className="card"
                        style={{ padding: 0, overflow: 'hidden', position: 'relative', cursor: 'zoom-in', height: '250px' }}
                        onClick={() => setLightboxIndex(idx)}
                    >
                        <img
                            src={`${api.defaults.baseURL || ''}${photo.web_path}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        {/* Hover Actions */}
                        <div
                            className="photo-actions"
                            style={{
                                position: 'absolute', top: 5, right: 5, display: 'flex', gap: 5
                            }}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMovingPhoto(photo);
                                    setShowMoveModal(true);
                                }}
                                title="Mover foto"
                                style={{
                                    background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white',
                                    borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Move size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Move Modal */}
            {showMoveModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '400px', maxHeight: '80vh', overflowY: 'auto', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>
                        <h3>{t('move_modal_title')}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {/* Option: Unclassified */}
                            {!isUnclassified && (
                                <button
                                    onClick={() => handleMove(null)}
                                    style={{ padding: '1rem', background: 'var(--bg-tertiary)', border: '1px dashed var(--border-color)', color: 'var(--text-main)', cursor: 'pointer' }}
                                >
                                    {t('unclassified_option')}
                                </button>
                            )}

                            {allClusters.map(c => {
                                if (c.id === info.id) return null; // Skip current
                                return (
                                    <button
                                        key={c.id}
                                        onClick={() => handleMove(c.id)}
                                        style={{ padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', textAlign: 'left', cursor: 'pointer' }}
                                    >
                                        📁 {c.folder_name}
                                    </button>
                                );
                            })}
                        </div>
                        <button onClick={() => setShowMoveModal(false)} style={{ marginTop: '1rem', width: '100%', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'pointer' }}>{t('cancel')}</button>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && photos[lightboxIndex] && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.95)', zIndex: 3000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onClick={() => setLightboxIndex(null)}
                >
                    <button onClick={prevPhoto} style={{ position: 'absolute', left: 20, fontSize: '3rem', background: 'transparent', border: 'none', color: 'white' }}>&lt;</button>

                    <img
                        src={`${api.defaults.baseURL || ''}${photos[lightboxIndex].web_path}`}
                        style={{ maxWidth: '90%', maxHeight: '90%', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}
                        onClick={e => e.stopPropagation()}
                    />

                    <button onClick={nextPhoto} style={{ position: 'absolute', right: 20, fontSize: '3rem', background: 'transparent', border: 'none', color: 'white' }}>&gt;</button>
                </div>
            )}
        </div>
    );
}
