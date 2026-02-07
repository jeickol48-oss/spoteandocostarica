import React, { useMemo, useState } from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const fallbackImageUrl =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80";

const userProvince = "San José";

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
  const [spots] = useState(seedSpots);
  const [activeTab, setActiveTab] = useState("home");
  const [searchText, setSearchText] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("Todas");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [nearbyOnly, setNearbyOnly] = useState(false);

  const handleOpenMap = async (url) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  const normalizeSpot = (spot) => ({
    ...spot,
    imageUrl: spot.imageUrl?.trim() ? spot.imageUrl : fallbackImageUrl,
    location: spot.location || "Costa Rica",
    province: spot.province || "San José",
    type: spot.type || "Spot",
    user: spot.user || "@CR_Adventures",
  });

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
      .filter((spot) => (nearbyOnly ? spot.province === userProvince : true));
  }, [nearbyOnly, provinceFilter, searchText, spots, typeFilter]);

  const nearbyRecommendations = useMemo(
    () => spots.map(normalizeSpot).filter((spot) => spot.province === userProvince),
    [spots]
  );

  const renderHome = () => (
    <>
      <View style={styles.profileRow}>
        <View style={styles.profileLeft}>
          <Image source={{ uri: fallbackImageUrl }} style={styles.profileAvatar} />
          <View>
            <Text style={styles.profileHandle}>@CR_Adventures</Text>
            <Text style={styles.profileSubtitle}>Explorando Costa Rica</Text>
          </View>
        </View>
        <View style={styles.profileActions}>
          <Text style={styles.profileActionIcon}>🔔</Text>
          <Text style={styles.profileActionIcon}>⋯</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Publicaciones destacadas</Text>
        <Text style={styles.sectionCount}>{spots.length} spots</Text>
      </View>

      <View style={styles.feedGrid}>
        {spots.map((spot) => {
          const s = normalizeSpot(spot);
          return (
            <View key={s.id} style={styles.feedCard}>
              <Image source={{ uri: s.imageUrl }} style={styles.feedImage} />
              <View style={styles.feedMeta}>
                <Text style={styles.feedLocation}>📍 {s.location}</Text>
                <Text style={styles.feedName}>{s.name}</Text>
                <View style={styles.feedFooter}>
                  <Text style={styles.feedUser}>{s.user}</Text>
                  <TouchableOpacity style={styles.feedAction} onPress={() => handleOpenMap(s.mapUrl)}>
                    <Text style={styles.feedActionText}>Mapa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </>
  );

  const renderSearch = () => (
    <>
      <View style={styles.searchCard}>
        <Text style={styles.searchTitle}>Buscar spots</Text>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar por nombre..."
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
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
          onPress={() => setNearbyOnly((current) => !current)}
        >
          <Text style={[styles.nearbyText, nearbyOnly && styles.nearbyTextActive]}>
            Recomendados cerca de ti ({userProvince})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Resultados</Text>
        <Text style={styles.sectionCount}>{filteredSpots.length} encontrados</Text>
      </View>

      {filteredSpots.map((spot) => (
        <View key={spot.id} style={styles.resultCard}>
          <Image source={{ uri: spot.imageUrl }} style={styles.resultImage} />
          <View style={styles.resultMeta}>
            <Text style={styles.resultName}>{spot.name}</Text>
            <Text style={styles.resultDetail}>{spot.province} · {spot.type}</Text>
            <TouchableOpacity style={styles.feedAction} onPress={() => handleOpenMap(spot.mapUrl)}>
              <Text style={styles.feedActionText}>Abrir mapa</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Cerca de ti</Text>
        <Text style={styles.sectionCount}>{userProvince}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {nearbyRecommendations.map((spot) => (
          <View key={`near-${spot.id}`} style={styles.nearbyCard}>
            <Image source={{ uri: spot.imageUrl }} style={styles.nearbyImage} />
            <Text style={styles.nearbyCardTitle}>{spot.name}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );

  const renderPlaceholder = (title) => (
    <View style={styles.placeholderCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.profileSubtitle}>Pantalla en construcción.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Spoteando</Text>
            <Text style={styles.headerSubtitle}>Costa Rica</Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.headerIcon}>♡</Text>
            <Text style={styles.headerIcon}>✉️</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {activeTab === "home" && renderHome()}
        {activeTab === "buscar" && renderSearch()}
        {activeTab === "agregar" && renderPlaceholder("Agregar spot")}
        {activeTab === "perfil" && renderPlaceholder("Perfil")}
        {activeTab === "config" && renderPlaceholder("Configuración")}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("home")}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={activeTab === "home" ? styles.navTextActive : styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("buscar")}>
          <Text style={styles.navIcon}>🔎</Text>
          <Text style={activeTab === "buscar" ? styles.navTextActive : styles.navText}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navAddWrapper} onPress={() => setActiveTab("agregar")}>
          <View style={styles.navAddButton}>
            <Text style={styles.navAddIcon}>＋</Text>
          </View>
          <Text style={styles.navAddLabel}>Agregar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("perfil")}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={activeTab === "perfil" ? styles.navTextActive : styles.navText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("config")}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={activeTab === "config" ? styles.navTextActive : styles.navText}>Config.</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  profileLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
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
  feedFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedUser: { fontSize: 11, color: "#6b7280" },

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
  navIcon: { fontSize: 18 },
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
