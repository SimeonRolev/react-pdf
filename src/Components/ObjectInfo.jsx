import React from 'react'
import PropTypes from 'prop-types'
import { Drawer } from '@vectorworks/vcs-ui/dist/lib/Drawer/Drawer'
import { Dialog } from '@vectorworks/vcs-ui/dist/lib/Dialog/Dialog';

import styled from 'styled-components';

const S = {
    Wrapper: styled(Drawer)`
        .MuiPaper-root {
            width: 320px;
            position: static;
            background-color: var(--bg-color);
        }
    `,
    Content: styled.div`
        padding: 15px;
        word-wrap: break-word;
    `
}


function ObjectInfo({ entry }) {
    return (
        <S.Wrapper
            anchor={'right'}
            variant={'permanent'}
        >
            <Dialog.Header borderBottom>
                <Dialog.Title>{gettext('Object info')}</Dialog.Title>
            </Dialog.Header>
            <S.Content>
                {entry ?
                    (entry.info ? entry.info() : JSON.stringify(entry))   
                    : gettext('No object selected')}
            </S.Content>
        </S.Wrapper>
    )
}

ObjectInfo.propTypes = {
    entry: PropTypes.object
}

export default ObjectInfo
