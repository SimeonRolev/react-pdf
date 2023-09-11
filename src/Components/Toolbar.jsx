import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

import { Select } from '@vectorworks/vcs-ui/dist/lib/Select/Select';
import { Menu } from '@vectorworks/vcs-ui/dist/lib/Menu/Menu';
import { MenuItem } from '@vectorworks/vcs-ui/dist/lib/MenuItem/MenuItem';
import { Icon } from '@vectorworks/vcs-ui/dist/lib/Basics/Icons/Icon';
import { IconButton } from '@vectorworks/vcs-ui/dist/lib/Buttons/IconButton';

import {
    usePopupState,
    bindTrigger,
    bindMenu,
} from 'material-ui-popup-state/hooks';

import Store from '../Store';
import { Mode } from '../constants';

const S = {
    Toolbar: styled.div`
        height: 50px;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        padding: 0 16px;
    `,
    Separator: styled.div`
        margin: 0 16px;
        width: 1px;
        height: 30px;
        background-color: var(--border-color);
    `
};

function Toolbar() {
    const { mode, setMode, scale, setScale, scaleLimit, navigate, pages, visiblePages } = React.useContext(Store);

    const zoomMenu = usePopupState({
        variant: 'popper',
        popupId: `zoom`,
    })

    const togglePanMode = () => {
        setMode(
            mode !== Mode.PAN
                ? Mode.PAN
                : Mode.NORMAL
        )
    }

    const scaleToString = value => {
        return parseInt(value * 100) + '%'
    }

    const onZoomOption = (e, value) => {
        e.stopPropagation();
        setScale(value);
        zoomMenu.close();
    }

    const menuProps = () => {
        const init = bindMenu(zoomMenu);
        return {
            ...init,
            onClose (e) {
                e.stopPropagation()
                init.onClose(e);
            }
        }
    }

    return (
        <S.Toolbar>
            <IconButton onClick={togglePanMode}>
                <Icon icon='hand' />
            </IconButton>
            <S.Separator />

            {visiblePages.length > 0 &&
                <Select
                    value={visiblePages[0].pageNumber}
                    onChange={e => navigate.toPage(e.target.value)}
                >
                    {
                        Object
                            .values(pages)
                            .map(page => (
                                <MenuItem
                                    key={page.pageNumber}
                                    value={page.pageNumber}
                                >{gettext('Sheet')} - {page.pageNumber}</MenuItem>
                            ))}
                </Select>
            }
            <S.Separator />
            <div
                style={{ position: 'relative' }}
                {...bindTrigger(zoomMenu)}
            >
                <div style={{ pointerEvents: 'none' }}>
                    <Select value={scaleToString(scale)}>
                        <MenuItem value={scaleToString(scale)}>{scaleToString(scale)}</MenuItem>
                    </Select>
                </div>

                <Menu {...menuProps()}>
                    <MenuItem onClick={(e) => onZoomOption(e, 0.25)}>25%</MenuItem>
                    <MenuItem onClick={(e) => onZoomOption(e, 0.5)}>50%</MenuItem>

                    {[...new Array(parseInt(scaleLimit))]
                        .map((_, index) => {
                            return (
                                <MenuItem
                                    key={index}
                                    onClick={(e) => onZoomOption(e, index + 1)}
                                >{scaleToString(index + 1)}</MenuItem>
                            )
                        })}
                </Menu>

            </div>
        </S.Toolbar>
    )
}

export default Toolbar
