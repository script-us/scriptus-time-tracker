import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, FormControl, Grid, List, ListItem, MenuItem, Select } from "@mui/material";
import styles from "./DashboardFilters.module.scss";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import Calendar from "@mui/icons-material/Event";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { PickersShortcutsItem, PickersShortcutsProps } from "@mui/x-date-pickers/PickersShortcuts";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import Button from "../general/Button";
import useUsers from "@renderer/hooks/useUsers";
import useCurrentUser from "@renderer/hooks/useCurrentUser";
import { TProject } from "@renderer/types/redmine";
import { DateInfo } from "../dashboard";

interface IDashboardFiltersProps {
  projects: TProject[];
  setOpen: (args: boolean) => void;
  setDateInfo: (args: DateInfo) => void;
  dateInfo: DateInfo;
  setSelectedUserId: (args: number[]) => void;
  selectedUserId: number[];
  setSelectedProjectId: (args: number[]) => void;
  selectedProjectId: number[];
}

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  {
    label: "Today",
    getValue: () => {
      const today = dayjs();
      return [today, today];
    },
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = dayjs().subtract(1, "day");
      return [yesterday, yesterday];
    },
  },
  {
    label: "The Day Before Yesterday",
    getValue: () => {
      const dayBeforeYesterday = dayjs().subtract(2, "day");
      return [dayBeforeYesterday, dayBeforeYesterday];
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => {
      const today = dayjs();
      return [today.subtract(7, "day"), today];
    },
  },
  {
    label: "Previous Month",
    getValue: () => {
      const today = dayjs();
      const startOfPrevMonth = today.subtract(1, "month").startOf("month");
      const endOfPrevMonth = today.subtract(1, "month").endOf("month");
      return [startOfPrevMonth, endOfPrevMonth];
    },
  },
];
const darkModeStyles = {
  backgroundColor: "#1F1F1F",
  color: "white",
};

const MenuProps = {
  PaperProps: {
    sx: {
      "@media (prefers-color-scheme: dark)": {
        ...darkModeStyles,
        "& .MuiMenuItem-root": {
          "&:hover": {
            backgroundColor: "#333",
          },
        },
      },
    },
  },
};

