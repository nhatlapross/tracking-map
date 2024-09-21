'use client';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import logo from "../assets/Logo.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/home");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName || email.split('@')[0]
        }));
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.");
      });
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h2 style={styles.heading}>Đăng nhập</h2>
        <form onSubmit={signIn} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={styles.button}>Đăng nhập</button>
        </form>
        <p style={styles.signupText}>
          Người dùng mới? <a href="/signup" style={styles.link}>Đăng ký tài khoản</a>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  loginContainer: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '100px',
    marginBottom: '20px',
  },
  heading: {
    textAlign: 'center',
    color: '#1877f2',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #dddfe2',
  },
  button: {
    background: '#1877f2',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  signupText: {
    textAlign: 'center',
    marginTop: '20px',
  },
  link: {
    color: '#1877f2',
    textDecoration: 'none',
  },
};

export default Login;