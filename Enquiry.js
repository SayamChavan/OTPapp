import { useState,useRef } from "react";
import{getDatabase} from "firebase/database";
import firebase from "firebase/compat/app";
import {set,ref} from "firebase/database";
import "firebase/compat/auth";


import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAELJKvHwDHXSDDzRMbFEcJN930zRmAQ4Q",
  authDomain: "otpapp-57417.firebaseapp.com",
  databaseURL:"https://otpapp-57417-default-rtdb.firebaseio.com",
  projectId: "otpapp-57417",
  storageBucket: "otpapp-57417.appspot.com",
  messagingSenderId: "68824611669",
  appId: "1:68824611669:web:6d3ee1a52489749b160ddc"
};

const app = firebase.initializeApp(firebaseConfig);
const db=getDatabase(app);

function Enquiry(){
    const[name,setName]=useState("");
    const[query,setQuery]=useState("");
    const[phone,setPhone]=useState("");
    const[otp,setOtp]=useState("");
    const[msg,setMsg]=useState("");
    const[final,setFinal]=useState("");
    
    const hName=(event)=>{setName(event.target.value);}
    const hQuery=(event)=>{setQuery(event.target.value);}
    const hPhone=(event)=>{setPhone(event.target.value);}
    const hOtp=(event)=>{setOtp(event.target.value);}
    const hFinal=(event)=>{setFinal(event.target.value);}

    const configureCaptcha=()=>{
        window.recaptchaVerifier=new firebase.auth.RecaptchaVerifier('sign-in-button',{
            size:'invisible',
            'callback':(response)=>{
                sendOtp();
                console.log("Repcaptca verified")
            },
            defaultCountry:"IN"
        });
    }

        const sendOtp=(event)=>{
            event.preventDefault();
            configureCaptcha();
            let pn ="+91"+phone;
            let av=window.recaptchaVerifier;
            firebase.auth().signInWithPhoneNumber(pn,av)
            .then(res=>{
                setFinal(res);
                console.log(res);
                console.log("OTP sent");
                setMsg("OTP sent");
                alert("OTP sent");
            })
            .catch(err=>{
                console.log(err);
            })

        }

        const submitOtp=(event)=>{
            event.preventDefault();
            final.confirm(otp)
            .then(res=>{
                    const d=new Date().toString();
                    const n=name+"-->"+d;
                    const data={name,phone,query,d}
                    set(ref(db,"visitors/"+n),data)
                    .then(res=>{
                        console.log(res);
                        alert("We will call you back in 2 hours");
                        setMsg("We will call you back in 2 hours");
                        window.location.reload()
                    })
                    .catch(err=>console.log(err))
            })
            .catch(err=>{
                console.log(err);
                alert("invalid OTP");
                window.location.reload();
            });
        }
    return(
        <>
        <center>
            <h1>Fill the form</h1>
            <form onSubmit={sendOtp}>
            <div id="sign-in-button"></div>
            <input type="text" placeholder="enter name"
            onChange={hName} value={name}/>
            <br/><br/>
            <textarea placeholder="enter query" 
            onChange={hQuery} value={query}></textarea>
            <br/><br/>
            <input type="number" placeholder="enter number"
            onChange={hPhone} value={phone}/>
            <br/><br/>
            <input type="submit" value="Generate OTP"/>
            </form>
            <br/>
            <form onSubmit={submitOtp}>
            <input type="number" placeholder="enter OTP"
            onChange={hOtp} value={otp}/>
            <br/><br/>
            <input type="submit" placeholder="submit OTP"/>
            </form>
            <h2>{msg}</h2>
        </center>
        </>
    );
}
export default Enquiry;