import { logo } from '../assets/images';
import { Link } from 'react-router-dom';

export default function ExtraLayout({ children }) {
    return (
        <div className={`flex justify-center items-center min-h-screen bg-slate-100 dark:bg-slate-700`}>
           <section className="my-4 w-full">
                <div className='text-center mb-4'>
                    <Link to='/'>
                        <img src={logo} alt="" className={`h-16 mb-4 inline-block`} />
                    </Link>
                </div>

                <div className="px-4">
                    {children}
                </div>
           </section>
        </div>
    );
}