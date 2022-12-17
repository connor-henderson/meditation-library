import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Icon,
  IconButton,
  Theme,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

type PropTypes = {
  miniSidenav: boolean;
  setMiniSidenav: (miniSidenav: boolean) => void;
};

const Navbar = ({ setMiniSidenav, miniSidenav }: PropTypes) => {
  const iconsStyle = ({ palette: p }: Theme) => ({
    color: p.mode === 'dark' ? p.white.main : p.dark.main,
    marginRight: 5,
  });

  const navItems = ['Home', 'About', 'Contact'];
  const handleMiniSidenav = () => setMiniSidenav(!miniSidenav);
  const router = useRouter();
  const routes = router.asPath.split('/');
  console.log(miniSidenav)

  return (
    <AppBar component="nav" >
      <Toolbar>
        <Box
          color="inherit"
          sx={{ marginLeft: 35, flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
          <IconButton
            size="small"
            disableRipple
            color="inherit"
            onClick={handleMiniSidenav}>
            <Icon sx={iconsStyle} fontSize="medium">
              {miniSidenav ? 'menu' : 'menu_open'}
            </Icon>
          </IconButton>
          <Breadcrumbs aria-label="breadcrumb">
            {routes.map((r) => (
              <NextLink href={r} key={r}>
                {r}
              </NextLink>
            ))}
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {navItems.map((item) => (
            <Button key={item} sx={{ color: '#fff' }}>
              {item}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
