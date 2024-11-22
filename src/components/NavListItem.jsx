import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"
//For each item in navbar, links to a react page

function NavListItem({ text, link, currentPage }) {
    const isActive = currentPage === link;

    const [scaled, setScale] = useState(false)

    return (
        <li className="list-none">
            <label className="cursor-pointer hover:border-b-4 hover:rounded-sm hover:border-textcl">
                <Link to={link} className={`${isActive ? "font-semibold text-textcl " : ""}`}>
                    {text}
                </Link>
            </label>
        </li>
    );
}

export default NavListItem;