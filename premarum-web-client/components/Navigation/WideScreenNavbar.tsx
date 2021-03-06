import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { Box, CssBaseline, Divider, IconButton, ListItemIcon, ListItemText, Toolbar, Typography, List, ListItemButton, Grid, Avatar, Button, Tooltip } from '@mui/material/'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import {Menu, ChevronLeft, ChevronRight, AccountBoxRounded, HomeRounded, ListAltRounded, AccountCircle, ManageAccountsRounded, SchoolRounded, LogoutRounded} from '@mui/icons-material'
import { useRouter } from 'next/router';
import { LogoutModal } from '../logoutModal';
import {Stack} from "@mui/material";
import ProfilePicture from "./ProfilePicture";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7.5)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7.5)} + 1px)`,
  },
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Navbars({children}:any) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openLogout, setOpenLogout] = React.useState(false);
  const router = useRouter();

  const handleLogoutOpen = () => {
    setOpenLogout(true);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
                }}
            >
                <Menu />
            </IconButton>
            <Stack 
                style={classes.appBarStack}
                direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Button
                    disableRipple
                    onClick={() => {router.push('/home')}}
                    sx={classes.logoButton}
                >
                    <img src="/prema-logo-white.png" style={classes.icon}/>
                </Button>
                <ProfilePicture />
            </Stack>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </DrawerHeader>
        <Divider />

          <List>
              <Tooltip title="Home" placement="right" arrow>
                <ListItemButton key="Home" onClick={() => {router.push('/home')}}>
                    <ListItemIcon>
                        <HomeRounded/>
                    </ListItemIcon>
                    <ListItemText primary="Home"/>
                </ListItemButton>
              </Tooltip>

              <Tooltip title="Course Catalog" placement="right" arrow>  
                <ListItemButton key="Course Catalog" onClick={() => {router.push('/catalog')}}>
                    <ListItemIcon>
                        <ListAltRounded/>
                    </ListItemIcon>
                    <ListItemText primary="Course Catalog"/>
                </ListItemButton>
              </Tooltip>
              
              <Tooltip title="Profile" placement="right" arrow>
                <ListItemButton key="Profile" onClick={() => {router.push('/profile')}}>
                    <ListItemIcon>
                        <AccountBoxRounded/>
                    </ListItemIcon> 
                    <ListItemText primary="Profile"/>
                </ListItemButton>
              </Tooltip>  

              <Divider />

              <Tooltip title="Log Out" placement="right" arrow>
                <ListItemButton key="Log Out" onClick={handleLogoutOpen}>
                    <ListItemIcon>
                        <LogoutRounded/>
                    </ListItemIcon> 
                    <ListItemText primary="Log Out"/>
                </ListItemButton>
              </Tooltip>
          </List>
          
          <Tooltip title="UPRM" placement="right" arrow>
            <Button
              sx={classes.logoComponent}
              href="https://www.uprm.edu/portada/"
              target="_blank"
              disableRipple
            >
              <Box
                sx={classes.boxSize}
                component="img"
                alt="UPRM"
                src="rum-logo-transparent.svg"
              />
            </Button>
          </Tooltip>

      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />

        {children}

      </Box>
    </Box>
    <LogoutModal openModalState={openLogout} setOpenModalState={setOpenLogout} />
    </>
  );
}

const useStyles = {
    logoComponent: {
        position: "absolute",
        bottom: 0,
        marginBottom: 0,
        height: "100px",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    boxSize: {
        width: "45px",
        height: "45px",
    },
    logoButton: {
        marginLeft: -2,
        maxWidth: '100%',
        maxHeight: '64px',
        padding: '2px 2px'
    },
    icon: {
        maxHeight: '70px',
    },
    appBarStack: {
        width:'100%'
    }
};

const classes = useStyles;