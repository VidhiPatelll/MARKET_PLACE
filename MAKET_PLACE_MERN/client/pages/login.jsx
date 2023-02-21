import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // state
  const {
    state: { user }, // const {user} = state;
    dispatch,
  } = useContext(Context);
  // console.log("STATE", state);

  useEffect(() => {
    if (user !== null) router.push("/user");
  }, [user]);

  // router
  const router = useRouter();

  console.log("testing env", process.env.NEXT_PUBLIC_API);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({ name, email, password });
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/login`, {
        email,
        password,
      });
      // console.log("LOGIN RESPONSE", data);
      dispatch({
        type: "LOGIN",
        payload: data,
      });
      // save in local storage
      window.localStorage.setItem("user", JSON.stringify(data));
      // redirect
      // router.push("/user");
      // setLoading(false);
    } catch (err) {
      toast(err.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Login</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-2 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <input
            type="password"
            className="form-control mb-2 p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <button
            type="submit"
            className="btn btn-block btn-primary w-100"
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Login"}
          </button>
        </form>
        <p className="text-center pt-2">
          Didn't have an account?{" "}
          <Link legacyBehavior href="/register">
            <a>Register</a>
          </Link>
        </p>

        <p className="text-center">
          <Link legacyBehavior href="/forgot-password">
            <a className="text-danger">Forgot password?</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
