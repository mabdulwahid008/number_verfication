import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import { BsArrowLeft, BsXLg, BsFiles } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import img from '../assets/img/loading.gif'

function ListNumber() {
    const [list, setList] = useState('')
    const [loading, setLoading] = useState(false)   
    const [Validlist, setValidList] = useState([])
    const [numbersStored, setNumbersStored] = useState(null)
    const [error, setError] = useState(null)
    
    // for storing into file
    const [number, setNumber] = useState(null)
    const [response, setResponse] = useState(null)
    const [showBox, setShowBox] = useState(false)
    const [loadingforInsert, setLoadingforInsert] = useState(false)  
    const [count, setCount] = useState(0) 

    const insertNumber = async(e) => {
        e.preventDefault()
        setLoadingforInsert(true)
        let num = number.replace(/[().\s-]/g, "");

        if(!num.startsWith('+1')){
            let pre = '+1'
            num = pre.concat(num)
        }
        if(num.length !== 12){
            setResponse('Number is invalid')
            setLoadingforInsert(false)
            return;
        }

        const response = await fetch('/insert-number',{
            method: 'POST',
            headers:{
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({number: num})
        })
        const res = await response.json()
        if(response.status)
            setResponse(res.message)
        else
            setResponse(res.message)
        setLoadingforInsert(false)
    }

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
        setValidList([])
        let phoneNumbersArray = list.split("\n");

        let validPhoneNumbers = []
        for (let i = 0; i < phoneNumbersArray.length; i++) {
            let num = phoneNumbersArray[i].replace(/[().\s-]/g, "");

            if(!num.startsWith('+1')){
                let pre = '+1'
                num = pre.concat(num)
            }
            if(num.length !== 12){
                continue;
            }

            const check = numbersStored.some((number)=> number === num)
            if(check){
                console.log(number);
                continue;
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
                    console.log();
                }
                else if(res.num.carrier.mobile_network_code === null)
                    console.log();
                else if(res.num.carrier.name === "AT&T Wireless" && res.num.carrier.mobile_country_code == "311" && res.num.carrier.mobile_network_code == "180" )
                // else if(res.num.carrier.mobile_country_code == "311" && res.num.carrier.mobile_network_code == "180" )
                    console.log();
                else    
                    setValidList(prevValidList => [...prevValidList, phoneNumbersArray[i]]);
                    setCount(count + 1)
            }
            else{
                
                setError(res.message)
                break;
            }
        }

        setLoading(false)
    }
useEffect(()=>{
}, [Validlist])

  
    useEffect(() => {
        fetchNumbersFromFile()
    }, [loadingforInsert])

    
  return (
    <div className='layout'>
    <BiLogOutCircle className='logout' onClick={()=>{localStorage.removeItem('token'); localStorage.removeItem('admin'); window.location.reload(true)}}/>    
    <Card className='card'>
        <CardHeader>
            <Link to='/'><BsArrowLeft /></Link>
            <CardTitle tag="h4">Verfiy List in One Go</CardTitle>
        </CardHeader>
        <CardBody>
            <Form onSubmit={onSubmit}>
                <FormGroup style={{display:'flex', flexDirection:'column'}}>
                    <label>Enter List</label>
                    <textarea name="list" id="" required onChange={(e)=>{setList(e.target.value)}}></textarea>
                </FormGroup>
                <Button disabled={loading? true : false} className='button'>Verify</Button>
            </Form>
            {error && <p style={{textAlign:'center', fontWeight: 500, padding:'10px 0px 0px', color: 'Red'}}>{error}</p>}
            {!showBox && <div onClick={()=> setShowBox(true)} style={{textAlign:'center',padding: 5, cursor:'pointer', color:'black', textDecoration:'underline'}}>Store Number</div>}
        </CardBody>
    </Card>

    {loading && <img src={img} alt="loading" style={{width: '30px', height:'30px', marginTop: '20px'}}/>}

    {Validlist && Validlist.length > 0 && <Card className='card' style={{marginTop: 20,paddingBottom: 20}}>
        <CardHeader style={{justifyContent:'space-between'}}>
            <CardTitle tag="h4">Valid List</CardTitle>
            <BsFiles onClick={()=> navigator.clipboard.writeText(Validlist)}/>
        </CardHeader>
        <CardBody style={{overflow: 'auto', minHeight: 20}}>
            {Validlist.map((num, index)=>{
                return <p style={{display:'flex', gap:50, marginBottom:-8}} key={index} >
                    <p style={{width:'15px'}}>{index+1}.</p>
                    <p style={{textAlign: 'right', width:'100px'}}>{num}</p>
                    </p>
            })}
        </CardBody>
    </Card>}

    {showBox && <Card className='card' style={{marginTop: 20}}>
        <CardHeader style={{justifyContent: 'space-between'}}>
            <CardTitle tag="h4">Save Number</CardTitle>
            <BsXLg onClick={()=> setShowBox(false)}/>
        </CardHeader>
        <CardBody>
            <Form onSubmit={insertNumber}>
                <FormGroup>
                    <label>Enter Number</label>
                    <Input type='text' onChange={(e)=> {setNumber(e.target.value); setResponse(null)}} required />
                </FormGroup>
                <Button disabled={loadingforInsert? true : false} className='button'>Insert</Button>
                {response && <p style={{textAlign:'center', fontWeight: 500, padding:'10px 0px 0px', color: `${response === "Number added"? 'Green': 'Red'}`}}>{response}</p>}
            </Form>
        </CardBody>
    </Card>}
</div>
  )
}

export default ListNumber