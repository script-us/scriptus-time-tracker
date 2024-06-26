import * as React from "react";
import styles from "./Dashboard.module.scss";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Sidebar from "../sidebar";
import { TTimeEntry } from "@renderer/types/redmine";
import { startOfDay } from "date-fns";
import useFormatHours from "@renderer/hooks/useFormatHours";
import useTimeEntries from "@renderer/hooks/useTimeEntries";
import Button from "../general/Button";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import DashboardFilters from "../dashboardFilters";
import useMyProjects from "@renderer/hooks/useMyProjects";
import useCurrentUser from "@renderer/hooks/useCurrentUser";

export interface DateInfo {
  from: Date;
  to: Date;
}

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
  const formatHours = useFormatHours();
  const { data: currentUser } = useCurrentUser();
  const [selectedUserId, setSelectedUserId] = React.useState<number[]>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState<number[]>([]);
  const [showFilter, setShowFilter] = React.useState(false);
  const [dateInfo, setDateInfo] = React.useState<DateInfo>({ from: new Date("2024-05-05"), to: startOfDay(new Date()) });
  const { data: entries } = useTimeEntries(dateInfo.from, dateInfo.to, currentUser?.admin !== true ? "me" : selectedUserId, selectedProjectId);
  const [open, setOpen] = React.useState(false);
  const { data: projects } = useMyProjects({
    enabled: showFilter,
  });

  const columns: GridColDef[] = [
    {
      field: "rowId",
      headerName: "ID",
      width: 10,
    },
    {
      field: "spent_on",
      headerName: "Date",
      width: 100,
    },
    {
      field: "user",
      headerName: "User",
      width: 130,
      renderCell: (params) => {
        return <span>{params.row.user.name}</span>;
      },
    },
    {
      field: "activity",
      headerName: "Activity",
      width: 150,
      renderCell: (params) => {
        return <span>{params.row.activity.name}</span>;
      },
    },
    {
      field: "comments",
      headerName: "Comments",
      width: 1000,
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 90,
      renderCell: (params) => {
        return <span>{formatHours(params.row.hours)}</span>;
      },
    },
  ];

  const rows = entries.map((res: TTimeEntry, index: number) => ({
    ...res,
    rowId: index + 1,
  }));

  const onFilterClick = () => {
    setOpen(true);
    if (currentUser?.admin === true) {
      setShowFilter(true);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <div className={styles.dashboardContainer}>
      <div>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <div className={styles.filterSection}>
          <div className={styles.dateFilter}>
            <Button onClick={onFilterClick}>Filter</Button>
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
              sx={{
                "@media (prefers-color-scheme: dark)": {
                  borderColor: "#1d4ed8",
                  "& .css-yrdy0g-MuiDataGrid-columnHeaderRow ": {
                    backgroundColor: "#1d4ed8!important",
                    color: "white",
                  },
                  "& .css-wop1k0-MuiDataGrid-footerContainer": {
                    borderColor: "#1d4ed8",
                  },
                  "& .css-1pe4mpk-MuiButtonBase-root-MuiIconButton-root": {
                    color: "white",
                  },
                  "& .css-rtrcn9-MuiTablePagination-root": {
                    color: "white",
                  },
                  "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                    color: "white",
                  },
                  "& .css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar .MuiTablePagination-actions > button": {
                    color: "white",
                  },
                },
                "& .MuiDataGrid-filler": {
                  height: "0!important",
                },
              }}
            />
          </div>
        </div>

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
                <DashboardFilters
                  projects={projects}
                  setOpen={setOpen}
                  setDateInfo={setDateInfo}
                  dateInfo={dateInfo}
                  setSelectedUserId={setSelectedUserId}
                  selectedUserId={selectedUserId}
                  setSelectedProjectId={setSelectedProjectId}
                  selectedProjectId={selectedProjectId}
                />
              </div>
            </Box>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
