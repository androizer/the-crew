import { Backdrop } from '@mui/material';
import { NineCellLoading, SemipolarLoading } from 'react-loadingg';

import { LoaderOptions } from './OverlayLoading.type';

interface IOverloadLoading {
  open: boolean;
  handleClose?: () => void;
  loaderOpts?: Partial<LoaderOptions>;
}

const OverlayLoading: React.FC<IOverloadLoading> = ({ open, loaderOpts }) => {
  const renderLoader = () => {
    switch (loaderOpts.type) {
      case 'NineCell':
        return <NineCellLoading {...loaderOpts} />;
      default:
        return <SemipolarLoading {...loaderOpts} />;
    }
  };

  return (
    <Backdrop open={open} sx={{ color: '#fff' }}>
      {renderLoader()}
    </Backdrop>
  );
};

OverlayLoading.defaultProps = {
  loaderOpts: new LoaderOptions(),
};

export default OverlayLoading;
