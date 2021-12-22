import React from 'react';
import './ClassGrades.css';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import { DataGrid, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';

const ClassGradesUpload = () => {
    const [columns, setColumns] = React.useState([]);
    const [data, setData] = React.useState([]);
   
    // process CSV/XLSX data
    const processData = dataString => {
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    
        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
            const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
            if (headers && row.length === headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] === '"')
                        d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] === '"')
                        d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j]) {
                        obj[headers[j]] = d;
                    }
                }
        
                // remove the blank rows
                if (Object.values(obj).filter(x => x).length > 0) {
                    list.push(obj);
                }
            }
        }
 
        // prepare columns list from headers
        const columns = headers.map(c => ({
            name: c,
            selector: c,
        }));
    
        setData(list);
        setColumns(columns);
    }
 
    // handle file upload
    const handleFileUpload = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            processData(data);
        };
        reader.readAsBinaryString(file);
    }

    //fake data
    const columnStudentList = [
        { field: 'id', headerName: 'StudentID', width: 170 },
        { field: 'name', headerName: 'Full Name', width: 170 },
    ];

    //fake data
    const rowStudentList = [
        { id: 18120230, name: 'Tran Thanh Quang'},
        { id: 18120313, name: 'Tran Tuan Dat'},
        { id: 18120537, name: 'Nguyen Thai Son'},
    ];

    //fake data
    const columnStudentGrade = [
        { field: 'id', headerName: 'StudentID', width: 170 },
        { field: 'grade', headerName: 'Grade', width: 170 },
    ];

    //fake data
    const rowStudentGrade = [
        { id: 18120230, grade: 9},
        { id: 18120313, grade: 9.5},
        { id: 18120537, grade: 10},
    ];

    function MyExportButton() {
        return (
          <GridToolbarContainer>
            <GridToolbarExport />
          </GridToolbarContainer>
        );
    }

    return(
        <div className="grades">
            <div>
                <h3>Uploads a csv/xlsx file with student list (StudentId, Full name)</h3>
                <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                />
                <DataTable
                    pagination
                    highlightOnHover
                    columns={columns}
                    data={data}
                />
            </div>
            <div style={{ height: 400, width: '80%' }}>
                <h3>Download default csv/Excel (xlsx) template for student list (StudentId, FullName)</h3>
               <DataGrid rows={rowStudentList} columns={columnStudentList} 
                    pageSize={3} 
                    components={{
                        Toolbar: MyExportButton,
                    }}
                />
            </div>
            <div style={{ height: 400, width: '80%' }}>
                <h3>Download default csv/Excel (xlsx) template for grades for an assignment (StudentId, Grade)</h3>
               <DataGrid rows={rowStudentGrade} columns={columnStudentGrade} 
                    pageSize={3} 
                    components={{
                        Toolbar: MyExportButton,
                    }}
                />
            </div>
        </div>
    )
}
export default ClassGradesUpload;