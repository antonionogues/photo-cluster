import { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { Edit2, Check, X, Download, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ResultsStep({ eventId, onOpenCluster, onReset }) {
    const { t } = useTranslation();
    const [clusters, setClusters] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newName, setNewName] = useState("");

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isMergeInfoOpen, setIsMergeInfoOpen] = useState(false);

    const loadData = async () => {
        try {
            const res = await api.get(`/simple/results/${eventId}`);
            setClusters(res.data);
        } catch (err) {
            toast.error(t('load_error'));
        }
    };

    useEffect(() => {
        loadData();
    }, [eventId]);

    const handleRename = async (e, id) => {
        e.stopPropagation();
        try {
            await api.post(`/simple/cluster/${id}/rename`, { new_name: newName });
            toast.success(t('rename_success'));
            setEditingId(null);
            loadData();
        } catch (err) {
            toast.error(t('error_generic'));
        }
    };

    const handleDownloadZip = async (e, id, name) => {
        e.stopPropagation();
        try {
            const link = document.createElement('a');
            link.href = `${api.defaults.baseURL || ''}/simple/cluster/${id}/download`;
            link.download = `${name}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            toast.error(t('error_zip'));
        }
    }

    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            if (selectedIds.length >= 2) {
                toast.info(t('merge_warning'));
                return;
            }
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleMerge = async () => {
        if (selectedIds.length !== 2) return;
        const [id1, id2] = selectedIds;

        if (!confirm(t('merge_confirm'))) return;

        try {
            await api.post('/simple/cluster/merge', {
                source_cluster_id: id2,
                target_cluster_id: id1
            });
            toast.success(t('merge_success'));
            setSelectedIds([]);
            setSelectionMode(false);
            loadData();
        } catch (err) {
            toast.error(t('error_merge'));
        }
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ margin: 0, color: 'var(--text-main)' }}>{t('results_title')}</h2>
                    <button
                        onClick={() => {
                            setSelectionMode(!selectionMode);
                            setSelectedIds([]);
                        }}
                        style={{
                            background: selectionMode ? 'var(--accent-gold)' : 'transparent',
                            border: '1px solid var(--accent-gold)', padding: '0.4rem 1rem', borderRadius: '20px',
                            color: selectionMode ? 'white' : 'var(--accent-gold)', fontSize: '0.9rem', marginRight: '0.5rem'
                        }}
                    >
                        {selectionMode ? t('cancel') : t('merge_button')}
                    </button>

                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                            onClick={() => setIsMergeInfoOpen(!isMergeInfoOpen)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                            title={t('merge_help_title')}
                        >
                            <HelpCircle size={18} />
                        </button>

                        {isMergeInfoOpen && (
                            <div style={{
                                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                                marginTop: '10px', background: 'var(--bg-tertiary)', color: 'var(--text-main)', padding: '1rem',
                                borderRadius: '8px', width: '250px', zIndex: 100,
                                boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid var(--border-color)'
                            }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{t('merge_help_title')}</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--text-muted)' }}>
                                    {t('merge_help_desc')}
                                    <br /><br />
                                    {t('merge_help_inst')}
                                </p>
                                <button
                                    onClick={() => setIsMergeInfoOpen(false)}
                                    style={{
                                        width: '100%', marginTop: '0.8rem', padding: '6px',
                                        background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)', borderRadius: '4px', cursor: 'pointer'
                                    }}
                                >
                                    {t('understood')}
                                </button>
                                <div style={{
                                    position: 'absolute', top: '-7px', left: '50%', marginLeft: '-6px',
                                    width: 12, height: 12, background: 'var(--bg-tertiary)',
                                    borderLeft: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)',
                                    transform: 'rotate(45deg)'
                                }} />
                            </div>
                        )}
                    </div>

                    {selectionMode && selectedIds.length === 2 && (
                        <button
                            onClick={handleMerge}
                            style={{
                                background: '#2ea043', border: 'none', padding: '0.4rem 1rem',
                                borderRadius: '20px', color: 'white', fontWeight: 'bold',
                                animation: 'popIn 0.3s'
                            }}
                        >
                            {t('confirm_merge_btn')}
                        </button>
                    )}
                </div>

                <button onClick={onReset} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.8rem 1.5rem', borderRadius: '8px' }}>
                    {t('new_session')}
                </button>
            </div>

            {/* CSS Grid for Strict Alignment */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem'
            }}>
                {/* Special Card for Unclassified */}
                <div
                    onClick={() => !selectionMode && onOpenCluster('unclassified')}
                    className="card"
                    style={{
                        breakInside: 'avoid', cursor: selectionMode ? 'not-allowed' : 'pointer',
                        background: 'var(--bg-secondary)', border: '1px dashed var(--border-color)',
                        padding: '1rem',
                        opacity: selectionMode ? 0.3 : 1
                    }}
                >
                    <div style={{
                        width: '100%', height: '150px', borderRadius: '8px',
                        background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '1rem', border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ fontSize: '3rem' }}>❓</div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>{t('unclassified')}</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('review_discards')}</p>
                    </div>
                </div>

                {clusters.map((cluster) => {
                    const isSelected = selectedIds.includes(cluster.id);
                    return (
                        <motion.div
                            key={cluster.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                            onClick={() => {
                                if (selectionMode) toggleSelection(cluster.id);
                                else onOpenCluster(cluster.id);
                            }}
                            style={{
                                breakInside: 'avoid', cursor: 'pointer',
                                padding: '1rem', background: isSelected ? 'rgba(0,113,227,0.1)' : 'var(--bg-secondary)',
                                border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                                position: 'relative'
                            }}
                        >
                            {selectionMode && (
                                <div style={{
                                    position: 'absolute', top: 10, left: 10, width: 20, height: 20,
                                    borderRadius: '50%', border: '2px solid white',
                                    background: isSelected ? '#646cff' : 'transparent', zIndex: 10
                                }} />
                            )}

                            {/* Thumbnail */}
                            <div style={{
                                width: '100%', height: '150px', borderRadius: '8px',
                                overflow: 'hidden', marginBottom: '1rem', background: 'var(--bg-tertiary)'
                            }}>
                                {cluster.thumbnail_path ? (
                                    <img
                                        src={`${api.defaults.baseURL || ''}/media/clusters/${cluster.thumbnail_path}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'var(--bg-tertiary)' }}>
                                        {t('no_photo_placeholder')}
                                    </div>
                                )}
                            </div>

                            {/* Title & Actions */}
                            {
                                editingId === cluster.id ? (
                                    <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            autoFocus
                                            style={{
                                                background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-main)',
                                                padding: '0.3rem', borderRadius: '4px', width: '100%'
                                            }}
                                        />
                                        <button onClick={e => handleRename(e, cluster.id)} style={{ background: '#2ea043', border: 'none', borderRadius: '4px', padding: '0.3rem', color: 'white' }}><Check size={16} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} style={{ background: '#d32f2f', border: 'none', borderRadius: '4px', padding: '0.3rem', color: 'white' }}><X size={16} /></button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', wordBreak: 'break-all', color: 'var(--text-main)' }}>{cluster.folder_name}</h3>
                                        {!selectionMode && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    title={t('rename_tooltip')}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingId(cluster.id);
                                                        setNewName(cluster.folder_name);
                                                    }}
                                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: 4, cursor: 'pointer' }}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    title={t('zip_tooltip')}
                                                    onClick={(e) => handleDownloadZip(e, cluster.id, cluster.folder_name)}
                                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: 4, cursor: 'pointer' }}
                                                >
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        </motion.div>
                    );
                })}
            </div>
        </div >
    );
}
