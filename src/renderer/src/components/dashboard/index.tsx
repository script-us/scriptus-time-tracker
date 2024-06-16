import * as React from 'react'
import styles from './Dashboard.module.scss'
import { Theme, useTheme } from '@mui/material/styles'
// import OutlinedInput from "@mui/material/OutlinedInput";
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Sidebar from '../sidebar'

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
]

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  }
}

const Dashboard = () => {
  const theme = useTheme()
  const [personName, setPersonName] = React.useState<string[]>([])

  // const myIssuesQuery = useMyIssues(
  //   Object.keys(issuesData.data)
  //     .map((id) => Number(id))
  //     .filter((id) => issuesData.data[id].remembered || issuesData.data[id].active || issuesData.data[id].time > 0),
  //   search,
  //   filter
  // );
  // console.log("myIssuesQuery: ", myIssuesQuery);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (_value, row) => `${row.firstName || ''} ${row.lastName || ''}`
    }
  ]

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 15 },
    { id: 6, lastName: 'Melisandre', firstName: 'Test', age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
  ]

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value }
    } = event
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  return (
    <div className={styles.dashboardContainer}>
      <div>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <h1>Spent Time</h1>
        <div className={styles.filterSection}>
          <h4>Filters</h4>
          <div className={styles.dateFilter}>
            <h4 className={styles.date}>Date</h4>
            <div>
              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Date</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={personName}
                  onChange={handleChange}
                  autoWidth
                  label="Age"
                >
                  {names.map((name) => (
                    <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div>
            {/* <div className={styles.tableMainSection}> */}
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick={true}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 }
                }
              }}
              pageSizeOptions={[10, 20, 30, 40, 50, 100]}
              classes={{
                cell: styles.whiteText
              }}
            />
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
