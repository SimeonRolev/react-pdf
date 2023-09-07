import React from 'react';
import PropTypes from 'prop-types';
import PDFViewer from './PDFViewer';
import styled from 'styled-components';
import Toolbar from './Components/Toolbar';
import ObjectInfo from './Components/ObjectInfo';

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
  /* 
  
    const togglePanMode = () => {
      if (viewerRef.current.mode !== Mode.PAN) {
        viewerRef.current.setMode(Mode.PAN);
      } else {
        viewerRef.current.setMode(Mode.NORMAL)
      }
    }
  */

  return (
    <S.Wrapper>
      <S.Content>
        {
          !loading && (
            <Toolbar
              nextPage={() => viewer.current.nextPage()}
              prevPage={() => viewer.current.prevPage()}
            />
          )
        }
        <PDFViewer
          viewerRef={viewer}
          onDocumentLoadSuccess={() => { setLoading(false) }}
          {...props}
        />
      </S.Content>
      <ObjectInfo />
    </S.Wrapper>
  )
}

export default Viewer
