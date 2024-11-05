import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect(props) {
    const { data, name, label, handleChange, value } = props
    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={value ? value : ''} label={label} name={name} onChange={handleChange} >
                    {
                        data?.map((item, key) => <MenuItem fullWidth key={key} value={item?._id ? item?._id : item}>{item?.name ? item?.name : item}</MenuItem>)
                    }
                </Select>
            </FormControl>
        </Box >
    );
}