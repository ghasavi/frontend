import UserData from './aviuserData.jsx';
import {Link} from 'react-router-dom';

export default function Header() {
    console.log("Header component loading...")
    return (
        <div className="bg-red-500 text-white p-4">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
        </div>
    )
}