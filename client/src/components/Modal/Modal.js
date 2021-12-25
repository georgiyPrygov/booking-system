import React, {useState} from 'react'
import {
    Modal,
  } from "@mui/material";

const ModalWindow = (props) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <Modal open={open} onClose={handleClose}>
      <button onClick={handleClose}>close</button>
      {props.children}
    </Modal>
  );
};

export default ModalWindow;
