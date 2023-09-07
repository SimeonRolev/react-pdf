import React from 'react'
import PropTypes from 'prop-types'
import { Drawer } from '@vectorworks/vcs-ui/dist/lib/Drawer/Drawer'
import { Dialog } from '@vectorworks/vcs-ui/dist/lib/Dialog/Dialog';

import styled from 'styled-components';

const Wrapper = styled(Drawer)`
    .MuiPaper-root {
        width: 250px;
        position: static;
        background-color: var(--bg-color);
    }
`;


function ObjectInfo() {
    return (
        <Wrapper
            anchor={'right'}
            variant={'permanent'}
        >
            <Dialog.Header borderBottom>
                <Dialog.Title>{gettext('Object info')}</Dialog.Title>
            </Dialog.Header>
            No object selected
        </Wrapper>
    )
}

ObjectInfo.propTypes = {}

export default ObjectInfo
