import React, {useEffect, useState} from 'react'
import './index'
import './products.css'

export function Products() {
    const [content, setContent] = useState(<ProductList showForm={showForm} />)

    function showList() {
        setContent(<ProductList showForm={showForm} />)
    }

    function showForm(product) {
        setContent(<ProductForm product={product} showList={showList} />)
    }

    return (
        <div className='container my-5'>
            {content}
        </div>
    )
}

function ProductList(props) {
    const [products, setProducts] = useState([])

    function fetchProducts() {
        fetch('http://localhost:3004/products/').then((response) => {
            if(!response.ok) {
                throw new Error('Unexpected Server Response')
            }
            return response.json()
        }).then((data) => {setProducts(data)}).catch((error) => console.log('Error: ', error))
    }

    useEffect(() => fetchProducts(), [])

    function deleteProduct(id) {
        fetch('http://localhost:3004/products/' + id, {
            method: "DELETE"
        }).then((response) => response.json()).then((data) => fetchProducts())
    }

    return (
        <>
        <h2 className='text-center mb-3'>Products List</h2><br />
        <button onClick={() => props.showForm({})} type='button' className='btn btn-dark me-2'>Create Product</button>
        <br /><br />
        <table className='table'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    products.map((product, index) => {
                        return (
                            <tr key={index}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.price}</td>
                                <td>{product.description}</td>
                                <td style={{width: '10px', whiteSpace: 'nowrap'}}>
                                    <button onClick={() => props.showForm(product)} type='button' className='btn btn-warning btn-sm me-2'>Edit</button>
                                    <button onClick={() => deleteProduct(product.id)} type='button' className='btn btn-danger btn-sm me-2'>Delete</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        </>
    )
}

function ProductForm(props) {
    const [errorMessage, setErrorMessage] = useState('')

    function handleSubmit(event) {
        event.preventDefault()

        // read formData
        const formData = new FormData(event.target)

        // convert formData to object
        const product = Object.fromEntries(formData.entries())

        // form validation
        if(!product.name || !product.category || !product.price || !product.description) {
            console.log('Please fill all the required fields')
            setErrorMessage(
                <div className='alert alert-danger' role='alert'>
                    Please fill all the required fields
                </div>
            )
            return
        }

        if(props.product.id) {
            // update product
            fetch('http://localhost:3004/products/' + props.product.id, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(product)
            }).then((response) => {
                if (!response.ok) {
                    throw new Error('Network response is not OK')
                }
                return response.json()
            }).then((data) => props.showList()).catch((error) => {
                console.error('Error: ', error)
            })
        } else {
            // create new product
            fetch('http://localhost:3004/products/', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(product)
            }).then((response) => {
                if(!response.ok) {
                    throw new Error('Network response is not OK')
                }
                return response.json()
            }).then((data) => props.showList()).catch((error) => {
                console.error('Error: ', error)
            })
        }
    }

    return (
        <>
        <h2 className='text-center mb-3'>{props.product.id ? 'Edit Product' : 'Create New Product'}</h2><br />

        <div className='row'>
            <div className='col-lg-6 mx-auto'>
                {errorMessage}

                <form onSubmit={(event) => handleSubmit(event)}>
                    {props.product.id && <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>ID</label>
                        <div className='col-sm-8'>
                            <input readOnly className='form-control-plaintext' name='id' defaultValue={props.product.id} />
                        </div>
                    </div>}
                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Name</label>
                        <div className='col-sm-8'>
                            <input className='form-control' name='name' defaultValue={props.product.name} />
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Category</label>
                        <div className='col-sm-8'>
                            <input className='form-control' name='category' defaultValue={props.product.category} />
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Price</label>
                        <div className='col-sm-8'>
                            <input className='form-control' name='price' defaultValue={props.product.price} />
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Description</label>
                        <div className='col-sm-8'>
                            <textarea className='form-control' name='description' defaultValue={props.product.description} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='offset-sm-4 col-sm-4 d-grid'>
                            <button type='submit' className='btn btn-dark btn-sm me-3'>Save</button>
                        </div>
                        <div className='col-sm-4 d-grid'>
                            <button onClick={() => props.showList()} type='button' className='btn btn-secondary me-2'>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}