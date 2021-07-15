import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import { InputLabel, Select, MenuItem, Button } from '@material-ui/core';

export const Form = () => {

    const [formErrors, setFormErrors] = useState({ name: '', size: '', type: '' });

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, size, type } = e.target.elements;

        if (!name.value) {
            setFormErrors(prevState => ({ ...prevState, name: 'The name is required' }))
        }

        if (!size.value) {
            setFormErrors(prevState => ({ ...prevState, size: 'The size is required' }))
        }

        if (!type.value) {
            setFormErrors(prevState => ({ ...prevState, type: 'The type is required' }))
        }
    }

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setFormErrors({ ...formErrors, [name]: value.length === 0 ? `the ${name} is required` : '' })
    }

    return (
        <>
            <h1>create product</h1>
            <form onSubmit={handleSubmit}>
                <TextField label="name" id="name" name='name' helperText={formErrors.name} onBlur={handleBlur} />
                <TextField label="size" id="size" name='size' helperText={formErrors.size} onBlur={handleBlur} />
                <InputLabel htmlFor="type" helperText={formErrors.type}>type</InputLabel>
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
                {formErrors.type.length > 0 && <p>{formErrors.type}</p>}

                <Button type='submit'>Submit</Button>
            </form>
        </>
    )
}

export default Form