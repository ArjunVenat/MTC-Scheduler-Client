import React, { useState, ChangeEvent } from 'react';
import AdvancedWidget from './AdvancedWidget';
import { CssBaseline, ThemeProvider, Button, Stack, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileUploadForm from './FileUploadForm';


function Index() {
  


  return (
    //<AdvancedWidget />
    <div>
      <Stack alignItems={'center'} spacing={4}>
        <Typography variant='h4' align='center'><b>MTC Scheduler</b></Typography>
        <Typography variant='body1'> Step 1) Export the results of the Qualtrics survey as an Excel file</Typography>
        <Typography variant='body1'> Step 2) Click on the &quot;Upload File&quot; button and upload that file</Typography>

        <FileUploadForm />
        
      </Stack>
      
    </div>

  );
}

export default Index;
