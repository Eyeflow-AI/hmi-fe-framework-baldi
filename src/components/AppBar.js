// React
import React, { useState, useEffect } from 'react';

// Design
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { deepOrange } from '@mui/material/colors';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TranslateIcon from '@mui/icons-material/Translate';

// Internal
import appSlice, { getTabList, getAppbarTab, getStation } from '../store/slices/app';
import authSlice, { getUserInitials, getUserAccessControl } from '../store/slices/auth';

// Third-party
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { colors } from 'sdk-fe-eyeflow';
import { IconButton, Tooltip } from '@mui/material';


const APPBAR_HEIGHT = window.app_config.components.AppBar.height;

const appBarSx = {
  background: colors.eyeflow.blue.medium,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
  padding: '8px 16px 8px 25px',
  width: '100%',
  position: 'fixed',
  height: APPBAR_HEIGHT,
};

const appBarGridSx = {
  justify: 'space-between',
  alignItems: 'center',
  wrap: 'nowrap',
  width: '100%',
  justifyContent: 'space-between',
};

const cardMediaSx = {
  height: '50px',
  width: 'auto'
};

const avatarSx = {
  cursor: 'pointer',
  color: (theme) => theme.palette.getContrastText(deepOrange[500]),
  backgroundColor: deepOrange[500],
  boxShadow: 1
};

const endBoxSx = {
  display: 'flex',
  alignItems: 'center'
};

const stationTextSx = {
  paddingRight: 2,
};

const appBarPaddingStyle = { height: APPBAR_HEIGHT };

const tabIndicatorProps = {
  sx: { background: 'white' }
};

const pageList = window.app_config.components.AppBar.tabList.map((tabData) => {
  return window.app_config.pages[tabData.page];
});
const languageList = window.app_config.locale.languageList.filter((el) => el.active);

export default function CustomAppBar() {

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const avatarOpen = Boolean(avatarAnchorEl);
  const languageOpen = Boolean(languageAnchorEl);

  // const open = Boolean(anchorEl);
  // const user = useSelector(getUser);
  const tabList = useSelector(getTabList);
  const station = useSelector(getStation);
  const appbarTab = useSelector(getAppbarTab);
  const userAccessControl = useSelector(getUserAccessControl);
  const userInitials = useSelector(getUserInitials);

  const handleClickAvatar = (event) => setAvatarAnchorEl(event.currentTarget);
  const handleCloseAvatarMenu = (event) => setAvatarAnchorEl(null);

  const handleClickLanguageMenu = (event) => setLanguageAnchorEl(event.currentTarget);
  const handleCloseLanguageMenu = (event) => setLanguageAnchorEl(null);



  const handleClickUserSettings = () => navigate('/app/user-settings');
  const handleTabChange = (event, newValue) => {
    navigate(tabList[newValue].path);
  };

  useEffect(() => {
    let newTabList = [];
    pageList.forEach((el) => {
      if (el.acl.length === 0 || el.acl.some((el) => Boolean(userAccessControl?.[el]))) {
        newTabList.push(el);
      };
    });

    const locationId = newTabList.findIndex((element) => (element.extraPath || []).concat(element.path).includes(location.pathname));
    dispatch(appSlice.actions.setAppbarTabValue(locationId !== -1 ? locationId : false));

    if (JSON.stringify(tabList) !== JSON.stringify(newTabList)) {
      dispatch(appSlice.actions.setTabListValue(newTabList));
    };
    // eslint-disable-next-line
  }, [userAccessControl, dispatch, location?.pathname]);

  const handleClickLogout = () => {
    dispatch(authSlice.actions.logout());
  };

  const onChangeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <>
      <Box sx={appBarSx}>
        <Grid container sx={appBarGridSx} >

          <Grid item>
            <CardMedia
              sx={cardMediaSx}
              image={"/assets/EyeFlowInspection-mask.png"}
              title="Eyeflow Inspection"
              component="img"
            />
          </Grid>

          <Grid item>
            <Tabs
              value={appbarTab}
              onChange={handleTabChange}
              TabIndicatorProps={tabIndicatorProps}
              textColor="inherit"
            >
              {tabList.map(({ localeId }, index) => (
                <Tab key={index} label={t(localeId)} />
              ))}
            </Tabs>
          </Grid>

          <Grid item>

            <Box sx={endBoxSx}>

              <Tooltip title={t('language')}>
                <IconButton
                  onClick={handleClickLanguageMenu}
                >
                  <TranslateIcon />
                </IconButton>
              </Tooltip>
              <Typography variant='subtitle2' sx={stationTextSx}>
                {station}
              </Typography>
              <Avatar
                onClick={handleClickAvatar}
                sx={avatarSx}
              >
                {userInitials}
              </Avatar>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <div id='appbar-padding' style={appBarPaddingStyle} />
      <Menu
        anchorEl={avatarAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={avatarOpen}
        onClose={handleCloseAvatarMenu}
        id="avatar-button"
      >
        <MenuItem onClick={handleClickUserSettings}>
          {t('User Settings')}
        </MenuItem>
        <MenuItem onClick={handleClickLogout}>
          {t('Logout')}
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={languageAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={languageOpen}
        onClose={handleCloseLanguageMenu}
        id="language-menu-button"
      >
        {languageList.map((languageData) =>
          <MenuItem
            key={languageData.id}
            value={languageData.id}
            onClick={() => onChangeLanguage(languageData.id)}
            selected={languageData.id === i18n.language}
          >
            {languageData.label}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}