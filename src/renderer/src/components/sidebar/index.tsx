import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import DashboardCustomizeTwoToneIcon from '@mui/icons-material/DashboardCustomizeTwoTone'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import styles from './Sidebar.module.scss'

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {['Dashboard'].map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton className={styles.listItemButton}>
                  <ListItemIcon>
                    <DashboardCustomizeTwoToneIcon sx={{ color: '#d1d5db' }} />
                  </ListItemIcon>
                  <ListItemText primary={text} className={styles.listItem} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </div>
    </div>
  )
}

export default Sidebar
