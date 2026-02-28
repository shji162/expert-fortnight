
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"

import { useUserCreateMutation } from "../../hooks/auth/register.mutation"
import { loginPage, resetPasswordPage } from "../../shared/consts/routes"

import styles from "./reg.page.module.css"

type RegisterFormValues = {
  name: string
  email: string
  password: string
}

export const Register = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const registerMutation = useUserCreateMutation()

  useEffect(() => {
    if (registerMutation.isSuccess) {
      setIsSuccessModalOpen(true)
    }
  }, [registerMutation.isSuccess])

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
      // role заполняется внутри useUserCreateMutation
    } as any)
  }

  const apiError =
    (registerMutation.error as any)?.response?.data?.message ?? "Произошла ошибка. Попробуйте ещё раз."

  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <div className={styles.card}>
        <header className={styles.header}>
          <p className={styles.badge}>Аукцион</p>
          <h1 className={styles.title}>Создание аккаунта</h1>
          <p className={styles.subtitle}>Пара шагов — и вы готовы делать ставки.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Имя
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Как к вам обращаться"
              className={styles.input}
              {...register("name", {
                required: "Введите имя",
                minLength: {
                  value: 2,
                  message: "Минимум 2 символа",
                },
              })}
            />
            {errors.name && <p className={styles.error}>{errors.name.message}</p>}
          </div>

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
              autoComplete="new-password"
              placeholder="Придумайте надёжный пароль"
              className={styles.input}
              {...register("password", {
                required: "Введите пароль",
                minLength: {
                  value: 6,
                  message: "Минимум 6 символов",
                },
              })}
            />
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          </div>

          {registerMutation.isError && (
            <p className={styles.apiError}>{apiError}</p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>

        <footer className={styles.footer}>
          <span className={styles.footerText}>Уже есть аккаунт?</span>
          <Link to={loginPage} className={styles.textLinkStrong}>
            Войти
          </Link>
        </footer>
      </div>

      {isSuccessModalOpen && (
        <div className={styles.backdrop} onClick={() => setIsSuccessModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Подтвердите e-mail</h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setIsSuccessModalOpen(false)}
              >
                ✕
              </button>
            </header>
            <p className={styles.modalText}>
              на ваш e-mail аддрес отправлено письмо, пожалйста подтвердите свой аккаунт
            </p>
          </div>
        </div>
      )}
    </div>
  )
}