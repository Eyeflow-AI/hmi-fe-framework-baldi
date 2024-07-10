// import * as React from 'react';
import React, { useState, useEffect } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import validateData from "../../functions/dataValidation/radioGroup";
import eventsHandler from "../../../utils/functions/eventsHandler";

export default function RadioButtonsGroup({
    name, 
    tag, 
    componentsInfo,
    setComponentsInfo,
    stationId,
    metadata,
}) {
    const [list, setList] = useState([]);
    const [value, setValue] = useState("");
    const [on, setOn] = useState({});
    const title = String(metadata?.title);
    const orientation = metadata?.orientation ?? "column"

    console.log({ RadioGroup: name, tag, componentsInfo, setComponentsInfo, stationId });

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        let _item = {
            list: list,
            selectedValue: selectedValue,
            on: on,
        };
        setValue(selectedValue)
        console.log({_item})
        let _componentsInfo = [...componentsInfo];
        let index = _componentsInfo.findIndex(
          (item) => item.tag === tag && item.name === name
        );
        _componentsInfo[index].output.selectedValue = _item.selectedValue;
        console.log(_componentsInfo[index])
        eventsHandler({
          componentsInfo: _componentsInfo,
          item: _item,
          fnExecutor: setComponentsInfo,
          fnName: on?.change,
          stationId,
        });
      };

    useEffect(() => {
        if (
          componentsInfo &&
          typeof componentsInfo === "object" &&
          Object.keys(componentsInfo).length > 0
        ) {
          const component = validateData({
            obj:
              componentsInfo?.find(
                (item) => item?.tag === tag && item?.name === name
              )?.output ?? [],
          });
          const _list = component?.list ?? [];
          const _on = component?.on ?? {};
          const _value = component?.selectedValue ?? "";
          setList(_list);
          setOn(_on);
          setValue(_value);
        }

      }, [componentsInfo]);

	return (
        <FormControl>
            <FormLabel 
                sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}
                id="demo-radio-buttons-group-label"
                disabled
            >
                {title}
            </FormLabel>
            <RadioGroup
                row={orientation === "row"}
                name="radio-buttons-group"
                aria-labelledby="demo-radio-buttons-group-label"
                onChange= {handleChange}
                value={value}
                sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}
            >
				{list.map((el, index) => (
					<FormControlLabel key ={index} value={el.value} label={el.label} control={<Radio />} />
				))}
            </RadioGroup>
        </FormControl>
	);
};