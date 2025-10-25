import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { UserRegisterDto } from "../models/models";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!username) validationErrors.push("Username is required.");
    if (!password) validationErrors.push("Password is required.");
    if (!confirmPassword) validationErrors.push("Confirm password is required.");
    if (password && confirmPassword && password !== confirmPassword)
      validationErrors.push("Passwords do not match.");
    if (password && password.length < 6)
      validationErrors.push("Password must be at least 6 characters long.");

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const dto: UserRegisterDto = { username, password };
      const res = await api.post("/auth/register", dto);
        console.log(res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
     console.error("Registration error:", err);
  setErrors([err.response?.data || err.message || "Registration failed"]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3">
            <ul className="list-disc pl-5">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded mb-3"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Register
        </button>

        <p className="text-center mt-3 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
