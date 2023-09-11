import React from 'react';
import PDFViewer from './PDFViewer';
import styled from 'styled-components';
import Toolbar from './Components/Toolbar';
import ObjectInfo from './Components/ObjectInfo';
import Store from './Store';
import { useStore } from './hooks/store';

const S = {
  Wrapper: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
  `,
  Content: styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  `
}

function Viewer(props) {
  const store = useStore();

  return (
    <S.Wrapper>
      <Store.Provider value={store}>
        <S.Content>
          { !store.loading && <Toolbar /> }
          <PDFViewer {...props} />
        </S.Content>
        <ObjectInfo />
      </Store.Provider>
    </S.Wrapper>
  )
}

export default Viewer
