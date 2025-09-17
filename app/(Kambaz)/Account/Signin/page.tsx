import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
export default function Signin() {
 return (
   <div id="wd-signin-screen">
     <h3>Sign in</h3>
     <input placeholder="username" className="wd-username" /> <br />
     <input placeholder="password" type="password" className="wd-password" /> <br />
     <button> <Link href="/Dashboard" id="wd-signin-link"> Sign in </Link> </button> <br />
     <Link href="Signup" id="wd-signup-link"> Sign up </Link> 
   </div>
);}
