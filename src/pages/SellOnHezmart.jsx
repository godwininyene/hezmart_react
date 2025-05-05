import { Link } from "react-router-dom"
import { sell_1, sell_2, sell_3, sell_4 } from "../assets/images"
import { FaArrowRight } from "react-icons/fa6"
const SellOnHezmart = ()=>{

    const steps = [
        {
            id:0,
            heading:'Register',
            content:'Visit Hezmart\'s website and fill out the seller registration form with your personal and business details. Provide necessary documents like ID and business verification if required.'
        },
        {
            id:1,
            heading:'Wait for Approval',
            content:'Submit your application and wait for Hezmart\'s team to review it. Approval timelines may vary depending on the verification process'
        },

        {
            id:2,
            heading:' Study Hezmart Selling Rules and Regulations',
            content:'Familiarize yourself with Hezmart\'s policies, including pricing, shipping, and customer service guidelines, to ensure smooth operations.'
        },

        {
            id:3,
            heading:'Login and start selling',
            content:'Once approved, log in to your seller dashboard, list your products, and begin managing your sales through the platform.'
        },
    ]
    return (
        <div className="max-w-5xl mx-auto ">
           <div class="flex items-center gap-[10px] py-4  lg:py-10 text-[14px] lg:px-0 px-4">
                <Link to='/'>Home</Link>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg>
                <strong>Sell on Hezmart</strong>
            </div>

            {/* Hero  */}
            <div className="">
                <div
                    className=" h-[472px]  pt-[3%] pb-[10px] mx-auto text-center  text-white lg:rounded-[5px] bg-cover bg-center flex items-center justify-center"
                    style={{
                        backgroundImage:
                        `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${sell_1})`,
                    }}
                    >
                    <h1 className="text-7xl font-bold">Why Sell On Hezmart</h1>
                </div>
            </div>

            {/* images  */}
            <div className="lg:px-0 px-4 mt-5">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="">
                        <div
                            className=" h-[200px] text-center text-white lg:rounded-[5px] bg-cover bg-center flex items-center justify-center"
                            style={{
                                backgroundImage:
                                `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${sell_2})`,
                            }}
                            >
                            <h1 className="text-[33px] leading-9 font-semibold">Access to a Wider Audience</h1>
                        </div>
                    </div>

                    <div className="">
                        <div
                            className=" h-[200px] text-center text-white lg:rounded-[5px] bg-cover bg-center flex items-center justify-center"
                            style={{
                                backgroundImage:
                                `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${sell_3})`,
                            }}
                            >
                            <h1 className="text-[33px] leading-9 font-semibold">Convenience for Sellers and Buyerst</h1>
                        </div>
                    </div>

                    <div className="">
                        <div
                            className=" h-[200px] text-center text-white lg:rounded-[5px] bg-cover bg-center flex items-center justify-center"
                            style={{
                                backgroundImage:
                                `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${sell_4})`,
                            }}
                            >
                            <h1 className="text-[33px] leading-9 font-semibold">Scalabiltity and Analytics</h1>
                        </div>
                    </div>
                    

                </div>

            </div>



             {/* Steps  */}
            <div className="lg:px-0 px-4 mt-20">

                <h1 className="text-center mb-8 text-2xl font-bold">How to Start</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {
                        steps.map(step => (
                            <div key={step.id} className="">
                            <div className="h-auto min-h-[200px] text-white bg-primary-light rounded-[5px] p-5 flex flex-col gap-2">
                                <h1 className="text-[20px] font-semibold">{step.id + 1}. {step.heading}</h1>
                                <p className="text-[14px] leading-relaxed">{step.content}</p>
                            </div>
                            </div>
                        ))
                    }

                </div>
            </div>

            <div className="mt-16 text-center pb-4">
                <Link
                    to="/vendor-register"
                        className="text-white inline-flex items-center justify-center w-[45%] bg-gradient-to-r rounded-xl  py-2 from-primary-light to-primary-dark px-5
                        cursor-pointer
                        "
                >
                    Start Procedure
                    <FaArrowRight className="mt-1 ml-1"/>
                </Link>
            </div>

        </div>
    )
}

export default SellOnHezmart