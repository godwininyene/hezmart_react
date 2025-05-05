import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { FiMail } from "react-icons/fi";

const ForgotPassword = () => {
  const[processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState({email:''})
  const[message, setMessage] = useState()
  const[status, setStatus] = useState('')

  const submit = async(e) => {
    e.preventDefault();
    setProcessing(true)
     
    try {
      let data = new FormData(e.target)
      let jsonData = Object.fromEntries(data);
      const response = await axios.post('api/v1/users/forgotPassword', jsonData);
      if(response.data.status == 'success'){
          setMessage(response.data.message)
      }
      setProcessing(false)
    } catch (err) {
      setProcessing(false)
  
      if (err && !err.response) {
        alert(err);
      } else { 
        const errors = {};
        if(err.response.data.message){
          setStatus(err.response.data.message)
      }

        if(err.response.data.errors){
          err.response.data.errors.forEach(el =>{
            for(let key in el){
                errors[key] = el[key]
              }
            })
          setErrors(errors)
        }
        
      }
    }
  };
 

  return (
    <div className="flex justify-center items-center py-10 bg-[#F5F6FA] ">
      <div className="w-full max-w-md">
        <form
          onSubmit={submit}
          className="bg-white rounded-lg border border-[#D9E1EC] shadow-sm p-8"
        >
           <h1
                className="
                text-2xl text-center font-bold text-[#111111]  mb-2"
            >
                Forgot Password?
            </h1>
            <p className="text-sm text-[#5A607F] mb-4 text-center">
              Forgot your password? No problem. Just let us know your email address 
              and we will email you a password
              reset link that will allow you to choose a new one.
            </p>

            {message && <div className="mb-7 font-medium text-center text-sm text-green-600">{message}</div>}
            {status && <div className="mb-7 font-medium text-center text-sm text-red-600">{status}</div>}
         

          <div className="mb-4">
            <InputField
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              icon={<FiMail className="text-gray-400" />}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
               Remembered your Password? Back to Sign in
            </Link>
          </div>

          <Button
            type="submit"
            disabled={processing}
            isLoading={processing}
            loadingText="Processing..."
            className="w-full py-3"
          >
            Send Link
          </Button>

          
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;