import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import { InputLabel, Select, Button } from '@material-ui/core';
import { CREATED_STATUS, ERROR_SERVER_STATUS, INVALID_REQUEST_STATUS } from '../consts/httpStatus'

const saveProduct = ({ name, size, type }) =>
    fetch('/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, size, type }),
    })

export const Form = () => {

    const [formErrors, setFormErrors] = useState({ name: '', size: '', type: '' });

    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validateField = ({ name, value }) => {
        setFormErrors(prevState => ({
            ...prevState,
            [name]: value.length ? '' : `The ${name} is required`,
        }))
    }

    const validateForm = ({ name, size, type }) => {
        validateField({ name: 'name', value: name })
        validateField({ name: 'size', value: size })
        validateField({ name: 'type', value: type })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSaving(true)

        const { name, size, type } = e.target.elements;

        const formData = { name: name.value, size: size.value, type: type.value }

        validateForm(formData)

        try {
            const response = await saveProduct(formData)

            if (!response.ok) throw response // throw respose as error

            if (response.status === CREATED_STATUS) {
                setIsSuccess(true)
                e.target.reset()
            }

        } catch (err) {
            if (err.status === ERROR_SERVER_STATUS) {
                setErrorMessage('Unexpected error, please try again');
            }

            if (err.status === INVALID_REQUEST_STATUS) {
                const data = await err.json();
                setErrorMessage(data.message);
            }
        }




        setIsSaving(false)

    }

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField({ name, value })
    }

    return (
        <>
            <h1>create product</h1>
            {isSuccess && (<p>product stored</p>)}
            <p>{errorMessage}</p>
            <form onSubmit={handleSubmit}>
                <TextField label="name" id="name" name='name' helperText={formErrors.name} onBlur={handleBlur} />
                <TextField label="size" id="size" name='size' helperText={formErrors.size} onBlur={handleBlur} />
                <InputLabel htmlFor="type" >type</InputLabel>
                <Select
                    native
                    inputProps={{
                        name: 'type',
                        id: 'type',
                    }}
                >
                    <option aria-label="None" value="" />
                    <option value="electronic">Electronic</option>
                    <option value="furniture">Furniture</option>
                    <option value="clothing">Clothing</option>
                </Select>
                {formErrors.type.length > 0 && <p>{formErrors.type}</p>}

                <Button disabled={isSaving} type='submit'>Submit</Button>
            </form>
        </>
    )
}

export default Form