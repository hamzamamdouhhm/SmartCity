import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import AuthFormCard from "../components/ui/AuthFormCard";
import { Button, Input } from "../components/ui";

const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/");
    return null;
  }

  const submit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!name || !email || !password) {
      setLocalError(t("allFieldsRequired"));
      return;
    }
    if (password.length < 6) {
      setLocalError(t("passwordTooShort"));
      return;
    }
    if (password !== confirm) {
      setLocalError(t("passwordsDoNotMatch"));
      return;
    }
    setLoading(true);
    const res = await register(name, email, password, currentLang);
    setLoading(false);
    if (res.success) navigate("/");
    else setLocalError(res.error);
  };

  return (
    <AuthFormCard
      title={t("register")}
      footer={
        <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
          {t("alreadyHaveAccount")}
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          type="text"
          label={t("name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
        <Input
          type="email"
          label={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          type="password"
          label={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <Input
          type="password"
          label={t("confirmPassword")}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
        />
        {localError && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-danger-50 text-danger-700 dark:bg-danger-50/10 dark:text-danger-500 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {localError}
          </div>
        )}
        <Button type="submit" loading={loading} className="w-full">
          {loading ? t("registering") : t("register")}
        </Button>
      </form>
    </AuthFormCard>
  );
};

export default RegisterPage;
