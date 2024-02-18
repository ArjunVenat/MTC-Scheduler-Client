import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import * as XLSX from 'xlsx';

interface Row {
  id: number;
  name: string;
  socialButterflyScore: number;
  prioritize: boolean;
}

interface MyTableProps {
  fileData: File | null;
  onChange: (choices: any) => void; // Define the onChange prop
}

const ParameterTable: React.FC<MyTableProps> = ({ fileData, onChange }) => {
  const [data, setData] = useState<Row[]>([]);

  useEffect(() => {
    if (fileData) {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target?.result as string, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        // Extract data from column R
        const columnRData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 }).map((row: any) => row[17]);
  
        // Filter out undefined or non-string values
        const validColumnRData: string[] = columnRData.filter((value: any) => typeof value === 'string');
  
        const rows: Row[] = validColumnRData.map((value: string, index: number) => ({
          id: index + 1,
          name: value,
          socialButterflyScore: 3, // Set a default score if needed
          prioritize: false, // Set a default prioritize value if needed
        }));
  
        setData(rows);
      };
  
      reader.readAsBinaryString(fileData);
    }
  }, [fileData]);

  const handleRadioChange = (id: number, value: string) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, socialButterflyScore: parseInt(value, 10) } : row))
    );
  };

  const handleCheckboxChange = (id: number) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, prioritize: !row.prioritize } : row))
    );
  };

  useEffect(() => {
    // Call the onChange function with the current data when it changes
    if (onChange) {
      onChange(data);
    }
  }, [data, onChange]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Rate the student's "Social Butterfly"</TableCell>
            <TableCell>Prioritize? (Check if Yes)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(2).map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <FormControl component="fieldset">
                  <FormLabel component="legend">"Social Butterfly" Score</FormLabel>
                  <RadioGroup row>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <FormControlLabel
                        key={value}
                        value={value.toString()}
                        control={
                          <Radio
                            checked={row.socialButterflyScore === value}
                            onChange={(e) => handleRadioChange(row.id, e.target.value)}
                          />
                        }
                        label={value.toString()}
                        labelPlacement="bottom"
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={row.prioritize}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  }
                  label="Prioritize?"
                  labelPlacement="bottom"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ParameterTable;