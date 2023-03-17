import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'

function Login() {
    const [pass, setPass] = useState('')
    const [error, setError] = useState(null)

    const onSubmit = (e) => {
        e.preventDefault()
        if(pass === '145236'){
            localStorage.setItem('token', true)
            window.location.reload(true)
        }
        else if(pass === 'Admin456'){
            localStorage.setItem('token', true)
            localStorage.setItem('admin', true)
            window.location.reload(true)
        }
        else{
            setError('Invalid Password')
        }

    }
  return (
    <div className='layout'>
        <Card className='card'>
            <CardHeader>
                <CardTitle tag="h5">Log In</CardTitle>
            </CardHeader>
            <CardBody>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <lable>Password</lable>
                        <Input type='password' onChange={(e)=> {setPass(e.target.value); setError(null)}} required/>
                    </FormGroup>
                    <Button style={{width:'100%'}}>Log in</Button>
                    {error && <p style={{textAlign:'center', fontWeight: 500, padding:'10px 0px 0px', color: 'Red'}}>{error}</p>}
                </Form>
            </CardBody>
        </Card>
    </div>
  )
}

export default Login