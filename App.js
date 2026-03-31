import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { hasFirebaseConfig, loadRemoteState, saveRemoteState } from "./firebaseConfig";
const appLogoDataUri =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAADGklEQVR42u2aa29MURSGzz8lCIIQmpaq6f3e6WWqnd51ehm9m+r9Oi1tSpUKEUKIEEKIEH7AS6MfRKqmZ699zl57ryd5Pu+V503mw8x4niAIgiAw5UfeIUgFzXy/chh+lXo++RY5AmqlagZ8jRyFbqXyHnzJP4agleq7fC44jrB0OvynwhMwRefifyw6CdN0Jv6H4lMwVevjvy8+DdO1Nv67kjPgonXx35aeBTetGuBN2Tlw05r4r8vPg6vs47+quADush7gZUUWuMs2/ovKbNgiywGeV+XAFtnFf1Z9EbbJaoCnNbkIwh2CeovVAE+il6HDTND1Npv4j6N5oNYPOu5gMcCj2ggoVYH6FhYDPKzLB5UUUN7DYoDt+gJQSAnVTSwGuN9QBAopobqJxQBbsWKoqgOKu1gMsBkrgao6oLjL+Ph3G8tAoQ6objN+hI2r5VBVBxR3sfgIWm+qhIo6Ub2NxQBrzVVQVQcUd7EY4Fa8GqrqgOIuFgOsxqNQVQcUd7EYIN1SC1V1QHEXiwGWW+tAISVUN7H5SnqxrQGqUkJxD6sfZObbY6CQAqpbWA0w19EIKlWgvIPdD/MzHU2g0g+U77P8W8p0ZzOozQQd73pcmeyKQ6c76H7D48zEtVZw1+POeHcbuOrZQirRAW56NjGW6AQ3PdsY6ekCFz1bGe7thul6tjPYl4Cpeq4w0N8D0/RcI5nsgyl6LtOf7EdYesJveq8nEbRSfQ8SAwPQrVTOgO7BQVArVX3SNTQEv0o9RTqHR6CqVFSgfXgUqkpFn7SNjIFKqemDltEUqJSaByQ+Ng5qpeoBaLoxAWqlaoY0piahS6mbAbHUFHQpdf9D/fgMdCuV96Hu5ix0K5X3IToxB91K5X9QM7mAoJTae1A1tYiglNp/UTG1hKCV6n9QPp1G0Er1XUpnVhCWUv8XJbOrCEvn4xfN3UbYOj1A4fwawtbpAfLn1xG2zsaPLGzAFJ0cIG/xDkzRufi5S5swTacGuLR8D6bpTPyc9BZM1YkBstMPYKrWx89a2YbpyncTgiAIgiAIgiAIFvMTibILFS3YI8gAAAAASUVORK5CYII=";

const fallbackImageUrl =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80";

const defaultUserProvince = "San José";
const { width: screenWidth } = Dimensions.get("window");

const provinceCoordinates = {
  "San José": { latitude: 9.9281, longitude: -84.0907 },
  Alajuela: { latitude: 10.0163, longitude: -84.2116 },
  Cartago: { latitude: 9.8644, longitude: -83.9194 },
  Heredia: { latitude: 10.0024, longitude: -84.1165 },
  Guanacaste: { latitude: 10.6346, longitude: -85.4407 },
  Puntarenas: { latitude: 9.9763, longitude: -84.8384 },
  Limón: { latitude: 9.991, longitude: -83.0379 },
};

const seedSpots = [
  {
    id: "1",
    name: "Catarata La Fortuna",
    mapUrl: "https://maps.google.com/?q=Catarata+La+Fortuna",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    location: "Alajuela",
    province: "Alajuela",
    type: "Montaña",
    user: "@CR_Adventures",
    features: ["caminata", "mirador"],
  },
  {
    id: "2",
    name: "Mirador Uvita",
    mapUrl: "https://maps.google.com/?q=Mirador+Uvita",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    location: "Puntarenas",
    province: "Puntarenas",
    type: "Playa",
    user: "@BeachExplorer7",
    features: ["entraAuto", "mirador"],
  },
  {
    id: "3",
    name: "Parque Nacional Volcán Irazú",
    mapUrl: "https://maps.google.com/?q=Volcan+Irazu",
    imageUrl:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=800&q=80",
    location: "Cartago",
    province: "Cartago",
    type: "Montaña",
    user: "@MountainViews",
    features: ["solo4x4", "caminata"],
  },
  {
    id: "4",
    name: "Puerto Viejo",
    mapUrl: "https://maps.google.com/?q=Puerto+Viejo+Limon",
    imageUrl:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
    location: "Limón",
    province: "Limón",
    type: "Playa",
    user: "@WildcrViews",
    features: ["petFriendly", "entraAuto"],
  },
  {
    id: "5",
    name: "Parque La Sabana",
    mapUrl: "https://maps.google.com/?q=Parque+La+Sabana",
    imageUrl:
      "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=800&q=80",
    location: "San José",
    province: "San José",
    type: "Urbano",
    user: "@NatureLoverCR",
    features: ["entraAuto", "rioCerca"],
  },
];

const provinces = [
  "Todas",
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limón",
];

const spotTypes = ["Todos", "Playa", "Montaña", "Catarata", "Urbano", "Sendero"];

const spotTypeLabelsEn = {
  Todos: "All",
  Playa: "Beach",
  Montaña: "Mountain",
  Catarata: "Waterfall",
  Urbano: "Urban",
  Sendero: "Trail",
};


const spotFeatureOptions = [
  { key: "solo4x4", label: "Solo 4x4", icon: "car-sport" },
  { key: "entraAuto", label: "Entra automóvil", icon: "car" },
  { key: "caminata", label: "Ruta caminata", icon: "walk-outline" },
  { key: "petFriendly", label: "Pet friendly", icon: "paw-outline" },
  { key: "mirador", label: "Mirador", icon: "eye-outline" },
  { key: "rioCerca", label: "Río cerca", icon: "water-outline" },
];

const spotFeatureLabelsEn = {
  solo4x4: "4x4 only",
  entraAuto: "Car access",
  caminata: "Hiking route",
  petFriendly: "Pet friendly",
  mirador: "Viewpoint",
  rioCerca: "River nearby",
};

