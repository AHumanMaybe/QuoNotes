import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"
import TypeAnim from "../components/TypeAnim"

import LoginButton from "../components/LoginButton"

function Land(){


    return (
        <div className="items-center h-screen w-full">
            <div className="flex flex-col justify-center w-full">
                <div className="flex flex-col md:flex-row w-full p-6 justify-center pt-32">
                    <div className="flex flex-col w-full md:w-1/2 p-4 justify-start items-center text-5xl text-bgl">
                        <div className="w-2/3">
                            <div className="font-bold">
                                <TypeAnim />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 10, duration: 5, ease: "easeInOut" }}
                                className="flex flex-col w-full text-lg text-bgl justify-start pt-2 mt-4"
                            >
                                <div className="flex w-full text-2xl text-ta justify-start text-left">
                                    All your tools for learning. All in one place.
                                </div>
                                <div className="flex flex-col sm:flex-row w-full sm:max-w-md md:max-w-lg lg:max-w-xl justify-center sm:justify-between pt-4 space-y-4 sm:space-y-0 sm:space-x-4">
                                    <a
                                        className="text-black text-center bg-clg hover:bg-textcl focus:ring-4 focus:ring-textclh font-medium rounded-lg text-sm px-4 py-2 focus:outline-none flex items-center justify-center"
                                        href="https://docs.google.com/forms/d/e/1FAIpQLSe-RYqVF-bUL3ONuF5vPxWrprJ6n5LWE_bMPzyDCRXqz18Ixw/viewform?usp=sf_link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Join the Waitlist
                                    </a>
                                    <a
                                        className="text-black text-center bg-clg hover:bg-textcl focus:ring-4 focus:ring-textclh font-medium rounded-lg text-sm px-4 py-2 focus:outline-none flex items-center justify-center"
                                        href="https://discord.gg/8Mf5kwUDUW"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Join the Discord
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    
                    <div className="hidden md:flex flex-col w-1/2 p-4 items-center justify-center">
                        <div className="flex bg-clg md:w-96 md:h-96 w-64 h-64 rounded-full justify-center items-center">
                            <img className="flex scale-90 items-center -rotate-6 justify-center" src="/QuoNotesLogo.png"/>
                        </div>
                    </div>
                </div>

                <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 10, duration: 5, ease: "easeInOut" }}
                                className="flex flex-col w-full text-lg text-bgl justify-start pt-2 mt-4"
                            >

<div className="flex flex-col items-center justify-center w-full pt-32">
                    <div className="flex md:w-5/6 w-full justify-center text-bgl md:text-7xl text-5xl font-semibold p-2">
                        What is&nbsp;<span className="text-textcl">Quonotes?</span>
                    </div>
                    <div className="flex flex row md:w-3/4 w-full pt-12">
                        <div className="w-1/2"/>
                        <div className="justify-end w-1/2 p-6">
                            <div className="flex w-full text-5xl text-bgl justify-end text-right font-semibold">
                                Learn from Yourself.
                            </div>
                            <div className="flex w-full text-lg text-ta justify-end text-right pt-2">
                                AI powered learning tools built by students for students. Use your own notes to create flashcard sets and have questions answered
                            </div>
                            <div className="flex w-full justify-end pt-2">
                                <a className="text-black text-center bg-clg hover:bg-textcl focus:ring-4 focus:ring-textclh font-medium rounded-lg text-sm px-4 py-2 focus:outline-none flex items-center justify-center"
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSe-RYqVF-bUL3ONuF5vPxWrprJ6n5LWE_bMPzyDCRXqz18Ixw/viewform?usp=sf_link"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                        Join the Waitlist
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex row md:w-3/4 w-full pt-12">
                        <div className="justify-start w-1/2 p-6">
                            <div className="flex w-full text-5xl text-bgl justify-start text-start font-semibold">
                                Focus on Community
                            </div>
                            <div className="flex w-full text-lg text-ta justify-start text-start pt-2">
                                Talk directly to developers, share your experiences, and suggest new features.
                            </div>
                            <div className="flex w-full justify-start pt-2">
                                <a className="text-black text-center bg-clg hover:bg-textcl focus:ring-4 focus:ring-textclh font-medium rounded-lg text-sm px-4 py-2 focus:outline-none flex items-center justify-center"
                                    href="https://discord.gg/8Mf5kwUDUW"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                        Join the Discord
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                </motion.div>

                
            </div>
        </div>
    )
}

export default Land