import React from 'react'
import PropTypes from 'prop-types'
import { Drawer } from '@vectorworks/vcs-ui/dist/lib/Drawer/Drawer'
import { Dialog } from '@vectorworks/vcs-ui/dist/lib/Dialog/Dialog';
import { Tabs, TabsList, Tab, TabPanel } from '@vectorworks/vcs-ui/dist/lib/Tabs/Tabs';

import styled from 'styled-components';
import Store from '../Store';
import SheetListItem from './SheetListItem';

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
        overflow: auto;
    `
}


function ObjectInfo() {
    const { selection: entry, pages } = React.useContext(Store);

    return (
        <S.Wrapper
            anchor={'right'}
            variant={'permanent'}
        >
            <Dialog.Header borderBottom>
                <Dialog.Title>{gettext('Object info')}</Dialog.Title>
            </Dialog.Header>
            <S.Content
                style={{ height: '50%' }}
            >
                {entry ?
                    (entry.info ? entry.info() : JSON.stringify(entry))
                    : gettext('No object selected')}
                <div
                    style={{
                        height: 1500
                    }}
                > </div>
                {entry ?
                    (entry.info ? entry.info() : JSON.stringify(entry))
                    : gettext('No object selected')}
            </S.Content>

            <Tabs defaultValue={0}>
                <TabsList>
                    <Tab>{gettext("Sheet layers")}</Tab>
                    <Tab>{gettext("Worksheets")}</Tab>
                </TabsList>
                <TabPanel value={0}>
                    {
                        Object
                            .values(pages)
                            .map(page => (
                                <SheetListItem
                                    key={page.pageNumber}
                                    page={page}
                                />
                            ))}
                </TabPanel>
                <TabPanel value={1}></TabPanel>
            </Tabs>
        </S.Wrapper>
    )
}

ObjectInfo.propTypes = {
    entry: PropTypes.object
}

export default ObjectInfo