const DashboardFilters = ({ projects, setOpen, setDateInfo, dateInfo, setSelectedUserId, selectedUserId, selectedProjectId, setSelectedProjectId }: IDashboardFiltersProps) => {
  const { data: currentUser } = useCurrentUser();
  const isAdmin = currentUser?.admin === true;
  const allUsersData = useUsers({ enabled: isAdmin });
  const [selectedProject, setSelectedProject] = React.useState<string[]>([]);
  const [userName, setUserName] = React.useState<string[]>([]);
  const [localData, setLocalData] = useState({ ...dateInfo, userId: selectedUserId, projectId: selectedProjectId });

  const projectData = projects?.map((project) => ({
    id: project.id,
    projectName: project.name,
  }));

  const userData = allUsersData?.data?.map((user) => ({
    id: user.id,
    fullName: `${user.firstname} ${user.lastname}`,
  }));

  useEffect(() => {
    if (allUsersData?.data) {
      const initialUserNames = selectedUserId
        ?.map((id) => {
          const user = allUsersData?.data?.find((user) => user.id === id);
          return user ? `${user.firstname} ${user.lastname}` : null;
        })
        .filter((name) => name !== null);
      setUserName(initialUserNames as string[]);

      const initialProjectsNames = selectedProjectId
        ?.map((id) => {
          const project = projects?.find((project) => project.id === id);
          return project ? project.name : null;
        })
        ?.filter((name) => name !== null);
      setSelectedProject(initialProjectsNames as string[]);
    }
  }, []);

  const handleProjectsChange = (event) => {
    const selectedProjectName = event.target.value;
    setSelectedProject(selectedProjectName);

    const selectedIds = selectedProjectName
      ?.map((name) => {
        const project = projectData?.find((project) => project.projectName === name);
        return project ? project.id : null;
      })
      ?.filter((id) => id !== null);

    setLocalData((prevState) => ({
      ...prevState,
      projectId: selectedIds,
    }));
  };

  const handleUsersChange = (event) => {
    const selectedFullName = event.target.value;
    setUserName(selectedFullName);

    const selectedIds = selectedFullName
      ?.map((name) => {
        const user = userData?.find((user) => user.fullName === name);
        return user ? user.id : null;
      })
      ?.filter((id) => id !== null);

    setLocalData((prevState) => ({
      ...prevState,
      userId: selectedIds,
    }));
  };

  function CustomRangeShortcuts(props: PickersShortcutsProps<DateRange<Dayjs>>) {
    const { items, onChange, isValid, changeImportance = "accept" } = props;

    if (items == null || items.length === 0) {
      return null;
    }

    const resolvedItems = items?.map((item) => {
      const newValue = item.getValue({ isValid });

      return {
        label: item.label,
        onClick: () => {
          onChange(newValue, changeImportance, item);
        },
        disabled: !isValid(newValue),
      };
    });

    return (
      <Box>
        <List
          sx={(theme) => ({
            px: theme.spacing(4),
            "& .MuiListItem-root": {
              pt: 0,
              pl: 0,
              pr: theme.spacing(1),
            },
          })}
        >
          {resolvedItems?.map((item, index) => {
            return (
              <div key={index}>
                <ListItem key={item.label}>
                  <Button onClick={item.onClick} disabled={item.disabled} className={styles.btn}>
                    {item.label}
                  </Button>
                </ListItem>
              </div>
            );
          })}
        </List>
      </Box>
    );
  }

  const handleApplyClick = () => {
    setDateInfo({ from: localData.from, to: localData.to });
    setSelectedUserId(localData.userId);
    setSelectedProjectId(localData.projectId);
    setOpen(false);
  };

  const handleCancelClick = () => {
    setOpen(false);
  };

  const handleDateChange = (newValue) => {
    setLocalData((prevState) => ({
      ...prevState,
      from: newValue[0]?.$d,
      to: newValue[1]?.$d,
    }));
  };

  return (
    <div className={styles.main}>
      <div className={styles.leftSec}>
        {currentUser?.admin ? (
          <Grid container spacing={10}>
            <Grid item xs={6} className={styles.container}>
              <label className={styles.label}>Projects</label>
              <FormControl sx={{ width: 510, paddingTop: "20px" }}>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={selectedProject}
                  onChange={handleProjectsChange}
                  MenuProps={MenuProps}
                  sx={{
                    "@media (prefers-color-scheme: dark)": {
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1d4ed8",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1d4ed8",
                      },
                      ".MuiSvgIcon-root ": {
                        fill: "white",
                      },
                    },
                  }}
                >
                  {projectData?.map((project, index) => (
                    <MenuItem key={`projectId-${index}`} value={project.projectName}>
                      {project.projectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        ) : null}
        {currentUser?.admin ? (
          <Grid container spacing={10}>
            <Grid item xs={6} className={styles.container}>
              <label className={styles.label}>Users</label>
              <FormControl sx={{ width: 510, paddingTop: "20px" }}>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={userName}
                  onChange={handleUsersChange}
                  MenuProps={MenuProps}
                  sx={{
                    "@media (prefers-color-scheme: dark)": {
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1d4ed8",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1d4ed8",
                      },
                      ".MuiSvgIcon-root ": {
                        fill: "white",
                      },
                    },
                  }}
                >
                  {userData?.map((name, index) => (
                    <MenuItem key={index} value={name.fullName}>
                      {name.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        ) : null}
        <div className={styles.container}>
          <label className={styles.label}>Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["SingleInputDateRangeField"]}>
              <DateRangePicker
                value={[dayjs(dateInfo?.from), dayjs(dateInfo?.to)]}
                slots={{ field: SingleInputDateRangeField, shortcuts: CustomRangeShortcuts }}
                name="allowedRange"
                slotProps={{
                  shortcuts: {
                    items: shortcutsItems,
                  },
                  actionBar: {},
                  textField: {
                    InputProps: {
                      endAdornment: <Calendar sx={{ cursor: "pointer" }} />,
                      sx: {
                        "@media (prefers-color-scheme: dark)": {
                          color: "white",
                        },
                      },
                    },
                  },
                  leftArrowIcon: {
                    sx: {
                      "@media (prefers-color-scheme: dark)": {
                        color: "white",
                      },
                    },
                  },
                  rightArrowIcon: {
                    sx: {
                      "@media (prefers-color-scheme: dark)": {
                        color: "white",
                      },
                    },
                  },
                }}
                calendars={2}
                onChange={handleDateChange}
                sx={{
                  "@media (prefers-color-scheme: dark)": {
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1d4ed8",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1d4ed8!important",
                    },
                    ".MuiSvgIcon-root ": {
                      fill: "white",
                    },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div>
          <Button className={styles.applyBtn} onClick={handleApplyClick}>
            Apply
          </Button>
          <Button className="ml-5" onClick={handleCancelClick}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
