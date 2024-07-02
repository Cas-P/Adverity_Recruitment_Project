import * as React from 'react';
import { DataGrid} from '@mui/x-data-grid';
  

export default function DataTable({data, columns, CustomToolbar}) {
    data = data ? data : [];
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 12},
                    },
                }}
                slots={{
                    toolbar: CustomToolbar
                }}
                
            />
        </div>
    );
}