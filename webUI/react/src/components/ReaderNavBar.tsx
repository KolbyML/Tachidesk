/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import React, { useContext, useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { useHistory, Link } from 'react-router-dom';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import { Switch } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import DarkTheme from '../context/DarkTheme';
import NavBarContext from '../context/NavbarContext';

const useStyles = (settings: IReaderSettings) => makeStyles((theme: Theme) => ({
    // main container and root div need to change classes...
    AppMainContainer: {
        display: 'none',
    },
    AppRootElment: {
        display: 'flex',
    },

    root: {
        position: settings.staticNav ? 'sticky' : 'fixed',
        top: 0,
        left: 0,
        minWidth: '300px',
        height: '100vh',
        overflowY: 'auto',
        backgroundColor: '#0a0b0b',

        '& header': {
            backgroundColor: '#363b3d',
            display: 'flex',
            alignItems: 'center',
            minHeight: '64px',
            paddingLeft: '24px',
            paddingRight: '24px',

            transition: 'left 2s ease',

            '& button': {
                flexGrow: 0,
                flexShrink: 0,
            },

            '& button:nth-child(1)': {
                marginRight: '16px',
            },

            '& button:nth-child(3)': {
                marginRight: '-12px',
            },

            '& h1': {
                fontSize: '1.25rem',
                flexGrow: 1,
            },
        },
        '& hr': {
            margin: '0 16px',
            height: '1px',
            border: '0',
            backgroundColor: 'rgb(38, 41, 43)',
        },
    },

    navigation: {
        margin: '0 16px',

        '& > span:nth-child(1)': {
            textAlign: 'center',
            display: 'block',
            marginTop: '16px',
        },

        '& $navigationChapters': {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateAreas: '"prev next"',
            gridColumnGap: '5px',
            margin: '10px 0',

            '& a': {
                flexGrow: 1,
                textDecoration: 'none',

                '& button': {
                    width: '100%',
                    padding: '5px 8px',
                    textTransform: 'none',
                },
            },
        },

    },
    navigationChapters: {}, // dummy rule

    settingsCollapsseHeader: {
        '& span': {
            fontWeight: 'bold',
        },
    },

    openDrawerButton: {
        position: 'fixed',
        top: 0 + 20,
        left: 10 + 20,
        height: '40px',
        width: '40px',
        borderRadius: 5,
        backgroundColor: 'black',

        '&:hover': {
            backgroundColor: 'black',
        },
    },
}));

export interface IReaderSettings{
    staticNav: boolean
    showPageNumber: boolean
    continuesPageGap: boolean
}

export const defaultReaderSettings = () => ({
    staticNav: false,
    showPageNumber: true,
    continuesPageGap: false,
} as IReaderSettings);

interface IProps {
    settings: IReaderSettings
    setSettings: React.Dispatch<React.SetStateAction<IReaderSettings>>
    manga: IManga | IMangaCard
    chapter: IChapter | IPartialChpter
    curPage: number
}

export default function ReaderNavBar(props: IProps) {
    const { title } = useContext(NavBarContext);
    const { darkTheme } = useContext(DarkTheme);

    const history = useHistory();

    const {
        settings, setSettings, manga, chapter, curPage,
    } = props;

    const [drawerOpen, setDrawerOpen] = useState(false || settings.staticNav);
    const [drawerVisible, setDrawerVisible] = useState(false || settings.staticNav);
    const [hideOpenButton, setHideOpenButton] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [settingsCollapseOpen, setSettingsCollapseOpen] = useState(false);

    const theme = useTheme();
    const classes = useStyles(settings)();

    const setSettingValue = (key: string, value: any) => setSettings({ ...settings, [key]: value });

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;

        if (Math.abs(currentScrollPos - prevScrollPos) > 20) {
            setHideOpenButton(currentScrollPos > prevScrollPos);
            setPrevScrollPos(currentScrollPos);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        const rootEl = document.querySelector('#root')!;
        const mainContainer = document.querySelector('#appMainContainer')!;

        rootEl.classList.add(classes.AppRootElment);
        mainContainer.classList.add(classes.AppMainContainer);

        return () => {
            rootEl.classList.remove(classes.AppRootElment);
            mainContainer.classList.remove(classes.AppMainContainer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);// handleScroll changes on every render

    return (
        <>
            <ClickAwayListener onClickAway={() => (drawerVisible && setDrawerOpen(false))}>
                <Slide
                    direction="right"
                    in={drawerOpen}
                    timeout={200}
                    appear={false}
                    mountOnEnter
                    unmountOnExit
                    onEntered={() => setDrawerVisible(true)}
                    onExited={() => setDrawerVisible(false)}
                >
                    <div className={classes.root}>
                        <header>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                disableRipple
                                onClick={() => history.push(`/manga/${manga.id}`)}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h1">
                                {title}
                            </Typography>
                            {!settings.staticNav
                        && (
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                disableRipple
                                onClick={() => setDrawerOpen(false)}
                            >
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                        ) }
                        </header>
                        <ListItem ContainerComponent="div" className={classes.settingsCollapsseHeader}>
                            <ListItemText primary="Reader Settings" />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    disableRipple
                                    disableFocusRipple
                                    onClick={() => setSettingsCollapseOpen(!settingsCollapseOpen)}
                                >
                                    {settingsCollapseOpen && <KeyboardArrowUpIcon />}
                                    {!settingsCollapseOpen && <KeyboardArrowDownIcon />}
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Collapse in={settingsCollapseOpen} timeout="auto" unmountOnExit>
                            <List>
                                <ListItem>
                                    <ListItemText primary="Static Navigation" />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            checked={settings.staticNav}
                                            onChange={(e) => setSettingValue('staticNav', e.target.checked)}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Show page number" />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            checked={settings.showPageNumber}
                                            onChange={(e) => setSettingValue('showPageNumber', e.target.checked)}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Continues Page gap" />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            checked={settings.continuesPageGap}
                                            onChange={(e) => setSettingValue('continuesPageGap', e.target.checked)}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                        </Collapse>
                        <hr />
                        <div className={classes.navigation}>
                            <span>
                                Currently on page
                                {' '}
                                {curPage + 1}
                                {' '}
                                of
                                {' '}
                                {chapter.pageCount}
                            </span>
                            <div className={classes.navigationChapters}>
                                {chapter.chapterIndex > 1
                            && (
                                <Link
                                    style={{ gridArea: 'prev' }}
                                    to={`/manga/${manga.id}/chapter/${chapter.chapterIndex - 1}`}
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={<KeyboardArrowLeftIcon />}
                                    >
                                        Chapter
                                        {' '}
                                        {chapter.chapterIndex - 1}
                                    </Button>
                                </Link>
                            )}
                                {chapter.chapterIndex < chapter.chapterCount
                            && (
                                <Link
                                    style={{ gridArea: 'next' }}
                                    to={`/manga/${manga.id}/chapter/${chapter.chapterIndex + 1}`}
                                >
                                    <Button
                                        variant="outlined"
                                        endIcon={<KeyboardArrowRightIcon />}
                                    >
                                        Chapter
                                        {' '}
                                        {chapter.chapterIndex + 1}
                                    </Button>
                                </Link>
                            )}
                            </div>
                        </div>
                    </div>
                </Slide>
            </ClickAwayListener>
            <Zoom in={!drawerOpen}>
                <Fade in={!hideOpenButton}>
                    <IconButton
                        className={classes.openDrawerButton}
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        disableRipple
                        disableFocusRipple
                        onClick={() => setDrawerOpen(true)}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Fade>
            </Zoom>
        </>
    );
}
