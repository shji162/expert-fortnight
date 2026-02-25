import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"

import { useNewPasswordMutation } from "../../hooks/auth/new-password.mutation"
import { loginPage } from "../../shared/consts/routes"

import styles from "./login.page.module.css"

type NewPasswordFormValues = {
  password: string
}

export const NewPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    defaultValues: {
      password: "",
    },
  })

  const newPasswordMutation = useNewPasswordMutation()

  const token = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get("token") ?? ""
  }, [])

  const onSubmit = (values: NewPasswordFormValues) => {
    if (!token) return
    newPasswordMutation.mutate({ password: values.password, token })
  }

  const apiError =
    (newPasswordMutation.error as any)?.response?.data?.message ??
    "Произошла ошибка. Попробуйте ещё раз."

  const isTokenMissing = !token

  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <div className={styles.card}>
        <header className={styles.header}>
          <p className={styles.badge}>Аукцион</p>
          <h1 className={styles.title}>Новый пароль</h1>
          <p className={styles.subtitle}>
            {isTokenMissing
              ? "Некорректная или устаревшая ссылка для сброса пароля."
              : "Введите новый пароль для вашего аккаунта."}
          </p>
        </header>

        {!isTokenMissing && (
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Новый пароль
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={styles.input}
                {...register("password", {
                  required: "Введите новый пароль",
                  minLength: {
                    value: 8,
                    message: "Минимум 8 символов",
                  },
                })}
              />
              {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            </div>

            {newPasswordMutation.isError && <p className={styles.apiError}>{apiError}</p>}
            {newPasswordMutation.isSuccess && (
              <p className={styles.apiSuccess}>
                Пароль успешно обновлён. Теперь вы можете войти в аккаунт с новым паролем.
              </p>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={newPasswordMutation.isPending}
            >
              {newPasswordMutation.isPending ? "Обновляем..." : "Сохранить пароль"}
            </button>
          </form>
        )}

        <footer className={styles.footer}>
          <span className={styles.footerText}>Вернуться ко входу?</span>
          <Link to={loginPage} className={styles.textLinkStrong}>
            Войти
          </Link>
        </footer>
      </div>
    </div>
  )
}

