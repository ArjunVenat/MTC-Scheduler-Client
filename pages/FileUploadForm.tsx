import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Stack, Grid, LinearProgress, Typography } from '@mui/material';
import ParameterTable from './ParameterTable';

interface FileUploadComponentProps {
  // Define any additional props if needed
}



const FileUploadComponent: React.FC<FileUploadComponentProps> = () => {

  
  //const apiEndpoint1 = process.env.ENDPOINT1 as string;
  //const apiEndpoint2 = process.env.ENDPOINT2 as string;

  const apiEndpoint1 = "http://localhost:5000/get_cleaned"
  const apiEndpoint2 = "http://localhost:5000/get_solution"

  
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);



  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent, endpoint: string, filePath: string) => {
    event.preventDefault();

    // Prepare the form data
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    try {
      // Make a request to the specified backend API endpoint for file upload
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      // Check if the response is successful (status code in the range 200-299)
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

        //setFile(null);
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

              <ParameterTable fileData={file}/>

              <Stack spacing={2}>
                <Button
                  onClick={(e) => handleSubmit(e, apiEndpoint1, "cleaned.xlsx")}
                  variant="contained"
                  color="primary"
                >
                  Get Cleaned Files
                </Button>
                <Button
                  onClick={(e) => handleSubmit(e, apiEndpoint2, "output.xlsx")}
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