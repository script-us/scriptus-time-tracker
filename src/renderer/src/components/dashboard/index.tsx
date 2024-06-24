import * as React from "react";
import styles from "./Dashboard.module.scss";
import { useTheme } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Sidebar from "../sidebar";
import { TTimeEntry } from "@renderer/types/redmine";
import { endOfMonth, startOfDay, subDays, subMonths } from "date-fns";
import useFormatHours from "@renderer/hooks/useFormatHours";
import useTimeEntries from "@renderer/hooks/useTimeEntries";
import Button from "../general/Button";
import Fieldset from "../general/Fieldset";
import { FormattedMessage } from "react-intl";
import useUsers from "@renderer/hooks/useUsers";
import Loader from "../shared/loader";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import DashboardFilters from "../dashboardFilters";
import useMyProjects from "@renderer/hooks/useMyProjects";

const style = {
  position: "absolute" as "string",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  "@media (prefers-color-scheme: dark)": {
    bgcolor: "#1F1F1F",
  },
};

const Dashboard = () => {
  const theme = useTheme();
  const formatHours = useFormatHours();
  const [personName, setPersonName] = React.useState<string>("");
  const [selectedUserId, setSelectedUserId] = React.useState([]);
  console.log("selectedUserId: ", selectedUserId);
  const [showFilter, setShowFilter] = React.useState(false);
  const today = startOfDay(new Date());
  // const startOfLastWeek = subWeeks(isMonday(today) ? today : previousMonday(today), 1);
  const [dateInfo, setDateInfo] = React.useState({ from: new Date("2024-05-05"), to: startOfDay(new Date()) });
  const { data: entries, refetch, isLoading } = useTimeEntries(dateInfo.from, dateInfo.to);
  const [open, setOpen] = React.useState(false);
  const { data: projects, isLoading: isLoadingProjects } = useMyProjects({
    enabled: showFilter,
  });

  const allUsersData = useUsers();

  const userData = allUsersData?.data?.map((user) => ({
    id: user.id,
    fullName: `${user.firstname} ${user.lastname}`,
  }));

  const handleDateChange = (period: string) => {
    let from, to;
    switch (period) {
      case "Today":
        from = to = today;
        break;
      case "Yesterday":
        from = to = subDays(today, 1);
        break;
      case "The Day Before Yesterday":
        from = to = subDays(today, 2);
        break;
      case "Last 7 Days":
        from = subDays(today, 7);
        to = today;
        break;
      case "Previous Month":
        from = startOfDay(subMonths(today, 1));
        to = endOfMonth(from);
        break;
      default:
        from = to = today;
        break;
    }
    setDateInfo({ from, to });
  };
  // const handleChange = (event) => {
  //   const selectedFullName = event.target.value;
  //   setPersonName(selectedFullName);

  //   const selectedUser = userData.find((user) => user.fullName === selectedFullName);
  //   setSelectedUserId(selectedUser ? selectedUser.id : "");
  // };

  const handleApplyButtonClick = () => {
    // refetch();
  };

  const columns: GridColDef[] = [
    {
      field: "rowId",
      headerName: "ID",
      width: 10,
      // flex: 1,
    },
    {
      field: "spent_on",
      headerName: "Date",
      width: 100,
      // flex: 1,
    },
    {
      field: "user",
      headerName: "User",
      width: 130,
      // flex: 1,
      renderCell: (params) => {
        return <span>{params.row.user.name}</span>;
      },
    },
    {
      field: "activity",
      headerName: "activity",
      width: 150,
      // flex: 1,
      renderCell: (params) => {
        return <span>{params.row.activity.name}</span>;
      },
    },
    {
      field: "comments",
      headerName: "comments",
      width: 1000,
      // flex: 1,
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 90,
      // flex: 1,
      renderCell: (params) => {
        return <span>{formatHours(params.row.hours)}</span>;
      },
    },
  ];

  // React.useEffect(() => {
  //   refetch().then((response) => {
  //     setEntries(response?.data?.pages); // Pass the fetched entries back to the Dashboard component
  //   });
  // }, []);

  const rows = entries.map((res: TTimeEntry, index: number) => ({
    ...res,
    rowId: index + 1,
  }));

  const onFilterClick = () => {
    setOpen(true);
    setShowFilter(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <div className={styles.dashboardContainer}>
      {/* {isLoading && <Loader />} */}
      <div>
        <Sidebar />
      </div>
      <div className={styles.content}>
        {/* <Fieldset legend={<FormattedMessage id="Filter" />} className={styles.fieldset}> */}
        <div className={styles.filterSection}>
          {/* <h4>Filters</h4> */}
          <div></div>
          <div className={styles.timFilters}>
            <Button onClick={() => handleDateChange("Today")}>Today</Button>
            <Button onClick={() => handleDateChange("Yesterday")}>Yesterday</Button>
            <Button onClick={() => handleDateChange("The Day Before Yesterday")}>The Day Before Yesterday</Button>
            <Button onClick={() => handleDateChange("Last 7 Days")}>Last 7 Days</Button>
            <Button onClick={() => handleDateChange("Previous Month")}>Previous Month</Button>
          </div>
          <div className={styles.dateFilter}>
            <Button onClick={onFilterClick}>Filter</Button>
            <div className="mb-3 flex items-center">
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 300,
                }}
                className={styles.dropDown}
              >
                <InputLabel id="demo-simple-select-autowidth-label" sx={{ color: "rgb(0 0 0 / var(--tw-text-opacity))" }}>
                  User
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={personName}
                  // onChange={handleChange}
                  autoWidth
                  label="Age"
                  sx={{ color: "rgb(0 0 0 / var(--tw-text-opacity))" }}
                >
                  {userData?.map((name, index) => (
                    <MenuItem key={`user-${index}`} value={name.fullName}>
                      {name.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div>
                <Button onClick={handleApplyButtonClick}>Apply</Button>
              </div>
            </div>
          </div>
          <div>
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick={true}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 20, 30, 40, 50, 100]}
              getCellClassName={() => "dark:text-white text-black"}
            />
          </div>
        </div>
        {/* </Fieldset> */}

        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <div className={styles.modal}>
            <Box sx={style}>
              <div className="flex items-center justify-between">
                <Typography id="modal-modal-title" variant="h6" component="h2" className="dark:text-white">
                  Filter
                </Typography>
                <div onClick={() => setOpen(false)}>
                  <CloseIcon className="cursor-pointer dark:text-white" />
                </div>
              </div>
              <div className="dark:text-white">
                <DashboardFilters projects={projects} setOpen={setOpen} setDateInfo={setDateInfo} dateInfo={dateInfo} refetch={refetch} setSelectedUserId={setSelectedUserId} />
              </div>
            </Box>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
