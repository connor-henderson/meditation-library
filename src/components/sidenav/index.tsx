import { Box, Divider, Icon, List, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import StyledDrawer from './styled-drawer';
import CloseIcon from '@mui/icons-material/Close';
import SidenavCollapse from './styled-list-item';
import sidenavLogoLabel from './styles';

type PropTypes = {
  miniSidenav: boolean;
  setMiniSidenav: (miniSidenav: boolean) => void;
};

const Sidenav = ({ miniSidenav, setMiniSidenav }: PropTypes) => {
  const textColor = 'white';

  // use the path to determine the collapseName, i.e. const collapseName = location.pathname.replace("/", "");
  const collapseName = Math.random() > 0.5 ? 'authors' : 'works';

  return (
    <StyledDrawer variant="permanent" open={!miniSidenav}>
      <Box pt={3} pb={1} px={4} textAlign="center">
        <Box
          display={{ xs: 'block', xl: 'none' }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={() => setMiniSidenav(true)}
          sx={{ cursor: 'pointer' }}>
          <CloseIcon fontSize="small" />
        </Box>
        <Box display="flex" alignItems="center">
          <Box component="img" src="favicon.ico" alt="Brand" width="2rem" />
          <Box sx={(theme) => sidenavLogoLabel(theme, miniSidenav)}>
            <Typography
              component="h6"
              variant="button"
              fontWeight="medium"
              color={textColor}>
              Mindfulnet
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider light={false} />
      <List>
        <SidenavCollapse
          name="Authors"
          icon="book"
          active={'authors' === collapseName}
          miniSidenav
        />
        <SidenavCollapse
          name="Works"
          icon="book"
          active={'works' === collapseName}
          miniSidenav
        />
      </List>
    </StyledDrawer>
  );
};

export default Sidenav;
