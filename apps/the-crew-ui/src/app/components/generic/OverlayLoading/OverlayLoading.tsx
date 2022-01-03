import { Backdrop, Typography } from '@mui/material';
import { NineCellLoading, SemipolarLoading } from 'react-loadingg';

import { LoaderOptions } from './OverlayLoading.type';

interface IOverloadLoading {
  open: boolean;
  handleClose?: () => void;
  loaderOpts?: Partial<LoaderOptions>;
}

const OverlayLoading: React.FC<IOverloadLoading> = ({ open, loaderOpts }) => {
  const { text, ...props } = loaderOpts;
  const renderLoader = () => {
    switch (loaderOpts.type) {
      case 'NineCell':
        return <NineCellLoading {...props} />;
      default:
        return <SemipolarLoading {...props} />;
    }
  };

  return (
    <Backdrop open={open} sx={{ color: '#fff', zIndex: 101 }}>
      {renderLoader()}
      {text && <Typography variant="h6">{text}</Typography>}
    </Backdrop>
  );
};

OverlayLoading.defaultProps = {
  loaderOpts: new LoaderOptions(),
};

export default OverlayLoading;
