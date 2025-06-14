

import { Translations } from './types';

export enum Language {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  KM = 'km',
}; // Added semicolon

export const DEFAULT_LANGUAGE: Language = Language.EN;
export const SUPPORTED_LANGUAGES: Language[] = [Language.EN, Language.ES, Language.FR, Language.KM];

export const MAX_IMAGE_SIZE_MB = 4;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const PLACEHOLDER_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
export const PLACEHOLDER_VIDEO_POSTER_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";


export const translations: Translations = {
  [Language.EN]: {
    loginTitle: "Login to KH AI Chat",
    usernameLabel: "Username",
    passwordLabel: "Password (dummy)",
    loginButton: "Login",
    logoutButton: "Logout",
    sendMessagePlaceholder: "Type your message or use microphone...",
    sendMessageButton: "Send",
    chatWithAI: "Chat with KH AI", 
    appTitleBrand: "KH AI", 
    apiKeyMissing: "Error: KH AI API Key is not configured. Please set the API_KEY environment variable in your deployment or update index.html for local development.",
    errorPrefix: "Error:",
    systemGreeting: "Hello! I am your KH AI assistant. How can I help you today? You can type, speak, or upload images (JPEG, PNG, WEBP, max 4MB).",
    languageLabel: "Language:",
    selectLanguage: "Select Language",
    aiTyping: "KH AI is typing...",
    failedToInitSession: "Failed to initialize chat session. Check API key and network.",
    failedToSendMessage: "Failed to send message. Please try again.",
    geminiServiceUnavailable: "KH AI service is currently unavailable. Please check your API key and network connection.",
    defaultUsername: "Chat User",
    uploadImageButtonLabel: "Upload Image",
    imagePreviewAlt: "Image preview",
    clearSelectedImageButtonLabel: "Clear selected image",
    imageTooLargeError: "Image is too large. Max size: {0}MB.",
    invalidImageTypeError: "Invalid image type. Please select a JPEG, PNG, or WEBP image.",
    generatingImagePreview: "Generating image preview...",
    imageSentWithName: "Image: {0}",
    recordMessageButtonLabel: "Record voice message",
    stopRecordingButtonLabel: "Stop recording",
    listeningStatus: "Listening...",
    sttErrorNoMicPermission: "Microphone access denied. Please allow microphone access in your browser settings.",
    sttErrorNoSpeechDetected: "No speech was detected. Please try again.",
    sttErrorNetwork: "A network error occurred during speech recognition. Please check your internet connection and try again.",
    sttErrorAborted: "Speech recognition was aborted. Please try again.",
    sttErrorGeneric: "An error occurred during speech recognition.",
    sttUnsupported: "Speech-to-text is not supported by your browser.",
    interimTranscriptPlaceholder: "Speak now...",
    ttsErrorGeneric: "An error occurred during text-to-speech.",
    ttsUnsupported: "Text-to-speech is not supported by your browser.",
    speakAiMessageLabel: "Speak KH AI response",
    stopSpeakingAiMessageLabel: "Stop speaking KH AI response",
    chatHistoryTitle: "Chat History",
    newChatButton: "New Chat",
    deleteChatButtonLabel: "Delete chat",
    confirmDeleteChatTitle: "Confirm Delete",
    confirmDeleteChatMessage: "Are you sure you want to delete the chat \"{0}\"?",
    cancelButton: "Cancel",
    deleteButton: "Delete",
    loadChatError: "Error loading chat. Please try again or start a new chat.",
    noChatsYet: "No chats yet. Start a new conversation!",
    sidebarToggleOpen: "Open chat history",
    sidebarToggleClose: "Close chat history",
    defaultChatTitle: "New Chat",
    aiResponseLanguageInstruction: "Please respond in English.",
    videoDownloaderTitle: "Video Downloader (Simulated)",
    videoUrlInputLabel: "Video URL (YouTube, TikTok, Facebook)",
    videoUrlInputPlaceholder: "Enter video link here...",
    startDownloadButton: "Start Download",
    simulatingDownloadStatus: "Simulating download for: {0}...",
    downloadCompleteStatus: "Simulated download complete for: {0}.",
    downloadFailedStatus: "Simulated download failed for: {0}. This might be an invalid URL or unsupported platform (for this demo).",
    invalidUrlStatus: "Please enter a valid video URL.",
    downloaderExplanation: "Note: This is a UI demonstration. Actual video downloading from these platforms is complex, often against their Terms of Service, and requires a backend service. No actual download will occur.",
    backToChatButton: "Back to Chat",
    switchToDownloaderViewLabel: "Open Video Downloader",
    youtubeIconLabel: "YouTube",
    tiktokIconLabel: "TikTok",
    facebookIconLabel: "Facebook",
    videoPlayerTitle: "Downloaded Video Preview",
    saveVideoButtonLabel: "Save Video",
    videoSavedFeedback: "Video Saved! (Simulated)",
    appPoweredBy: "Powered by KH AI",
    runCodeButtonLabel: "Run Code",
    codeSimulationModalTitle: "Code Execution Simulation",
    simulatingExecutionText: "Simulating execution of the following code:",
    codeOutputSimulatedPlaceholder: "[Simulated output will appear here]",
    closeModalButtonLabel: "Close",
    editButtonLabel: "Edit",
    editUserMessageModalTitle: "Edit Your Message",
    saveChangesButton: "Save Changes",
    cancelEditButton: "Cancel",
    codeEditableInModalHint: "This code is editable.",
    copyButtonLabel: "Copy text",
    copiedFeedbackText: "Copied!",
    themeLabel: "Theme:",
    themeLight: "Light", 
    themeDark: "Dark", 
    themeSystem: "System", 
  },
  [Language.ES]: {
    loginTitle: "Iniciar Sesión en KH AI Chat",
    usernameLabel: "Usuario",
    passwordLabel: "Contraseña (simulada)",
    loginButton: "Iniciar Sesión",
    logoutButton: "Cerrar Sesión",
    sendMessagePlaceholder: "Escribe tu mensaje o usa el micrófono...",
    sendMessageButton: "Enviar",
    chatWithAI: "Chatea con KH AI",
    appTitleBrand: "KH AI",
    apiKeyMissing: "Error: La clave API de KH AI no está configurada. Por favor, establece la variable de entorno API_KEY en tu despliegue o actualiza index.html para desarrollo local.",
    errorPrefix: "Error:",
    systemGreeting: "¡Hola! Soy tu asistente KH AI. ¿Cómo puedo ayudarte hoy? Puedes escribir, hablar o subir imágenes (JPEG, PNG, WEBP, máx 4MB).",
    languageLabel: "Idioma:",
    selectLanguage: "Seleccionar Idioma",
    aiTyping: "KH AI está escribiendo...",
    failedToInitSession: "Error al iniciar la sesión de chat. Comprueba la clave API y la red.",
    failedToSendMessage: "Error al enviar el mensaje. Inténtalo de nuevo.",
    geminiServiceUnavailable: "El servicio KH AI no está disponible actualmente. Verifica tu clave de API y conexión de red.",
    defaultUsername: "Usuario de Chat",
    uploadImageButtonLabel: "Subir Imagen",
    imagePreviewAlt: "Vista previa de la imagen",
    clearSelectedImageButtonLabel: "Eliminar imagen seleccionada",
    imageTooLargeError: "La imagen es demasiado grande. Tamaño máximo: {0}MB.",
    invalidImageTypeError: "Tipo de imagen no válido. Selecciona una imagen JPEG, PNG o WEBP.",
    generatingImagePreview: "Generando vista previa de la imagen...",
    imageSentWithName: "Imagen: {0}",
    recordMessageButtonLabel: "Grabar mensaje de voz",
    stopRecordingButtonLabel: "Detener grabación",
    listeningStatus: "Escuchando...",
    sttErrorNoMicPermission: "Acceso al micrófono denegado. Permite el acceso al micrófono en la configuración de tu navegador.",
    sttErrorNoSpeechDetected: "No se detectó voz. Inténtalo de nuevo.",
    sttErrorNetwork: "Ocurrió un error de red durante el reconocimiento de voz. Por favor, comprueba tu conexión a internet e inténtalo de nuevo.",
    sttErrorAborted: "Se abortó el reconocimiento de voz. Inténtalo de nuevo.",
    sttErrorGeneric: "Ocurrió un error durante el reconocimiento de voz.",
    sttUnsupported: "Tu navegador no admite la conversión de voz a texto.",
    interimTranscriptPlaceholder: "Habla ahora...",
    ttsErrorGeneric: "Ocurrió un error durante la conversión de texto a voz.",
    ttsUnsupported: "Tu navegador no admite la conversión de texto a voz.",
    speakAiMessageLabel: "Leer respuesta de KH AI",
    stopSpeakingAiMessageLabel: "Dejar de leer respuesta de KH AI",
    chatHistoryTitle: "Historial de Chats",
    newChatButton: "Nuevo Chat",
    deleteChatButtonLabel: "Eliminar chat",
    confirmDeleteChatTitle: "Confirmar Eliminación",
    confirmDeleteChatMessage: "¿Estás seguro de que quieres eliminar el chat \"{0}\"?",
    cancelButton: "Cancelar",
    deleteButton: "Eliminar",
    loadChatError: "Error al cargar el chat. Inténtalo de nuevo o inicia un nuevo chat.",
    noChatsYet: "Aún no hay chats. ¡Inicia una nueva conversación!",
    sidebarToggleOpen: "Abrir historial de chats",
    sidebarToggleClose: "Cerrar historial de chats",
    defaultChatTitle: "Nuevo Chat",
    aiResponseLanguageInstruction: "Por favor, responde en español.",
    videoDownloaderTitle: "Descargador de Video (Simulado)",
    videoUrlInputLabel: "URL del Video (YouTube, TikTok, Facebook)",
    videoUrlInputPlaceholder: "Introduce el enlace del video aquí...",
    startDownloadButton: "Iniciar Descarga",
    simulatingDownloadStatus: "Simulando descarga para: {0}...",
    downloadCompleteStatus: "Descarga simulada completa para: {0}.",
    downloadFailedStatus: "Falló la descarga simulada para: {0}. Podría ser una URL inválida o plataforma no soportada (para esta demo).",
    invalidUrlStatus: "Por favor, introduce una URL de video válida.",
    downloaderExplanation: "Nota: Esto es una demostración de UI. La descarga real de videos de estas plataformas es compleja, a menudo va en contra de sus Términos de Servicio y requiere un servicio backend. No se realizará ninguna descarga real.",
    backToChatButton: "Volver al Chat",
    switchToDownloaderViewLabel: "Abrir Descargador de Video",
    youtubeIconLabel: "YouTube",
    tiktokIconLabel: "TikTok",
    facebookIconLabel: "Facebook",
    videoPlayerTitle: "Vista Previa del Video Descargado",
    saveVideoButtonLabel: "Guardar Video",
    videoSavedFeedback: "¡Video Guardado! (Simulado)",
    appPoweredBy: "Impulsado por KH AI",
    runCodeButtonLabel: "Ejecutar Código",
    codeSimulationModalTitle: "Simulación de Ejecución de Código",
    simulatingExecutionText: "Simulando ejecución del siguiente código:",
    codeOutputSimulatedPlaceholder: "[La salida simulada aparecerá aquí]",
    closeModalButtonLabel: "Cerrar",
    editButtonLabel: "Editar",
    editUserMessageModalTitle: "Editar Tu Mensaje",
    saveChangesButton: "Guardar Cambios",
    cancelEditButton: "Cancelar",
    codeEditableInModalHint: "Este código es editable.",
    copyButtonLabel: "Copiar texto",
    copiedFeedbackText: "¡Copiado!",
    themeLabel: "Tema:",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeSystem: "Sistema",
  },
  [Language.FR]: {
    loginTitle: "Connexion au Chat KH AI",
    usernameLabel: "Nom d'utilisateur",
    passwordLabel: "Mot de passe (fictif)",
    loginButton: "Connexion",
    logoutButton: "Déconnexion",
    sendMessagePlaceholder: "Écrivez votre message ou utilisez le microphone...",
    sendMessageButton: "Envoyer",
    chatWithAI: "Discutez avec KH AI",
    appTitleBrand: "KH AI",
    apiKeyMissing: "Erreur : La clé API KH AI n'est pas configurée. Veuillez définir la variable d'environnement API_KEY dans votre déploiement ou mettre à jour index.html pour le développement local.",
    errorPrefix: "Erreur:",
    systemGreeting: "Bonjour ! Je suis votre assistant KH AI. Comment puis-je vous aider aujourd'hui ? Vous pouvez écrire, parler ou télécharger des images (JPEG, PNG, WEBP, max 4MB).",
    languageLabel: "Langue:",
    selectLanguage: "Sélectionner la langue",
    aiTyping: "KH AI écrit...",
    failedToInitSession: "Échec de l'initialisation de la session de chat. Vérifiez la clé API et le réseau.",
    failedToSendMessage: "Échec de l'envoi du message. Veuillez réessayer.",
    geminiServiceUnavailable: "Le service KH AI est currently indisponible. Veuillez vérifier votre clé API et votre connexion réseau.",
    defaultUsername: "Utilisateur de Chat",
    uploadImageButtonLabel: "Télécharger une image",
    imagePreviewAlt: "Aperçu de l'image",
    clearSelectedImageButtonLabel: "Effacer l'image sélectionnée",
    imageTooLargeError: "L'image est trop volumineuse. Taille maximale : {0}Mo.",
    invalidImageTypeError: "Type d'image invalide. Veuillez sélectionner une image JPEG, PNG ou WEBP.",
    generatingImagePreview: "Génération de l'aperçu de l'image...",
    imageSentWithName: "Image : {0}",
    recordMessageButtonLabel: "Enregistrer un message vocal",
    stopRecordingButtonLabel: "Arrêter l'enregistrement",
    listeningStatus: "Écoute en cours...",
    sttErrorNoMicPermission: "Accès au microphone refusé. Veuillez autoriser l'accès au microphone dans les paramètres de votre navigateur.",
    sttErrorNoSpeechDetected: "Aucune parole n'a été détectée. Veuillez réessayer.",
    sttErrorNetwork: "Une erreur réseau s'est produite lors de la reconnaissance vocale. Veuillez vérifier votre connexion internet et réessayer.",
    sttErrorAborted: "La reconnaissance vocale a été interrompue. Veuillez réessayer.",
    sttErrorGeneric: "Une erreur s'est produite lors de la reconnaissance vocale.",
    sttUnsupported: "La synthèse vocale n'est pas prise en charge par votre navigateur.",
    interimTranscriptPlaceholder: "Parlez maintenant...",
    ttsErrorGeneric: "Une erreur s'est produite lors de la synthèse vocale.",
    ttsUnsupported: "La synthèse vocale n'est pas prise en charge par votre navigateur.",
    speakAiMessageLabel: "Lire la réponse de KH AI",
    stopSpeakingAiMessageLabel: "Arrêter la lecture de la réponse de KH AI",
    chatHistoryTitle: "Historique des Chats",
    newChatButton: "Nouveau Chat",
    deleteChatButtonLabel: "Supprimer le chat",
    confirmDeleteChatTitle: "Confirmer la Suppression",
    confirmDeleteChatMessage: "Êtes-vous sûr de vouloir supprimer le chat « {0} » ?",
    cancelButton: "Annuler",
    deleteButton: "Supprimer",
    loadChatError: "Erreur lors du chargement du chat. Veuillez réessayer ou démarrer un nouveau chat.",
    noChatsYet: "Aucun chat pour le moment. Démarrez une nouvelle conversation !",
    sidebarToggleOpen: "Ouvrir l'historique des chats",
    sidebarToggleClose: "Fermer l'historique des chats",
    defaultChatTitle: "Nouveau Chat",
    aiResponseLanguageInstruction: "Veuillez répondre en français.",
    videoDownloaderTitle: "Téléchargeur de Vidéo (Simulé)",
    videoUrlInputLabel: "URL de la Vidéo (YouTube, TikTok, Facebook)",
    videoUrlInputPlaceholder: "Entrez le lien de la vidéo ici...",
    startDownloadButton: "Démarrer le Téléchargement",
    simulatingDownloadStatus: "Simulation du téléchargement pour : {0}...",
    downloadCompleteStatus: "Téléchargement simulé terminé pour : {0}.",
    downloadFailedStatus: "Échec du téléchargement simulé pour : {0}. URL invalide ou plateforme non prise en charge (pour cette démo).",
    invalidUrlStatus: "Veuillez entrer une URL de vidéo valide.",
    downloaderExplanation: "Note : Ceci est une démonstration d'interface utilisateur. Le téléchargement réel de vidéos depuis ces plateformes est complexe, souvent contraire à leurs Conditions d'Utilisation, et nécessite un service backend. Aucun téléchargement réel ne sera effectué.",
    backToChatButton: "Retour au Chat",
    switchToDownloaderViewLabel: "Ouvrir le Téléchargeur de Vidéo",
    youtubeIconLabel: "YouTube",
    tiktokIconLabel: "TikTok",
    facebookIconLabel: "Facebook",
    videoPlayerTitle: "Aperçu de la Vidéo Téléchargée",
    saveVideoButtonLabel: "Enregistrer la Vidéo",
    videoSavedFeedback: "Vidéo Enregistrée ! (Simulé)",
    appPoweredBy: "Optimisé par KH AI",
    runCodeButtonLabel: "Exécuter le Code",
    codeSimulationModalTitle: "Simulation d'Exécution de Code",
    simulatingExecutionText: "Simulation de l'exécution du code suivant :",
    codeOutputSimulatedPlaceholder: "[La sortie simulée apparaîtra ici]",
    closeModalButtonLabel: "Fermer",
    editButtonLabel: "Modifier",
    editUserMessageModalTitle: "Modifier Votre Message",
    saveChangesButton: "Enregistrer les Modifications",
    cancelEditButton: "Annuler",
    codeEditableInModalHint: "Ce code est modifiable.",
    copyButtonLabel: "Copier le texte",
    copiedFeedbackText: "Copié !",
    themeLabel: "Thème:",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeSystem: "Système",
  },
  [Language.KM]: {
    loginTitle: "ចូលប្រើ KH AI Chat",
    usernameLabel: "ឈ្មោះអ្នកប្រើ",
    passwordLabel: "ពាក្យសម្ងាត់ (សាកល្បង)",
    loginButton: "ចូលប្រើ",
    logoutButton: "ចាកចេញ",
    sendMessagePlaceholder: "វាយសាររបស់អ្នក ឬប្រើមីក្រូហ្វូន...",
    sendMessageButton: "ផ្ញើ",
    chatWithAI: "ជជែកជាមួយ KH AI",
    appTitleBrand: "KH AI",
    apiKeyMissing: "កំហុស៖ លេខកូដ API របស់ KH AI មិនត្រូវបានកំណត់ទេ។ សូមកំណត់អថេរ API_KEY នៅក្នុងការដាក់ពង្រាយរបស់អ្នក ឬធ្វើបច្ចុប្បន្នភាព index.html សម្រាប់ការអភិវឌ្ឍក្នុងតំបន់។",
    errorPrefix: "កំហុស៖",
    systemGreeting: "សួស្តី! ខ្ញុំជាជំនួយការ KH AI របស់អ្នក។ តើខ្ញុំអាចជួយអ្នកអ្វីបានខ្លះថ្ងៃនេះ? អ្នកអាចវាយ, និយាយ ឬបង្ហោះរូបភាព (JPEG, PNG, WEBP, អតិបរមា 4MB)។",
    languageLabel: "ភាសា៖",
    selectLanguage: "ជ្រើសរើសភាសា",
    aiTyping: "KH AI កំពុងវាយ...",
    failedToInitSession: "បរាជ័យក្នុងការចាប់ផ្តើមវគ្គជជែក។ សូមពិនិត្យលេខកូដ API និងបណ្តាញ។",
    failedToSendMessage: "បរាជ័យក្នុងការផ្ញើសារ។ សូម​ព្យាយាម​ម្តង​ទៀត។",
    geminiServiceUnavailable: "សេវាកម្ម KH AI បច្ចុប្បន្នមិនអាចប្រើបានទេ។ សូមពិនិត្យមើលសោ API និងការតភ្ជាប់បណ្តាញរបស់អ្នក។",
    defaultUsername: "អ្នកប្រើប្រាស់ជជែក",
    uploadImageButtonLabel: "បង្ហោះរូបភាព",
    imagePreviewAlt: "មើលរូបភាពជាមុន",
    clearSelectedImageButtonLabel: "លុបរូបភាពដែលបានជ្រើសរើស",
    imageTooLargeError: "រូបភាពធំពេក។ ទំហំអតិបរមា៖ {0}MB។",
    invalidImageTypeError: "ប្រភេទរូបភាពមិនត្រឹមត្រូវ។ សូមជ្រើសរើសរូបភាពជា JPEG, PNG, ឬ WEBP។",
    generatingImagePreview: "កំពុងបង្កើតការមើលរូបភាពជាមុន...",
    imageSentWithName: "រូបភាព៖ {0}",
    recordMessageButtonLabel: "ថតសារជាសំឡេង",
    stopRecordingButtonLabel: "បញ្ឈប់ការថត",
    listeningStatus: "កំពុងស្ដាប់...",
    sttErrorNoMicPermission: "ការចូលប្រើមីក្រូហ្វូនត្រូវបានបដិសេធ។ សូមអនុញ្ញាតការចូលប្រើមីក្រូហ្វូននៅក្នុងការកំណត់កម្មវិធីរុករករបស់អ្នក។",
    sttErrorNoSpeechDetected: "រកមិនឃើញការនិយាយទេ។ សូមព្យាយាមម្តងទៀត។",
    sttErrorNetwork: "មានបញ្ហាបណ្តាញកើតឡើងកំឡុងពេលសម្គាល់ការនិយាយ។ សូមពិនិត្យមើលការតភ្ជាប់អ៊ីនធឺណិតរបស់អ្នក ហើយព្យាយាមម្តងទៀត។",
    sttErrorAborted: "ការសម្គាល់ការនិយាយត្រូវបានបោះបង់។ សូមព្យាយាមម្តងទៀត។",
    sttErrorGeneric: "មានកំហុសមួយបានកើតឡើងកំឡុងពេលសម្គាល់ការនិយាយ។",
    sttUnsupported: "កម្មវិធីរុករករបស់អ្នកមិនគាំទ្រការបម្លែងការនិយាយទៅជាអត្ថបទទេ។",
    interimTranscriptPlaceholder: "និយាយឥឡូវនេះ...",
    ttsErrorGeneric: "មានកំហុសមួយបានកើតឡើងកំឡុងពេលបម្លែងអត្ថបទទៅជាការនិយាយ។",
    ttsUnsupported: "កម្មវិធីរុករករបស់អ្នកមិនគាំទ្រការបម្លែងអត្ថបទទៅជាការនិយាយទេ។",
    speakAiMessageLabel: "អានចម្លើយ KH AI",
    stopSpeakingAiMessageLabel: "ឈប់អានចម្លើយ KH AI",
    chatHistoryTitle: "ប្រវត្តិជជែក",
    newChatButton: "ចាប់ផ្តើមការជជែកថ្មី",
    deleteChatButtonLabel: "លុបការជជែក",
    confirmDeleteChatTitle: "បញ្ជាក់ការលុប",
    confirmDeleteChatMessage: "តើអ្នកពិតជាចង់លុបការជជែក \"{0}\" មែនទេ?",
    cancelButton: "បោះបង់",
    deleteButton: "លុប",
    loadChatError: "មានបញ្ហាក្នុងការផ្ទុកការជជែក។ សូមព្យាយាមម្តងទៀត ឬចាប់ផ្តើមការជជែកថ្មី។",
    noChatsYet: "មិនទាន់មានការជជែកទេ។ ចាប់ផ្តើមការសន្ទនាថ្មី!",
    sidebarToggleOpen: "បើកប្រវត្តិជជែក",
    sidebarToggleClose: "បិទប្រវត្តិជជែក",
    defaultChatTitle: "ការជជែកថ្មី",
    aiResponseLanguageInstruction: "សូមឆ្លើយតបជាភាសាខ្មែរ។",
    videoDownloaderTitle: "កម្មវិធីទាញយកវីដេអូ (ក្លែងធ្វើ)",
    videoUrlInputLabel: "URL វីដេអូ (YouTube, TikTok, Facebook)",
    videoUrlInputPlaceholder: "បញ្ចូលតំណវីដេអូនៅទីនេះ...",
    startDownloadButton: "ចាប់ផ្តើមទាញយក",
    simulatingDownloadStatus: "កំពុងក្លែងធ្វើការទាញយកសម្រាប់៖ {0}...",
    downloadCompleteStatus: "ការទាញយកក្លែងធ្វើបានបញ្ចប់សម្រាប់៖ {0}។",
    downloadFailedStatus: "ការទាញយកក្លែងធ្វើបានបរាជ័យសម្រាប់៖ {0}។ នេះអាចជា URL មិនត្រឹមត្រូវ ឬវេទិកាមិនគាំទ្រ (សម្រាប់ការបង្ហាញនេះ)។",
    invalidUrlStatus: "សូមបញ្ចូល URL វីដេអូដែលត្រឹមត្រូវ។",
    downloaderExplanation: "សម្គាល់៖ នេះគឺជាការបង្ហាញ UI ប៉ុណ្ណោះ។ ការទាញយកវីដេអូពិតប្រាកដពីវេទិកាទាំងនេះមានភាពស្មុគស្មាញ ជាញឹកញាប់បំពានលក្ខខណ្ឌប្រើប្រាស់របស់ពួកគេ ហើយទាមទារសេវាកម្ម backend។ គ្មានការទាញយកពិតប្រាកដណាមួយនឹងកើតឡើងទេ។",
    backToChatButton: "ត្រឡប់ទៅការជជែកវិញ",
    switchToDownloaderViewLabel: "បើកកម្មវិធីទាញយកវីដេអូ",
    youtubeIconLabel: "YouTube",
    tiktokIconLabel: "TikTok",
    facebookIconLabel: "Facebook",
    videoPlayerTitle: "ការបង្ហាញវីដេអូដែលបានទាញយក",
    saveVideoButtonLabel: "រក្សាទុកវីដេអូ",
    videoSavedFeedback: "វីដេអូបានរក្សាទុក! (ក្លែងធ្វើ)",
    appPoweredBy: "ដំណើរការដោយ KH AI",
    runCodeButtonLabel: "ដំណើរការកូដ",
    codeSimulationModalTitle: "ការក្លែងធ្វើការដំណើរការកូដ",
    simulatingExecutionText: "កំពុងក្លែងធ្វើការដំណើរការកូដខាងក្រោម៖",
    codeOutputSimulatedPlaceholder: "[លទ្ធផលក្លែងធ្វើនឹងបង្ហាញនៅទីនេះ]",
    closeModalButtonLabel: "បិទ",
    editButtonLabel: "កែសម្រួល",
    editUserMessageModalTitle: "កែសម្រួលសាររបស់អ្នក",
    saveChangesButton: "រក្សាទុកការផ្លាស់ប្តូរ",
    cancelEditButton: "បោះបង់",
    codeEditableInModalHint: "កូដនេះអាចកែសម្រួលបាន។",
    copyButtonLabel: "ចម្លងអត្ថបទ",
    copiedFeedbackText: "បានចម្លង!",
    themeLabel: "រចនាប័ទ្ម៖",
    themeLight: "ពន្លឺ",
    themeDark: "ងងឹត",
    themeSystem: "ប្រព័ន្ធ",
  }
};

export const GEMINI_CHAT_MODEL = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_SYSTEM_INSTRUCTION = "You are KH AI, a friendly and helpful AI assistant. When asked about your name or identity, you should state that you are KH AI. If an image is provided, analyze it in conjunction with the text. If no text is provided with an image, describe the image or respond to any implicit question it might pose. Respond concisely unless asked for detail.";
export const CHAT_HISTORY_KEY = 'geminiAIChatHistory';
export const MAX_TITLE_LENGTH = 30;
export const USER_MESSAGE_FOR_TITLE_MAX_LENGTH = 50;
export const DOWNLOADER_SIMULATION_DURATION = 3000;