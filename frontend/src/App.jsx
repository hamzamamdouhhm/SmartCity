import React, { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MunicipalitiesPage from "./pages/MunicipalitiesPage";
import MunicipalityDetail from "./pages/MunicipalityDetail";
import Compare from "./pages/Compare";
import Ranking from "./pages/Ranking";
import WeightsPage from "./pages/WeightsPage";
import MapsPage from "./pages/MapsPage";
import KpiCalculator from "./pages/KpiCalculator";
import Methodology from "./pages/Methodology";
import DataPage from "./pages/DataPage";
import KpiCatalogue from "./pages/KpiCatalogue";
import ApiPage from "./pages/ApiPage";
import AiPage from "./pages/AiPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import KpiDetailModal from "./components/modals/KpiDetailModal";
import CategoryDetailModal from "./components/modals/CategoryDetailModal";
import { useData } from "./hooks/useData";
import { computeScores } from "./utils/scoring";

const AppInner = () => {
  const [modal, setModal] = useState(null);
  const [categoryModal, setCategoryModal] = useState(null);
  const [stakeholder, setStakeholder] = useState("stadt");
  const [indicatorWeights, setIndicatorWeights] = useState({});
  const [categoryWeights, setCategoryWeights] = useState({});
  const resetWeights = () => { setIndicatorWeights({}); setCategoryWeights({}); };
  const { data } = useData();
  const scores = useMemo(() => computeScores(data, indicatorWeights, categoryWeights), [data, indicatorWeights, categoryWeights]);

  return (
    <Layout stakeholder={stakeholder} setStakeholder={setStakeholder}>
      <Routes>
        <Route path="/" element={<Dashboard scores={scores} setCategoryModal={setCategoryModal} stakeholder={stakeholder} setStakeholder={setStakeholder} />} />
        <Route path="/municipalities" element={<MunicipalitiesPage scores={scores} />} />
        <Route path="/municipality/:id" element={<MunicipalityDetail scores={scores} setModal={setModal} stakeholder={stakeholder} setStakeholder={setStakeholder} />} />
        <Route path="/compare" element={<Compare scores={scores} setModal={setModal} stakeholder={stakeholder} setStakeholder={setStakeholder} />} />
        <Route path="/ranking" element={<Ranking scores={scores} categoryWeights={categoryWeights} />} />
        <Route path="/weights" element={<WeightsPage indicatorWeights={indicatorWeights} setIndicatorWeights={setIndicatorWeights} categoryWeights={categoryWeights} setCategoryWeights={setCategoryWeights} resetWeights={resetWeights} />} />
        <Route path="/maps" element={<MapsPage />} />
        <Route path="/calculator" element={<KpiCalculator />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/catalogue" element={<KpiCatalogue />} />
        <Route path="/api" element={<ApiPage />} />
        <Route path="/ai" element={<AiPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      {modal && <KpiDetailModal kpi={modal.kpi} municipality={modal.municipality} onClose={()=>setModal(null)} scores={scores} />}
      {categoryModal && <CategoryDetailModal kpi={categoryModal.kpi} onClose={()=>setCategoryModal(null)} scores={scores} />}
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppInner />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
