import React, { useMemo, useState } from "react";
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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

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

export default function App() {
  const [spots, setSpots] = useState(seedSpots);
  const [activeTab, setActiveTab] = useState("home");
  const [searchText, setSearchText] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("Todas");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [creatorSearchText, setCreatorSearchText] = useState("");
  const [selectedHomeSpot, setSelectedHomeSpot] = useState(null);
  const [detailSourceTab, setDetailSourceTab] = useState("home");
  const [selectedCreator, setSelectedCreator] = useState(null);
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

  const [newSpot, setNewSpot] = useState({
    name: "",
    description: "",
    province: "San José",
    type: "Playa",
    spotPhotos: [],
    locationLabel: "",
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
  });

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

  const themedInputStyle = {
    backgroundColor: theme.input,
    color: theme.text,
    borderColor: theme.border,
  };
  const themedPlaceholderColor = theme.muted;

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
  });

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

  const openCreatorDetail = (creator) => {
    setSelectedCreator(creator);
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
    Alert.alert("Acciones rápidas", "¿Qué quieres abrir?", [
      { text: "Mi perfil", onPress: () => setActiveTab("perfil") },
      { text: "Notificaciones", onPress: () => setActiveTab("notificaciones") },
      { text: "Configuración", onPress: () => setActiveTab("config") },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleAddComment = () => {
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
      .filter((spot) => (nearbyOnly ? spot.province === nearbyProvince : true));
  }, [nearbyOnly, nearbyProvince, provinceFilter, searchText, spots, typeFilter]);

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
    const normalized = normalizeSpot(spot);
    setSavedSpotIds((current) => {
      const alreadySaved = current.includes(normalized.id);
      const updated = alreadySaved
        ? current.filter((id) => id !== normalized.id)
        : [normalized.id, ...current];

      return updated;
    });
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
    };

    setSpots((current) => [createdSpot, ...current]);
    setNewSpot({
      name: "",
      description: "",
      province: "San José",
      type: "Playa",
      spotPhotos: [],
      locationLabel: "",
    });
    setActiveTab("home");
  };

  const renderHome = () => (
    <>
      <View style={styles.profileRow}>
        <TouchableOpacity style={styles.profileLeft} onPress={() => setActiveTab("perfil")}>
          <Image source={{ uri: fallbackImageUrl }} style={styles.profileAvatar} />
          <View>
            <Text style={styles.profileHandle}>@CR_Adventures</Text>
            <Text style={styles.profileSubtitle}>Explorando Costa Rica</Text>
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
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Publicaciones destacadas</Text>
        <Text style={[styles.sectionCount, { color: theme.muted }]}>{spots.length} spots</Text>
      </View>

      <View style={styles.feedGrid}>
        {spots.map((spot) => {
          const s = normalizeSpot(spot);
          return (
            <TouchableOpacity key={s.id} style={styles.feedCard} onPress={() => openHomeSpotDetail(s, "home")}>
              <Image source={{ uri: s.imageUrl }} style={styles.feedImage} />
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

    return (
      <View style={[styles.profileEditorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
        <View style={styles.postHeaderRow}>
          <Text style={[styles.searchTitle, { color: theme.text, flex: 1 }]}>{selectedHomeSpot.name}</Text>
          <TouchableOpacity onPress={() => { setSelectedPhotoIndex(null); setActiveTab(detailSourceTab || "home"); }} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.postMeta, { color: theme.muted }]}>📍 {selectedHomeSpot.location} · {selectedHomeSpot.province}</Text>
        <Text style={[styles.postMeta, { color: theme.muted }]}>Tipo: {selectedHomeSpot.type} · Creador: {selectedHomeSpot.user}</Text>
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
            <Text style={styles.feedActionText}>Abrir mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryAction} onPress={() => toggleSaveSpot(selectedHomeSpot)}>
            <Text style={styles.secondaryActionText}>
              {savedSpotIds.includes(selectedHomeSpot.id) ? "Guardado" : "Guardar"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileGalleryHeader}>
          <Text style={[styles.filterTitle, { color: theme.text }]}>Comentarios de visitantes ({comments.length})</Text>
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

  const renderSearch = () => (
    <>
      <View style={styles.searchCard}>
        <Text style={styles.searchTitle}>Buscar spots</Text>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar por nombre..."
          placeholderTextColor={themedPlaceholderColor}
          style={[styles.searchInput, themedInputStyle]}
        />

        <View style={styles.filterBlock}>
          <Text style={styles.filterTitle}>Provincia</Text>
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
          <Text style={styles.filterTitle}>Tipo de spot</Text>
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
                  {type}
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
            Recomendaciones cerca de ti
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Resultados</Text>
        <Text style={[styles.sectionCount, { color: theme.muted }]}>{filteredSpots.length} encontrados</Text>
      </View>

      {filteredSpots.map((spot) => (
        <TouchableOpacity key={spot.id} style={styles.resultCard} onPress={() => openHomeSpotDetail(spot, "buscar")}>
          <Image source={{ uri: spot.imageUrl }} style={styles.resultImage} />
          <View style={styles.resultMeta}>
            <Text style={styles.resultName}>{spot.name}</Text>
            <Text style={styles.resultDetail}>{spot.province} · {spot.type}</Text>
            <View style={styles.feedFooterActions}>
              <TouchableOpacity style={styles.feedAction} onPress={() => handleOpenMap(spot.mapUrl, spot)}>
                <Text style={styles.feedActionText}>Abrir mapa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryAction} onPress={() => toggleSaveSpot(spot)}>
                <Text style={styles.secondaryActionText}>
                  {savedSpotIds.includes(spot.id) ? "Guardado" : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Cerca de ti</Text>
        <Text style={[styles.sectionCount, { color: theme.muted }]}>{nearbyProvince}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {nearbyRecommendations.map((spot) => (
          <View key={`near-${spot.id}`} style={styles.nearbyCard}>
            <Image source={{ uri: spot.imageUrl }} style={styles.nearbyImage} />
            <Text style={styles.nearbyCardTitle}>{spot.name}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Buscar creadores</Text>
        <Text style={[styles.sectionCount, { color: theme.muted }]}>{filteredCreators.length}</Text>
      </View>
      <TextInput
        value={creatorSearchText}
        onChangeText={setCreatorSearchText}
        placeholder="Buscar perfiles de creadores..."
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

    return (
      <View style={[styles.profileEditorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.postHeaderRow}>
          <Text style={[styles.searchTitle, { color: theme.text, flex: 1 }]}>Perfil del creador</Text>
          <TouchableOpacity onPress={() => setActiveTab("buscar")} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.creatorCard, { backgroundColor: theme.input, borderColor: theme.border, marginTop: 8 }]}> 
          <Image source={{ uri: selectedCreator.avatarUrl || fallbackImageUrl }} style={styles.creatorAvatar} />
          <View style={styles.creatorMeta}>
            <Text style={[styles.creatorName, { color: theme.text }]}>{selectedCreator.fullName}</Text>
            <Text style={[styles.creatorUsername, { color: theme.muted }]}>{selectedCreator.username}</Text>
            <Text style={[styles.profileSubtitle, { color: theme.muted, marginTop: 6 }]}>{selectedCreator.bio || "Sin biografía por ahora."}</Text>
          </View>
        </View>

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
                <Text style={[styles.resultDetail, { color: theme.muted }]}>{spot.province} · {spot.type}</Text>
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
      <Text style={styles.searchTitle}>Agregar nuevo spot</Text>
      <TextInput
        value={newSpot.name}
        onChangeText={(value) => setNewSpot((current) => ({ ...current, name: value }))}
        placeholder="Nombre del spot"
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle]}
      />
      <TextInput
        value={newSpot.description}
        onChangeText={(value) => setNewSpot((current) => ({ ...current, description: value }))}
        placeholder="Descripción corta"
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle, styles.textArea]}
        multiline
      />

      <View style={styles.filterBlock}>
        <Text style={styles.filterTitle}>Provincia</Text>
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
        <Text style={styles.filterTitle}>Tipo de spot</Text>
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
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TextInput
        value={newSpot.locationLabel}
        onChangeText={(value) => setNewSpot((current) => ({ ...current, locationLabel: value }))}
        placeholder="Nombre de ubicación (ej. Mirador de Orosi)"
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle, styles.locationLabelInput]}
      />

      <View style={styles.mapHeaderRow}>
        <Text style={styles.filterTitle}>Ubicación exacta del spot</Text>
        <TouchableOpacity style={styles.useLocationButton} onPress={useCurrentLocation}>
          <Text style={styles.useLocationButtonText}>Usar mi ubicación</Text>
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
        <Text style={styles.nearbyText}>Abrir ubicación seleccionada en Google Maps</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImageFromGallery}>
        <Text style={styles.uploadButtonText}>Cargar fotos del spot (máximo 10)</Text>
      </TouchableOpacity>
      {newSpot.spotPhotos.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoPreviewRow}>
          {newSpot.spotPhotos.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.previewThumb} />
          ))}
        </ScrollView>
      ) : null}

      <TouchableOpacity style={[styles.feedAction, styles.submitButton]} onPress={handleCreateSpot}>
        <Text style={styles.feedActionText}>Guardar spot</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfileEditor = () => (
    <View style={styles.profileEditorCard}>
      <Text style={styles.searchTitle}>Tu perfil</Text>
      <View style={styles.profilePreviewRow}>
        <Image
          source={{ uri: profileForm.avatarUrl || fallbackImageUrl }}
          style={styles.profilePreviewAvatar}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={pickProfileAvatar}>
          <Text style={styles.uploadButtonText}>Cambiar foto de perfil</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={profileForm.fullName}
        onChangeText={(value) => setProfileForm((current) => ({ ...current, fullName: value }))}
        placeholder="Nombre completo"
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle, styles.locationLabelInput]}
      />
      <TextInput
        value={profileForm.username}
        onChangeText={(value) => setProfileForm((current) => ({ ...current, username: value }))}
        placeholder="Usuario (@tu_usuario)"
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle, styles.locationLabelInput]}
      />
      <TextInput
        value={profileForm.bio}
        onChangeText={(value) => setProfileForm((current) => ({ ...current, bio: value }))}
        placeholder="Cuéntanos sobre ti..."
        placeholderTextColor={themedPlaceholderColor}
        style={[styles.searchInput, themedInputStyle, styles.textArea]}
        multiline
      />

      <View style={styles.profileGalleryHeader}>
        <Text style={styles.filterTitle}>Tus fotos ({profileForm.photos.length})</Text>
        <TouchableOpacity style={styles.useLocationButton} onPress={addPhotoToProfile}>
          <Text style={styles.useLocationButtonText}>Agregar foto</Text>
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
        <Text style={styles.feedActionText}>Guardar perfil</Text>
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

    return (
      <View style={styles.profileEditorCard}>
        <View style={styles.publicHeaderRow}>
          <Text style={styles.searchTitle}>{profile.fullName}</Text>
          <TouchableOpacity style={styles.useLocationButton} onPress={() => setIsProfileEditMode(true)}>
            <Text style={styles.useLocationButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.creatorUsername}>{profile.username}</Text>
        <Text style={styles.profileSubtitle}>{profile.bio}</Text>

        <View style={styles.profilePreviewRow}>
          <Image
            source={{ uri: profile.avatarUrl || fallbackImageUrl }}
            style={styles.profilePreviewAvatar}
          />
        </View>

        <View style={styles.profileGalleryHeader}>
          <Text style={styles.filterTitle}>Fotos del perfil ({profile.photos.length})</Text>
        </View>
        {profile.photos.length ? (
          <View style={styles.profilePhotosGrid}>
            {profile.photos.map((uri, index) => (
              <TouchableOpacity
                key={`profile-photo-${index}-${uri || "image"}`}
                style={styles.profilePhotoPressable}
                onPress={() => openGallery(profile.photos, index, "perfil")}
              >
                <Image source={{ uri }} style={styles.profileGalleryImage} />
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
                <Text style={styles.resultDetail}>{spot.province} · {spot.type}</Text>
                <TouchableOpacity
                  style={styles.feedAction}
                  onPress={() => handleOpenMap(spot.mapUrl, spot)}
                >
                  <Text style={styles.feedActionText}>Abrir mapa</Text>
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

  const renderSettings = () => (
    <View style={[styles.profileEditorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.searchTitle, { color: theme.text }]}>Configuración</Text>

      <View style={[styles.settingRow, { backgroundColor: theme.input, borderColor: theme.border }]}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>Tono de la app</Text>
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
              Claro
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, settings.darkMode && styles.themeButtonActive]}
            onPress={() => setSettings((current) => ({ ...current, darkMode: true }))}
          >
            <Text
              style={[styles.themeButtonText, settings.darkMode && styles.themeButtonTextActive]}
            >
              Oscuro
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.settingRow, { backgroundColor: theme.input, borderColor: theme.border }]}
        onPress={() => toggleSetting("notifications")}
      >
        <Text style={[styles.settingLabel, { color: theme.text }]}>Notificaciones</Text>
        <Text style={[styles.settingValue, { color: settings.darkMode ? "#ff8a8a" : "#d62828" }]}>{settings.notifications ? "ON" : "OFF"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.settingRow, { backgroundColor: theme.input, borderColor: theme.border }]}
        onPress={() => toggleSetting("privateProfile")}
      >
        <Text style={[styles.settingLabel, { color: theme.text }]}>Perfil privado</Text>
        <Text style={[styles.settingValue, { color: settings.darkMode ? "#ff8a8a" : "#d62828" }]}>{settings.privateProfile ? "ON" : "OFF"}</Text>
      </TouchableOpacity>

      <View style={styles.profileGalleryHeader}>
        <Text style={[styles.filterTitle, { color: theme.text }]}>Actividad reciente (últimos 3 vistos)</Text>
      </View>
      {viewedSpots.length ? (
        viewedSpots.slice(0, 3).map((spot) => (
          <View key={`viewed-${spot.id}`} style={[styles.activityCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.activityMessage, { color: theme.text }]}>Viste: {spot.name}</Text>
            <Text style={[styles.activityDate, { color: theme.muted }]}>
              {spot.province} · {spot.type} · {spot.dateLabel}
            </Text>
          </View>
        ))
      ) : (
        <Text style={[styles.profileSubtitle, { color: theme.muted }]}>Todavía no has visto spots recientemente.</Text>
      )}

      <View style={styles.profileGalleryHeader}>
        <Text style={[styles.filterTitle, { color: theme.text }]}>Guardados ({savedSpots.length})</Text>
      </View>
      {savedSpots.length ? (
        savedSpots.map((spot) => (
          <View key={`saved-${spot.id}`} style={[styles.resultCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Image source={{ uri: spot.imageUrl }} style={styles.resultImage} />
            <View style={styles.resultMeta}>
              <Text style={[styles.resultName, { color: theme.text }]}>{spot.name}</Text>
              <Text style={[styles.resultDetail, { color: theme.muted }]}>{spot.province} · {spot.type}</Text>
              <TouchableOpacity style={styles.feedAction} onPress={() => handleOpenMap(spot.mapUrl, spot)}>
                <Text style={styles.feedActionText}>Abrir mapa</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={[styles.profileSubtitle, { color: theme.muted }]}>No tienes spots guardados todavía.</Text>
      )}
    </View>
  );


  const renderFavorites = () => (
    <View style={[styles.profileEditorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
      <Text style={[styles.searchTitle, { color: theme.text }]}>Favoritos</Text>
      <Text style={[styles.profileSubtitle, { color: theme.muted, marginBottom: 12 }]}>Spots guardados ({savedSpots.length})</Text>
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
              <Text style={[styles.resultDetail, { color: theme.muted }]}>{spot.province} · {spot.type}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={[styles.profileSubtitle, { color: theme.muted }]}>No tienes spots favoritos todavía.</Text>
      )}
    </View>
  );

  const renderNotifications = () => (
    <View style={[styles.profileEditorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
      <Text style={[styles.searchTitle, { color: theme.text }]}>Centro de notificaciones</Text>
      <Text style={[styles.profileSubtitle, { color: theme.muted, marginBottom: 12 }]}>Última actividad reciente</Text>
      {viewedSpots.length ? (
        viewedSpots.slice(0, 10).map((spot) => (
          <TouchableOpacity
            key={`notif-${spot.id}-${spot.dateLabel}`}
            style={[styles.activityCard, { backgroundColor: theme.input, borderColor: theme.border }]}
            onPress={() => openHomeSpotDetail(spot, "notificaciones")}
          >
            <Text style={[styles.activityMessage, { color: theme.text }]}>Visitaste: {spot.name}</Text>
            <Text style={[styles.activityDate, { color: theme.muted }]}>{spot.dateLabel}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={[styles.profileSubtitle, { color: theme.muted }]}>No tienes notificaciones por ahora.</Text>
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
          <View>
            <Text style={styles.headerTitle}>Spoteando</Text>
            <Text style={[styles.headerSubtitle, { color: settings.darkMode ? "#d6d9e0" : "#ffe5e5" }]}>Costa Rica</Text>
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
          <Text style={activeTab === "home" ? styles.navTextActive : styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("buscar")}>
          <Ionicons name="search-outline" size={22} color={activeTab === "buscar" ? "#d62828" : "#6b7280"} />
          <Text style={activeTab === "buscar" ? styles.navTextActive : styles.navText}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navAddWrapper} onPress={() => setActiveTab("agregar")}>
          <View style={styles.navAddButton}>
            <Text style={styles.navAddIcon}>＋</Text>
          </View>
          <Text style={styles.navAddLabel}>Agregar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("perfil")}>
          <Ionicons name="person-outline" size={22} color={activeTab === "perfil" ? "#d62828" : "#6b7280"} />
          <Text style={activeTab === "perfil" ? styles.navTextActive : styles.navText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("config")}>
          <Ionicons name="settings-outline" size={22} color={activeTab === "config" ? "#d62828" : "#6b7280"} />
          <Text style={activeTab === "config" ? styles.navTextActive : styles.navText}>Config.</Text>
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
  commentInput: {
    flex: 1,
  },
  commentsList: {
    marginTop: 8,
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
