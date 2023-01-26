import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../../redux/actions";
function Register(props: any) {
  const dispatch: any = useDispatch();
  const loginSelector = useSelector((state: any) => state.AuthReducer.login);
  useEffect(() => {
    dispatch(loginAction(1));
  }, []);
  useEffect(() => {
    console.log(loginSelector, "loginSelector");
  }, [loginSelector]);

  return <div>Register</div>;
}

export default Register;
