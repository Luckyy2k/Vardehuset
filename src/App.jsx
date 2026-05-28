import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Lokalet from './pages/Lokalet'
import TekniskeLosninger from './pages/TekniskeLosninger'
import Kalender from './pages/Kalender'
import Sponsorer from './pages/Sponsorer'
import Foresporsel from './pages/Foresporsel'
import Mannskoret from './pages/Mannskoret'
import Konserter from './pages/Konserter'
import Styret from './pages/Styret'
import Medlemmer from './pages/Medlemmer'
import BliMedlem from './pages/BliMedlem'
import Kontakt from './pages/Kontakt'
import NotFound from './pages/NotFound'
import Admin from './pages/admin/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="lokalet" element={<Lokalet />} />
          <Route path="tekniske-losninger" element={<TekniskeLosninger />} />
          <Route path="kalender" element={<Kalender />} />
          <Route path="sponsorer" element={<Sponsorer />} />
          <Route path="foresporsel" element={<Foresporsel />} />
          <Route path="mannskoret" element={<Mannskoret />} />
          <Route path="konserter" element={<Konserter />} />
          <Route path="styret" element={<Styret />} />
          <Route path="medlemmer" element={<Medlemmer />} />
          <Route path="bli-medlem" element={<BliMedlem />} />
          <Route path="kontakt" element={<Kontakt />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
