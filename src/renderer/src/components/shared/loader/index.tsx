import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// import { WHITE } from '../../constant/color/index'

const Loader = () => {
  return (
    <Backdrop style={{ opacity: 0.5 }} sx={{ color: "white", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
      <CircularProgress sx={{ color: "#696CFF" }} />
    </Backdrop>
  );
};

export default Loader;
