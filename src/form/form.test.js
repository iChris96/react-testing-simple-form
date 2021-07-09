import React from 'react'
import {screen, render} from '@testing-library/react'
import {Form} from './form'

describe('form is mounted', ()=>{
    it('there must be a create product form page', ()=>{
        render(<Form/>)

        // expect(screen.queryByText(/create product/i)).toBeInTheDocument()
        expect(screen.getByRole('heading', {name: /create product/i})).toBeInTheDocument()
    })
    
})