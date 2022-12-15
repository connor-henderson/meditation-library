
import { Drawer } from "@mui/material";
import { styled } from "@mui/system";
import boxShadow from "../../assets/theme/functions/boxShadow";

export default styled(Drawer)(({ theme }) => {
    const { palette, transitions, breakpoints } = theme;

    // styles for the sidenav when miniSidenav={false}
    const drawerOpenStyles = () => ({
        background: palette.common.black,
        transform: "translateX(0)",
        transition: transitions.create("transform", {
            easing: transitions.easing.sharp,
            duration: transitions.duration.shorter,
        }),

        [breakpoints.up("xl")]: {
            marginBottom: "inherit",
            left: "0",
            width: 250,
            height: "fit-content",
            transform: "translateX(0)",
            transition: transitions.create(["width", "background-color"], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.enteringScreen,
            }),
        },
    });

    return {
        "& .MuiDrawer-paper": {
          boxShadow: boxShadow([0, 20], [27, 0], palette.common.black, 0.05),
          border: "none",
    
          ...drawerOpenStyles(),
        },
      };
});