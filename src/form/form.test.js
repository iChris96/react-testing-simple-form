import React from 'react'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Form } from './form';
import { CREATED_STATUS, ERROR_SERVER_STATUS, INVALID_REQUEST_STATUS } from '../consts/httpStatus'


const server = setupServer(
    rest.post('/products', (req, res, ctx) => {
        const { name, size, type } = req.body;

        // console.log("req.body: ", req.body) // { name: 'my product', size: '10', type: 'electronic' }

        if (name && size && type) {
            return res(ctx.status(CREATED_STATUS))
        }

        return res(ctx.status(ERROR_SERVER_STATUS))
    }),
)

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers()); // reset/clean server in case of overrided endpoints

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


describe("when the user submits the form succesfully", () => {

    beforeEach(() => render(<Form />));

    it("submit button should be disabled until the request is done", async () => {
        const submitButton = screen.getByRole('button', { name: /submit/i })

        expect(submitButton).not.toBeDisabled()

        fireEvent.click(submitButton)

        expect(submitButton).toBeDisabled()

        await waitFor(() => expect(submitButton).not.toBeDisabled())
    })

    it('the form page must display the success messsage "product stored" and cleand the field values', async () => {
        const submitButton = screen.getByRole('button', { name: /submit/i })
        const nameInput = screen.getByLabelText(/name/i)
        const sizeInput = screen.getByLabelText(/size/i)
        const typeSelector = screen.getByLabelText(/type/i)

        fireEvent.change(nameInput, { target: { name: 'name', value: 'my product' } })
        fireEvent.change(sizeInput, { target: { name: 'size', value: '10' } })
        fireEvent.change(typeSelector, { target: { name: 'type', value: 'electronic' } })

        fireEvent.click(submitButton)

        await waitFor(() => expect(screen.getByText(/product stored/i)).toBeInTheDocument())

        // if response is successful the form inputs should be empty again
        expect(nameInput).toHaveValue('')
        expect(sizeInput).toHaveValue('')
        expect(typeSelector).toHaveValue('')
    })
})


describe("when the user submits the form unsuccessfully", () => {

    beforeEach(() => render(<Form />));

    it("the form page must display the error message 'Unexpected error, please try again'", async () => {
        const submitButton = screen.getByRole('button', { name: /submit/i })

        fireEvent.click(submitButton)

        await waitFor(() => {
            const errorMessage = screen.getByText(/unexpected error, please try again/i);
            expect(errorMessage).toBeInTheDocument();
        })
    })
})

describe("when the user submits the form and the server returns an unexpected error", () => {

    beforeEach(() => render(<Form />));

    it("the form page must display the error message 'the form is invalid, the fields [field1...fieldN] are required'", async () => {
        server.use( // this override the current behavior for defined '/products' endpoint
            rest.post('/products', (req, res, ctx) => res(
                ctx.status(INVALID_REQUEST_STATUS),
                ctx.json({
                    message:
                        'The form is invalid, the fields name, size, type are required',
                }),
            )),
        )

        const submitButton = screen.getByRole('button', { name: /submit/i })

        fireEvent.click(submitButton)

        await waitFor(() => {
            const errorMessage = screen.getByText(/the form is invalid, the fields name, size, type are required/i);
            expect(errorMessage).toBeInTheDocument();
        })
    })
})

describe("when the user submits the form and the server returns conexion error", () => {

    beforeEach(() => render(<Form />));

    it("the form page must display the error message 'connection error, please try later'", async () => {
        server.use( // this override the current behavior for defined '/products' endpoint
            rest.post('/products', (req, res, ctx) => res.networkError('Failed to connect')),
        )

        const submitButton = screen.getByRole('button', { name: /submit/i })

        fireEvent.click(submitButton)

        await waitFor(() => {
            const errorMessage = screen.getByText(/connection error, please try later/i);
            expect(errorMessage).toBeInTheDocument();
        })
    })
})