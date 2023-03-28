// React
import React, { useState } from 'react';

// Design
import IconButton from '@mui/material/IconButton';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { deepOrange } from '@mui/material/colors';
import TranslateIcon from '@mui/icons-material/Translate';

// Internal
import { getStation, getStationList, setStationId } from '../store/slices/app';
import authSlice, { getUserInitials } from '../store/slices/auth';
import updatePath from '../utils/functions/updatePath';
import getOriginalURLPath from '../utils/functions/getOriginalURLPath';

// Third-party
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";


const APPBAR_HEIGHT = window.app_config.components.AppBar.height;
const HOME_URL = "/app/:stationSlugLabel/home";

const appBarSx = {
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
  width: 46,
  height: 46,
  marginLeft: -1,
  "&:hover, &.Mui-focusVisible": {
    backgroundColor: deepOrange[600],
  }
};

const endBoxSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 4
};

const stationButtonSx = {color: "white", textTransform: "none"};
const languageIconSx =  {color: "white", marginLeft: -1, marginRight: 1};
const appBarPaddingStyle = { height: APPBAR_HEIGHT };

const languageList = window.app_config.locale.languageList.filter((el) => el.active);

export default function CustomAppBar() {

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [stationAnchorEl, setStationAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);

  const stationOpen = Boolean(stationAnchorEl);
  const languageOpen = Boolean(languageAnchorEl);
  const avatarOpen = Boolean(avatarAnchorEl);


  // const user = useSelector(getUser);
  const station = useSelector(getStation);
  const stationList = useSelector(getStationList);
  const userInitials = useSelector(getUserInitials);

  const handleClickAvatar = (event) => setAvatarAnchorEl(event.currentTarget);
  const handleCloseAvatarMenu = (event) => setAvatarAnchorEl(null);

  const handleClickStation = (event) => setStationAnchorEl(event.currentTarget);
  const handleCloseStationMenu = (event) => setStationAnchorEl(null);

  const handleClickLanguageMenu = (event) => setLanguageAnchorEl(event.currentTarget);
  const handleCloseLanguageMenu = (event) => setLanguageAnchorEl(null);

  const handleClickEyeflow = () => navigate(updatePath(HOME_URL, station), {state: {changeType: "click"}});
  const handleClickUserSettings = () => navigate(updatePath('/app/user-settings', station), {state: {changeType: "click"}}); //TODO

  const handleClickLogout = () => {
    dispatch(authSlice.actions.logout());
  };

  const onChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    handleCloseLanguageMenu();
  };

  const onChangeStation = (newStation) => () => {
    dispatch(setStationId(newStation._id));
    let originalURL = getOriginalURLPath(location.pathname);
    if (originalURL?.params?.hasOwnProperty("stationSlugLabel")) {
      navigate(updatePath(originalURL.pattern.path, newStation), {state: {changeType: "click"}});
    };
    handleCloseStationMenu();
  };

  return (
    <>
      <Box sx={appBarSx}>
        <Grid container sx={appBarGridSx} >

          <Grid item>
            <ButtonBase>
              <CardMedia
                sx={cardMediaSx}
                image={"/assets/EyeFlowInspection-mask.png"}
                title="Home"
                component="img"
                onClick={handleClickEyeflow}
              />
            </ButtonBase>
          </Grid>

          <Grid item>

            <Box sx={endBoxSx}>

              <Tooltip title={t('station')} onClick={handleClickStation} sx={stationButtonSx}>
                <Button color="inherit" variant="outlined" size='small'>
                  {station?.label}
                </Button>
              </Tooltip>

              <Tooltip title={t('language')} onClick={handleClickLanguageMenu} sx={languageIconSx}>
                <Button color="inherit" variant="outlined" size='small' endIcon={<TranslateIcon />}>
                  {i18n.language}
                </Button>
              </Tooltip>

              <IconButton
                onClick={handleClickAvatar}
                sx={avatarSx}
              >
                {userInitials}
              </IconButton>

            </Box>
          </Grid>
        </Grid>
      </Box>

      <div id='appbar-padding' style={appBarPaddingStyle} />

      <Menu
        anchorEl={stationAnchorEl}
        open={stationOpen}
        onClose={handleCloseStationMenu}
        id="station-menu"
      >
        {stationList.map((stationData) =>
        <MenuItem
          key={stationData._id}
          value={stationData._id}
          onClick={onChangeStation(stationData)}
          selected={stationData._id === station._id}
        >
          {stationData.label}
        </MenuItem>
        )}
      </Menu>

      <Menu
        anchorEl={languageAnchorEl}
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
    </>
  );
}