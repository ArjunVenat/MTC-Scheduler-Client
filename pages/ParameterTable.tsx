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
}

const MyTable: React.FC<MyTableProps> = ({ fileData }) => {
  const [data, setData] = useState<Row[]>([]);

  useEffect(() => {
    if (fileData) {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        // Explicitly type excelData as string[]
        const excelData: string[] = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
        const rows = excelData.map((name: string, index: number) => ({
          id: index + 1,
          name,
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Prioritize?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Rate</FormLabel>
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

export default MyTable;
