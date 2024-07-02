// PieChart.js
import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';

const PieChartComponent = ({ data }) => {
  const pieData = data
    .filter(value => value.amount > 0)
    .map((value, index) => ({
      key: `${value.label}-${index}`,
      value: value.amount,
      svg: {
        fill: value.color,
        onPress: () => console.log('press', index),
      },
      arc: { outerRadius: '100%', cornerRadius: 10 },
      label: value.label,
    }));

  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, data } = slice;
      return (
        <Text
          key={index}
          x={labelCentroid[0]}
          y={labelCentroid[1]}
          fill={'white'}
          textAnchor={'middle'}
          alignmentBaseline={'middle'}
          fontSize={24}
          stroke={'black'}
          strokeWidth={0.2}
        >
          {data.label}
        </Text>
      );
    });
  };

  return (
    <View style={{ height: 300 }}>
      <PieChart style={{ flex: 1 }} data={pieData}>
        <Labels />
      </PieChart>
    </View>
  );
};

export default PieChart;
