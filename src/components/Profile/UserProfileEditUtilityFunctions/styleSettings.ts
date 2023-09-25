export const styleSettings = {
  cropContainer: `
    position: relative;
    width: 100%;
    height: 200px;
    background: #333;
    @media (min-width:600px) {
      height: 400px;
    }
  `,
  cropButton: `
    flex-shrink: 0;
    margin-left: 16px;
  `,
  controls: `
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    @media (min-width:600px) {
      flex-direction: row;
      align-items: center;
    }
  `,
  sliderContainer: `
    display: flex;
    flex: 1;
    align-items: center;
  `,
  sliderLabel: `
    @media (max-width:599px) {
      min-width: 65px;
    }
  `,
  slider: `
    padding: 22px 0px;
    margin-left: 32px;
    @media (min-width:600px) {
      flex-direction: row;
      align-items: center;
      margin: 0 16px;
    }
  `
};
