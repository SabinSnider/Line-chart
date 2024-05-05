import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
} from "react-native-gifted-charts";
import { Dropdown } from "react-native-element-dropdown";
import { datas } from "./datas";
import MyLineChart from "./lineChart";

export default function App() {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [data, setData] = useState([]);

  const info = datas["Weekly Adjusted Time Series"]; //using offline data since api limit was 25 per day
  const dates = Object.keys(info);
  console.log(dates, "Dates values in Array");

  const options = [
    { label: "Open", value: "Open" },
    { label: "High", value: "High" },
    { label: "Low", value: "Low" },
    { label: "Close", value: "Close" },
  ];

  const companyName = [
    { label: "IBM", value: "IBM" },
    { label: "MSFT", value: "MSFT" },
  ];

  // to handle dropdown state value
  const handleState = async (companyName) => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${companyName}&apikey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        const weeklyData = responseData["Weekly Adjusted Time Series"];
        const formattedData = Object.keys(weeklyData).map((date) => ({
          value: parseFloat(weeklyData[date]["1. open"]),
        }));
        setData(formattedData.slice(0, 5)); // get formatted data and save in state
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
  }


  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 35 }}>
        {/* <DropdownComponent /> */}
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={companyName}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              handleState(item.value);
              setValue(item.value);
            }}
          />

          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={options}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              // handleState(item.value);
              //   setValue(item.value);
              setIsFocus(false);
            }}
          />
        </View>
      </View>
      <View style={styles.lineChart}>
        <LineChart
          data={data}
          xAxisLabelTexts={dates}
          xAxisLabelsVerticalShift={30}
          xAxisLabelsHeight={22}
          xAxisTextNumberOfLines={1}
          xAxisLabelTextStyle={{
            color: "black",
            padding: 1,
            width: 90,
            transform: [{ rotate: "75deg" }],
          }}
        />
      </View>

      {/* <View><MyLineChart/></View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownContainer: {
    width: 350,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    width: 120,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 18,
    paddingHorizontal: 8,
  },
  lineChart: {
    height: 300,
  },
});
