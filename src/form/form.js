import React from 'react'
import TextField from '@material-ui/core/TextField'
import { InputLabel, Select, MenuItem } from '@material-ui/core';

export const Form = () => {
    const x = 22;
    console.log(x);

    return (
        <>
            <h1>create productt</h1>
            <form>
                <TextField label="name" id="name" />
                <TextField label="size" id="size" />
                <InputLabel htmlFor="type">type</InputLabel>
                <Select
                    native
                    id="demo-simple-select"
                    value=""
                    onChange={undefined}
                    inputProps={{
                        name: 'type',
                        id: 'type'
                    }}
                >
                    <MenuItem value='electronic'>electronic</MenuItem>
                    <MenuItem value="furniture">furniture</MenuItem>
                    <MenuItem value="clothing">clothing</MenuItem>
                </Select>
            </form>
        </>
    )
}

export default Form