import styled from 'styled-components';

export const ViewerContainer = styled.div`
  width: 100%;
  height: 250px;
  background: #f1f5f9;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  position: relative;
  overflow: hidden;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export const OverlayText = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  pointer-events: none;
`;
