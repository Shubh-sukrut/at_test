import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function MultipleSelect({ data, name, value, label, handleChange }) {
    const theme = useTheme();
    const [personName, setPersonName] = React.useState(value?.map(it => it._id));
    const handleSelect = ({ target }) => {
        const { value, name } = target

        // handal local state 
        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        );

        // send data to parent 
        handleChange({
            name: name,
            value: typeof value === 'string' ? value.split(',') : value,
        })
    };

    return (
        <div>
            <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-multiple-name-label">{label}</InputLabel>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={value?.length ? personName : []}
                    onChange={handleSelect}
                    name={name}
                    input={<OutlinedInput label={label} />}
                    MenuProps={MenuProps}
                >
                    {data.map((item) => (
                        <MenuItem
                            key={item.name}
                            value={item._id}
                            style={getStyles(item.name, personName, theme)}
                        >
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}