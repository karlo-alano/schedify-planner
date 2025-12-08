import {Input, Label} from "@heroui/react";
import { useNavigate } from "react-router-dom"

const wait = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));




export default function Signup() {
    const navigate = useNavigate();

    async function animateAndRedirect() {
        await wait(2000)
        navigate('/home')
    }
    return(
        <>
            <section className="h-screen w-screen gradient-1 center-children flex-col gap-4">
                <div className="card bg-white text-primary-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-15">
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                    </svg>
                </div>
                <h1 className="text-white text-6xl font-extrabold mb-10">Schedify</h1>
                <div className="flex flex-col">
                    <Label htmlFor="input-type-email" className="text-white">Email</Label>
                    <Input id="input-type-email" type="email" className="shadow-1 h-15 bg-blue-100 inputBox"/>
                </div>
                <div className="flex flex-col">
                    <Label htmlFor="input-type-username" className="text-white">Username</Label>
                    <Input id="input-type-username" type="text" className="shadow-1 h-15 bg-blue-100 inputBox"/>
                </div>
                <div className="flex flex-col">
                    <Label htmlFor="input-type-password" className="text-white">Password</Label>
                    <Input id="input-type-password" type="password" className="shadow-1 h-15 bg-blue-100 inputBox"/>
                </div>
                <button className="w-[70%] h-15 mt-10 card button bg-blue-100 text-primary-600 text-xl font-bold"
                    onClick={animateAndRedirect}>
                        Get Started
                    </button>
            </section>
        </>
    )
}