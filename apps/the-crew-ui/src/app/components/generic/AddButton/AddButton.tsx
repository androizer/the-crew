import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState, useEffect } from 'react';

interface IAddButton {
  count?: number;
  onAdd?: (count) => void;
  onRemove?: (count) => void;
}

const AddButton: React.FC<IAddButton> = props => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(props.count);
  }, [props.count]);

  return (
    <ButtonGroup disableElevation variant="outlined" color="primary">
      {count !== 0 ? (
        <Button
          onClick={() => {
            const _count = count - 1;
            setCount(_count);
            props.onRemove(_count);
          }}
          variant="contained"
        >
          -
        </Button>
      ) : null}
      <Button>{count === 0 ? 'Add' : count}</Button>
      <Button
        onClick={() => {
          const _count = count + 1;
          setCount(_count);
          props.onAdd(_count);
        }}
        variant={count !== 0 ? 'contained' : 'outlined'}
      >
        +
      </Button>
    </ButtonGroup>
  );
};

export default AddButton;
