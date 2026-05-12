import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  size: number;
  strokeWidth: number;
  progress: number; // 0 to 1
  color: string;
  trailColor?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  size,
  strokeWidth,
  progress,
  color,
  trailColor = 'rgba(255,255,255,0.08)',
  children,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trailColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      {children}
    </View>
  );
}

interface ThreeRingProps {
  stepProgress: number;
  calorieProgress: number;
  activeProgress: number;
  stepColor: string;
  calorieColor: string;
  activeColor: string;
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function ThreeRingProgress({
  stepProgress,
  calorieProgress,
  activeProgress,
  stepColor,
  calorieColor,
  activeColor,
  size = 180,
  centerLabel,
  centerValue,
}: ThreeRingProps) {
  const strokeWidth = 12;
  const gap = 6;

  const outerRadius = (size - strokeWidth) / 2;
  const midRadius = outerRadius - strokeWidth - gap;
  const innerRadius = midRadius - strokeWidth - gap;
  const center = size / 2;

  const toOffset = (progress: number, r: number) => {
    const circumference = 2 * Math.PI * r;
    return circumference * (1 - Math.min(Math.max(progress, 0), 1));
  };

  const makeCircle = (r: number, color: string, progress: number) => {
    const circumference = 2 * Math.PI * r;
    return (
      <>
        <Circle
          cx={center}
          cy={center}
          r={r}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={toOffset(progress, r)}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </>
    );
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {makeCircle(outerRadius, stepColor, stepProgress)}
        {makeCircle(midRadius, calorieColor, calorieProgress)}
        {makeCircle(innerRadius, activeColor, activeProgress)}
      </Svg>
      {centerLabel && (
        <View style={{ alignItems: 'center' }}>
          {centerValue && (
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>{centerValue}</Text>
          )}
          <Text style={{ color: '#9CA3AF', fontSize: 11 }}>{centerLabel}</Text>
        </View>
      )}
    </View>
  );
}
