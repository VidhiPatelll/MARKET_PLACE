import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
  } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  console.log("testing env", process.env.NEXT_PUBLIC_API);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.table({ name, email, password });
    try { 
      setLoading(true);
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      });
      console.log("REGISTER RESPONSE", data);
      toast.success("Registration successfully. Please Login.");
      setName("");
      setEmail("");
      setPassword("");
      router.push("/");
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Register</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-2 p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />

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
            disabled={!name || !email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Register"}
          </button>
        </form>
        <p className="text-center p-2">
          Already have an Account?{" "}
          <Link legacyBehavior href="/login">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
