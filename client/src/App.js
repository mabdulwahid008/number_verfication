import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import './App.css'

function App() {
    const [number, setNumber] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [response, setResponse] = useState(null)

    const onSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)

        
        let num = number;
        if(!num.startsWith('+1')){
            let pre = '+1'
            num = pre.concat(num)
        }
        if(num.length !== 12){
            setErrorMessage('Invalid phone number')
            setError(true)
            setLoading(false)
            return;
        }

        let data = {
            number: num
        }
        const response = await fetch('/verifynumber',{
            method: 'POST',
            headers:{
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify(data)
        })

        const res = await response.json()

        if(response.status === 200){
            if(res.num.carrier.type === "landline"){
                setResponse("Invalid")
            }
            else if(res.num.carrier.mobile_network_code === null)
                setResponse("Invalid")
            else if(res.num.carrier.name === "AT&T Wireless" && res.num.carrier.mobile_country_code == "311" && res.num.carrier.mobile_network_code == "180" )
                setResponse("Invalid")
            else    
                setResponse("Valid")
        }
        else{
            setErrorMessage(res.message)
            setError(true)
        }
        setLoading(false)
    }
  return (
      <>
    <div className='layout'>
        <Card className='card'>
            <CardHeader>
                <CardTitle tag="h4">Number Verification</CardTitle>
            </CardHeader>
            <CardBody>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <label>Enter Number</label>
                        <Input type="number" onChange={(e)=> {setNumber(e.target.value); setError(false); setResponse(null)}}/>
                    </FormGroup>
                    {error && <p style={{color: 'red'}}>{errorMessage}</p>}
                    <Button disabled={loading? true : false} className='button'>Verify</Button>
                    {response && <p style={{fontWeight: 700, padding:'10px 0px 0px', color: `${response === "Valid"? 'Green': 'Red'}`}}>{response}</p>}
                </Form>
            </CardBody>
        </Card>
    </div>
          </>    
    )
}

export default App