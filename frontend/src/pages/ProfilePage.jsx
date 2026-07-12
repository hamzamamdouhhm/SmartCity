import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, LogOut, User, Mail, Shield, Calendar } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Button, Card, Input, Select, Spinner } from "../components/ui";

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { user, loading, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user && user.name ? user.name : "");
  const [language, setLanguage] = useState(user && user.language ? user.language : currentLang);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const res = await updateProfile({ name, language });
    if (res.success) {
      setMessage(t("profileUpdated"));
      i18n.changeLanguage(language);
    } else {
      setError(res.error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (newPwd.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }
    if (newPwd !== confirmPwd) {
      setError(t("passwordsDoNotMatch"));
      return;
    }
    const res = await changePassword(currentPwd, newPwd);
    if (res.success) {
      setMessage(t("passwordChanged"));
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } else {
      setError(res.error || t("genericError"));
    }
  };

  const infoRow = (icon, label, value) => (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-text-tertiary">{icon}</span>
      <span className="text-text-tertiary w-28 shrink-0">{label}</span>
      <span className="font-medium text-text-primary">{value}</span>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <h1 className="text-h1 font-display text-text-primary mb-6">{t("profile")}</h1>

      <Card className="mb-6">
        <h2 className="text-h4 font-display text-text-primary mb-4">
          {t("accountInformation")}
        </h2>
        <div className="space-y-3 mb-6">
          {infoRow(<Mail className="w-4 h-4" />, "Email:", user.email)}
          {infoRow(<Shield className="w-4 h-4" />, t("role"), user.role)}
          {infoRow(<Calendar className="w-4 h-4" />, t("memberSince"), new Date(user.createdAt).toLocaleDateString())}
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <Input
            type="text"
            label={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            label={t("language")}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </Select>
          {message && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-success-50 text-success-700 dark:bg-success-50/10 dark:text-success-500 text-sm">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              {message}
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-danger-50 text-danger-700 dark:bg-danger-50/10 dark:text-danger-500 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          <Button type="submit" leftIcon={<User className="w-4 h-4" />}>
            {t("saveProfile")}
          </Button>
        </form>
      </Card>

      <Card className="mb-6">
        <h2 className="text-h4 font-display text-text-primary mb-4">
          {t("changePassword")}
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            type="password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            placeholder={t("currentPassword")}
            required
          />
          <Input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder={t("newPassword")}
            required
          />
          <Input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            placeholder={t("confirmNewPassword")}
            required
          />
          <Button type="submit" variant="secondary">
            {t("changePassword")}
          </Button>
        </form>
      </Card>

      <Button
        variant="danger"
        className="w-full"
        leftIcon={<LogOut className="w-4 h-4" />}
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        {t("logout")}
      </Button>
    </div>
  );
};

export default ProfilePage;
