import React, {useState, useEffect} from 'react';
import DataTable from './DataTable';
import {GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector, } from '@mui/x-data-grid';
import { Button, Box, Grid, List, Paper, ListItemButton, ListItemText } from '@mui/material';
import { styled } from '@mui/material';
import Papa from 'papaparse';
import EnrichModal from './EnrichModal';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

function Home() {

    const [data, setData] = useState(null);
    const [fileList, setFileList] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [enrichModal, setEnrichModal] = useState(false);
    const [columns, setColumns] = useState([]);


    useEffect(() => {
        fetch('http://localhost:8000/djangoApp/files/')
        .then(res => res.json())
        .then(data => setFileList(data.files === null ? [] : data.files));
    }, []);

    useEffect(() => {
        if(selectedFile)
            {
                fetch('http://localhost:8000/djangoApp/jsonCSV/?name='+selectedFile)
                    .then(res => res.json())
                    .then(data => {
                        const result = data.file.map((row, index) => {
                            return {
                                ...row,
                                id: index
                            };
                        });

                        var tempCol = []
                        for(var key in data.file[0])
                            {
                                var row = {
                                    field: key, headerName: key, flex: 1
                                }
                                tempCol.push(row)
                            }
                        setColumns(tempCol)
                        setData(result)
                    });
            }
        
    }, [selectedFile]);

    useEffect(() => {
        if (file) {
        fetch('http://localhost:8000/djangoApp/upload_jsonCSV/', {
            method: "POST",
            body: file,
            headers: { 'Content-Type': 'application/json'}
        });
        }

    }, [file]);

    const onUploadHandle = (e) => {
        if (e.target.files) {
            const f = e.target.files[0];
            const fileType = f.name.split('.').pop().toLowerCase();

            if(fileType !== 'csv') {

                alert("Not a CSV file");
                return;
            }

            Papa.parse(f, {
                complete: (result) => {
                    const res = result.data;

                    const jsonFile = {

                        res,
                        file_name: f.name.split('.')[0]
                    };

                    setFile(JSON.stringify(jsonFile, null, 2));
                },
                header: true,
            });
        }
        window.location.reload();
    }

    const onFileSelectHandle = (e) => {
        if (e.target.textContent){
            setSelectedFile(e.target.textContent)
        }
    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector
                slotProps={{ tooltip: { title: 'Change density' } }}
            />
            <GridToolbarExport
                slotProps={{
                tooltip: { title: 'Export data' },
                }}
            />
            <Box sx={{ flexGrow: 1 }} />
            {selectedFile ?
            <>
                <Button
                    variant='contained'
                    component="label"
                    style={{marginBottom: '0.5%'}}
                    onClick={() => {
                        setEnrichModal(true);
                    }}
                >
                    Enrich Data
                </Button>
                <EnrichModal
                    enrichModal={enrichModal}
                    setEnrichModal={setEnrichModal}
                    columns={columns}
                    data={data}
                    selectedFile={selectedFile}
                    setFile={setFile}
                /> 
            </>
            : 
            <></>}
            <Button
                variant='contained'
                component="label"
                style={{marginBottom: '0.5%'}}
            >
                Upload File
                <input
                    type='file'
                    hidden
                    onChange={onUploadHandle}
                />
            </Button>
            </GridToolbarContainer>
        );
    }

    return (
        <Grid container spacing={1} padding={1} width={'100%'}>
            <Grid item xs={4}>
                <Item>
                    {fileList ? <List>
                        <ListItemText>Files</ListItemText>
                        {fileList.map(file => {
                            return (
                                <ListItemButton
                                    key={file.file_name}
                                    onClick={onFileSelectHandle}
                                >
                                    {file.file_name}
                                </ListItemButton>
                            )
                        })}
                    </List> : <> </>}
                </Item>
            </Grid>
            <Grid item xs={8}>
                
                <DataTable
                    columns={columns}
                    data={data}
                    CustomToolbar={CustomToolbar}
                    />
                
            </Grid>
        </Grid>
    )
}

export default Home;