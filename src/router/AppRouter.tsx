import { Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { ClaimsPage } from '@/pages/ClaimsPage'
import { CompaniesPage } from '@/pages/CompaniesPage'
import { AccountPage } from '@/pages/AccountPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/en" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage />} />
      <Route path="/en/user/login" element={<LoginPage />} />
      <Route path="/claims" element={<ClaimsPage />} />
      <Route path="/en/claims" element={<ClaimsPage />} />
      <Route path="/en/user/claims" element={<ClaimsPage />} />
      <Route path="/dashboard" element={<ClaimsPage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/en/companies" element={<CompaniesPage />} />
      <Route path="/en/user/companies" element={<CompaniesPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/en/account" element={<AccountPage />} />
      <Route path="/en/user/account" element={<AccountPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  )
}
