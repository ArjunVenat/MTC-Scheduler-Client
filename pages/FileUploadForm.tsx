import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Stack, Grid, LinearProgress, Typography } from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import ParameterTable from './ParameterTable';

interface FileUploadComponentProps {
  // Define any additional props if needed
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = () => {
  const apiEndpoint1 = "http://localhost:5000/api/get_cleaned";
  const apiEndpoint2 = "http://localhost:5000/api/get_solution";

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [parameterTableChoices, setParameterTableChoices] = useState<any>(null);
  const [isCleanedUpload, setIsCleanedUpload] = useState<boolean>(false); // Initialize isCleanedUpload state

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      // Set isCleanedUpload based on which file input is clicked
      setIsCleanedUpload(event.target.id === 'cleaned-file');
    }
  };

  const handleParameterTableChange = (choices: any) => {
    // Map through the choices and encode "Yes" as true and "No" as false for the 'prioritized?' column
    const encodedChoices = choices.map((choice: any) => ({
      ...choice,
      prioritized: choice.prioritized === 'Yes' ? true : false
    }));
  
    setParameterTableChoices(encodedChoices);
  };
  

  const handleSubmit = async (event: FormEvent, endpoint: string, flag: boolean, filePath: string) => {
    event.preventDefault();
  
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
  
    // Determine the mode based on isCleanedUpload
    const mode = isCleanedUpload ? "Cleaned" : "Qualtrics";
    formData.append('mode', mode);
  
    if (flag && parameterTableChoices) {
      formData.append('parameterTableChoices', JSON.stringify(parameterTableChoices));
    }
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('File uploaded successfully');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
  
        setUploadProgress(0);
      } else {
        console.error('Error uploading file:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <form>
      <Stack alignItems="center">
        {/* File upload buttons */}
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item>
            <input
              accept="*"
              style={{ display: 'none' }}
              id="raw-qualtrics-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raw-qualtrics-file">
              <Button variant="contained" color="primary" component="span" endIcon={<AttachFileIcon />}>
                Upload Raw Qualtrics
              </Button>
            </label>
          </Grid>
          <Grid item>
            <input
              accept="*"
              style={{ display: 'none' }}
              id="cleaned-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="cleaned-file">
              <Button variant="contained" color="primary" component="span" endIcon={<AttachFileIcon />}>
                Upload Cleaned
              </Button>
            </label>
          </Grid>
        </Grid>
  
        {/* Display selected file and parameter table */}
        {file && (
          <div>
            <Stack spacing={12}>
              <div>
                <Typography variant='body1'> Selected File: {file.name}</Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </div>
  
              <Stack spacing={2}>
                {/* Parameter table */}
                <Typography variant='body1' align='center'> Step 3) Fill out the table below </Typography>
                <ParameterTable
                  fileData={file}
                  onChange={handleParameterTableChange}
                  isCleanedUpload={isCleanedUpload}
                />
  
                {/* Buttons for getting cleaned file and solution */}
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    onClick={(e) => handleSubmit(e, apiEndpoint1, true, "cleaned.xlsx")}
                    variant="contained"
                    color="primary"
                    endIcon={<SaveAltIcon />}
                  >
                    Get/Update Cleaned File
                  </Button>
                  <Button
                    onClick={(e) => handleSubmit(e, apiEndpoint2, true, "solution.xlsx")}
                    variant="contained"
                    color="primary"
                    endIcon={<SaveAltIcon />}
                  >
                    Get Solution
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </div>
        )}
      </Stack>
    </form>
  );
  
  
};

export default FileUploadComponent;
