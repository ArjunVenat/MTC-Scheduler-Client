import React, { useState, ChangeEvent } from 'react';
import ScheduleSelector from 'react-schedule-selector';
import { SelectionSchemeType } from 'react-schedule-selector/dist/lib/selection-schemes';
import { Grid, Button, Typography, Slider, Slide } from '@mui/material';
import Stack from '@mui/material/Stack';
import DiscreteRangeSlider from './DiscreteRangeSlider';

const AdvancedWidget: React.FC = () => {
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
    const toggleAdvanced = () => {
      setShowAdvanced(!showAdvanced);
    };

    const [schedule, setSchedule] = React.useState<Array<Date>>([]);
    const [selectionScheme, setSelectionScheme] = React.useState<SelectionSchemeType>('square');
    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [numDays, setNumDays] = React.useState<number>(5);
    const [hourlyChunks, setHourlyChunks] = React.useState<number>(1);
    const [minTime, setMinTime] = React.useState<number>(12);
    const [maxTime, setMaxTime] = React.useState<number>(17);
    
    
    const handleDayRangeChange = (value: number[]) => {
      const startDay = value[0];
      const endDay = value[1];
      const numDays = endDay-startDay+1
      setNumDays(numDays)
    };
  
    const handleTimeRangeChange = (value: number[]) => {
      const minTime = value[0]
      const maxTime = value[1]
      setMinTime(minTime)
      setMaxTime(maxTime)
    };
  
  
    const daysOfWeek = [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ];
      
    
    const customDayMarks =  daysOfWeek.map((day, index) => ({
      value: index,
      label: day,
    }));
    
    const generateTimeMarks = () => {
      const marks = [];
      for (let hours = 0; hours < 24; hours++) {
        const formattedHours12 = hours % 12 === 0 ? 12 : hours % 12;
        const label = `${formattedHours12} ${hours < 12 ? 'AM' : 'PM'}`;
        marks.push({ value: hours, label });
      }
      return marks;
    };
  
    const customTimeMarks = generateTimeMarks();
  
    //Overriding Button Styles
    const [isHovered, setIsHovered] = useState(false);
    const buttonStyle = {
        backgroundColor: isHovered ? "#1565c0" : "#1976d2",
        
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',  // Center horizontally
        alignItems: 'center',      // Center vertically
        width: '100%',            // Full height of the viewport
      };

return (
    <div style={containerStyle}>

        <Stack spacing={6} alignItems={'center'}>

        <Button onClick={toggleAdvanced}  style={buttonStyle} variant='contained'>
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
        </Button>
        
        {showAdvanced && (        
            <div>
                <Stack spacing={4} alignItems={'center'}>
                        
                <Typography>Select Parameters</Typography>
                <DiscreteRangeSlider onChange={handleDayRangeChange} minValue={0} maxValue={6} step={1} customMarks={customDayMarks} />
                <DiscreteRangeSlider onChange={handleTimeRangeChange} minValue={0} maxValue={23} step={1} customMarks={customTimeMarks} />

                <ScheduleSelector
                minTime={minTime}
                maxTime={maxTime}
                numDays={numDays}
                startDate={new Date(startDate)}
                selection={schedule}
                onChange={setSchedule}
                hourlyChunks={hourlyChunks}
                timeFormat="h:mma"
                selectionScheme={selectionScheme}
                />
                </Stack>
            </div>
        )}
        </Stack>
          
    </div>)}

export default AdvancedWidget