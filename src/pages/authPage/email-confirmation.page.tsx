


import { useEffect, useMemo } from "react"
import { Link } from "react-router"

import { useEmailConfirmationMutation } from "../../hooks/auth/confirm-email.mutation"
import { loginPage } from "../../shared/consts/routes"

import styles from "./login.page.module.css"

export const EmailConfirmationPage = () => {
  const confirmMutation = useEmailConfirmationMutation()

  const token = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get("token") ?? ""
  }, [])

  useEffect(() => {
    if (!token) return
    confirmMutation.mutate(token)
  }, [confirmMutation, token])

  const isLoading = confirmMutation.isPending
  const isError = confirmMutation.isError
  const isSuccess = confirmMutation.isSuccess

  let content: string

  if (!token) {
    content = "Некорректная ссылка подтверждения."
  } else if (isLoading) {
    content = "Подтверждаем ваш e-mail..."
  } else if (isError) {
    content = "Ссылка недействительна или устарела. Запросите подтверждение ещё раз."
  } else if (isSuccess) {
    content = "E-mail успешно подтверждён! Теперь вы можете войти в аккаунт."
  } else {
    content = "Подтверждаем ваш e-mail..."
  }

  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <div className={styles.card}>
        <header className={styles.header}>
          <p className={styles.badge}>Аукцион</p>
          <h1 className={styles.title}>Подтверждение e-mail</h1>
          <p className={styles.subtitle}>{content}</p>
        </header>

        <footer className={styles.footer}>
          <span className={styles.footerText}>Готовы продолжить?</span>
          <Link to={loginPage} className={styles.textLinkStrong}>
            Перейти ко входу
          </Link>
        </footer>
      </div>
    </div>
  )
}
