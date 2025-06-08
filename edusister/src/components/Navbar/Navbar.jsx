import React from 'react'
import '../../main.css'
import { Link} from 'react-router-dom';

//Imported icons
import { GiGlassHeart } from "react-icons/gi";
import { MdSupportAgent } from "react-icons/md";
import { MdOutlineLanguage } from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";

//Imported images
import logo from '../../assets/logo.png'

const Navbar = () => {
    return (
        <div className='navBar flex'>
            <div className="navBarOne flex">
                {/* Left: Heart */}
                <GiGlassHeart className='icon heartIcon' />

                {/* Center: Support & Language */}
                <div className="middleLinks flex">
                    <li className="flex"><MdSupportAgent className='icon' />Support</li>
                    <li className="flex"><MdOutlineLanguage className='icon' />Language</li>
                </div>

                {/* Right: Auth Links */}
                <div className="atb flex">
                    <Link to='/loginsignup'><span>Sign Up</span></Link>
                    <Link to='/loginsignup'><span>Log In</span></Link>
                </div>
            </div>

            <div className="navBarTwo">
                <div className="logoDiv">
                    <img src={logo} alt="EduSister logo" />
                </div>

                <div className="navBarMenu">
                    <ul className="menu flex">
                        <li className="listItem">Home</li>
                        <li className="listItem">Journal</li>
                        <li className="listItem">Resources</li>
                        <li className="listItem">Mentorship</li>
                        <li className="listItem">SisterCircle</li>
                    </ul>

                    <button className="btn flex btnOne">
                        Contact
                    </button>

                    <div className="toggleIcon">
                        <CgMenuGridO />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Navbar