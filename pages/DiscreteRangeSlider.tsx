import React, { useState, useEffect } from 'react';
import {Box, Slider} from '@mui/material';

interface Mark {
  value: number;
  label: string;
}

interface DiscreteRangeSliderProps {
  onChange: (value: number[]) => void;
  minValue: number;
  maxValue: number;
  step: number;
  customMarks?: Mark[];
}

const DiscreteRangeSlider: React.FC<DiscreteRangeSliderProps> = ({
  onChange,
  minValue,
  maxValue,
  step,
  customMarks,
}) => {
  const [value, setValue] = useState<number[]>([minValue, maxValue]);

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  const marks = customMarks || Array.from({ length: (maxValue - minValue) / step + 1 }, (_, index) => ({
    value: minValue + index * step,
    label: `${minValue + index * step}`,
  }));

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <div>
      <Box sx={{ width: 1200 }}>
      <Slider 
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="discrete-range-slider"
        marks={marks}
        step={step}
        min={minValue}
        max={maxValue}
      />
      </Box>
    </div>
  );
};

export default DiscreteRangeSlider;