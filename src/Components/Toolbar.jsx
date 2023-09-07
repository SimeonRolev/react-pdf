import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

import { Icon } from '@vectorworks/vcs-ui/dist/lib/Basics/Icons/Icon';
import { IconButton } from '@vectorworks/vcs-ui/dist/lib/Buttons/IconButton';

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

function Toolbar({ prevPage, nextPage, scale, togglePanMode }) {
    return (
        <S.Toolbar>
            <IconButton onClick={togglePanMode}>
                <Icon icon='hand' />
            </IconButton>
            <S.Separator />

            <IconButton onClick={prevPage}>
                <Icon icon='left-arrow' />
            </IconButton>
            <IconButton onClick={nextPage}>
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
    togglePanMode: PropTypes.func,
    scale: PropTypes.number,
}

export default Toolbar
