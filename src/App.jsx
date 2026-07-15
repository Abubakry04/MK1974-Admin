import { AppProvider } from './context/AppContext'
import { AdminProvider } from './admin/context/AdminContext'
import AdminLayout from './admin/AdminLayout'
import Toast from './components/Toast'

export default function App() {
  return (
    <AppProvider>
      <AdminProvider>
        <AdminLayout />
        <Toast />
      </AdminProvider>
    </AppProvider>
  )
}
