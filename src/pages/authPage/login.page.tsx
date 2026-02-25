
import { useForm } from "react-hook-form"
import { Link } from "react-router"

import { useUserLoginMutation } from "../../hooks/auth/login.mutation"
import { regPage, resetPasswordPage } from "../../shared/consts/routes"

import styles from "./login.page.module.css"

type LoginFormValues = {
  email: string
  password: string
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginMutation = useUserLoginMutation()

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    })
  }

  const apiError =
    (loginMutation.error as any)?.response?.data?.message ?? "Произошла ошибка. Попробуйте ещё раз."

  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <div className={styles.card}>
        <header className={styles.header}>
          <p className={styles.badge}>Аукцион</p>
          <h1 className={styles.title}>Вход в аккаунт</h1>
          <p className={styles.subtitle}>Продолжите, чтобы участвовать в торгах и ставках.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={styles.input}
              {...register("email", {
                required: "Введите email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Неверный формат email",
                },
              })}
            />
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          </div>

          <div className={styles.field}>
            <div className={styles.fieldHeader}>
              <label className={styles.label} htmlFor="password">
                Пароль
              </label>
              <Link to={resetPasswordPage} className={styles.textLink}>
                Забыли пароль?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={styles.input}
              {...register("password", {
                required: "Введите пароль",
                minLength: {
                  value: 8,
                  message: "Минимум 8 символов",
                },
              })}
            />
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          </div>

          {loginMutation.isError && (
            <p className={styles.apiError}>{apiError}</p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Входим..." : "Войти"}
          </button>
        </form>

        <footer className={styles.footer}>
          <span className={styles.footerText}>Нет аккаунта?</span>
          <Link to={regPage} className={styles.textLinkStrong}>
            Зарегистрироваться
          </Link>
        </footer>
      </div>
    </div>
  )
}