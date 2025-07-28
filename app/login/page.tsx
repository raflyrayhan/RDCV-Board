"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      setCookie(null, "token", token, {
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      router.push("/");
    } catch (error: unknown) {
      let message = "Unknown error";
      if (error instanceof Error) {
        message = error.message;
      }
      alert("Login gagal: " + message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-left">
          <div className="logo-row">
            <Image src="/KPI.png" alt="Pertamina" width={120} height={40} />
            <Image src="/timas.png" alt="Timas" width={100} height={40} />
          </div>
          <h2 className="login-title">REVAMPING DESALTER CDU V</h2>
          <p className="login-desc">Refinery Unit V Balikpapan</p>
        </div>
        <div className="login-right">
          <h3 className="login-heading">Project Portal Login</h3>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
