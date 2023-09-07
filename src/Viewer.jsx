import React from 'react';
import PropTypes from 'prop-types';
import PDFViewer from './PDFViewer';
import styled from 'styled-components';
import Toolbar from './Components/Toolbar';
import ObjectInfo from './Components/ObjectInfo';
import { Mode } from './constants';

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
  
  const togglePanMode = () => {
    if (viewer.current.mode !== Mode.PAN) {
      viewer.current.setMode(Mode.PAN);
    } else {
      viewer.current.setMode(Mode.NORMAL)
    }
  }


  return (
    <S.Wrapper>
      <S.Content>
        {
          !loading && (
            <Toolbar
              scale={scale}
              nextPage={() => viewer.current.nextPage()}
              prevPage={() => viewer.current.prevPage()}
              togglePanMode={togglePanMode}
            />
          )
        }
        <PDFViewer
          viewerRef={viewer}
          onDocumentLoadSuccess={() => { setLoading(false) }}
          onScaleChange={value => setScale(value)}
          {...props}
        />
      </S.Content>
      <ObjectInfo />
    </S.Wrapper>
  )
}

export default Viewer
