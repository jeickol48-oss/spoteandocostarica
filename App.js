import React, { useMemo, useState } from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const fallbackImageUrl =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80";

const seedSpots = [
  {
    id: "1",
    name: "Catarata La Fortuna",
    description: "Sendero corto con vista a la catarata y poza natural.",
    mapUrl: "https://maps.google.com/?q=Catarata+La+Fortuna",
    tags: ["catarata", "senderismo"],
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    distance: "2.6 km",
    duration: "1 h 20 min",
    level: "Moderado",
    location: "Alajuela",
  },
  {
    id: "2",
    name: "Mirador Uvita",
    description: "Vista panorámica al parque Marino Ballena.",
    mapUrl: "https://maps.google.com/?q=Mirador+Uvita",
    tags: ["mirador", "playa"],
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    distance: "4.1 km",
    duration: "2 h 10 min",
    level: "Fácil",
    location: "Puntarenas",
  },
];

export default function App() {
  const [spots, setSpots] = useState(seedSpots);
  const [form, setForm] = useState({
    name: "",
    description: "",
    mapUrl: "",
    tags: "",
    imageUrl: "",
  });

  const canSubmit = useMemo(
    () => form.name.trim() && form.mapUrl.trim(),
    [form.name, form.mapUrl]
  );

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleAddSpot = () => {
    if (!canSubmit) {
      return;
    }

    const newSpot = {
      id: Date.now().toString(),
      name: form.name.trim(),
      description: form.description.trim(),
      mapUrl: form.mapUrl.trim(),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      imageUrl: form.imageUrl.trim(),
      distance: "3.0 km",
      duration: "1 h 45 min",
      level: "Moderado",
      location: "Costa Rica",
    };

    setSpots((current) => [newSpot, ...current]);
    setForm({
      name: "",
      description: "",
      mapUrl: "",
      tags: "",
      imageUrl: "",
    });
  };

  const handleOpenMap = async (url) => {
    if (!url) {
      return;
    }

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const resolveImageUrl = (url) => {
    if (url && url.trim().length > 0) {
      return url;
    }

    return fallbackImageUrl;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spoteando</Text>
        <Text style={styles.headerSubtitle}>Costa Rica</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personas en tendencia</Text>
            <Text style={styles.sectionCount}>Semana</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {spots.map((spot) => (
              <View key={`trend-${spot.id}`} style={styles.trendingAvatarCard}>
                <Image
                  source={{ uri: resolveImageUrl(spot.imageUrl) }}
                  style={styles.trendingAvatar}
                />
                <Text style={styles.trendingName}>{spot.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.viralSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Publicaciones virales</Text>
            <Text style={styles.sectionCount}>Top hoy</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {spots.map((spot) => (
              <View key={`viral-${spot.id}`} style={styles.viralCard}>
                <Image
                  source={{ uri: resolveImageUrl(spot.imageUrl) }}
                  style={styles.viralImage}
                />
                <View style={styles.viralContent}>
                  <Text style={styles.viralTitle}>{spot.name}</Text>
                  <Text style={styles.viralMeta}>
                    {spot.location} · {spot.distance}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>Encuentra tu próximo spot</Text>
          <View style={styles.searchRow}>
            <TextInput
              placeholder="Busca playas, cataratas, senderos..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Buscar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterChipActive}>
              <Text style={styles.filterChipActiveText}>Spots</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Mapa</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spots destacados</Text>
          <Text style={styles.sectionCount}>{spots.length} lugares</Text>
        </View>

        {spots.map((spot) => (
          <View key={spot.id} style={styles.spotCard}>
            <Image
              source={{ uri: resolveImageUrl(spot.imageUrl) }}
              style={styles.spotImage}
            />
            <View style={styles.spotContent}>
              <View style={styles.spotTitleRow}>
                <Text style={styles.spotName}>{spot.name}</Text>
                <View style={styles.favoriteBadge}>
                  <Text style={styles.favoriteBadgeText}>♡</Text>
                </View>
              </View>
              <Text style={styles.spotLocation}>{spot.location}</Text>
              <Text style={styles.spotDescription}>{spot.description}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Distancia</Text>
                  <Text style={styles.metaValue}>{spot.distance}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Duración</Text>
                  <Text style={styles.metaValue}>{spot.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Nivel</Text>
                  <Text style={styles.metaValue}>{spot.level}</Text>
                </View>
              </View>
              <View style={styles.tags}>
                {spot.tags.map((tag) => (
                  <Text key={`${spot.id}-${tag}`} style={styles.tag}>
                    {tag}
                  </Text>
                ))}
              </View>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => handleOpenMap(spot.mapUrl)}
              >
                <Text style={styles.linkText}>Abrir en mapas</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Nuevo spot</Text>
          <TextInput
            placeholder="Nombre del spot"
            value={form.name}
            onChangeText={(value) => updateField("name", value)}
            style={styles.input}
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            placeholder="Descripción"
            value={form.description}
            onChangeText={(value) => updateField("description", value)}
            style={[styles.input, styles.multilineInput]}
            multiline
            numberOfLines={3}
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            placeholder="Enlace de mapa (Google Maps u otro)"
            value={form.mapUrl}
            onChangeText={(value) => updateField("mapUrl", value)}
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            placeholder="Etiquetas (separadas por coma)"
            value={form.tags}
            onChangeText={(value) => updateField("tags", value)}
            style={styles.input}
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            placeholder="URL de imagen"
            value={form.imageUrl}
            onChangeText={(value) => updateField("imageUrl", value)}
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity
            onPress={handleAddSpot}
            style={[styles.button, !canSubmit && styles.buttonDisabled]}
            disabled={!canSubmit}
          >
            <Text style={styles.buttonText}>Agregar spot</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔎</Text>
          <Text style={styles.navText}>Buscar</Text>
        </TouchableOpacity>
        <View style={styles.navAddWrapper}>
          <TouchableOpacity style={styles.navAddButton}>
            <Text style={styles.navAddIcon}>＋</Text>
          </TouchableOpacity>
          <Text style={styles.navAddLabel}>Agregar</Text>
        </View>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f2ff",
  },
  container: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#cdb4db",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3f2a56",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#5a4173",
    marginTop: 2,
  },
  searchCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f9f1ff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginRight: 10,
    color: "#111827",
  },
  searchButton: {
    backgroundColor: "#a7c7e7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  searchButtonText: {
    color: "#1f2a44",
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  filterChipActive: {
    backgroundColor: "#a7c7e7",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginRight: 8,
  },
  filterChipActiveText: {
    color: "#1f2a44",
    fontWeight: "600",
    fontSize: 12,
  },
  filterChip: {
    backgroundColor: "#fce1e4",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginRight: 8,
  },
  filterChipText: {
    color: "#6b3b47",
    fontWeight: "600",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionCount: {
    color: "#6b7280",
    fontSize: 12,
  },
  trendingSection: {
    marginBottom: 12,
  },
  trendingAvatarCard: {
    width: 90,
    marginRight: 12,
    alignItems: "center",
  },
  trendingAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#a7c7e7",
  },
  trendingName: {
    marginTop: 6,
    fontSize: 11,
    color: "#374151",
    textAlign: "center",
  },
  viralSection: {
    marginBottom: 12,
  },
  viralCard: {
    width: 220,
    marginRight: 14,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  viralImage: {
    width: "100%",
    height: 120,
  },
  viralContent: {
    padding: 12,
  },
  viralTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  viralMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  card: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: "#f9fafb",
    color: "#111827",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#b7e4c7",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  spotCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  spotImage: {
    width: "100%",
    height: 160,
  },
  spotContent: {
    padding: 16,
  },
  spotTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  favoriteBadge: {
    backgroundColor: "#fef3c7",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteBadgeText: {
    fontSize: 16,
    color: "#b45309",
  },
  spotLocation: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  spotName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 12,
  },
  spotDescription: {
    marginTop: 8,
    color: "#4b5563",
    fontSize: 13,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metaItem: {
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 10,
    color: "#6b7280",
    textTransform: "uppercase",
  },
  metaValue: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  tag: {
    backgroundColor: "#d8f3dc",
    color: "#2c4a3b",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
  },
  linkButton: {
    alignSelf: "flex-start",
    backgroundColor: "#cde7f0",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  linkText: {
    color: "#2a5d79",
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    minWidth: 60,
  },
  navItemActive: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    minWidth: 60,
  },
  navIcon: {
    fontSize: 18,
  },
  navText: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 11,
    color: "#5b6d9c",
    marginTop: 2,
    fontWeight: "600",
  },
  navAddWrapper: {
    alignItems: "center",
    minWidth: 70,
  },
  navAddButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#a7c7e7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -18,
    shadowColor: "#0f172a",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  navAddLabel: {
    fontSize: 10,
    color: "#5b6d9c",
    marginTop: 4,
    fontWeight: "600",
  },
  navAddIcon: {
    color: "#1f2a44",
    fontSize: 26,
    fontWeight: "700",
  },
});
