import React, { useMemo, useState } from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const seedSpots = [
  {
    id: "1",
    name: "Catarata La Fortuna",
    description: "Sendero corto con vista a la catarata.",
    mapUrl: "https://maps.google.com/?q=Catarata+La+Fortuna",
    tags: ["catarata", "senderismo"],
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Spoteando Costa Rica</Text>
        <Text style={styles.subtitle}>
          Comparte lugares increíbles con ubicación, fotos y detalles.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Nuevo spot</Text>
          <TextInput
            placeholder="Nombre del spot"
            value={form.name}
            onChangeText={(value) => updateField("name", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Descripción"
            value={form.description}
            onChangeText={(value) => updateField("description", value)}
            style={[styles.input, styles.multilineInput]}
            multiline
            numberOfLines={3}
          />
          <TextInput
            placeholder="Enlace de mapa (Google Maps u otro)"
            value={form.mapUrl}
            onChangeText={(value) => updateField("mapUrl", value)}
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Etiquetas (separadas por coma)"
            value={form.tags}
            onChangeText={(value) => updateField("tags", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="URL de imagen"
            value={form.imageUrl}
            onChangeText={(value) => updateField("imageUrl", value)}
            style={styles.input}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={handleAddSpot}
            style={[styles.button, !canSubmit && styles.buttonDisabled]}
            disabled={!canSubmit}
          >
            <Text style={styles.buttonText}>Agregar spot</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          <Text style={styles.sectionTitle}>Spots recientes</Text>
          {spots.map((spot) => (
            <View key={spot.id} style={styles.spotCard}>
              <Text style={styles.spotName}>{spot.name}</Text>
              {spot.description ? (
                <Text style={styles.spotDescription}>{spot.description}</Text>
              ) : null}
              {spot.tags.length ? (
                <View style={styles.tags}>
                  {spot.tags.map((tag) => (
                    <Text key={`${spot.id}-${tag}`} style={styles.tag}>
                      {tag}
                    </Text>
                  ))}
                </View>
              ) : null}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => handleOpenMap(spot.mapUrl)}
                >
                  <Text style={styles.linkText}>Abrir mapa</Text>
                </TouchableOpacity>
                {spot.imageUrl ? (
                  <Text style={styles.imageHint}>Imagen: {spot.imageUrl}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#475569",
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
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: "#f8fafc",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  list: {
    marginTop: 24,
  },
  spotCard: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  spotName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  spotDescription: {
    marginTop: 6,
    color: "#475569",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tag: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
  },
  actions: {
    marginTop: 12,
  },
  linkButton: {
    alignSelf: "flex-start",
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  linkText: {
    color: "#1d4ed8",
    fontWeight: "600",
  },
  imageHint: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 12,
  },
});
