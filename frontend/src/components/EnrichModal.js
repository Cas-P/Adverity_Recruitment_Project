import * as React from 'react';
import {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Radio, FormControlLabel, FormControl, Grid, FormLabel, RadioGroup, TextField, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function EnrichModal({enrichModal, setEnrichModal, columns, data, selectedFile, setFile}) {

    const [apiEndpoint, setApiEndpoint] = useState(null);
    const [apiKeys, setApiKeys] = useState([]);
    const [apiData, setApiData] = useState([]);
    const [selectedFileColumn, setSelectedFileColumn] = useState(null);
    const [selectedApiColumn, setSelectedApiColumn] = useState(null);

    useEffect(() => {
        if(apiEndpoint)
            {
                fetch(apiEndpoint)
                    .then(res => res.json())
                    .then(data => {
                        var tempCol = []
                        for(var key in data[0]) 
                            tempCol.push(key)
                        setApiKeys(tempCol)
                        setApiData(data)
                    })
            }
        

    }, [apiEndpoint])

    const getKeysHandle = () => {
        setApiEndpoint(document.getElementById('api_endpoint').value);
    }

    const enrichHandle = () => {
        if(!selectedApiColumn || !selectedFileColumn)
            return;
        var tempRow = null;
        var res = [];

        data.map((dataRow) => {
            tempRow = dataRow;
            apiKeys.map((key) => {
                var matched = apiData.find(row => row[selectedApiColumn].toString() === dataRow[selectedFileColumn]);
                if(key !== selectedApiColumn)
                    {
                        tempRow[key] = matched ? matched[key] : '';
                    }
            })
            res.push(tempRow);
        });

        const jsonFile = {

            res,
            file_name: selectedFile+'_'+Date.now()
        };
        setFile(JSON.stringify(jsonFile));
        window.location.reload();
    }
    

    return (
        <Modal
            open={enrichModal}
            onClose={() => {
                setEnrichModal(false)
            }}
        >
            <Box sx={style}>
                <Grid container spacing={1}>
                    <Grid item xs={6} >
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Data File Columns</FormLabel>
                            <RadioGroup id='FileColumns'
                                onChange={(e) => {
                                    setSelectedFileColumn(e.target.value)
                                }}
                            >
                                {columns.map(row => {
                                    return (
                                        <FormControlLabel key={row.headerName} control={<Radio />} label={row.headerName} value={row.headerName}  />
                                    )
                                })}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <Box xs={2}>
                            
                        <TextField id='api_endpoint' label="External Api Endpoint" variant='outlined'/>
                            <Box marginBottom={1} marginTop={1}>
                                <Button variant='contained' onClick={getKeysHandle} style={{marginRight: 10}}>
                                    Get Keys
                                </Button>
                                <Button variant='contained' onClick={enrichHandle}>
                                    Enrich
                                </Button>
                            </Box>
                            
                        </Box>                        
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Api Keys</FormLabel>
                            <RadioGroup id='ApiColumns'
                                onChange={(e) => {
                                    setSelectedApiColumn(e.target.value)
                                }}
                                
                            >
                                {apiKeys.map(row => {
                                    return (
                                        <FormControlLabel key={row+"_api"} control={<Radio />} label={row} value={row}  />
                                    )
                                })}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}