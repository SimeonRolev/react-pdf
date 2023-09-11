import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { RadioButton } from '@vectorworks/vcs-ui/dist/lib/Radio/RadioButton';
import Store from '../Store';

const S = {
    Wrapper: styled.div`
        height: 32px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        padding: 0 15px;
    `,
    Title: styled.div`
        padding: 0 15px;
    `
}

function SheetListItem({ page }) {
    const { visiblePages, navigate } = useContext(Store);

  return (
    <S.Wrapper>
        <RadioButton
            state={visiblePages.length && visiblePages[0].pageNumber}
            value={page.pageNumber}
            onClick={() => navigate.toPage(page.pageNumber)}
        />
        <S.Title>
            {gettext('Sheet')} - {page.pageNumber}
        </S.Title>
    </S.Wrapper>
  )
}

SheetListItem.propTypes = {
    page: PropTypes.object
}

export default SheetListItem
