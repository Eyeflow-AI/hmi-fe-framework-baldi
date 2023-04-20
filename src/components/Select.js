import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function ControlledOpenSelect({ title, disabled, value, setValue, choices }) {
	const [open, setOpen] = React.useState(false);

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	return (
		<FormControl sx={{ width: '100%' }}>
			<Select
				disabled={disabled}
				labelId="demo-controlled-open-select-label"
				id="demo-controlled-open-select"
				open={open}
				onClose={handleClose}
				onOpen={handleOpen}
				value={value}
				label={title}
				onChange={handleChange}
			>
				{/* <MenuItem value="">
					<em>None</em>
				</MenuItem> */}
				{choices.map((el, index) => (
					<MenuItem key={index} value={el}>{el}</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}