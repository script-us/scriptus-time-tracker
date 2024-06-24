import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DashboardCustomizeTwoToneIcon from "@mui/icons-material/DashboardCustomizeTwoTone";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import styles from "./Sidebar.module.scss";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className={styles.sidebar}>
      <div>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {["Dashboard"].map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton className={`${styles.listItemButton} ${location.pathname === "/dashboard" ? styles.active : ""}`}>
                  <ListItemIcon>
                    <DashboardCustomizeTwoToneIcon className={styles.dashboardIcon} />
                  </ListItemIcon>
                  <ListItemText primary={text} className={styles.listItem} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </div>
    </div>
  );
};

export default Sidebar;
