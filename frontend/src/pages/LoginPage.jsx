import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthFormCard from "../components/ui/AuthFormCard";
import { AlertCircle } from "lucide-react";
import { Button, Input } from "../components/ui";

const LoginPage = () => {
  const { t } = useTranslation();
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/");
    return null;
  }

  const submit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!email || !password) {
      setLocalError(t("loginRequiredError"));
      return;
    }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) navigate("/");
    else setLocalError(res.error);
  };

  return (
    <AuthFormCard
      title={t("login")}
      footer={
        <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">
          {t("noAccountRegister")}
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          type="email"
          label={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@beispiel.de"
          required
          autoComplete="email"
        />
        <Input
          type="password"
          label={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {localError && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-danger-50 text-danger-700 dark:bg-danger-50/10 dark:text-danger-500 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {localError}
          </div>
        )}
        <Button type="submit" loading={loading} className="w-full">
          {loading ? t("loggingIn") : t("login")}
        </Button>
      </form>
    </AuthFormCard>
  );
};

export default LoginPage;
