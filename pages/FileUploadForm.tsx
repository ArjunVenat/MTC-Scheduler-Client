import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Stack, Grid, LinearProgress, Typography } from '@mui/material';
import ParameterTable from './ParameterTable';

interface FileUploadComponentProps {
  // Define any additional props if needed
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = () => {
  const apiEndpoint1 = "http://localhost:5000/get_cleaned";
  const apiEndpoint2 = "http://localhost:5000/get_solution";

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [parameterTableChoices, setParameterTableChoices] = useState<any>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleParameterTableChange = (choices: any) => {
    setParameterTableChoices(choices);
  };

  const handleSubmit = async (event: FormEvent, endpoint: string, flag: boolean, filePath: string) => {
    event.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

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
        <Grid item xs={12}>
          <input
            accept="*"
            style={{ display: 'none' }}
            id="contained-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              Upload File
            </Button>
          </label>
          {file && (
            <div>
              <Stack spacing={12}>
                <div>
                  <Typography variant='body1'> Selected File: {file.name}</Typography>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </div>

                <Stack spacing={2}>
                  <ParameterTable fileData={file} onChange={handleParameterTableChange} />
                  <Button
                    onClick={(e) => handleSubmit(e, apiEndpoint1, true, "cleaned.xlsx")}
                    variant="contained"
                    color="primary"
                  >
                    Save Choices and Get Cleaned Files
                  </Button>
                </Stack>

                <Stack spacing={2}>
                  <Button
                    onClick={(e) => handleSubmit(e, apiEndpoint2, false, "output.xlsx")}
                    variant="contained"
                    color="primary"
                  >
                    Get Output Solution
                  </Button>
                </Stack>
              </Stack>
            </div>
          )}
        </Grid>
      </Stack>
    </form>
  );
};

export default FileUploadComponent;