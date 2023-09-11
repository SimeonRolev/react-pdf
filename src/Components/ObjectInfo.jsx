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
    Block: styled.div`
        padding: 15px;
        word-wrap: break-word;
        overflow: auto;
    `
}


function ObjectInfo() {
    const { selection: entry, pages } = React.useContext(Store);

    const shapeInfo = () => {
        if (!entry) return null;
        return entry.info
            ? entry.info()
            : JSON.stringify(entry)
    }

    const dataInfo = () => {
        return entry ? gettext('No data available.') : null
    }

    return (
        <S.Wrapper
            anchor={'right'}
            variant={'permanent'}
        >
            <div style={{ height: '50%' }}>
                <Dialog.Header>
                    <Dialog.Title>{gettext('Object info')}</Dialog.Title>
                </Dialog.Header>

                <Tabs defaultValue={0}>
                    <TabsList>
                        <Tab>{gettext("Shape")}</Tab>
                        <Tab>{gettext("Data")}</Tab>
                    </TabsList>
                    <TabPanel value={0}>
                        {entry && (
                            <S.Block>
                                {shapeInfo()}
                            </S.Block>
                        )}
                    </TabPanel>
                    <TabPanel value={1}>
                        {entry && (
                            <S.Block>
                                {dataInfo()}
                            </S.Block>
                        )}
                    </TabPanel>
                </Tabs>
                <S.Block>
                    {!entry && gettext('No selection')}
                </S.Block>
            </div>



            <Dialog.Header>
                <Dialog.Title>{gettext('Navigation')}</Dialog.Title>
            </Dialog.Header>


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
