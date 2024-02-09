import React, { useState, useEffect, useMemo } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { useTranslation } from "react-i18next";

import { getPartsObj, getPartsList } from "../store/slices/app";

import { useSelector } from "react-redux";
import fetchJson from "../utils/functions/fetchJson";

const style = {
  mainBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    // border: '2px solid #000',
    color: "white",
    boxShadow: 24,
    p: 4,
  },
  formBox: {
    width: "100%",
  },
  footerBox: {
    pt: 4,
    display: "flex",
    justifyContent: "center",
    gap: 1,
  },
};

const modalProps = {
  slots: { backdrop: Backdrop },
  slotProps: {
    backdrop: {
      timeout: 500,
    },
  },
};

function PartIdAutoComplete(props) {
  const {
    // value,
    label,
    onChange,
    disabled,
    usemasklist,
    filtermaskmaplist,
  } = props;
  const partsList = useSelector(getPartsList);

  const getOptionLabel = (option) => option.part_id ?? "";

  const _onChange = (event, value) => {
    onChange({ target: { value: value?.part_id ?? "" } });
  };

  return (
    <Autocomplete
      disablePortal
      getOptionLabel={getOptionLabel}
      options={Boolean(usemasklist) ? filtermaskmaplist : partsList}
      onChange={_onChange}
      disabled={disabled}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}

const inputComponents = {
  else: (props) => <TextField fullWidth {...props} />,
  part_id: (props) => <PartIdAutoComplete {...props} />,
};

function getDefaultValue(fieldData) {
  let type = fieldData.type ?? "text";
  if (type === "text") {
    return "";
  } else if (type === "number") {
    if (fieldData.hasOwnProperty("min")) {
      return fieldData.min;
    } else if (fieldData.hasOwnProperty("max")) {
      return Math.min(0, fieldData.max);
    }
  } else {
    return "";
  }
}

export default function FormModal({
  config,
  open,
  handleClose,
  onClickSend,
  sendLoading,
}) {
  const { t } = useTranslation();

  const partsObj = useSelector(getPartsObj);
  const [formData, setFormData] = useState({});
  const [partIdFields, setPartIdFields] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [maskMapList, setMaskMapList] = useState([]);
  const [partFields, setPartFields] = useState([]);
  const [filterMaskMapList, setFilterMaskMapList] = useState([]);

  const useMaskList = config.useMaskList ?? false;

  const getMaskMapList = () => {
    let _maskMapList = [];
    let urlExamples = `${config.maskMapListURLTest}/examples.json`;
    let urlParms = `${config.maskMapListURLTest}/parms.json`;

    fetchJson(urlExamples)
      .then((res) => {
        res.forEach((example) => {
          let part = {};
          for (let key in example) {
            let partId = partFields?.find((el) => el.id === key)?.id;
            if (partId) {
              part[partId] = example[key];
            }
          }
          _maskMapList.push(part);
        });
        setMaskMapList(_maskMapList);
        console.log(_maskMapList);
      })
      .catch((err) => {
        console.log(err);
      });

      fetchJson(urlParms)
      .then((res) => {
        console.log(res);
        setPartFields(res?.parts_fields);
      })
  };

  useEffect(() => {
    getMaskMapList();
  }, [partFields]);

  const { sendDisabled } = useMemo(() => {
    let sendDisabled = false;
    if (config?.fields?.length > 0) {
      for (let fieldData of config.fields) {
        if (fieldData.required) {
          if (fieldData.type === "text" && formData[fieldData.field] === "") {
            sendDisabled = true;
            break;
          } else if (fieldData.type === "number") {
            if (
              (fieldData.hasOwnProperty("min") &&
                formData[fieldData.field] < fieldData.min) ||
              (fieldData.hasOwnProperty("max") &&
                formData[fieldData.field] > fieldData.max)
            ) {
              sendDisabled = true;
              break;
            }
          }
        }
      }
    }
    return { sendDisabled };
  }, [config, formData]);

  useEffect(() => {
    if (open && config?.fields?.length > 0) {
      let newFormData = {};
      let newPartIdFields = [];
      config.fields.forEach((fieldData) => {
        let inputField = fieldData.input_field ?? null;
        newFormData[fieldData.field] = getDefaultValue(fieldData);

        if (inputField && inputField.startsWith("part")) {
          newPartIdFields.push(fieldData);
        }
      });
      setFormData(newFormData);
      setFormFields(config.fields);
      setPartIdFields(newPartIdFields);
    } else {
      setFormData({});
      setFormFields([]);
      setPartIdFields([]);
    }
  }, [config, open]);

  const _onClickSend = () => {
    onClickSend(formData);
  };

  useEffect(() => {
    const updatedMaskMapList = maskMapList.map((maskMap) => {
      const part_id = maskMap.part_id;
      if (partsObj.hasOwnProperty(part_id)) {
        const part = partsObj[part_id];
        return { ...maskMap, ...part };
      }
      return maskMap;
    });
    updatedMaskMapList?.sort((a, b) => {
      return a?.part_id?.localeCompare(b.part_id);
    });
    setFilterMaskMapList(updatedMaskMapList);
  }, [
    partsObj,
    maskMapList,
  ]);

  const onChange = (fieldData) => (event) => {
    let newValue = event.target.value;
    let usedList = useMaskList ? filterMaskMapList : partsObj;
    if (fieldData.type === "part_id") {
      let updateData = { part_id: newValue };
      if (useMaskList) {
        if (usedList?.find((el) => el.part_id === newValue)) {
          let part = usedList?.find((el) => el.part_id === newValue);
          partIdFields.forEach((fieldData) => {
            updateData[fieldData.field] = part[fieldData.field];
          });
        }
      }
      if (partsObj.hasOwnProperty(newValue)) {
        let part = partsObj[newValue];
        partIdFields.forEach((fieldData) => {
          updateData[fieldData.field] = part[fieldData.field];
        });
      } else {
        partIdFields.forEach((fieldData) => {
          updateData[fieldData.field] = getDefaultValue(fieldData);
        });
      }

      setFormData((oldValue) => Object.assign({}, oldValue, updateData));
    } else {
      let newValue = event.target.value;
      setFormData((oldValue) =>
        Object.assign({}, oldValue, { [fieldData.field]: newValue })
      );
    }
  };

  return (
    <Modal
      open={open}
      // onClose={handleClose}
      closeAfterTransition
      slots={modalProps.slots}
      slotProps={modalProps.slotProps}
    >
      <Fade in={open}>
        <Box width={config?.width ?? 800} sx={style.mainBox}>
          <Grid container spacing={1} sx={style.formBox}>
            {formFields.map(({ xs, ...fieldData }, index) => (
              <Grid key={index} xs={xs} item>
                {inputComponents[
                  inputComponents[fieldData.type] ? fieldData.type : "else"
                ]({
                  label: t(fieldData.label),
                  type: fieldData.type,
                  value: formData[fieldData.field],
                  onChange: onChange(fieldData),
                  disabled: fieldData.disabled,
                  usemasklist: useMaskList.toString(),
                  filtermaskmaplist: filterMaskMapList,
                })}
              </Grid>
            ))}
          </Grid>

          <Box sx={style.footerBox}>
            <Button color="inherit" variant="outlined" onClick={handleClose}>
              {t("cancel")}
            </Button>
            <LoadingButton
              loading={sendLoading}
              disabled={sendDisabled}
              variant="contained"
              onClick={_onClickSend}
            >
              {t("confirm")}
            </LoadingButton>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
