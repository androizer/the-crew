import './selectedItemStyles.scss';

import { Grid, Paper, Typography } from '@mui/material';

import { AddButton } from '../../../components';
import { useAppDispatch } from '../../../store';
import { cartActions } from '../../../store/slices';

import type { Cart } from '@the-crew/common';

interface ISelectedItem {
  data: Cart;
}

const SelectedItem: React.FC<ISelectedItem> = props => {
  const dispatch = useAppDispatch();

  const onServiceAdd = (count: number) => {
    if (count) {
      if (count === 1) {
        dispatch(cartActions.addItem({ ...props.data, quantity: 1 }));
      } else {
        dispatch(cartActions.addQuantity({ id: props.data.id, changes: { quantity: count } }));
      }
    }
  };

  const onServiceRemove = (count: number) => {
    if (!count) {
      dispatch(cartActions.removeItem(props.data.id));
    } else {
      dispatch(cartActions.removeQuantity({ id: props.data.id, changes: { quantity: count } }));
    }
  };

  return (
    <Paper variant="outlined">
      <Grid container flexDirection="column" padding="16px">
        <Grid container flexDirection="column">
          <Typography variant="body1">{props.data.title}</Typography>
          <ul>
            {props.data.description.split('\n').map((item, index) => {
              return (
                <li key={index}>
                  <Typography variant="body2" color="textSecondary">
                    {item}
                  </Typography>
                </li>
              );
            })}
          </ul>
        </Grid>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6">₹ {props.data.price}</Typography>
          <AddButton count={props.data.quantity} onAdd={onServiceAdd} onRemove={onServiceRemove} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SelectedItem;
