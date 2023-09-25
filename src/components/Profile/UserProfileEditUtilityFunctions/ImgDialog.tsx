import * as React from 'react';
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)({
  position: 'relative',
});

const FlexTypography = styled(Typography)({
  flex: 1,
});

const ImgContainer = styled('div')({
  position: 'relative',
  flex: 1,
  padding: 16,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledImg = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  borderRadius:"50%"

});

type ImgDialogProps = {
  img?: string;
  onClose: () => void;
};

type ImgDialogState = {
  open: boolean;
};

const Transition = React.forwardRef<unknown, { children: React.ReactElement }>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export default class ImgDialog extends React.Component<ImgDialogProps, ImgDialogState> {
  state: ImgDialogState = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { img, onClose } = this.props;

    return (
      <Dialog
        fullScreen
        open={!!img}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <StyledAppBar>
          <Toolbar>
            <IconButton color="inherit" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <FlexTypography variant="h6" color="inherit">
              Cropped image
            </FlexTypography>
          </Toolbar>
        </StyledAppBar>
        <ImgContainer>
          <StyledImg src={img || ''} alt="Cropped" />
        </ImgContainer>
      </Dialog>
    );
  }
}
