import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import { BiLogOutCircle } from "react-icons/bi";
import img from '../assets/img/loading.gif'

function SingleNumber() {
    const [number, setNumber] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [response, setResponse] = useState(null)
    const [numberInfo, setNumberInfo] = useState(null)
    const [numbersStored, setNumbersStored] = useState(null)

    const fetchNumbersFromFile = async() => {
        const response = await fetch('get-numbers',{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json'
            }
        })
        const res = await response.json()
        if(response.status === 200)
            setNumbersStored(res)
        else 
            console.log(res.message);
    }

    const onSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)

        
        let num = number.replace(/[().\s-]/g, "");

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

        const check = numbersStored.some((number)=> number === num)
        if(check){
            setResponse('Invalid')
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
                setResponse("The phone number is invalid")
            }
            else if(res.num.carrier.mobile_network_code === null)
                setResponse("The phone number is invalid")
            // else if(res.num.carrier.name === "AT&T Wireless" && res.num.carrier.mobile_country_code == "311" && res.num.carrier.mobile_network_code == "180" )
            else if(res.num.carrier.mobile_country_code == "311" && res.num.carrier.mobile_network_code == "180" )
                setResponse("The phone number is invalid")
            else    
                setResponse("The phone number is valid")
            setNumberInfo(res.num.carrier)
        }
        else{
            setResponse(res.message)
            setError(true)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchNumbersFromFile()
    }, [])
  return (
    <div className='layout'>
    <BiLogOutCircle className='logout' onClick={()=>{localStorage.removeItem('token'); localStorage.removeItem('admin'); window.location.reload(true)}}/>
    <Card className='card'>
        <CardHeader>
            <CardTitle tag="h4">Number Verification</CardTitle>
        </CardHeader>
        <CardBody>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <label>Enter Number</label>
                    <Input type="text" required onChange={(e)=> {setNumber(e.target.value); setError(false); setResponse(null)}}/>
                </FormGroup>
                {error && <p style={{color: 'red'}}>{errorMessage}</p>}
                <Button disabled={loading? true : false} className='button'>Verify</Button>
                {response && <p style={{textAlign:'center', fontWeight: 500, padding:'10px 0px 0px', color: `${response === "The phone number is valid"? 'Green': 'Red'}`}}>{response}</p>}
            </Form>
            {localStorage.getItem('admin') && <Link to='/verify-list'><p style={{textAlign:'center', color:'black', textDecoration:'underline'}}>Verify List</p></Link>}
        </CardBody>
    </Card>
    
    {loading && <img src={img} alt="loading" style={{width: '30px', height:'30px', marginTop: '20px'}}/>}

   {numberInfo && response && <Card className='card' style={{marginTop: 20}}>
        <CardHeader>
            <CardTitle tag="h4">Number Info</CardTitle>
        </CardHeader>
        <CardBody>
            <div className='number-info'>
                <div>
                    <p>Mobile Country Code:</p>
                    <p>Mobile Network Code:</p>
                    <p>Number Carrier Name:</p>
                    <p>Number Carrier Type:</p>
                </div>
                <div>
                    <p>{numberInfo.mobile_country_code}</p>
                    <p>{numberInfo.mobile_network_code}</p>
                    <p>{numberInfo.name}</p>
                    <p>{numberInfo.type}</p>
                </div>
            </div>
        </CardBody>
    </Card>}
</div>
  )
}

export default SingleNumber