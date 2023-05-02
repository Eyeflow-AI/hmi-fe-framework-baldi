import React, {useState, useEffect, useMemo} from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { useTranslation } from "react-i18next";

import { getPartsObj, getPartsList } from '../store/slices/app';

import {useSelector} from 'react-redux';

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

function PartIdAutoComplete (props) {

  const {label, value, onChange, ...rest} = props;
  const partsList = useSelector(getPartsList);

  const getOptionLabel = (option) => option.part_id ?? "";

  const _onChange = (event, value) => {
    onChange({target: {value: value?.part_id ?? ""}});
  };

  return (
    <Autocomplete
      disablePortal
      getOptionLabel={getOptionLabel}
      inputValue={value}
      options={partsList}
      onChange={_onChange}
      renderInput={(params) => <TextField {...params} label={label} />}
      {...rest}
    />
  );
}

const inputComponents = {
  "part_id": (props) => <PartIdAutoComplete {...props}/>,
  "else": (props) => <TextField {...props}/>
};


export default function FormModal({config, open, handleClose, onClickSend, isValid=true}) {

  const {t} = useTranslation();

  const partsObj = useSelector(getPartsObj);
  const [formData, setFormData] = useState({});
  const [partIdFields, setPartIdFields] = useState([]);
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    if (open && config?.fields?.length > 0) {
      let newFormData = {};
      let newPartIdFields = [];
      config.fields.forEach((fieldData) => {
        let fieldType = fieldData.type ?? "text";
        if (fieldType === "text") {
          newFormData[fieldData.field] = "";
        }
        else if (fieldType === "number") {
          newFormData[fieldData.field] = 0;
        }
        else if (fieldType.startsWith("part_id")) {
          newFormData[fieldData.field] = "";
          if (fieldType !== "part_id") {
            newPartIdFields.push(fieldData);
          };
        };
      });
      setFormData(newFormData);
      setFormFields(config.fields);
      setPartIdFields(newPartIdFields);
    }
    else {
      setFormData({});
      setFormFields([]);
      setPartIdFields([]);
    };
  }, [config, open]);

  const _onClickSend = () => {
    onClickSend(formData);
  };

  const onChange = (fieldData) => (event) => {

    let newValue = event.target.value;

    if (fieldData.type === "part_id") {

      let updateData = {"part_id": newValue};
      if (partsObj.hasOwnProperty(newValue)) {
        let part = partsObj[newValue];
        partIdFields.forEach((fieldData) => {
          updateData[fieldData.field] = part[fieldData.field];
        });
      }
      else {
        partIdFields.forEach((fieldData) => {
          updateData[fieldData.field] = "";
        });
      };

      setFormData((oldValue) => Object.assign({}, oldValue, updateData));
    }
    else {
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
            {formFields.map((fieldData, index) => inputComponents[fieldData.type === "part_id" ? "part_id": "else"]({
              key: index,
              label: t(fieldData.label),
              type: fieldData.type,
              value: formData[fieldData.field],
              onChange: onChange(fieldData),
              sx: style.textfield,
              disabled: fieldData.disabled,
            }))}
          </Box>
          <Box sx={style.footerBox}>
            <Button color="inherit" variant="outlined" onClick={handleClose}>{t('cancel')}</Button>
            <Button disabled={!isValid} variant="contained" onClick={_onClickSend}>{t('send')}</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
