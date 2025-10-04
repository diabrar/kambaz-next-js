import { FormControl, FormSelect, Button } from "react-bootstrap";

export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h1>Profile</h1>
      <FormControl defaultValue="alice" placeholder="username" className="wd-username"/>
      <FormControl defaultValue="123"   placeholder="password" type="password"
             className="wd-password" />
      <FormControl defaultValue="Alice" placeholder="First Name" id="wd-firstname" />
      <FormControl defaultValue="Wonderland" placeholder="Last Name" id="wd-lastname" />
      <FormControl defaultValue="2000-01-01" type="date" id="wd-dob" />
      <FormControl defaultValue="alice@wonderland" type="email" id="wd-email" />
      <FormSelect defaultValue="FACULTY" id="wd-role">
        <option value="USER">User</option>       <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option> <option value="STUDENT">Student</option>
      </FormSelect>
      <Button 
      href="Signin"
      variant="danger"
      className="btn btn-primary w-100 mb-2">
         Sign out </Button>

    </div>
);}
