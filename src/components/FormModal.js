import React, {useState, useEffect} from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useTranslation } from "react-i18next";

const style = {
  mainBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    color: 'white',
    boxShadow: 24,
    p: 4,
  },
  formBox: {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
    width: '100%',
    // justifyContent: 'center',
    paddingBottom: 4
  },
  textfield: {
    width: "calc(50% - 4px)",
  },
  footerBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: 1
  }
}

const modalProps = {
  slots: { backdrop: Backdrop },
  slotProps: {
    backdrop: {
      timeout: 500,
    },
  }
}

// TODO
export default function FormModal({config, open, handleClose, onClickSend}) {

  const {t} = useTranslation();

  const [formData, setFormData] = useState({});
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    if (open && config?.fields?.length > 0) {
      let newFormData = {};
      config.fields.forEach((fieldData) => {
        let fieldType = fieldData.type ?? "text";
        if (fieldType === "text") {
          newFormData[fieldData.field] = "";
        }
        else if (fieldType === "number") {
          newFormData[fieldData.field] = 0;
        };
      });
      setFormData(newFormData);
      setFormFields(config.fields);
    }
    else {
      setFormData({});
      setFormFields([]);
    };
  }, [config, open]);

  const _onClickSend = () => {
    onClickSend(formData);
  };

  const onChange = (fieldData) => (event) => {

    let newValue = event.target.value;
    let oldValue = formData[fieldData.field];

    if (fieldData.type === "number") {
      newValue = Number(newValue);
      if (isNaN(newValue)) {
        newValue = oldValue;
      };
    };
    setFormData((oldValue) => Object.assign({}, oldValue, {[fieldData.field]: newValue}));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={modalProps.slots}
      slotProps={modalProps.slotProps}
    >
      <Fade in={open}>
        <Box width={config?.width ?? 400} sx={style.mainBox}>
          <Box sx={style.formBox}>
            {formFields.map((fieldData) => (
              <TextField
                key={fieldData.field}
                label={t(fieldData.label)}
                value={formData[fieldData.field]}
                onChange={onChange(fieldData)}
                sx={style.textfield}
              />
            ))}

          </Box>
          <Box sx={style.footerBox}>
            <Button color="inherit" variant="outlined" onClick={handleClose}>{t('cancel')}</Button>
            <Button variant="contained" onClick={_onClickSend}>{t('send')}</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
