/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types';

// @mui material components
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Icon from '@mui/material/Icon';

// Custom styles for the SidenavCollapse
// import {
//   collapseItem,
//   collapseIconBox,
//   collapseIcon,
//   collapseText,
// } from "examples/Sidenav/styles/sidenavCollapse";

// Material Dashboard 2 React context
import { Box } from '@mui/material';

type PropTypes = {
    icon: string;
    name: string
}

function SidenavCollapse({ icon, name }: PropTypes) {

  return (
    <ListItem component="li">
      <Box>
        <ListItemIcon
        //   sx={(theme) =>
        //     collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active })
        //   }
        >
            <Icon>{icon}</Icon> 
        </ListItemIcon>
        <ListItemText primary={name} />
      </Box>
    </ListItem>
  );
}

export default SidenavCollapse;

// List item icon sx={(theme) => collapseIcon(theme, { active })}

// Box sx={(theme) =>
// collapseItem(theme, {
//     active,
//     transparentSidenav,
//     whiteSidenav,
//     darkMode,
//     sidenavColor,
//   })
// }

//  ListItemText sx={(theme) =>
// collapseText(theme, {
//     miniSidenav,
//     transparentSidenav,
//     whiteSidenav,
//     active,
//   })
// }
