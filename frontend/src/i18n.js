import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "app_title": "PhotoCluster",
            "upload_title": "Upload Photos",
            "history_btn": "History",
            "mode_help_title": "Which mode to choose?",
            "ref_photos_title": "1. Reference Photos (Who are we looking for?)",
            "event_photos_title": "2. Event Photos",
            "ref_count_singular": "reference",
            "ref_count_plural": "references",
            "remove_all": "Remove All",
            "people_to_find": "People to find",
            "photos_count_singular": "photo",
            "photos_count_plural": "photos",
            "ready_to_process": "Ready to process",
            "duplicates_warning": "Ignored duplicates",
            "upload_error_event": "Please add event photos.",
            "upload_error_search": "Search Mode requires reference photos.",
            "upload_start_msg": "Upload Complete! Processing...",
            "upload_fail_msg": "Upload failed.",
            "supported_formats": "Supports: JPG, PNG, WEBP, ARW, CR2, NEF, DNG",

            // Modal Info
            "mode_auto_title": "Auto Mode",
            "mode_auto_desc": "The system analyzes all photos and groups faces automatically. Ideal for organizing a whole event without knowing guests beforehand.",
            "mode_auto_result": "Result: One folder per person found.",
            "mode_search_title": "Search Mode",
            "mode_search_desc": "You upload reference photos (e.g. the couple) and the system looks ONLY for those people. Ideal for creating custom albums.",
            "mode_search_result": "Result: One folder only for the specific people you indicated.",
            "understood": "Understood",

            "drop_zone": "Check files or click here",
            "click_to_explore": "(Or click to explore)",
            "processing": "Processing...",
            "processing_count": "Processing photo {{current}} of {{total}}...",
            "processing_photo": "Processing photo {{current}} of {{total}}...",
            "init_detect": "Starting detection...",
            "analyzing_targets": "Analyzing targets...",
            "analyzing_results": "Analyzing results...",
            "creating_folder": "Creating folder {{name}}...",
            "processing_remaining": "Processing remaining...",
            "completed": "Completed!",
            "event_not_found": "Event not found",
            "results": "Results",
            "unclassified": "Unclassified",
            "review_discards": "Review discards",
            "merge_selected": "Merge Selected",
            "new_session": "New Session",
            "download_zip": "Download ZIP",
            "rename": "Rename",

            // Merge Help
            "merge_help_title": "Folder Merging",
            "merge_help_desc": "Use this if the system separated the same person into two different folders.",
            "merge_help_inst": "Select 2 folders and click 'Merge Selected' to join them.",
            "confirm": "Confirm",
            "cancel": "Cancel",
            "merge_success": "Folders merged successfully!",
            "history": "Session History",
            "admin": "Admin",
            "settings": "Settings",
            "theme_dark": "Midnight Gold",
            "theme_light": "Clean Studio",
            "lang_select": "Language",

            // Upload Step
            "drag_event": "Drag & Drop Event Photos Here",
            "drag_target": "Drag & Drop Reference Photos Here",
            "auto_mode": "Auto Mode (Group All)",
            "search_mode": "Search Mode (Find Specific People)",
            "upload_button": "Start Upload & Process",
            "load_session": "Load Previous Session",
            "upload_error": "Please add event photos.",
            "search_mode_error": "Search Mode requires reference photos.",
            "uploading": "Uploading photos...",
            "upload_success": "Upload Complete!",

            // Processing Step
            "processing_title": "Processing your photos...",
            "starting": "Starting...",

            // Results Step
            "results_title": "Results",
            "download_all": "Download All (ZIP)",
            "merge_button": "Merge Selected",
            "merge_warning": "Select exactly 2 folders to merge.",
            "merge_confirm": "Are you sure you want to merge these folders?",
            "merge_success": "Merged successfully",
            "rename_success": "Renamed successfully",
            "load_error": "Error loading results",

            // Cluster Detail
            "loading": "Loading...",
            "unclassified": "Unclassified",
            "move_photo": "Move Photo",
            "move_modal_title": "Move photo to...",
            "cancel": "Cancel",
            "move_success": "Photo moved successfully",
            "no_photos": "No photos found.",

            // License Guard
            "welcome": "Welcome",
            "license_prompt": "Enter your license key to access PhotoCluster.",
            "license_placeholder": "License Key (e.g. DEMO-2025)",
            "verify_access": "Verify Access",
            "verifying": "Verifying...",
            "try_demo": "Try Free Demo",
            "demo_hint": "(Simulation: Use DEMO-PRO-2025)",
            "error_zip": "Error downloading ZIP",
            "error_merge": "Error merging folders",
            "error_photos": "Error loading photos",
            "error_move": "Error moving photo",
            "no_photo_placeholder": "No Photo",
            "rename_tooltip": "Rename",
            "zip_tooltip": "Download ZIP",
            "unclassified_option": "❓ Unclassified (Discard)",
            "confirm_merge_btn": "Confirm Merge"
        }
    },
    es: {
        translation: {
            "app_title": "PhotoCluster",
            "upload_title": "Subir Fotos",
            "history_btn": "Historial",
            "mode_help_title": "¿Qué modo elegir?",
            "ref_photos_title": "1. Fotos de Referencia (¿A quién buscamos?)",
            "event_photos_title": "2. Fotos del Evento",
            "ref_count_singular": "referencia",
            "ref_count_plural": "referencias",
            "remove_all": "Eliminar Todas",
            "people_to_find": "Personas a buscar",
            "photos_count_singular": "foto",
            "photos_count_plural": "fotos",
            "ready_to_process": "Listo para procesar",
            "duplicates_warning": "Duplicados ignorados",
            "upload_error_event": "Por favor, añade fotos del evento.",
            "upload_error_search": "Modo Búsqueda requiere fotos de referencia.",
            "upload_start_msg": "¡Subida completa! Procesando...",
            "upload_fail_msg": "Error en la subida.",
            "supported_formats": "Soporta: JPG, PNG, WEBP, ARW, CR2, NEF, DNG",

            // Modal Info
            "mode_auto_title": "Modo Automático",
            "mode_auto_desc": "El sistema analiza todas las fotos y agrupa las caras automáticamente. Ideal para organizar un evento completo sin saber a priori quiénes son los invitados.",
            "mode_auto_result": "Resultado: Una carpeta por cada persona encontrada.",
            "mode_search_title": "Modo Búsqueda",
            "mode_search_desc": "Subes fotos de referencia (ej: los novios) y el sistema busca SOLO a esas personas. Ideal para crear álbumes personalizados.",
            "mode_search_result": "Resultado: Una carpeta solo para las personas que has indicado.",
            "understood": "Entendido",

            "drop_zone": "Arrastra archivos o haz clic aquí",
            "click_to_explore": "(O haz click para explorar)",
            "processing": "Procesando...",
            "processing_count": "Procesando foto {{current}} de {{total}}...",
            "processing_photo": "Procesando foto {{current}} de {{total}}...",
            "init_detect": "Iniciando detección...",
            "analyzing_targets": "Analizando objetivos...",
            "analyzing_results": "Analizando resultados...",
            "creating_folder": "Creando carpeta {{name}}...",
            "processing_remaining": "Procesando restantes...",
            "completed": "¡Completado!",
            "event_not_found": "Evento no encontrado",
            "results": "Resultados",
            "unclassified": "No Clasificadas",
            "review_discards": "Revisar descartes",
            "merge_selected": "Fusionar Seleccionadas",
            "new_session": "Nueva Sesión",
            "download_zip": "Descargar ZIP",
            "rename": "Renombrar",

            // Merge Help
            "merge_help_title": "Fusión de Carpetas",
            "merge_help_desc": "Úsalo si el sistema ha separado a una misma persona en dos carpetas distintas.",
            "merge_help_inst": "Selecciona 2 carpetas y pulsa 'Fusionar Seleccionadas' para unirlas.",
            "confirm": "Confirmar",
            "cancel": "Cancelar",
            "merge_success": "¡Carpetas fusionadas!",
            "history": "Historial de Sesiones",
            "admin": "Admin",
            "settings": "Configuración",
            "theme_dark": "Midnight Gold (Oscuro)",
            "theme_light": "Clean Studio (Claro)",
            "lang_select": "Idioma",

            // Upload Step
            "drag_event": "Arrastra tus fotos del evento aquí",
            "drag_target": "Arrastra tus fotos de referencia aquí",
            "auto_mode": "Modo Automático (Agrupar Todos)",
            "search_mode": "Modo Búsqueda (Buscar Personas)",
            "upload_button": "Subir y Procesar",
            "load_session": "Cargar Sesión Anterior",
            "upload_error": "Por favor, añade fotos del evento.",
            "search_mode_error": "Modo Búsqueda requiere fotos de referencia.",
            "uploading": "Subiendo fotos...",
            "upload_success": "¡Subida Completada!",

            // Processing Step
            "processing_title": "Procesando tus fotografías...",
            "starting": "Iniciando...",

            // Results Step
            "results_title": "Resultados",
            "download_all": "Descargar Todo (ZIP)",
            "merge_button": "Fusionar Seleccionados",
            "merge_warning": "Solo se pueden fusionar 2 carpetas a la vez.",
            "merge_confirm": "¿Seguro que quieres fusionar estas dos carpetas?",
            "merge_success": "Fusionado correctamente",
            "rename_success": "Renombrado correctamente",
            "load_error": "Error cargando resultados",

            // Cluster Detail
            "loading": "Cargando...",
            "unclassified": "No Clasificadas",
            "move_photo": "Mover foto",
            "move_modal_title": "Mover foto a...",
            "cancel": "Cancelar",
            "move_success": "Foto movida correctamente",
            "no_photos": "No se encontraron fotos.",

            // License Guard
            "welcome": "Bienvenido",
            "license_prompt": "Introduce tu clave de licencia para acceder a PhotoCluster.",
            "license_placeholder": "Clave de Licencia (ej. DEMO-2025)",
            "verify_access": "Verificar Acceso",
            "verifying": "Verificando...",
            "try_demo": "Probar Demo Gratis",
            "demo_hint": "(Simulación: Usa DEMO-PRO-2025)",
            "error_zip": "Error descargando ZIP",
            "error_merge": "Error al fusionar carpetas",
            "error_photos": "Error cargando fotos",
            "error_move": "Error moviendo foto",
            "no_photo_placeholder": "Sin Foto",
            "rename_tooltip": "Renombrar",
            "zip_tooltip": "Descargar ZIP",
            "unclassified_option": "❓ No Clasificadas (Descartar)",
            "confirm_merge_btn": "Confirmar Fusión"
        }
    },
    fr: {
        translation: {
            "app_title": "PhotoCluster",
            "upload_title": "Télécharger des Photos",
            "history_btn": "Historique",
            "mode_help_title": "Quel mode choisir ?",

            "ref_photos_title": "1. Photos de Référence (Qui cherchons-nous ?)",
            "event_photos_title": "2. Photos de l'Événement",
            "ref_count_singular": "référence",
            "ref_count_plural": "références",
            "remove_all": "Tout Supprimer",
            "people_to_find": "Personnes à trouver",
            "photos_count_singular": "photo",
            "photos_count_plural": "photos",
            "ready_to_process": "Prêt à traiter",
            "duplicates_warning": "Doublons ignorés",
            "upload_error_event": "Veuillez ajouter des photos.",
            "upload_error_search": "Le mode recherche nécessite des références.",
            "upload_start_msg": "Téléchargement terminé! Traitement...",
            "upload_fail_msg": "Échec du téléchargement.",
            "supported_formats": "Supporte : JPG, PNG, WEBP, ARW, CR2, NEF, DNG",

            // Modal Info
            "mode_auto_title": "Mode Auto",
            "mode_auto_desc": "Le système analyse toutes les photos et regroupe les visages automatiquement.",
            "mode_auto_result": "Résultat : Un dossier par personne trouvée.",
            "mode_search_title": "Mode Recherche",
            "mode_search_desc": "Vous téléchargez des photos de référence et le système cherche UNIQUEMENT ces personnes.",
            "mode_search_result": "Résultat : Un dossier pour les personnes indiquées.",
            "understood": "Compris",

            "drop_zone": "Déposez les fichiers ou cliquez ici",
            "click_to_explore": "(Ou cliquez pour explorer)",
            "processing": "Traitement en cours...",
            "processing_count": "Traitement photo {{current}} sur {{total}}...",
            "processing_photo": "Traitement photo {{current}} sur {{total}}...",
            "init_detect": "Démarrage de la détection...",
            "analyzing_targets": "Analyse des cibles...",
            "analyzing_results": "Analyse des résultats...",
            "creating_folder": "Création du dossier {{name}}...",
            "processing_remaining": "Traitement restant...",
            "completed": "Terminé !",
            "event_not_found": "Événement non trouvé",
            "results": "Résultats",
            "unclassified": "Non Classées",
            "review_discards": "Revoir les rejets",
            "merge_selected": "Fusionner la sélection",
            "new_session": "Nouvelle Session",
            "download_zip": "Télécharger ZIP",
            "rename": "Renommer",

            // Merge Help
            "merge_help_title": "Fusion de Dossiers",
            "merge_help_desc": "Utilisez ceci si le système a séparé une même personne dans deux dossiers différents.",
            "merge_help_inst": "Sélectionnez 2 dossiers et cliquez sur 'Fusionner' pour les unir.",
            "confirm": "Confirmer",
            "cancel": "Annuler",
            "merge_success": "Dossiers fusionnés !",
            "history": "Historique",
            "admin": "Admin",
            "settings": "Paramètres",
            "theme_dark": "Or de Minuit",
            "theme_light": "Studio Propre",
            "lang_select": "Langue",

            // Upload Step
            "drag_event": "Déposez les photos de l'événement ici",
            "drag_target": "Déposez les photos de référence ici",
            "auto_mode": "Mode Auto (Tout Regrouper)",
            "search_mode": "Mode Recherche (Trouver des Personnes)",
            "upload_button": "Télécharger et Traiter",
            "load_session": "Charger Session Précédente",
            "upload_error": "Veuillez ajouter des photos de l'événement.",
            "search_mode_error": "Le mode recherche nécessite des photos de référence.",
            "uploading": "Téléchargement...",
            "upload_success": "Téléchargement Terminé!",

            // Processing Step
            "processing_title": "Traitement de vos photos...",
            "starting": "Démarrage...",

            // Results Step
            "results_title": "Résultats",
            "download_all": "Tout Télécharger (ZIP)",
            "merge_button": "Fusionner la Sélection",
            "merge_warning": "Sélectionnez exactement 2 dossiers à fusionner.",
            "merge_confirm": "Êtes-vous sûr de vouloir fusionner ces dossiers ?",
            "merge_success": "Fusionné avec succès",
            "rename_success": "Renommé avec succès",
            "load_error": "Erreur de chargement",

            // Cluster Detail
            "loading": "Chargement...",
            "unclassified": "Non Classé",
            "move_photo": "Déplacer la photo",
            "move_modal_title": "Déplacer la photo vers...",
            "cancel": "Annuler",
            "move_success": "Photo déplacée avec succès",
            "no_photos": "Aucune photo trouvée.",

            // License Guard
            "welcome": "Bienvenue",
            "license_prompt": "Entrez votre clé de licence pour accéder à PhotoCluster.",
            "license_placeholder": "Clé de Licence (ex. DEMO-2025)",
            "verify_access": "Vérifier l'Accès",
            "verifying": "Vérification...",
            "try_demo": "Essayer la Démo Gratuite",
            "demo_hint": "(Simulation: Utilisez DEMO-PRO-2025)",
            "error_zip": "Erreur lors du téléchargement du ZIP",
            "error_merge": "Erreur lors de la fusion",
            "error_photos": "Erreur lors du chargement des photos",
            "error_move": "Erreur lors du déplacement",
            "no_photo_placeholder": "Pas de Photo",
            "rename_tooltip": "Renommer",
            "zip_tooltip": "Télécharger ZIP",
            "unclassified_option": "❓ Non Classées (Rejeter)",
            "confirm_merge_btn": "Confirmer la Fusion"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