export default function App() {
  const [spots, setSpots] = useState(seedSpots);
  const [activeTab, setActiveTab] = useState("home");
  const [searchText, setSearchText] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("Todas");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [searchFeatureFilter, setSearchFeatureFilter] = useState("all");
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [creatorSearchText, setCreatorSearchText] = useState("");
  const [selectedHomeSpot, setSelectedHomeSpot] = useState(null);
  const [detailSourceTab, setDetailSourceTab] = useState("home");
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [creatorReturnTab, setCreatorReturnTab] = useState("buscar");
  const [creatorSpotSort, setCreatorSpotSort] = useState("popular");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [gallerySourceTab, setGallerySourceTab] = useState("detalle");
  const [commentDraft, setCommentDraft] = useState("");
  const [spotComments, setSpotComments] = useState({
    "1": [
      { id: "c1", user: "@TicoRutas", text: "La caminata vale totalmente la pena." },
      { id: "c2", user: "@AventureraCR", text: "Fui temprano y no había tanta gente." },
    ],
    "2": [{ id: "c3", user: "@SurfLife", text: "Atardecer increíble, recomendado." }],
    "3": [{ id: "c4", user: "@GeoCR", text: "Lleva abrigo, arriba hace frío." }],
    "4": [{ id: "c5", user: "@CaribeLover", text: "Ambiente super chill y buena comida." }],
    "5": [{ id: "c6", user: "@SJWalks", text: "Perfecto para ir en familia." }],
  });
  const [contentReports, setContentReports] = useState([]);
  const [commentLikes, setCommentLikes] = useState({});
  const [commentReplies, setCommentReplies] = useState({});
  const [replyDraftByComment, setReplyDraftByComment] = useState({});
  const [replyInputVisible, setReplyInputVisible] = useState({});

  const [newSpot, setNewSpot] = useState({
    name: "",
    description: "",
    province: "San José",
    type: "Playa",
    spotPhotos: [],
    locationLabel: "",
    features: [],
  });

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 9.9281,
    longitude: -84.0907,
  });
  const [nearbyProvince, setNearbyProvince] = useState(defaultUserProvince);

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    username: "",
    bio: "",
    avatarUrl: "",
    photos: [],
  });

  const [isProfileEditMode, setIsProfileEditMode] = useState(true);
  const [savedProfile, setSavedProfile] = useState(null);
  const [savedSpotIds, setSavedSpotIds] = useState([]);
  const [viewedSpots, setViewedSpots] = useState([]);
  const [settings, setSettings] = useState({
    notifications: true,
    privateProfile: false,
    darkMode: false,
    language: "es",
  });
  const [socialGraph, setSocialGraph] = useState({});
  const [connectionTab, setConnectionTab] = useState("followers");

  const [isRemoteReady, setIsRemoteReady] = useState(false);

  const normalizeUsername = (value) => {
    const clean = value.trim().replace(/^@+/, "");
    return clean ? `@${clean}` : "";
  };

  const theme = settings.darkMode
    ? {
        background: "#0f1115",
        surface: "#1c212b",
        border: "#2f3745",
        text: "#f3f4f6",
        muted: "#aab3c2",
        header: "#310f0f",
        nav: "#1a1f29",
        input: "#222936",
      }
    : {
        background: "#f8f9fb",
        surface: "#ffffff",
        border: "#f0dada",
        text: "#111827",
        muted: "#6b7280",
        header: "#7a1c1c",
        nav: "#ffffff",
        input: "#fffafa",
      };

  const isEnglish = settings.language === "en";
  const uiText = {
    settingsTitle: isEnglish ? "Settings" : "Configuración",
    appTone: isEnglish ? "App theme" : "Tono de la app",
    light: isEnglish ? "Light" : "Claro",
    dark: isEnglish ? "Dark" : "Oscuro",
    notifications: isEnglish ? "Notifications" : "Notificaciones",
    privateProfile: isEnglish ? "Private profile" : "Perfil privado",
    language: isEnglish ? "Language" : "Idioma",
    languageValue: isEnglish ? "English" : "Español",
    recentActivity: isEnglish
      ? "Recent activity (last 3 viewed)"
      : "Actividad reciente (últimos 3 vistos)",
    savedTitle: isEnglish ? "Saved" : "Guardados",
    headerCountry: isEnglish ? "Costa Rica" : "Costa Rica",
    homeFeatured: isEnglish ? "Featured posts" : "Publicaciones destacadas",
    spotsCount: isEnglish ? "spots" : "spots",
    searchSpots: isEnglish ? "Search spots" : "Buscar spots",
    searchByName: isEnglish ? "Search by name..." : "Buscar por nombre...",
    province: isEnglish ? "Province" : "Provincia",
    spotType: isEnglish ? "Spot type" : "Tipo de spot",
    nearbyToggle: isEnglish ? "Recommendations near you" : "Recomendaciones cerca de ti",
    results: isEnglish ? "Results" : "Resultados",
    foundCount: isEnglish ? "found" : "encontrados",
    nearYou: isEnglish ? "Near you" : "Cerca de ti",
    mapResults: isEnglish ? "Map results" : "Resultados en mapa",
    mapHint: isEnglish ? "Tap a pin to open spot detail" : "Toca un pin para abrir el detalle del spot",
    allFeatures: isEnglish ? "All features" : "Todas las características",
    searchCreators: isEnglish ? "Search creators" : "Buscar creadores",
    searchCreatorsPlaceholder: isEnglish ? "Search creator profiles..." : "Buscar perfiles de creadores...",
    openMap: isEnglish ? "Open map" : "Abrir mapa",
    save: isEnglish ? "Save" : "Guardar",
    saved: isEnglish ? "Saved" : "Guardado",
    addSpot: isEnglish ? "Add new spot" : "Agregar nuevo spot",
    spotNamePlaceholder: isEnglish ? "Spot name" : "Nombre del spot",
    spotDescriptionPlaceholder: isEnglish ? "Short description" : "Descripción corta",
    exactLocation: isEnglish ? "Exact spot location" : "Ubicación exacta del spot",
    useMyLocation: isEnglish ? "Use my location" : "Usar mi ubicación",
    openSelectedMap: isEnglish ? "Open selected location in Google Maps" : "Abrir ubicación seleccionada en Google Maps",
    uploadSpotPhotos: isEnglish ? "Upload spot photos (max 10)" : "Cargar fotos del spot (máximo 10)",
    saveSpot: isEnglish ? "Save spot" : "Guardar spot",
    yourProfile: isEnglish ? "Your profile" : "Tu perfil",
    changeProfilePhoto: isEnglish ? "Change profile photo" : "Cambiar foto de perfil",
    fullNamePlaceholder: isEnglish ? "Full name" : "Nombre completo",
    usernamePlaceholder: isEnglish ? "Username (@your_user)" : "Usuario (@tu_usuario)",
    aboutYouPlaceholder: isEnglish ? "Tell us about yourself..." : "Cuéntanos sobre ti...",
    addPhoto: isEnglish ? "Add photo" : "Agregar foto",
    saveProfile: isEnglish ? "Save profile" : "Guardar perfil",
    favorites: isEnglish ? "Favorites" : "Favoritos",
    savedSpotsCount: isEnglish ? "Saved spots" : "Spots guardados",
    notificationsCenter: isEnglish ? "Notifications center" : "Centro de notificaciones",
    latestActivity: isEnglish ? "Latest recent activity" : "Última actividad reciente",
    visited: isEnglish ? "Visited" : "Visitaste",
    navSearch: isEnglish ? "Search" : "Buscar",
    navHome: isEnglish ? "Home" : "Inicio",
    navAdd: isEnglish ? "Add" : "Agregar",
    navProfile: isEnglish ? "Profile" : "Perfil",
    navConfig: isEnglish ? "Settings" : "Config.",
    spotFeatures: isEnglish ? "Spot features" : "Características del spot",
    locationNamePlaceholder: isEnglish
      ? "Location name (e.g. Orosi viewpoint)"
      : "Nombre de ubicación (ej. Mirador de Orosi)",
    noSavedYet: isEnglish ? "You don't have saved spots yet." : "No tienes spots guardados todavía.",
    noFavoritesYet: isEnglish ? "You don't have favorite spots yet." : "No tienes spots favoritos todavía.",
    noNotificationsYet: isEnglish ? "You have no notifications right now." : "No tienes notificaciones por ahora.",
    noRecentViewed: isEnglish
      ? "You haven't viewed spots recently."
      : "Todavía no has visto spots recientemente.",
    visitedLabel: isEnglish ? "Visited" : "Visitaste",
    on: "ON",
    off: "OFF",
    spanishShort: "ES",
    englishShort: "EN",
  };

  const themedInputStyle = {
    backgroundColor: theme.input,
    color: theme.text,
    borderColor: theme.border,
  };
  const themedPlaceholderColor = theme.muted;

  const featureMetaByKey = useMemo(
    () => Object.fromEntries(spotFeatureOptions.map((option) => [option.key, option])),
    []
  );

  const getSpotFeatures = (spot) =>
    Array.isArray(spot?.features) ? spot.features.filter((feature) => featureMetaByKey[feature]) : [];

  const getSpotTypeLabel = (type) => (isEnglish ? spotTypeLabelsEn[type] || type : type);
  const getSpotFeatureLabel = (featureKey) =>
    isEnglish ? spotFeatureLabelsEn[featureKey] || featureMetaByKey[featureKey]?.label || featureKey : featureMetaByKey[featureKey]?.label || featureKey;

  const getFeatureIconSize = (featureKey, context = "default") => {
    const is4x4 = featureKey === "solo4x4";
    const isCompactCar = featureKey === "entraAuto";
    if (context === "overlay") return is4x4 ? 13 : isCompactCar ? 9 : 10;
    if (context === "chip") return is4x4 ? 17 : isCompactCar ? 12 : 13;
    if (context === "badge") return is4x4 ? 14 : isCompactCar ? 11 : 12;
    return is4x4 ? 15 : isCompactCar ? 11 : 12;
  };

  const toggleFeatureForNewSpot = (featureKey) => {

    setNewSpot((current) => {
      const exists = current.features.includes(featureKey);
      return {
        ...current,
        features: exists
          ? current.features.filter((feature) => feature !== featureKey)
          : [...current.features, featureKey],
      };
    });
  };

  const renderSpotFeatureIconsOverlay = (spot, maxIcons = 3) => {
    const featureKeys = getSpotFeatures(spot).slice(0, maxIcons);
    if (!featureKeys.length) return null;

    return (
      <View style={styles.spotImageFeatureOverlay}>
        {featureKeys.map((featureKey) => {
          const feature = featureMetaByKey[featureKey];
          return (
            <View key={`overlay-${spot.id}-${featureKey}`} style={styles.spotImageFeatureIconBadge}>
              <Ionicons name={feature.icon} size={getFeatureIconSize(featureKey, "overlay")} color="#7a1c1c" />
            </View>
          );
        })}
      </View>
    );
  };


  const currentUsername = useMemo(
    () => normalizeUsername(savedProfile?.username || profileForm.username) || "@tu_usuario",
    [profileForm.username, savedProfile?.username]
  );

  const getFollowersForUser = (username) => socialGraph[username]?.followers || [];
  const getFollowingForUser = (username) => socialGraph[username]?.following || [];

  const upsertUserConnectionNode = (graph, username) => {
    if (!username) return graph;
    return {
      ...graph,
      [username]: {
        followers: Array.isArray(graph[username]?.followers) ? graph[username].followers : [],
        following: Array.isArray(graph[username]?.following) ? graph[username].following : [],
      },
    };
  };

  const toggleFollowUser = (targetUsername) => {
    const hasSavedProfile = Boolean(savedProfile?.username?.trim());
    if (!hasSavedProfile) {
      Alert.alert(
        "Debes crear tu perfil",
        "Para seguir usuarios primero debes crear y guardar tu perfil.",
        [
          { text: "Quitar", style: "cancel" },
          {
            text: "Ir a crear perfil",
            onPress: () => {
              setIsProfileEditMode(true);
              setActiveTab("perfil");
            },
          },
        ]
      );
      return;
    }

    if (!targetUsername || targetUsername === currentUsername) return;

    setSocialGraph((current) => {
      let nextGraph = upsertUserConnectionNode(current, currentUsername);
      nextGraph = upsertUserConnectionNode(nextGraph, targetUsername);

      const myFollowing = nextGraph[currentUsername].following;
      const targetFollowers = nextGraph[targetUsername].followers;
      const isFollowing = myFollowing.includes(targetUsername);

      return {
        ...nextGraph,
        [currentUsername]: {
          ...nextGraph[currentUsername],
          following: isFollowing
            ? myFollowing.filter((username) => username !== targetUsername)
            : [...myFollowing, targetUsername],
        },
        [targetUsername]: {
          ...nextGraph[targetUsername],
          followers: isFollowing
            ? targetFollowers.filter((username) => username !== currentUsername)
            : [...targetFollowers, currentUsername],
        },
      };
    });
  };

  const registerViewedSpot = (spot) => {
    if (!spot?.id) return;
    const normalized = normalizeSpot(spot);
    setViewedSpots((current) => {
      const withoutCurrent = current.filter((entry) => entry.id !== normalized.id);
      return [
        {
          id: normalized.id,
          name: normalized.name,
          province: normalized.province,
          type: normalized.type,
          imageUrl: normalized.imageUrl,
          mapUrl: normalized.mapUrl,
          dateLabel: new Date().toLocaleString(),
        },
        ...withoutCurrent,
      ];
    });
  };


  const handleOpenMap = async (url, spot = null) => {
    if (!url) return;
    if (spot) {
      registerViewedSpot(spot);
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  const normalizeSpot = (spot) => ({
    ...spot,
    imageUrl: spot.imageUrl?.trim() ? spot.imageUrl : fallbackImageUrl,
    photos:
      Array.isArray(spot.photos) && spot.photos.length
        ? spot.photos
        : [spot.imageUrl?.trim() ? spot.imageUrl : fallbackImageUrl],
    description: spot.description || "Sin descripción por ahora.",
    location: spot.location || "Costa Rica",
    province: spot.province || "San José",
    type: spot.type || "Spot",
    user: spot.user || "@CR_Adventures",
    features: getSpotFeatures(spot),
  });

  useEffect(() => {
    let isMounted = true;

    const hydrateFromRemote = async () => {
      if (!hasFirebaseConfig) {
        if (isMounted) setIsRemoteReady(true);
        return;
      }

      try {
        const remote = await loadRemoteState();
        if (!remote || !isMounted) return;

        if (Array.isArray(remote.spots)) {
          setSpots(remote.spots.map(normalizeSpot));
        }
        if (remote.savedProfile) {
          setSavedProfile(remote.savedProfile);
        }
        if (Array.isArray(remote.savedSpotIds)) {
          setSavedSpotIds(remote.savedSpotIds);
        }
        if (Array.isArray(remote.viewedSpots)) {
          setViewedSpots(remote.viewedSpots);
        }
        if (remote.settings) {
          setSettings((current) => ({ ...current, ...remote.settings }));
        }
        if (remote.spotComments) {
          setSpotComments(remote.spotComments);
        }
        if (remote.socialGraph) {
          setSocialGraph(remote.socialGraph);
        }
        if (Array.isArray(remote.contentReports)) {
          setContentReports(remote.contentReports);
        }
        if (typeof remote.nearbyProvince === "string" && remote.nearbyProvince.trim()) {
          setNearbyProvince(remote.nearbyProvince);
        }
      } catch (error) {
        console.warn("No se pudo cargar el estado remoto:", error?.message || error);
      } finally {
        if (isMounted) setIsRemoteReady(true);
      }
    };

    hydrateFromRemote();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isRemoteReady || !hasFirebaseConfig) return;

    const timeoutId = setTimeout(async () => {
      try {
        await saveRemoteState({
          spots,
          savedProfile,
          savedSpotIds,
          viewedSpots,
          settings,
          spotComments,
          socialGraph,
          contentReports,
          nearbyProvince,
        });
      } catch (error) {
        console.warn("No se pudo guardar el estado remoto:", error?.message || error);
      }
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [
    isRemoteReady,
    nearbyProvince,
    savedProfile,
    savedSpotIds,
    settings,
    socialGraph,
    contentReports,
    spotComments,
    spots,
    viewedSpots,
  ]);

  const getSpotCoordinate = (spot) => {
    const match = spot?.mapUrl?.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (match) {
      return {
        latitude: Number(match[1]),
        longitude: Number(match[2]),
      };
    }
    return provinceCoordinates[spot?.province] || provinceCoordinates[defaultUserProvince];
  };

  const openHomeSpotDetail = (spot, sourceTab = activeTab) => {
    const normalized = normalizeSpot(spot);
    setSelectedHomeSpot(normalized);
    setSelectedPhotoIndex(null);
    setGalleryImages([]);
    setCommentDraft("");
    setDetailSourceTab(sourceTab);
    setActiveTab("detalle");
    registerViewedSpot(normalized);
  };

  const openCreatorDetail = (creator, sourceTab = activeTab) => {
    setSelectedCreator(creator);
    setCreatorReturnTab(sourceTab);
    setCreatorSpotSort("popular");
    setActiveTab("creador");
  };

  const openGallery = (images, index = 0, sourceTab = "detalle") => {
    if (!images?.length) return;
    setGalleryImages(images);
    setSelectedPhotoIndex(index);
    setGallerySourceTab(sourceTab);
    setActiveTab("galeria");
  };

  const handleProfileQuickActions = () => {
    Alert.alert(isEnglish ? "Quick actions" : "Acciones rápidas", isEnglish ? "What do you want to open?" : "¿Qué quieres abrir?", [
      { text: isEnglish ? "My profile" : "Mi perfil", onPress: () => setActiveTab("perfil") },
      { text: uiText.notifications, onPress: () => setActiveTab("notificaciones") },
      { text: uiText.settingsTitle, onPress: () => setActiveTab("config") },
      { text: isEnglish ? "Cancel" : "Cancelar", style: "cancel" },
    ]);
  };

  const requireSavedProfile = (message) => {
    if (savedProfile?.username?.trim()) return true;

    Alert.alert(
      "Debes crear tu perfil",
      message,
      [
        { text: "Quitar", style: "cancel" },
        {
          text: "Ir a crear perfil",
          onPress: () => {
            setIsProfileEditMode(true);
            setActiveTab("perfil");
          },
        },
      ]
    );
    return false;
  };

  const handleAddComment = () => {
    if (!requireSavedProfile("Para comentar primero debes crear y guardar tu perfil.")) {
      return;
    }

    if (!selectedHomeSpot || !commentDraft.trim()) return;
    const newComment = {
      id: `${selectedHomeSpot.id}-${Date.now()}`,
      user: normalizeUsername(savedProfile?.username || profileForm.username) || "@Visitante",
      text: commentDraft.trim(),
    };
    setSpotComments((current) => ({
      ...current,
      [selectedHomeSpot.id]: [newComment, ...(current[selectedHomeSpot.id] || [])],
    }));
    setCommentDraft("");
  };

  const toggleCommentLike = (commentId) => {
    if (
      !requireSavedProfile("Para dar like en comentarios primero debes crear y guardar tu perfil.")
    ) {
      return;
    }

    setCommentLikes((current) => ({
      ...current,
      [commentId]: current[commentId] ? current[commentId] - 1 : 1,
    }));
  };

  const toggleReplyComposer = (commentId) => {
    if (!requireSavedProfile("Para responder comentarios primero debes crear y guardar tu perfil.")) {
      return;
    }

    setReplyInputVisible((current) => ({
      ...current,
      [commentId]: !current[commentId],
    }));
  };

  const handleReplyDraftChange = (commentId, value) => {
    setReplyDraftByComment((current) => ({
      ...current,
      [commentId]: value,
    }));
  };

  const handleAddReply = (commentId) => {
    if (!requireSavedProfile("Para responder comentarios primero debes crear y guardar tu perfil.")) {
      return;
    }

    const draft = replyDraftByComment[commentId]?.trim();
    if (!selectedHomeSpot || !draft) return;

    const newReply = {
      id: `${commentId}-r-${Date.now()}`,
      user: normalizeUsername(savedProfile?.username || profileForm.username) || "@Visitante",
      text: draft,
    };

    setCommentReplies((current) => ({
      ...current,
      [commentId]: [...(current[commentId] || []), newReply],
    }));
    setReplyDraftByComment((current) => ({
      ...current,
      [commentId]: "",
    }));
    setReplyInputVisible((current) => ({
      ...current,
      [commentId]: false,
    }));
  };

  const registerContentReport = ({ type, targetId, reason, preview }) => {
    const reporter = normalizeUsername(savedProfile?.username || profileForm.username) || "@Visitante";
    setContentReports((current) => [
      {
        id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        targetId,
        reason,
        preview,
        reporter,
        createdAt: new Date().toISOString(),
        status: "pendiente",
      },
      ...current,
    ]);
    Alert.alert("Reporte enviado", "Gracias. Revisaremos este contenido pronto.");
  };

  const openReportReasonPicker = (onSelectReason) => {
    Alert.alert("Reportar contenido", "Selecciona el motivo del reporte.", [
      { text: "Spam", onPress: () => onSelectReason("Spam") },
      { text: "Contenido ofensivo", onPress: () => onSelectReason("Contenido ofensivo") },
      { text: "Información engañosa", onPress: () => onSelectReason("Información engañosa") },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleReportSpot = (spot) => {
    if (!spot?.id) return;
    openReportReasonPicker((reason) =>
      registerContentReport({
        type: "spot",
        targetId: spot.id,
        reason,
        preview: spot.name,
      })
    );
  };

  const handleReportComment = (comment, spotId) => {
    if (!comment?.id) return;
    openReportReasonPicker((reason) =>
      registerContentReport({
        type: "comentario",
        targetId: `${spotId}:${comment.id}`,
        reason,
        preview: comment.text,
      })
    );
  };

  const filteredSpots = useMemo(() => {
    return spots
      .map(normalizeSpot)
      .filter((spot) =>
        searchText.trim()
          ? spot.name.toLowerCase().includes(searchText.trim().toLowerCase())
          : true
      )
      .filter((spot) => (provinceFilter === "Todas" ? true : spot.province === provinceFilter))
      .filter((spot) => (typeFilter === "Todos" ? true : spot.type === typeFilter))
      .filter((spot) =>
        searchFeatureFilter === "all"
          ? true
          : getSpotFeatures(spot).includes(searchFeatureFilter)
      )
      .filter((spot) => (nearbyOnly ? spot.province === nearbyProvince : true));
  }, [nearbyOnly, nearbyProvince, provinceFilter, searchFeatureFilter, searchText, spots, typeFilter]);

  const nearbyRecommendations = useMemo(
    () => spots.map(normalizeSpot).filter((spot) => spot.province === nearbyProvince),
    [nearbyProvince, spots]
  );

  const creators = useMemo(() => {
    const profileCreator = savedProfile
      ? [
          {
            username: savedProfile.username,
            fullName: savedProfile.fullName,
            bio: savedProfile.bio,
            avatarUrl: savedProfile.avatarUrl,
          },
        ]
      : [];

    const fromSpots = spots.map((spot) => {
      const s = normalizeSpot(spot);
      return {
        username: s.user,
        fullName: s.user,
        bio: "Creador de spots",
        avatarUrl: s.imageUrl,
      };
    });

    const map = new Map();
    [...profileCreator, ...fromSpots].forEach((creator) => {
      if (!creator.username) return;
      if (!map.has(creator.username)) {
        map.set(creator.username, creator);
      }
    });

    return Array.from(map.values());
  }, [savedProfile, spots]);

  const creatorsByUsername = useMemo(
    () => Object.fromEntries(creators.map((creator) => [creator.username, creator])),
    [creators]
  );

  useEffect(() => {
    if (!creators.length) return;

    setSocialGraph((current) => {
      let next = current;
      creators.forEach((creator) => {
        if (!creator?.username) return;
        const hasNode = next[creator.username];
        if (hasNode) return;
        if (next === current) next = { ...current };
        next[creator.username] = { followers: [], following: [] };
      });

      if (!next[currentUsername]) {
        if (next === current) next = { ...current };
        next[currentUsername] = { followers: [], following: [] };
      }
      return next;
    });
  }, [creators, currentUsername]);

  const filteredCreators = useMemo(() => {
    if (!creatorSearchText.trim()) return creators;
    const query = creatorSearchText.trim().toLowerCase();
    return creators.filter(
      (creator) =>
        creator.username.toLowerCase().includes(query) ||
        creator.fullName.toLowerCase().includes(query)
    );
  }, [creatorSearchText, creators]);

  const savedSpots = useMemo(
    () => spots.map(normalizeSpot).filter((spot) => savedSpotIds.includes(spot.id)),
    [savedSpotIds, spots]
  );

  const mapRegion = useMemo(
    () => ({
      ...selectedLocation,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    }),
    [selectedLocation]
  );

  const handleNearbyToggle = async () => {
    if (nearbyOnly) {
      setNearbyOnly(false);
      return;
    }

    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permiso requerido", "Activa ubicación para mostrar spots realmente cerca de ti.");
      return;
    }

    const current = await Location.getCurrentPositionAsync({});
    if (!current?.coords) return;

    const currentCoords = {
      latitude: current.coords.latitude,
      longitude: current.coords.longitude,
    };
    setSelectedLocation(currentCoords);

    try {
      const geocode = await Location.reverseGeocodeAsync(currentCoords);
      const geo = geocode?.[0];
      const label = geo?.region || geo?.subregion || geo?.city || "";
      if (label) {
        const normalizeText = (value) =>
          value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .trim();
        const normalizedLabel = normalizeText(label);
        const provincesOnly = provinces.filter((province) => province !== "Todas");
        const matchedProvince = provincesOnly.find((province) => {
          const normalizedProvince = normalizeText(province);
          return (
            normalizedLabel.includes(normalizedProvince) ||
            normalizedProvince.includes(normalizedLabel)
          );
        });
        if (matchedProvince) {
          setNearbyProvince(matchedProvince);
        }
      }
    } catch (_error) {
      // Mantiene provincia previa si no se pudo geocodificar.
    }

    setNearbyOnly(true);
  };

  const useCurrentLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permiso requerido", "Activa ubicación para detectar dónde estás.");
      return;
    }

    const current = await Location.getCurrentPositionAsync({});
    if (current?.coords) {
      setSelectedLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    }
  };

  const pickImageFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos permiso para acceder a tus fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });

    if (!result.canceled && result.assets?.length) {
      const selectedUris = result.assets.map((asset) => asset.uri).filter(Boolean);
      setNewSpot((current) => {
        const merged = [...current.spotPhotos, ...selectedUris].slice(0, 10);
        return { ...current, spotPhotos: merged };
      });
    }
  };

  const pickProfileAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos permiso para acceder a tus fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfileForm((current) => ({ ...current, avatarUrl: result.assets[0].uri }));
    }
  };

  const addPhotoToProfile = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos permiso para acceder a tus fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfileForm((current) => ({
        ...current,
        photos: [result.assets[0].uri, ...current.photos].slice(0, 12),
      }));
    }
  };

  const saveProfile = () => {
    if (!profileForm.fullName.trim()) {
      Alert.alert("Falta nombre", "Agrega tu nombre para crear el perfil.");
      return;
    }

    if (!profileForm.username.trim()) {
      Alert.alert("Falta usuario", "Agrega tu nombre de usuario.");
      return;
    }

    const normalizedUsername = normalizeUsername(profileForm.username);
    const payload = {
      ...profileForm,
      username: normalizedUsername,
      fullName: profileForm.fullName.trim(),
      bio: profileForm.bio.trim(),
    };

    setProfileForm(payload);
    setSavedProfile(payload);
    setIsProfileEditMode(false);
    Alert.alert("Perfil guardado", "Así es como lo verán los demás.");
  };

  const toggleSaveSpot = (spot) => {
    if (!requireSavedProfile("Para guardar publicaciones primero debes crear y guardar tu perfil.")) {
      return;
    }

    const normalized = normalizeSpot(spot);
    setSavedSpotIds((current) => {
      const alreadySaved = current.includes(normalized.id);
      const updated = alreadySaved
        ? current.filter((id) => id !== normalized.id)
        : [normalized.id, ...current];

      return updated;
    });
  };

  const homeProfile = {
    username: normalizeUsername(savedProfile?.username || profileForm.username) || "@TuUsuario",
    subtitle: savedProfile?.fullName?.trim() || "Tu perfil",
    avatarUrl: savedProfile?.avatarUrl || profileForm.avatarUrl || fallbackImageUrl,
  };

  const handleCreateSpot = () => {
    if (!newSpot.name.trim()) {
      Alert.alert("Falta nombre", "Escribe el nombre del spot.");
      return;
    }

    if (!selectedLocation.latitude || !selectedLocation.longitude) {
      Alert.alert("Falta ubicación", "Selecciona la ubicación del spot en el mapa.");
      return;
    }

    const mapUrl = `https://maps.google.com/?q=${selectedLocation.latitude},${selectedLocation.longitude}`;

    const createdSpot = {
      id: Date.now().toString(),
      name: newSpot.name.trim(),
      location: newSpot.locationLabel.trim() || newSpot.province,
      province: newSpot.province,
      type: newSpot.type,
      user: normalizeUsername(savedProfile?.username || profileForm.username) || "@TuUsuario",
      mapUrl,
      imageUrl: newSpot.spotPhotos[0] || fallbackImageUrl,
      description: newSpot.description.trim(),
      photos: newSpot.spotPhotos.length ? newSpot.spotPhotos : [fallbackImageUrl],
      features: newSpot.features,
    };

    setSpots((current) => [createdSpot, ...current]);
    setNewSpot({
      name: "",
      description: "",
      province: "San José",
      type: "Playa",
      spotPhotos: [],
      locationLabel: "",
      features: [],
    });
    setActiveTab("home");
  };

  const renderHome = () => (
    <>
      <View style={styles.profileRow}>
        <TouchableOpacity style={styles.profileLeft} onPress={() => setActiveTab("perfil")}>
          <Image source={{ uri: homeProfile.avatarUrl }} style={styles.profileAvatar} />
          <View>
            <Text style={styles.profileHandle}>{homeProfile.username}</Text>
            <Text style={styles.profileSubtitle}>{homeProfile.subtitle}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.profileActions}>
          <TouchableOpacity onPress={() => setActiveTab("notificaciones")}>
            <Ionicons name="notifications-outline" size={22} style={styles.profileActionIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfileQuickActions}>
            <Ionicons name="ellipsis-horizontal" size={22} style={styles.profileActionIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{uiText.homeFeatured}</Text>
        <Text style={[styles.sectionCount, { color: theme.muted }]}>{spots.length} {uiText.spotsCount}</Text>
      </View>

      <View style={styles.feedGrid}>
        {spots.map((spot) => {
          const s = normalizeSpot(spot);
          return (
            <TouchableOpacity key={s.id} style={styles.feedCard} onPress={() => openHomeSpotDetail(s, "home")}>
              <View style={styles.feedImageWrap}>
                <Image source={{ uri: s.imageUrl }} style={styles.feedImage} />
                {renderSpotFeatureIconsOverlay(s)}
              </View>
              <View style={styles.feedMeta}>
                <Text style={styles.feedLocation}>📍 {s.location}</Text>
                <Text style={styles.feedName}>{s.name}</Text>
                <Text style={styles.feedDescriptionPreview} numberOfLines={2}>
                  {s.description}
                </Text>
                <View style={styles.feedFooter}>
                  <Text style={styles.feedUser}>{s.user}</Text>
                  <TouchableOpacity style={styles.feedAction} onPress={() => handleOpenMap(s.mapUrl, s)}>
                    <Text style={styles.feedActionText}>Mapa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

    </>
  );

  const renderSpotDetail = () => {
    if (!selectedHomeSpot) return renderHome();

    const coordinate = getSpotCoordinate(selectedHomeSpot);
    const comments = spotComments[selectedHomeSpot.id] || [];
    const creatorFromSpot = {
      username: selectedHomeSpot.user,
      fullName: selectedHomeSpot.user,
      bio: "Creador de spots",
      avatarUrl: selectedHomeSpot.imageUrl,
    };

    return (
      <View style={[styles.profileEditorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
        <View style={styles.postHeaderRow}>
          <Text style={[styles.searchTitle, { color: theme.text, flex: 1 }]}>
            {selectedHomeSpot.name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedPhotoIndex(null);
              setActiveTab(detailSourceTab || "home");
            }}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.postMeta, { color: theme.muted }]}>📍 {selectedHomeSpot.location} · {selectedHomeSpot.province}</Text>
        <View style={styles.postMetaInlineRow}>
          <Text style={[styles.postMeta, { color: theme.muted, marginTop: 0 }]}>
            {uiText.spotType}: {getSpotTypeLabel(selectedHomeSpot.type)} · {isEnglish ? "Creator" : "Creador"}:
          </Text>
          <TouchableOpacity onPress={() => openCreatorDetail(creatorFromSpot, "detalle")}>
            <Text style={styles.postMetaCreatorLink}> {selectedHomeSpot.user}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.postDescription, { color: theme.text }]}>{selectedHomeSpot.description}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.postPhotosRow}>
          {selectedHomeSpot.photos.map((photo, index) => (
            <TouchableOpacity key={`${selectedHomeSpot.id}-${index}`} onPress={() => openGallery(selectedHomeSpot.photos, index, "detalle")}>
              <Image source={{ uri: photo }} style={styles.postPhoto} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.filterTitle, { color: theme.text }]}>Mini mapa</Text>
        <MapView
          style={styles.detailMiniMap}
          initialRegion={{
            ...coordinate,
            latitudeDelta: 0.06,
            longitudeDelta: 0.06,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker coordinate={coordinate} />
        </MapView>

        <View style={styles.feedFooterActions}>
          <TouchableOpacity
            style={styles.feedAction}
            onPress={() => handleOpenMap(selectedHomeSpot.mapUrl, selectedHomeSpot)}
          >
            <Text style={styles.feedActionText}>{uiText.openMap}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryAction} onPress={() => toggleSaveSpot(selectedHomeSpot)}>
            <Text style={styles.secondaryActionText}>
              {savedSpotIds.includes(selectedHomeSpot.id) ? uiText.saved : uiText.save}
            </Text>
          </TouchableOpacity>
        </View>

        {getSpotFeatures(selectedHomeSpot).length ? (
          <View style={styles.spotFeatureRow}>
            {getSpotFeatures(selectedHomeSpot).map((featureKey) => {
              const feature = featureMetaByKey[featureKey];
              return (
                <View key={`${selectedHomeSpot.id}-${featureKey}`} style={styles.spotFeatureBadge}>
                  <Ionicons name={feature.icon} size={getFeatureIconSize(featureKey, "badge")} color="#7a1c1c" />
                  <Text style={styles.spotFeatureText}>{getSpotFeatureLabel(featureKey)}</Text>
                </View>
              );
            })}
          </View>
        ) : null}

        <View style={styles.profileGalleryHeader}>
          <Text style={[styles.filterTitle, { color: theme.text }]}>Comentarios de visitantes ({comments.length})</Text>
          <TouchableOpacity style={styles.reportLinkButton} onPress={() => handleReportSpot(selectedHomeSpot)}>
            <Ionicons name="flag-outline" size={14} color="#b91c1c" />
            <Text style={styles.reportLinkText}>Reportar spot</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.commentComposerRow}>
          <TextInput
            value={commentDraft}
            onChangeText={setCommentDraft}
            placeholder="Escribe un comentario..."
            placeholderTextColor={theme.muted}
            style={[styles.searchInput, themedInputStyle, styles.commentInput]}
          />
          <TouchableOpacity style={styles.feedAction} onPress={handleAddComment}>
            <Text style={styles.feedActionText}>Enviar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentsList}>
          {comments.length ? (
            comments.map((comment) => (
              <View key={comment.id} style={[styles.activityCard, { backgroundColor: theme.input, borderColor: theme.border }]}> 
                <Text style={[styles.creatorUsername, { color: theme.text }]}>{comment.user}</Text>
                <Text style={[styles.profileSubtitle, { color: theme.muted }]}>{comment.text}</Text>
                <View style={styles.commentActionsRow}>
                  <TouchableOpacity style={styles.commentActionButton} onPress={() => toggleCommentLike(comment.id)}>
                    <Ionicons
                      name={commentLikes[comment.id] ? "heart" : "heart-outline"}
                      size={15}
                      color={commentLikes[comment.id] ? "#b91c1c" : theme.muted}
                    />
                    <Text style={[styles.commentActionText, { color: theme.muted }]}>
                      {commentLikes[comment.id] || 0}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.commentActionButton} onPress={() => toggleReplyComposer(comment.id)}>
                    <Ionicons name="chatbox-ellipses-outline" size={15} color={theme.muted} />
                    <Text style={[styles.commentActionText, { color: theme.muted }]}>Responder</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.commentActionButton}
                    onPress={() => handleReportComment(comment, selectedHomeSpot.id)}
                  >
                    <Ionicons name="flag-outline" size={15} color={theme.muted} />
                    <Text style={[styles.commentActionText, { color: theme.muted }]}>Reportar</Text>
                  </TouchableOpacity>
                </View>

                {replyInputVisible[comment.id] ? (
                  <View style={styles.replyComposerWrap}>
                    <TextInput
                      value={replyDraftByComment[comment.id] || ""}
                      onChangeText={(value) => handleReplyDraftChange(comment.id, value)}
                      placeholder="Escribe una respuesta..."
                      placeholderTextColor={theme.muted}
                      style={[styles.searchInput, themedInputStyle, styles.replyInput]}
                    />
                    <TouchableOpacity style={styles.replySendButton} onPress={() => handleAddReply(comment.id)}>
                      <Text style={styles.replySendButtonText}>Enviar</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {(commentReplies[comment.id] || []).length ? (
                  <View style={styles.replyList}>
                    {(commentReplies[comment.id] || []).map((reply) => (
                      <View key={reply.id} style={[styles.replyItem, { borderColor: theme.border }]}>
                        <Text style={[styles.replyUser, { color: theme.text }]}>{reply.user}</Text>
                        <Text style={[styles.replyText, { color: theme.muted }]}>{reply.text}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            ))
          ) : (
            <Text style={[styles.profileSubtitle, { color: theme.muted }]}>Aún no hay comentarios para este spot.</Text>
          )}
        </View>


      </View>
    );
  };


  const renderSpotGallery = () => {
    const images = galleryImages.length ? galleryImages : selectedHomeSpot?.photos || [];
    if (!images.length || selectedPhotoIndex === null) return renderSpotDetail();

    return (
      <View style={styles.galleryScreen}>
        <TouchableOpacity
          style={styles.galleryCloseButton}
          onPress={() => {
            setActiveTab(gallerySourceTab || "detalle");
            setSelectedPhotoIndex(null);
            setGalleryImages([]);
          }}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          pagingEnabled
          contentOffset={{ x: selectedPhotoIndex * screenWidth, y: 0 }}
          showsHorizontalScrollIndicator={false}
          style={styles.galleryPager}
        >
          {images.map((photo, index) => (
            <Image key={`gallery-${index}-${photo}`} source={{ uri: photo }} style={styles.galleryImage} />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSearch = () => {
    const mapFocusSpot = filteredSpots[0];
    const mapFocusCoordinate = mapFocusSpot ? getSpotCoordinate(mapFocusSpot) : selectedLocation;

    return (
    <>
      <View style={styles.searchCard}>
        <Text style={styles.searchTitle}>{uiText.searchSpots}</Text>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder={uiText.searchByName}
          placeholderTextColor={themedPlaceholderColor}
          style={[styles.searchInput, themedInputStyle]}
        />

        <View style={styles.filterBlock}>
          <Text style={styles.filterTitle}>{uiText.province}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {provinces.map((province) => (
              <TouchableOpacity
                key={province}
                style={[
                  styles.filterChip,
                  provinceFilter === province && styles.filterChipActive,
                ]}
                onPress={() => setProvinceFilter(province)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    provinceFilter === province && styles.filterChipTextActive,
                  ]}
                >
                  {province}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterTitle}>{uiText.spotType}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {spotTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.filterChip, typeFilter === type && styles.filterChipActive]}
                onPress={() => setTypeFilter(type)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    typeFilter === type && styles.filterChipTextActive,
                  ]}
                >
                  {getSpotTypeLabel(type)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterTitle}>{uiText.spotFeatures}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.filterChip, searchFeatureFilter === "all" && styles.filterChipActive]}
              onPress={() => setSearchFeatureFilter("all")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  searchFeatureFilter === "all" && styles.filterChipTextActive,
                ]}
              >
                {uiText.allFeatures}
              </Text>
            </TouchableOpacity>
            {spotFeatureOptions.map((feature) => (
              <TouchableOpacity
                key={`search-feature-${feature.key}`}
                style={[
                  styles.filterChip,
                  searchFeatureFilter === feature.key && styles.filterChipActive,
                ]}
                onPress={() => setSearchFeatureFilter(feature.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    searchFeatureFilter === feature.key && styles.filterChipTextActive,
                  ]}
                >
                  {getSpotFeatureLabel(feature.key)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={[styles.nearbyButton, nearbyOnly && styles.nearbyButtonActive]}
          onPress={handleNearbyToggle}
        >
          <Text style={[styles.nearbyText, nearbyOnly && styles.nearbyTextActive]}>
            {uiText.nearbyToggle}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{uiText.results}</Text>
        <Text style={[styles.sectionCount, { color: theme.muted }]}>{filteredSpots.length} {uiText.foundCount}</Text>
      </View>

      <View style={[styles.searchMapCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.filterTitle, { color: theme.text }]}>{uiText.mapResults}</Text>
        <Text style={[styles.profileSubtitle, { color: theme.muted }]}>{uiText.mapHint}</Text>
        <MapView
          style={styles.searchResultsMap}
          initialRegion={{
            ...mapFocusCoordinate,
            latitudeDelta: 0.35,
            longitudeDelta: 0.35,
          }}
        >
          {filteredSpots.map((spot) => (
            <Marker
              key={`search-map-${spot.id}`}
              coordinate={getSpotCoordinate(spot)}
              title={spot.name}
              description={`${spot.province} · ${getSpotTypeLabel(spot.type)}`}
              onPress={() => openHomeSpotDetail(spot, "buscar")}
            />
          ))}
        </MapView>
      </View>

      {filteredSpots.map((spot) => (
        <TouchableOpacity key={spot.id} style={styles.resultCard} onPress={() => openHomeSpotDetail(spot, "buscar")}>
          <View style={styles.resultImageWrap}>
            <Image source={{ uri: spot.imageUrl }} style={styles.resultImage} />
            {renderSpotFeatureIconsOverlay(spot)}
          </View>
          <View style={styles.resultMeta}>
            <Text style={styles.resultName}>{spot.name}</Text>
            <Text style={styles.resultDetail}>{spot.province} · {getSpotTypeLabel(spot.type)}</Text>
            <View style={styles.feedFooterActions}>
              <TouchableOpacity style={styles.feedAction} onPress={() => handleOpenMap(spot.mapUrl, spot)}>
                <Text style={styles.feedActionText}>{uiText.openMap}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryAction} onPress={() => toggleSaveSpot(spot)}>
                <Text style={styles.secondaryActionText}>
                  {savedSpotIds.includes(spot.id) ? uiText.saved : uiText.save}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{uiText.nearYou}</Text>
        <Text style={[styles.sectionCount, { color: theme.muted }]}>{nearbyProvince}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {nearbyRecommendations.map((spot) => (
          <TouchableOpacity
            key={`near-${spot.id}`}
            style={styles.nearbyCard}
            onPress={() => openHomeSpotDetail(spot, "buscar")}
          >
            <Image source={{ uri: spot.imageUrl }} style={styles.nearbyImage} />
            <Text style={styles.nearbyCardTitle}>{spot.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{uiText.searchCreators}</Text>
        <Text style={[styles.sectionCount, { color: theme.muted }]}>{filteredCreators.length}</Text>
      </View>
      <TextInput
        value={creatorSearchText}
        onChangeText={setCreatorSearchText}
        placeholder={uiText.searchCreatorsPlaceholder}
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle]}
      />
      {filteredCreators.map((creator) => (
        <TouchableOpacity key={creator.username} style={styles.creatorCard} onPress={() => openCreatorDetail(creator)}>
          <Image
            source={{ uri: creator.avatarUrl || fallbackImageUrl }}
            style={styles.creatorAvatar}
          />
          <View style={styles.creatorMeta}>
            <Text style={styles.creatorName}>{creator.fullName}</Text>
            <Text style={styles.creatorUsername}>{creator.username}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
  };


  const renderCreatorDetail = () => {
    if (!selectedCreator) return renderSearch();

    const creatorSpots = spots
      .map(normalizeSpot)
      .filter((spot) => spot.user === selectedCreator.username);

    const sortedCreatorSpots = [...creatorSpots].sort((a, b) => {
      if (creatorSpotSort === "alfabetico") {
        return a.name.localeCompare(b.name, "es");
      }
      if (creatorSpotSort === "reciente") {
        return Number(b.id) - Number(a.id);
      }
      const popularityA = (spotComments[a.id]?.length || 0) + (savedSpotIds.includes(a.id) ? 1 : 0) + (viewedSpots.some((v) => v.id === a.id) ? 1 : 0);
      const popularityB = (spotComments[b.id]?.length || 0) + (savedSpotIds.includes(b.id) ? 1 : 0) + (viewedSpots.some((v) => v.id === b.id) ? 1 : 0);
      return popularityB - popularityA;
    });

    const creatorFollowers = getFollowersForUser(selectedCreator.username);
    const creatorFollowing = getFollowingForUser(selectedCreator.username);
    const isFollowingCreator = creatorFollowers.includes(currentUsername);
    const isOwnCreatorProfile = selectedCreator.username === currentUsername;

    return (
      <View style={[styles.profileEditorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.postHeaderRow}>
          <Text style={[styles.searchTitle, { color: theme.text, flex: 1 }]}>Perfil del creador</Text>
          <TouchableOpacity onPress={() => setActiveTab(creatorReturnTab || "buscar")} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.creatorName, { color: theme.text, marginTop: 6 }]}>{selectedCreator.fullName}</Text>
        <Text style={[styles.creatorUsername, styles.profileUsernameSpacing, { color: theme.muted }]}>{selectedCreator.username}</Text>

        <View style={styles.instagramProfileTopRow}>
          <Image source={{ uri: selectedCreator.avatarUrl || fallbackImageUrl }} style={styles.profilePreviewAvatar} />
          <View style={styles.instagramCountersRow}>
            <View style={styles.instagramCounterItem}>
              <Text style={styles.instagramCounterValue}>{creatorSpots.length}</Text>
              <Text style={styles.instagramCounterLabel}>Publicaciones</Text>
            </View>
            <View style={styles.instagramCounterItem}>
              <Text style={styles.instagramCounterValue}>{creatorFollowers.length}</Text>
              <Text style={styles.instagramCounterLabel}>Seguidores</Text>
            </View>
            <View style={styles.instagramCounterItem}>
              <Text style={styles.instagramCounterValue}>{creatorFollowing.length}</Text>
              <Text style={styles.instagramCounterLabel}>Siguiendo</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.profileSubtitle, { color: theme.muted, marginBottom: 8 }]}>
          {selectedCreator.bio || "Sin biografía por ahora."}
        </Text>

        {!isOwnCreatorProfile ? (
          <TouchableOpacity
            style={[styles.secondaryAction, { marginBottom: 8, alignSelf: "flex-start" }]}
            onPress={() => toggleFollowUser(selectedCreator.username)}
          >
            <Text style={styles.secondaryActionText}>{isFollowingCreator ? "Siguiendo" : "Seguir"}</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Spots compartidos</Text>
          <Text style={[styles.sectionCount, { color: theme.muted }]}>{creatorSpots.length}</Text>
        </View>

        <View style={styles.filterBlock}>
          <Text style={[styles.filterTitle, { color: theme.text }]}>Ordenar por</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: "popular", label: "Más popular" },
              { key: "reciente", label: "Más reciente" },
              { key: "alfabetico", label: "A-Z" },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.filterChip, creatorSpotSort === option.key && styles.filterChipActive]}
                onPress={() => setCreatorSpotSort(option.key)}
              >
                <Text style={[styles.filterChipText, creatorSpotSort === option.key && styles.filterChipTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {sortedCreatorSpots.length ? (
          sortedCreatorSpots.map((spot) => (
            <TouchableOpacity
              key={`creator-${spot.id}`}
              style={[styles.resultCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => openHomeSpotDetail(spot, "creador")}
            >
              <Image source={{ uri: spot.imageUrl }} style={styles.resultImage} />
              <View style={styles.resultMeta}>
                <Text style={[styles.resultName, { color: theme.text }]}>{spot.name}</Text>
                <Text style={[styles.resultDetail, { color: theme.muted }]}>
                  {spot.province} · {getSpotTypeLabel(spot.type)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={[styles.profileSubtitle, { color: theme.muted }]}>Este creador aún no tiene spots publicados.</Text>
        )}
      </View>
    );
  };

  const renderPlaceholder = (title) => (
    <View style={styles.placeholderCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.profileSubtitle}>Pantalla en construcción.</Text>
    </View>
  );

  const renderAddSpot = () => (
    <View style={styles.addCard}>
      <Text style={styles.searchTitle}>{uiText.addSpot}</Text>
      <TextInput
        value={newSpot.name}
        onChangeText={(value) => setNewSpot((current) => ({ ...current, name: value }))}
        placeholder={uiText.spotNamePlaceholder}
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle]}
      />
      <TextInput
        value={newSpot.description}
        onChangeText={(value) => setNewSpot((current) => ({ ...current, description: value }))}
        placeholder={uiText.spotDescriptionPlaceholder}
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle, styles.textArea]}
        multiline
      />

      <View style={styles.filterBlock}>
        <Text style={styles.filterTitle}>{uiText.province}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {provinces.filter((province) => province !== "Todas").map((province) => (
            <TouchableOpacity
              key={`add-${province}`}
              style={[styles.filterChip, newSpot.province === province && styles.filterChipActive]}
              onPress={() => setNewSpot((current) => ({ ...current, province }))}
            >
              <Text
                style={[
                  styles.filterChipText,
                  newSpot.province === province && styles.filterChipTextActive,
                ]}
              >
                {province}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterBlock}>
          <Text style={styles.filterTitle}>{uiText.spotType}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {spotTypes.filter((type) => type !== "Todos").map((type) => (
            <TouchableOpacity
              key={`type-${type}`}
              style={[styles.filterChip, newSpot.type === type && styles.filterChipActive]}
              onPress={() => setNewSpot((current) => ({ ...current, type }))}
            >
              <Text
                style={[
                  styles.filterChipText,
                  newSpot.type === type && styles.filterChipTextActive,
                ]}
              >
                {getSpotTypeLabel(type)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterBlock}>
        <Text style={styles.filterTitle}>{uiText.spotFeatures}</Text>
        <View style={styles.addFeatureGrid}>
          {spotFeatureOptions.map((feature) => {
            const isSelected = newSpot.features.includes(feature.key);
            return (
              <TouchableOpacity
                key={`feature-${feature.key}`}
                style={[styles.addFeatureChip, isSelected && styles.addFeatureChipActive]}
                onPress={() => toggleFeatureForNewSpot(feature.key)}
              >
                <Ionicons
                  name={feature.icon}
                  size={getFeatureIconSize(feature.key, "chip")}
                  color={isSelected ? "#ffffff" : "#7a1c1c"}
                  style={styles.addFeatureIcon}
                />
                <Text style={[styles.addFeatureText, isSelected && styles.addFeatureTextActive]}>
                  {getSpotFeatureLabel(feature.key)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TextInput
        value={newSpot.locationLabel}
        onChangeText={(value) => setNewSpot((current) => ({ ...current, locationLabel: value }))}
        placeholder={uiText.locationNamePlaceholder}
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle, styles.locationLabelInput]}
      />

      <View style={styles.mapHeaderRow}>
        <Text style={styles.filterTitle}>{uiText.exactLocation}</Text>
        <TouchableOpacity style={styles.useLocationButton} onPress={useCurrentLocation}>
          <Text style={styles.useLocationButtonText}>{uiText.useMyLocation}</Text>
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.mapPreview}
        initialRegion={mapRegion}
        region={mapRegion}
        onPress={(event) => setSelectedLocation(event.nativeEvent.coordinate)}
      >
        <Marker
          coordinate={selectedLocation}
          draggable
          onDragEnd={(event) => setSelectedLocation(event.nativeEvent.coordinate)}
        />
      </MapView>

      <TouchableOpacity
        style={styles.nearbyButton}
        onPress={() =>
          handleOpenMap(`https://maps.google.com/?q=${selectedLocation.latitude},${selectedLocation.longitude}`)
        }
      >
        <Text style={styles.nearbyText}>{uiText.openSelectedMap}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImageFromGallery}>
        <Text style={styles.uploadButtonText}>{uiText.uploadSpotPhotos}</Text>
      </TouchableOpacity>
      {newSpot.spotPhotos.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoPreviewRow}>
          {newSpot.spotPhotos.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.previewThumb} />
          ))}
        </ScrollView>
      ) : null}

      <TouchableOpacity style={[styles.feedAction, styles.submitButton]} onPress={handleCreateSpot}>
        <Text style={styles.feedActionText}>{uiText.saveSpot}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfileEditor = () => (
    <View style={styles.profileEditorCard}>
      <Text style={styles.searchTitle}>{uiText.yourProfile}</Text>
      <View style={styles.profilePreviewRow}>
        <Image
          source={{ uri: profileForm.avatarUrl || fallbackImageUrl }}
          style={styles.profilePreviewAvatar}
        />
        <TouchableOpacity style={[styles.uploadButton, styles.profileUploadButton]} onPress={pickProfileAvatar}>
          <Text style={styles.uploadButtonText}>{uiText.changeProfilePhoto}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={profileForm.fullName}
        onChangeText={(value) => setProfileForm((current) => ({ ...current, fullName: value }))}
        placeholder={uiText.fullNamePlaceholder}
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle, styles.locationLabelInput]}
      />
      <TextInput
        value={profileForm.username}
        onChangeText={(value) => setProfileForm((current) => ({ ...current, username: value }))}
        placeholder={uiText.usernamePlaceholder}
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle, styles.locationLabelInput]}
      />
      <TextInput
        value={profileForm.bio}
        onChangeText={(value) => setProfileForm((current) => ({ ...current, bio: value }))}
        placeholder={uiText.aboutYouPlaceholder}
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle, styles.textArea]}
        multiline
      />

      <View style={styles.profileGalleryHeader}>
        <Text style={styles.filterTitle}>Tus fotos ({profileForm.photos.length})</Text>
        <TouchableOpacity style={styles.useLocationButton} onPress={addPhotoToProfile}>
          <Text style={styles.useLocationButtonText}>{uiText.addPhoto}</Text>
        </TouchableOpacity>
      </View>

      {profileForm.photos.length ? (
        <View style={styles.profilePhotosGrid}>
          {profileForm.photos.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.profileGalleryImage} />
          ))}
        </View>
      ) : (
        <Text style={styles.profileSubtitle}>Aún no has agregado fotos a tu perfil.</Text>
      )}

      <TouchableOpacity style={[styles.feedAction, styles.submitButton]} onPress={saveProfile}>
        <Text style={styles.feedActionText}>{uiText.saveProfile}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfilePublic = () => {
    const profile = savedProfile || {
      fullName: "Tu nombre",
      username: "@tu_usuario",
      bio: "Agrega una biografía para que te conozcan.",
      avatarUrl: "",
      photos: [],
    };

    const mySpots = spots
      .map(normalizeSpot)
      .filter((spot) => spot.user === profile.username);
    const safeProfilePhotos = Array.isArray(profile.photos) ? profile.photos : [];
    const myFollowers = getFollowersForUser(profile.username);
    const myFollowing = getFollowingForUser(profile.username);
    const visibleConnections = connectionTab === "followers" ? myFollowers : myFollowing;

    return (
      <View style={styles.profileEditorCard}>
        <View style={styles.publicHeaderRow}>
          <Text style={styles.searchTitle}>{profile.fullName}</Text>
          <TouchableOpacity style={styles.useLocationButton} onPress={() => setIsProfileEditMode(true)}>
            <Text style={styles.useLocationButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.creatorUsername, styles.profileUsernameSpacing]}>{profile.username}</Text>

        <View style={styles.instagramProfileTopRow}>
          <Image
            source={{ uri: profile.avatarUrl || fallbackImageUrl }}
            style={styles.profilePreviewAvatar}
          />
          <View style={styles.instagramCountersRow}>
            <View style={styles.instagramCounterItem}>
              <Text style={styles.instagramCounterValue}>{mySpots.length}</Text>
              <Text style={styles.instagramCounterLabel}>Publicaciones</Text>
            </View>
            <View style={styles.instagramCounterItem}>
              <Text style={styles.instagramCounterValue}>{myFollowers.length}</Text>
              <Text style={styles.instagramCounterLabel}>Seguidores</Text>
            </View>
            <View style={styles.instagramCounterItem}>
              <Text style={styles.instagramCounterValue}>{myFollowing.length}</Text>
              <Text style={styles.instagramCounterLabel}>Siguiendo</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.profileSubtitle, styles.profileBioBelowStats]}>{profile.bio}</Text>

        <View style={styles.instagramTabRow}>
          <TouchableOpacity
            style={[styles.instagramTabButton, connectionTab === "followers" && styles.instagramTabButtonActive]}
            onPress={() => setConnectionTab("followers")}
          >
            <Text style={[styles.instagramTabLabel, connectionTab === "followers" && styles.instagramTabLabelActive]}>
              Seguidores
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.instagramTabButton, connectionTab === "following" && styles.instagramTabButtonActive]}
            onPress={() => setConnectionTab("following")}
          >
            <Text style={[styles.instagramTabLabel, connectionTab === "following" && styles.instagramTabLabelActive]}>
              Siguiendo
            </Text>
          </TouchableOpacity>
        </View>

        {visibleConnections.length ? (
          <View style={styles.connectionListBlock}>
            {visibleConnections.map((username) => (
              <TouchableOpacity
                key={`${connectionTab}-${username}`}
                style={styles.connectionListRow}
                onPress={() => {
                  const creatorProfile = creatorsByUsername[username] || {
                    username,
                    fullName: username,
                    bio: "Creador de spots",
                    avatarUrl: fallbackImageUrl,
                  };
                  openCreatorDetail(creatorProfile, "perfil");
                }}
              >
                <Image
                  source={{ uri: creatorsByUsername[username]?.avatarUrl || fallbackImageUrl }}
                  style={styles.connectionAvatarImage}
                />
                <View style={styles.connectionMetaCol}>
                  <Text style={styles.connectionListItem}>{username}</Text>
                  <Text style={styles.connectionListSubtext}>
                    {creatorsByUsername[username]?.fullName || "Ver perfil"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#7a1c1c" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.profileSubtitle}>
            {connectionTab === "followers" ? "Aún no tienes seguidores." : "Aún no sigues a nadie."}
          </Text>
        )}

        <View style={styles.profileGalleryHeader}>
          <Text style={styles.filterTitle}>Fotos del perfil ({safeProfilePhotos.length})</Text>
        </View>
        {safeProfilePhotos.length ? (
          <View style={styles.profilePhotosGrid}>
            {safeProfilePhotos.map((uri, index) => (
              <TouchableOpacity
                key={`profile-photo-${index}`}
                style={styles.profilePhotoPressable}
                onPress={() => openGallery(safeProfilePhotos, index, "perfil")}
              >
                <Image source={{ uri: uri || fallbackImageUrl }} style={styles.profileGalleryImage} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.profileSubtitle}>Sin fotos en el perfil aún.</Text>
        )}

        <View style={styles.profileGalleryHeader}>
          <Text style={styles.filterTitle}>Spots agregados ({mySpots.length})</Text>
        </View>
        {mySpots.length ? (
          mySpots.map((spot) => (
            <TouchableOpacity key={`my-${spot.id}`} style={styles.resultCard} onPress={() => openHomeSpotDetail(spot, "perfil")}>
              <Image source={{ uri: spot.imageUrl }} style={styles.resultImage} />
              <View style={styles.resultMeta}>
                <Text style={styles.resultName}>{spot.name}</Text>
                <Text style={styles.resultDetail}>{spot.province} · {getSpotTypeLabel(spot.type)}</Text>
                <TouchableOpacity
                  style={styles.feedAction}
                  onPress={() => handleOpenMap(spot.mapUrl, spot)}
                >
                  <Text style={styles.feedActionText}>{uiText.openMap}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.profileSubtitle}>Todavía no has agregado spots.</Text>
        )}
      </View>
    );
  };

  const renderProfile = () => (isProfileEditMode ? renderProfileEditor() : renderProfilePublic());

  const toggleSetting = (key) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  const toggleLanguage = () => {
    setSettings((current) => ({
      ...current,
      language: current.language === "es" ? "en" : "es",
    }));
  };

  const renderSettings = () => (
    <View style={[styles.profileEditorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.searchTitle, { color: theme.text }]}>{uiText.settingsTitle}</Text>

      <View style={[styles.settingRow, { backgroundColor: theme.input, borderColor: theme.border }]}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>{uiText.appTone}</Text>
        <View style={styles.themeToggleRow}>
          <TouchableOpacity
            style={[styles.themeButton, !settings.darkMode && styles.themeButtonActive]}
            onPress={() => setSettings((current) => ({ ...current, darkMode: false }))}
          >
            <Text
              style={[
                styles.themeButtonText,
                !settings.darkMode && styles.themeButtonTextActive,
              ]}
            >
              {uiText.light}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, settings.darkMode && styles.themeButtonActive]}
            onPress={() => setSettings((current) => ({ ...current, darkMode: true }))}
          >
            <Text
              style={[styles.themeButtonText, settings.darkMode && styles.themeButtonTextActive]}
            >
              {uiText.dark}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.settingRow, { backgroundColor: theme.input, borderColor: theme.border }]}
        onPress={() => toggleSetting("notifications")}
      >
        <Text style={[styles.settingLabel, { color: theme.text }]}>{uiText.notifications}</Text>
        <Text style={[styles.settingValue, { color: settings.darkMode ? "#ff8a8a" : "#d62828" }]}>
          {settings.notifications ? uiText.on : uiText.off}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.settingRow, { backgroundColor: theme.input, borderColor: theme.border }]}
        onPress={() => toggleSetting("privateProfile")}
      >
        <Text style={[styles.settingLabel, { color: theme.text }]}>{uiText.privateProfile}</Text>
        <Text style={[styles.settingValue, { color: settings.darkMode ? "#ff8a8a" : "#d62828" }]}>
          {settings.privateProfile ? uiText.on : uiText.off}
        </Text>
      </TouchableOpacity>

      <View style={[styles.settingRow, { backgroundColor: theme.input, borderColor: theme.border }]}>
        <View>
          <Text style={[styles.settingLabel, { color: theme.text }]}>{uiText.language}</Text>
          <Text style={[styles.settingHint, { color: theme.muted }]}>
            {uiText.spanishShort} / {uiText.englishShort} · {uiText.languageValue}
          </Text>
        </View>
        <Switch
          value={isEnglish}
          onValueChange={toggleLanguage}
          trackColor={{ false: "#f2c7c7", true: "#d62828" }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={styles.profileGalleryHeader}>
        <Text style={[styles.filterTitle, { color: theme.text }]}>{uiText.recentActivity}</Text>
      </View>
      {viewedSpots.length ? (
        viewedSpots.slice(0, 3).map((spot) => (
          <View key={`viewed-${spot.id}`} style={[styles.activityCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.activityMessage, { color: theme.text }]}>Viste: {spot.name}</Text>
            <Text style={[styles.activityDate, { color: theme.muted }]}>
              {spot.province} · {getSpotTypeLabel(spot.type)} · {spot.dateLabel}
            </Text>
          </View>
        ))
      ) : (
        <Text style={[styles.profileSubtitle, { color: theme.muted }]}>{uiText.noRecentViewed}</Text>
      )}

      <View style={styles.profileGalleryHeader}>
        <Text style={[styles.filterTitle, { color: theme.text }]}>{uiText.savedTitle} ({savedSpots.length})</Text>
      </View>
      {savedSpots.length ? (
        savedSpots.map((spot) => (
          <View key={`saved-${spot.id}`} style={[styles.resultCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Image source={{ uri: spot.imageUrl }} style={styles.resultImage} />
            <View style={styles.resultMeta}>
              <Text style={[styles.resultName, { color: theme.text }]}>{spot.name}</Text>
              <Text style={[styles.resultDetail, { color: theme.muted }]}>
                {spot.province} · {getSpotTypeLabel(spot.type)}
              </Text>
              <TouchableOpacity style={styles.feedAction} onPress={() => handleOpenMap(spot.mapUrl, spot)}>
                <Text style={styles.feedActionText}>{uiText.openMap}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={[styles.profileSubtitle, { color: theme.muted }]}>{uiText.noSavedYet}</Text>
      )}

      <View style={styles.profileGalleryHeader}>
        <Text style={[styles.filterTitle, { color: theme.text }]}>
          Moderación y reportes ({contentReports.length})
        </Text>
      </View>
      {contentReports.length ? (
        contentReports.slice(0, 5).map((report) => (
          <View
            key={report.id}
            style={[styles.activityCard, { backgroundColor: theme.input, borderColor: theme.border }]}
          >
            <Text style={[styles.activityMessage, { color: theme.text }]}>
              {report.type === "spot" ? "Spot reportado" : "Comentario reportado"} · {report.reason}
            </Text>
            <Text style={[styles.activityDate, { color: theme.muted }]}>
              {report.preview} · por {report.reporter}
            </Text>
          </View>
        ))
      ) : (
        <Text style={[styles.profileSubtitle, { color: theme.muted }]}>
          Aún no hay reportes registrados.
        </Text>
      )}
    </View>
  );


  const renderFavorites = () => (
    <View style={[styles.profileEditorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
      <Text style={[styles.searchTitle, { color: theme.text }]}>{uiText.favorites}</Text>
      <Text style={[styles.profileSubtitle, { color: theme.muted, marginBottom: 12 }]}>{uiText.savedSpotsCount} ({savedSpots.length})</Text>
      {savedSpots.length ? (
        savedSpots.map((spot) => (
          <TouchableOpacity
            key={`fav-${spot.id}`}
            style={[styles.resultCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => openHomeSpotDetail(spot, "favoritos")}
          >
            <Image source={{ uri: spot.imageUrl }} style={styles.resultImage} />
            <View style={styles.resultMeta}>
              <Text style={[styles.resultName, { color: theme.text }]}>{spot.name}</Text>
              <Text style={[styles.resultDetail, { color: theme.muted }]}>
                {spot.province} · {getSpotTypeLabel(spot.type)}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={[styles.profileSubtitle, { color: theme.muted }]}>{uiText.noFavoritesYet}</Text>
      )}
    </View>
  );

  const renderNotifications = () => (
    <View style={[styles.profileEditorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
      <Text style={[styles.searchTitle, { color: theme.text }]}>{uiText.notificationsCenter}</Text>
      <Text style={[styles.profileSubtitle, { color: theme.muted, marginBottom: 12 }]}>{uiText.latestActivity}</Text>
      {viewedSpots.length ? (
        viewedSpots.slice(0, 10).map((spot) => (
          <TouchableOpacity
            key={`notif-${spot.id}-${spot.dateLabel}`}
            style={[styles.activityCard, { backgroundColor: theme.input, borderColor: theme.border }]}
            onPress={() => openHomeSpotDetail(spot, "notificaciones")}
          >
            <Text style={[styles.activityMessage, { color: theme.text }]}>{uiText.visitedLabel}: {spot.name}</Text>
            <Text style={[styles.activityDate, { color: theme.muted }]}>{spot.dateLabel}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={[styles.profileSubtitle, { color: theme.muted }]}>{uiText.noNotificationsYet}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.header }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerBrand}>
            <Image source={{ uri: appLogoDataUri }} style={styles.headerLogo} />
            <View>
            <Text style={styles.headerTitle}>Spoteando</Text>
            <Text style={[styles.headerSubtitle, { color: settings.darkMode ? "#d6d9e0" : "#ffe5e5" }]}>{uiText.headerCountry}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setActiveTab("favoritos")}>
              <Ionicons name="heart-outline" size={24} style={styles.headerIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("notificaciones")}>
              <Ionicons name="notifications-outline" size={24} style={styles.headerIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "home" && renderHome()}
        {activeTab === "buscar" && renderSearch()}
        {activeTab === "agregar" && renderAddSpot()}
        {activeTab === "perfil" && renderProfile()}
        {activeTab === "config" && renderSettings()}
        {activeTab === "favoritos" && renderFavorites()}
        {activeTab === "notificaciones" && renderNotifications()}
        {activeTab === "creador" && renderCreatorDetail()}
        {activeTab === "detalle" && renderSpotDetail()}
        {activeTab === "galeria" && renderSpotGallery()}
      </ScrollView>

      <View style={[styles.bottomNav, { backgroundColor: theme.nav, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("home")}>
          <Ionicons name="home-outline" size={22} color={activeTab === "home" ? "#d62828" : "#6b7280"} />
          <Text style={activeTab === "home" ? styles.navTextActive : styles.navText}>{uiText.navHome}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("buscar")}>
          <Ionicons name="search-outline" size={22} color={activeTab === "buscar" ? "#d62828" : "#6b7280"} />
          <Text style={activeTab === "buscar" ? styles.navTextActive : styles.navText}>{uiText.navSearch}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navAddWrapper} onPress={() => setActiveTab("agregar")}>
          <View style={styles.navAddButton}>
            <Text style={styles.navAddIcon}>＋</Text>
          </View>
          <Text style={styles.navAddLabel}>{uiText.navAdd}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("perfil")}>
          <Ionicons name="person-outline" size={22} color={activeTab === "perfil" ? "#d62828" : "#6b7280"} />
          <Text style={activeTab === "perfil" ? styles.navTextActive : styles.navText}>{uiText.navProfile}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("config")}>
          <Ionicons name="settings-outline" size={22} color={activeTab === "config" ? "#d62828" : "#6b7280"} />
          <Text style={activeTab === "config" ? styles.navTextActive : styles.navText}>{uiText.navConfig}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f9fb" },
  container: { padding: 20, paddingBottom: 120 },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#7a1c1c",
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerBrand: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#ffffff" },
  headerSubtitle: { fontSize: 14, color: "#ffe5e5", marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 12 },
  headerIcon: { color: "#ffffff", fontSize: 18 },

  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionCount: { color: "#6b7280", fontSize: 12 },

  profileRow: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#f0dada",
  },
  profileLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  profileAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#d62828",
  },
  profileHandle: { fontSize: 14, fontWeight: "700", color: "#7a1c1c" },
  profileSubtitle: { fontSize: 12, color: "#6b7280" },
  profileActions: { flexDirection: "row", gap: 12 },
  profileActionIcon: { fontSize: 18, color: "#d62828" },

  feedGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  feedCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0dada",
  },
  feedImageWrap: {
    position: "relative",
  },
  feedImage: { width: "100%", height: 120 },
  feedMeta: { padding: 10 },
  feedLocation: { fontSize: 11, color: "#d62828", fontWeight: "600" },
  feedName: { fontSize: 13, fontWeight: "700", color: "#7a1c1c", marginTop: 4 },
  feedDescriptionPreview: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  feedFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedFooterActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  feedUser: { fontSize: 11, color: "#6b7280" },
  secondaryAction: {
    borderWidth: 1,
    borderColor: "#d62828",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#fff5f5",
  },
  secondaryActionText: {
    fontSize: 11,
    color: "#7a1c1c",
    fontWeight: "700",
  },
  postOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15,17,21,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  postModal: {
    width: "100%",
    maxHeight: "86%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0dada",
    overflow: "hidden",
  },
  postModalScroll: {
    flexGrow: 0,
  },
  postModalContent: {
    padding: 16,
    paddingBottom: 18,
    flexGrow: 0,
  },
  postHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f0dada",
  },
  closeButtonText: {
    color: "#7a1c1c",
    fontWeight: "700",
  },
  postMeta: {
    marginTop: 6,
    color: "#6b7280",
    fontSize: 12,
  },
  postMetaInlineRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  postMetaCreatorLink: {
    color: "#7a1c1c",
    fontSize: 12,
    fontWeight: "700",
  },
  postDescription: {
    marginTop: 10,
    color: "#111827",
    fontSize: 14,
    lineHeight: 20,
  },
  postPhotosRow: {
    marginTop: 12,
    marginBottom: 14,
  },
  postPhoto: {
    width: 230,
    height: 150,
    borderRadius: 12,
    marginRight: 10,
  },

  detailMiniMap: {
    width: "100%",
    height: 170,
    borderRadius: 12,
    marginBottom: 12,
  },
  commentComposerRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reportLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#fff5f5",
  },
  reportLinkText: {
    color: "#b91c1c",
    fontSize: 11,
    fontWeight: "700",
  },
  commentInput: {
    flex: 1,
  },
  commentsList: {
    marginTop: 8,
  },
  commentActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 14,
  },
  commentActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  commentActionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  replyComposerWrap: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  replyInput: {
    flex: 1,
    paddingVertical: 8,
  },
  replySendButton: {
    backgroundColor: "#7a1c1c",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  replySendButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  replyList: {
    marginTop: 8,
    gap: 6,
  },
  replyItem: {
    borderLeftWidth: 2,
    paddingLeft: 10,
    marginLeft: 2,
  },
  replyUser: {
    fontSize: 12,
    fontWeight: "700",
  },
  replyText: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  galleryScreen: {
    backgroundColor: "#0b0f15",
    minHeight: "100%",
    marginHorizontal: -20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  galleryPager: {
    marginTop: 48,
  },
  galleryCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 41,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  galleryImage: {
    width: screenWidth,
    height: screenWidth * 1.25,
    resizeMode: "contain",
  },

  searchCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0dada",
    padding: 14,
  },
  searchMapCard: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  searchResultsMap: {
    marginTop: 8,
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  searchTitle: { fontSize: 18, fontWeight: "700", color: "#7a1c1c", marginBottom: 10 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#f2c7c7",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fffafa",
  },
  filterBlock: { marginTop: 12 },
  filterTitle: { fontSize: 13, color: "#7a1c1c", fontWeight: "600", marginBottom: 8 },
  filterChip: {
    borderWidth: 1,
    borderColor: "#f2c7c7",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: "#fffafa",
  },
  filterChipActive: { backgroundColor: "#7a1c1c", borderColor: "#7a1c1c" },
  filterChipText: { color: "#7a1c1c", fontSize: 12, fontWeight: "600" },
  filterChipTextActive: { color: "#ffffff" },
  addFeatureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  addFeatureChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f2c7c7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fffafa",
  },
  addFeatureChipActive: {
    backgroundColor: "#7a1c1c",
    borderColor: "#7a1c1c",
  },
  addFeatureIcon: {
    marginRight: 5,
  },
  addFeatureText: {
    fontSize: 11,
    color: "#7a1c1c",
    fontWeight: "600",
  },
  addFeatureTextActive: {
    color: "#ffffff",
  },
  spotFeatureRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 4,
  },
  spotFeatureBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f2d4d4",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: "#fffafa",
  },
  spotFeatureText: {
    fontSize: 10,
    color: "#7a1c1c",
    marginLeft: 4,
    fontWeight: "600",
  },
  spotImageFeatureOverlay: {
    position: "absolute",
    top: 6,
    left: 6,
    flexDirection: "row",
  },
  spotImageFeatureIconBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255, 250, 250, 0.95)",
    borderWidth: 1,
    borderColor: "#f2d4d4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  nearbyButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#f2c7c7",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fffafa",
  },
  nearbyButtonActive: { backgroundColor: "#7a1c1c", borderColor: "#7a1c1c" },
  nearbyText: { color: "#7a1c1c", fontWeight: "600", fontSize: 12 },
  nearbyTextActive: { color: "#ffffff" },

  resultCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0dada",
  },
  resultImageWrap: {
    width: 90,
    height: 90,
    position: "relative",
  },
  resultImage: { width: 90, height: 90 },
  resultMeta: { padding: 10, flex: 1, justifyContent: "space-between" },
  resultName: { fontSize: 14, fontWeight: "700", color: "#7a1c1c" },
  resultDetail: { fontSize: 12, color: "#6b7280" },

  nearbyCard: {
    width: 150,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginRight: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0dada",
  },
  nearbyImage: { width: "100%", height: 80 },
  nearbyCardTitle: { fontSize: 12, fontWeight: "700", color: "#7a1c1c", padding: 8 },

  addCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0dada",
    padding: 14,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
    marginTop: 10,
  },
  locationLabelInput: {
    marginTop: 10,
  },
  mapHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  useLocationButton: {
    borderWidth: 1,
    borderColor: "#d62828",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff5f5",
  },
  useLocationButtonText: {
    color: "#7a1c1c",
    fontSize: 11,
    fontWeight: "700",
  },
  mapPreview: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    marginTop: 12,
    backgroundColor: "#f9eaea",
  },
  uploadButton: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d62828",
    paddingVertical: 10,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#7a1c1c",
    fontWeight: "700",
  },
  profileUploadButton: {
    marginTop: 0,
    paddingHorizontal: 16,
  },
  photoPreviewRow: {
    marginTop: 10,
  },
  previewThumb: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 8,
  },
  profileEditorCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0dada",
    padding: 14,
  },
  profilePreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  profilePreviewAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#d62828",
  },
  profileGalleryHeader: {
    marginTop: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  publicHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileUsernameSpacing: {
    marginBottom: 8,
  },
  profileBioBelowStats: {
    marginBottom: 10,
  },
  instagramProfileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  instagramCountersRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  instagramCounterItem: {
    alignItems: "flex-start",
  },
  instagramCounterValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  instagramCounterLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
  instagramTabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0dada",
    marginBottom: 8,
  },
  instagramTabButton: {
    marginRight: 18,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  instagramTabButtonActive: {
    borderBottomColor: "#111827",
  },
  instagramTabLabel: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "600",
  },
  instagramTabLabelActive: {
    color: "#111827",
  },
  connectionListBlock: {
    marginBottom: 8,
  },
  connectionListRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#f0dada",
    borderRadius: 12,
    backgroundColor: "#fffafa",
    marginBottom: 8,
  },
  connectionAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  connectionMetaCol: {
    flex: 1,
  },
  connectionListItem: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
    textAlign: "left",
  },
  connectionListSubtext: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  creatorCard: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f0dada",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  creatorMeta: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    color: "#7a1c1c",
    fontWeight: "700",
  },
  creatorUsername: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  settingRow: {
    backgroundColor: "#fffafa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0dada",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeToggleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeButton: {
    borderWidth: 1,
    borderColor: "#d62828",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 6,
    backgroundColor: "#fff5f5",
  },
  themeButtonActive: {
    backgroundColor: "#7a1c1c",
  },
  themeButtonText: {
    color: "#7a1c1c",
    fontSize: 11,
    fontWeight: "700",
  },
  themeButtonTextActive: {
    color: "#ffffff",
  },
  settingLabel: {
    fontSize: 14,
    color: "#7a1c1c",
    fontWeight: "600",
  },
  settingHint: {
    fontSize: 11,
    marginTop: 3,
  },
  settingValue: {
    fontSize: 12,
    color: "#d62828",
    fontWeight: "700",
  },
  activityCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f0dada",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  activityMessage: {
    color: "#7a1c1c",
    fontSize: 13,
    fontWeight: "600",
  },
  activityDate: {
    marginTop: 3,
    color: "#6b7280",
    fontSize: 11,
  },
  profilePhotosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  profilePhotoPressable: {
    width: "31%",
    marginBottom: 8,
  },
  profileGalleryImage: {
    width: "100%",
    height: 90,
    borderRadius: 10,
  },
  submitButton: {
    marginTop: 14,
    paddingVertical: 10,
    alignItems: "center",
  },

  placeholderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f0dada",
  },

  feedAction: {
    backgroundColor: "#7a1c1c",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  feedActionText: { color: "#ffffff", fontSize: 11, fontWeight: "600" },

  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#ead2d2",
  },
  navItem: { alignItems: "center", justifyContent: "center", paddingVertical: 4, minWidth: 54 },
  navText: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  navTextActive: { fontSize: 11, color: "#d62828", marginTop: 2, fontWeight: "600" },
  navAddWrapper: { alignItems: "center", minWidth: 70 },
  navAddButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#d62828",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -18,
    shadowColor: "#0f172a",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  navAddLabel: { fontSize: 10, color: "#7a1c1c", marginTop: 4, fontWeight: "600" },
  navAddIcon: { color: "#ffffff", fontSize: 26, fontWeight: "700" },
});
