import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";

const DriverStatistics = ({ driverStats }) => {
  return (
    <View style={styles.instructionsContainer}>
      <Text style={styles.sectionTitle}>Driver Statistics</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statsText}>Success Rate</Text>
          <Icon name="star" type="material" size={30} color="#FFD700" />
          <Text style={styles.statsText}>
            {driverStats.successfulTrips + driverStats.unsuccessfulTrips > 0
              ? parseFloat(
                  (driverStats.successfulTrips /
                    (driverStats.successfulTrips +
                      driverStats.unsuccessfulTrips)) *
                    100
                ).toFixed(2) + "%"
              : "0.00%"}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statsText}>Successful Trips</Text>
          <Icon name="check-circle" type="material" size={30} color="#4CAF50" />
          <Text style={styles.statsText}>{driverStats.successfulTrips}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statsText}>Unsuccessful Trips</Text>
          <Icon name="cancel" type="material" size={30} color="#F44336" />

          <Text style={styles.statsText}>{driverStats.unsuccessfulTrips}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  instructionsContainer: {
    marginTop: 8,
    backgroundColor: "#161622",
    padding: 12,
    borderRadius: 8,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statsText: {
    marginTop: 5,
    fontSize: 16,
    color: "white",
  },
});

export default DriverStatistics;
