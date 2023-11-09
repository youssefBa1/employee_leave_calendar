import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, FlatList, StyleSheet } from "react-native";

function TableScreen() {
  const [tableData, setTableData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthName = new Date(0, monthIndex).toLocaleString("en-US", {
      month: "long",
    });
    return monthName;
  });

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const numRows = 3; // Number of employee rows

    // Generate header row with months
    const headerRow = ["Employee"];
    months.forEach((month) => {
      headerRow.push(month);
    });
    setHeaderData(headerRow);

    // Generate employee data rows (dummy data)
    const employeeRows = [];
    for (let i = 1; i <= numRows; i++) {
      const employeeRow = [`Employee ${i}`];
      months.forEach((_, monthIndex) => {
        const days = daysInMonth(monthIndex, currentYear);
        for (let j = 1; j <= days; j++) {
          employeeRow.push(`Data ${i}-${monthIndex + 1}-${j}`);
        }
      });
      employeeRows.push(employeeRow);
    }

    // Combine all rows
    const data = [...headerRow, ...employeeRows];

    setTableData(data);
  }, []);

  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        {/* Render headers using FlatList */}
        <FlatList
          data={headerData}
          renderItem={({ item }) => (
            <View style={styles.headerCell}>
              <Text>{item}</Text>
            </View>
          )}
          horizontal={true}
          keyExtractor={(item) => item}
        />
        {/* Render data using nested ScrollView */}
        <ScrollView horizontal={true}>
          <View>
            {tableData.map((rowData, rowIndex) => (
              <View
                key={rowIndex}
                style={[styles.row, rowIndex === 0 && styles.rowHeader]}
              >
                {rowData.map((cellData, cellIndex) => (
                  <View
                    key={cellIndex}
                    style={[
                      styles.cell,
                      cellIndex === 0 && styles.rowHeaderCell,
                    ]}
                  >
                    <Text>{cellData}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  headerCell: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#C1C0B9",
    padding: 10,
    minWidth: 80,
    backgroundColor: "#F6F5F5",
  },
  cell: {
    flex: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#C1C0B9",
    padding: 10,
    minWidth: 80,
    backgroundColor: "#FFF1C1",
  },
  rowHeader: {
    backgroundColor: "#F6F5F5",
  },
  rowHeaderCell: {
    backgroundColor: "#FFF1C1",
  },
});

export default TableScreen;
