import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

import { Select } from '@vectorworks/vcs-ui/dist/lib/Select/Select';
import { MenuItem } from '@vectorworks/vcs-ui/dist/lib/MenuItem/MenuItem';
import { Icon } from '@vectorworks/vcs-ui/dist/lib/Basics/Icons/Icon';
import { IconButton } from '@vectorworks/vcs-ui/dist/lib/Buttons/IconButton';
import Store from '../Store';

const S = {
    Toolbar: styled.div`
        height: 50px;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        padding: 0 15px;
    `,
    Separator: styled.div`
        margin: 0 8px;
        width: 1px;
        height: 30px;
        background-color: var(--border-color);
    `
};

function Toolbar({ scale, togglePanMode }) {
    const { navigate, pages, visiblePages } = React.useContext(Store);

    return (
        <S.Toolbar>
            <IconButton onClick={togglePanMode}>
                <Icon icon='hand' />
            </IconButton>
            <S.Separator />

            <IconButton onClick={navigate.prevPage}>
                <Icon icon='left-arrow' />
            </IconButton>
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
            <IconButton onClick={navigate.nextPage}>
                <Icon icon='right-arrow' />
            </IconButton>
            <S.Separator />
            {parseInt(scale * 100) + '%'}

        </S.Toolbar>
    )
}

Toolbar.propTypes = {
    viewer: PropTypes.object,
    prevPage: PropTypes.func,
    nextPage: PropTypes.func,
    scrollToPage: PropTypes.func,
    togglePanMode: PropTypes.func,
    scale: PropTypes.number,
}

export default Toolbar
