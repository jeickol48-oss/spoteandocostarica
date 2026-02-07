import React, { useState } from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
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
  const [spots] = useState(seedSpots);

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

  const normalizeSpot = (spot) => ({
    ...spot,
    imageUrl: resolveImageUrl(spot.imageUrl),
    tags: Array.isArray(spot.tags) ? spot.tags : [],
    location: spot.location || "Costa Rica",
    distance: spot.distance || "—",
    duration: spot.duration || "—",
    level: spot.level || "—",
    user: spot.user || "@CR_Adventures",
  });

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
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileRow}>
          <View style={styles.profileLeft}>
            <Image
              source={{ uri: fallbackImageUrl }}
              style={styles.profileAvatar}
            />
            <View>
              <Text style={styles.profileHandle}>@CR_Adventures</Text>
              <Text style={styles.profileSubtitle}>
                Explorando Costa Rica
              </Text>
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
            const normalizedSpot = normalizeSpot(spot);
            return (
              <View key={normalizedSpot.id} style={styles.feedCard}>
                <Image
                  source={{ uri: normalizedSpot.imageUrl }}
                  style={styles.feedImage}
                />
                <View style={styles.feedMeta}>
                  <Text style={styles.feedLocation}>
                    📍 {normalizedSpot.location}
                  </Text>
                  <Text style={styles.feedName}>{normalizedSpot.name}</Text>
                  <View style={styles.feedFooter}>
                    <Text style={styles.feedUser}>{normalizedSpot.user}</Text>
                    <TouchableOpacity
                      style={styles.feedAction}
                      onPress={() => handleOpenMap(normalizedSpot.mapUrl)}
                    >
                      <Text style={styles.feedActionText}>Mapa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
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
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Config.</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  container: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#7a1c1c",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e6f2ff",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  headerIcon: {
    color: "#ffffff",
    fontSize: 18,
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
  profileRow: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e6edf5",
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#d62828",
  },
  profileHandle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7a1c1c",
  },
  profileSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  profileActions: {
    flexDirection: "row",
    gap: 12,
  },
  profileActionIcon: {
    fontSize: 18,
    color: "#d62828",
  },
  feedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  feedCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e6edf5",
  },
  feedImage: {
    width: "100%",
    height: 120,
  },
  feedMeta: {
    padding: 10,
  },
  feedLocation: {
    fontSize: 11,
    color: "#d62828",
    fontWeight: "600",
  },
  feedName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7a1c1c",
    marginTop: 4,
  },
  feedFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedUser: {
    fontSize: 11,
    color: "#6b7280",
  },
  feedAction: {
    backgroundColor: "#7a1c1c",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  feedActionText: {
    color: "#ffffff",
    fontSize: 11,
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
    color: "#d62828",
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
  navAddLabel: {
    fontSize: 10,
    color: "#7a1c1c",
    marginTop: 4,
    fontWeight: "600",
  },
  navAddIcon: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "700",
  },
});
