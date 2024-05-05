import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { datas } from "./datas";
import { API_KEY } from "react-native-dotenv";

const MyLineChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (companyName) => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${companyName}&apikey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        const weeklyData = responseData["Weekly Adjusted Time Series"];
        // const dates = Object.keys(info);

        const formattedData = Object.keys(weeklyData).map((date) => ({
          value: parseFloat(weeklyData[date]["1. open"]),
        }));
        setData(formattedData.slice(0, 5));
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      /*Load state */
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      /* Incase Error */
      <View style={styles.error}>
        <Text>{error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.lineChart}>
      <LineChart
        data={data}
        xAxisLabelTexts={dates} //X-axis date data
        xAxisLabelsVerticalShift={30}
        xAxisLabelsHeight={22}
        xAxisTextNumberOfLines={1}
        xAxisLabelTextStyle={{
          //to transform date position
          color: "black",
          padding: 1,
          width: 90,
          transform: [{ rotate: "75deg" }],
        }}
      />
    </View>
  );
};

export default MyLineChart;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lineChart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
