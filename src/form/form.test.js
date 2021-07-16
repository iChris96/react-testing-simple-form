import React from 'react'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Form } from './form';


const server = setupServer(
    rest.post('/products', (req, res, ctx) => res(ctx.status(201))),
)

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('form is mounted', () => {

    beforeEach(() => render(<Form />));

    it('there must be a create product form page', () => {
        // expect(screen.queryByText(/create product/i)).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /create product/i })).toBeInTheDocument()
    })

    it('should exists the fields: name, size, type (electronic,furniture,clothing)', () => {

        // screen.debug();

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/size/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/type/i)).toBeInTheDocument()

        expect(screen.queryByText(/electronic/i)).toBeInTheDocument();
        expect(screen.queryByText(/furniture/i)).toBeInTheDocument();
        expect(screen.queryByText(/clothing/i)).toBeInTheDocument();


    })

    it('should exists the submit button', () => {
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    })

})


describe('when the user submits the form without values', () => {
    beforeEach(() => render(<Form />));

    it('should display validation messages', async () => {
        const button = screen.getByRole('button', { name: /submit/i })
        expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument()

        fireEvent.click(button);

        expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()

        await waitFor(() => expect(button).not.toBeDisabled()) // await fetch to be done, if we dont add this line the test fails, we going to await until button be enabled again
    })

})

describe('when the user blurs and empty field', () => {
    beforeEach(() => render(<Form />));

    it('should display a validation error message for name input', () => {


        expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()


        fireEvent.blur(screen.getByLabelText(/name/i), {
            target: {
                name: 'name', value: ''
            }
        })

        expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()

    })

    it('should display a validation error message for size input', () => {


        expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()


        fireEvent.blur(screen.getByLabelText(/size/i), {
            target: {
                name: 'size', value: ''
            }
        })

        expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()

    })
})


describe("when the user submits the form", () => {

    beforeEach(() => render(<Form />));

    it("submit button should be disabled until the request is done", async () => {
        const submitButton = screen.getByRole('button', { name: /submit/i })

        expect(submitButton).not.toBeDisabled()

        fireEvent.click(submitButton)

        expect(submitButton).toBeDisabled()

        await waitFor(() => expect(submitButton).not.toBeDisabled())
    })
})