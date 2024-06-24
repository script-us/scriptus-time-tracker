import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, Chip, Divider, FormControl, Grid, List, ListItem, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import styles from "./DashboardFilters.module.scss";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import Calendar from "@mui/icons-material/Event";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import { PickersShortcutsItem, PickersShortcutsProps } from "@mui/x-date-pickers/PickersShortcuts";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import Button from "../general/Button";
import { endOfMonth, startOfDay, subDays, subMonths } from "date-fns";
import useUsers from "@renderer/hooks/useUsers";
import useTimeEntries from "@renderer/hooks/useTimeEntries";

const names = ["Oliver Hansen", "Van Henry", "April Tucker", "Ralph Hubbard", "Omar Alexander", "Carlos Abbott", "Miriam Wagner", "Bradley Wilkerson", "Virginia Andrews", "Kelly Snyder"];

interface IDashboardFiltersProps {
  projects;
  setOpen;
  setDateInfo;
  dateInfo;
  refetch;
  setSelectedUserId;
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

const DashboardFilters = ({ projects, setOpen, setDateInfo, dateInfo, refetch, setSelectedUserId }: IDashboardFiltersProps) => {
  const allUsersData = useUsers();
  const [selectedProject, setSelectedProject] = React.useState<string[]>([]);
  const [userName, setUserName] = React.useState<string[]>([]);
  const [localData, setLocalData] = useState({ ...dateInfo, userId: [] });

  const today = startOfDay(new Date());
  // const { data: entries, refetch, isLoading } = useTimeEntries(dateInfo.from, dateInfo.to);

  const projectData = projects.map((project) => ({
    id: project.id,
    projectName: project.name,
  }));
  const userData = allUsersData?.data?.map((user) => ({
    id: user.id,
    fullName: `${user.firstname} ${user.lastname}`,
  }));

  const handleChange = (event) => {
    const selectedProjectName = event.target.value;
    setSelectedProject(selectedProjectName);
  };

  const handleUsersChange = (event) => {
    const selectedFullName = event.target.value;
    console.log("event.target.value: ", event.target.value);
    setUserName(selectedFullName);

    const selectedIds = selectedFullName
      .map((name) => {
        const user = userData.find((user) => user.fullName === name);
        return user ? user.id : null;
      })
      .filter((id) => id !== null);

    console.log("selectedIds: ", selectedIds);
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

    const resolvedItems = items.map((item) => {
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
          {resolvedItems.map((item, index) => {
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

  const handleApplyButtonClick = () => {
    console.log("localData: ", localData);
    setDateInfo({ from: localData.from, to: localData.to });
    setSelectedUserId(localData.userId);
    refetch();
    setOpen(false);
  };

  const handleDateChange = (newValue) => {
    setLocalData((prevState) => ({
      ...prevState,
      from: newValue[0].$d,
      to: newValue[1].$d,
    }));
  };

  return (
    <div className={styles.main}>
      <div className={styles.leftSec}>
        <Grid container spacing={10}>
          <Grid item xs={6} className={styles.container}>
            <label className={styles.label}>Projects</label>
            <FormControl sx={{ width: 500, paddingTop: "20px" }}>
              <Select labelId="demo-multiple-name-label" id="demo-multiple-name" multiple value={selectedProject} onChange={handleChange}>
                {projectData.map((project, index) => (
                  <MenuItem key={`projectId-${index}`} value={project.projectName}>
                    {project.projectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={10}>
          <Grid item xs={6} className={styles.container}>
            <label className={styles.label}>Users</label>
            <FormControl sx={{ width: 500, paddingTop: "20px" }}>
              <Select labelId="demo-multiple-name-label" id="demo-multiple-name" multiple value={userName} onChange={handleUsersChange}>
                {userData.map((name, index) => (
                  <MenuItem key={index} value={name.fullName}>
                    {name.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div className={styles.container}>
          <label className={styles.label}>Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["SingleInputDateRangeField"]}>
              <DateRangePicker
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
                        color: "white",
                      },
                    },
                  },
                  leftArrowIcon: {
                    sx: { color: "white" },
                  },
                  rightArrowIcon: {
                    sx: { color: "white" },
                  },
                }}
                calendars={2}
                onChange={handleDateChange}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div>
          <Button className={styles.applyBtn} onClick={handleApplyButtonClick}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
