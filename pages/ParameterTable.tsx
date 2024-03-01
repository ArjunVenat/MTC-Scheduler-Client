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
  social_credit_score: number;
  prioritize: boolean;
}

interface MyTableProps {
  fileData: File | null;
  onChange: (choices: any) => void; // Define the onChange prop
  isCleanedUpload: boolean; // Flag indicating whether the uploaded file is cleaned
}

const ParameterTable: React.FC<MyTableProps> = ({ fileData, onChange, isCleanedUpload }) => {
  const [data, setData] = useState<Row[]>([]);

  useEffect(() => {
    if (fileData) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target?.result as string, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          let names: any[];
          let socialCreditList: any[];
          let priorityList: any[];

          if (isCleanedUpload) {
            names = XLSX.utils.sheet_to_json(sheet, { header: 1 }).map((row: any) => row[1]); // Column B for cleaned file

            const socialCreditIndex = 6; // Index 6 for cleaned file
            const prioritizeIndex = 7; // Index 7 for cleaned file

            socialCreditList = XLSX.utils.sheet_to_json(sheet, { header: 1 }).map((row: any) => row[socialCreditIndex])
            priorityList = XLSX.utils.sheet_to_json(sheet, { header: 1 }).map((row: any) => row[prioritizeIndex])

          } else {
            names = XLSX.utils.sheet_to_json(sheet, { header: 1 }).map((row: any) => row[17]); // Column R for raw Qualtrics file
          }

          // Filter out undefined or non-string values
          const validColumnData: string[] = names.filter((value: any) => typeof value === 'string');

          
          const rows: Row[] = validColumnData.map((value: string, index: number) => {
            if (isCleanedUpload) {

              const socialCreditValue = socialCreditList[index];
              const prioritizeValue = priorityList[index];

              return {
                id: index + 1,
                name: value,
                social_credit_score: socialCreditValue ? parseInt(socialCreditValue, 10) : 3, // Use social credit value from list
                prioritize: prioritizeValue ? prioritizeValue === 'Yes' : false, // Use prioritize value from list
              };
            } else {
              return {
                id: index + 1,
                name: value,
                social_credit_score: 3, // Default score for raw Qualtrics data
                prioritize: false, // Default prioritize value for raw Qualtrics data
              };
            }
          });
          

          setData(rows);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
        }
      };

      reader.readAsBinaryString(fileData);
    }
  }, [fileData, isCleanedUpload]);

  const handleRadioChange = (id: number, value: string) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, social_credit_score: parseInt(value, 10) } : row))
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
            <TableCell>Select the student&apos;s Social Credit Score</TableCell>
            <TableCell>Prioritize? (Check if Yes)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(isCleanedUpload ? 1 : 2).map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Social Credit Score</FormLabel>
                  <RadioGroup row>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <FormControlLabel
                        key={value}
                        value={value.toString()}
                        control={
                          <Radio
                            checked={row.social_credit_score === value}
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
