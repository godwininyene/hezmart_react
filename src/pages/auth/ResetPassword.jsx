import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import axios from "../../lib/axios";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { FaLock } from "react-icons/fa";
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const[processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState({email:''})
    const[message, setMessage] = useState()
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(document.location.search)
    const token = searchParams.get('token')
    const submit = async(e) => {
        e.preventDefault();
        setProcessing(true)
       
        try {
            let data = new FormData(e.target)
            let jsonData = Object.fromEntries(data);
            const response = await axios.patch(`api/v1/users/resetPassword/${token}`, jsonData);
            if(response.data.status === 'success'){
                toast.success("Password Reset Successfully.");
                
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
            setProcessing(false)
        } catch (err) {
            console.log(err)
            setProcessing(false)
        
            if (err && !err.response) {
              alert(err);
            } else { 
                if(err.response.data.message & !err.response.data.errors){
                    setMessage(err.response.data.message)
                }
              setErrors(err.response.data.errors)
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
                Reset Password
            </h1>
            <p className="text-base text-[#5A607F] mb-4 text-center">
                We Will Help You Reset your Password
            </p>

            {message && <div className="mb-7 font-medium text-sm text-red-600">{message}</div>}

          <div className="mb-4">
            <InputField
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              error={errors.password}
              icon={<FaLock className="text-gray-400" />}
            />
          </div>

          <div className="mb-4">
            <InputField
              type="password"
              name="passwordConfirm"
              label="password Confirm"
              placeholder="Enter confirm your password"
              error={errors.passwordConfirm }
              icon={<FaLock className="text-gray-400" />}
            />
          </div>

          <Button
            type="submit"
            disabled={processing}
            isLoading={processing}
            loadingText="Resetting..."
            className="w-full py-3"
          >
            Reset Password
          </Button>

          
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;