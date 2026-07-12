import { useTranslation } from "react-i18next";
import { Link, NavLink, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";

export const useLegacyEnv = () => {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const { data } = useData();
  const params = useParams();
  const navigate = useNavigate();

  return {
    t,
    i18n,
    lang: i18n.language,
    changeLang: (l) => i18n.changeLanguage(l),
    currentLang: i18n.language,
    TRANSLATIONS: {},
    BENCHMARK_DATA: data,
    data,
    Link,
    NavLink,
    useParams: () => params,
    navigate: (path) => navigate(path),
    ...auth
  };
};

export default useLegacyEnv;
