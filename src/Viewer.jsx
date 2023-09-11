import React from 'react';
import PropTypes from 'prop-types';
import PDFViewer from './PDFViewer';
import styled from 'styled-components';
import Toolbar from './Components/Toolbar';
import ObjectInfo from './Components/ObjectInfo';
import { Mode } from './constants';
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
  const viewer = React.useRef();
  const [loading, setLoading] = React.useState(true);
  const [scale, setScale] = React.useState(1);
  const [selection, setSelection] = React.useState();

  const store = useStore();

  const togglePanMode = () => {
    if (viewer.current.mode !== Mode.PAN) {
      viewer.current.setMode(Mode.PAN);
    } else {
      viewer.current.setMode(Mode.NORMAL)
    }
  }

  return (
    <S.Wrapper>
      <Store.Provider value={store}>
        <S.Content>
          {
            !loading && (
              <Toolbar
                scale={scale}
                togglePanMode={togglePanMode}
              />
            )
          }
          <PDFViewer
            viewerRef={viewer}
            onDocumentLoadSuccess={() => { setLoading(false) }}
            onScaleChange={value => setScale(value)}
            setSelection={setSelection}
            selection={selection}
            {...props}
          />
        </S.Content>
        <ObjectInfo entry={selection} />
      </Store.Provider>
    </S.Wrapper>
  )
}

export default Viewer
