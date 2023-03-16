import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'

function ListNumber() {
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState('')
    const [Validlist, setValidList] = useState(null)
    
    const onSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
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
                    console.log();
                else    
                    validPhoneNumbers.push(phoneNumbersArray[i])
            }
        }
        setValidList(validPhoneNumbers)

        setLoading(false)
    }
    useEffect(() => {
      console.log(Validlist);
    }, [Validlist])
    
  return (
    <div className='layout'>
    <Card className='card'>
        <CardHeader>
            <CardTitle tag="h4">Verfiy List in One Go</CardTitle>
        </CardHeader>
        <CardBody>
            <Form onSubmit={onSubmit}>
                <FormGroup style={{display:'flex', flexDirection:'column'}}>
                    <label>Enter List</label>
                    <textarea name="list" id="" onChange={(e)=>{setList(e.target.value)}}></textarea>
                </FormGroup>
                <Button disabled={loading? true : false} className='button'>Verify</Button>
            </Form>
            <Link to='/'><p style={{textAlign:'center', color:'black', textDecoration:'underline'}}>Verify Single Number</p></Link>
        </CardBody>
    </Card>

    {Validlist && Validlist.length !== 0 && !loading && <Card className='card' style={{marginTop: 20}}>
        <CardHeader>
            <CardTitle tag="h4">Valid List</CardTitle>
        </CardHeader>
        <CardBody>
            {Validlist.map((num, index)=>{
                return <p style={{lineHeight: 0.5}} key={index}>{num}</p>
            })}
        </CardBody>
    </Card>}
</div>
  )
}

export default ListNumber