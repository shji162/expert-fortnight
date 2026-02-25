import { useForm } from "react-hook-form"

import { useResetPasswordMutation } from "../../hooks/auth/reset-password.mutation"

import styles from "./login.page.module.css"

type ResetFormValues = {
  email: string
}

export const Reset = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    defaultValues: {
      email: "",
    },
  })

  const resetMutation = useResetPasswordMutation()

  const onSubmit = (values: ResetFormValues) => {
    resetMutation.mutate(values.email)
  }

  const apiError =
    (resetMutation.error as any)?.response?.data?.message ?? "Произошла ошибка. Попробуйте ещё раз."

  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <div className={styles.card}>
        <header className={styles.header}>
          <p className={styles.badge}>Аукцион</p>
          <h1 className={styles.title}>Сброс пароля</h1>
          <p className={styles.subtitle}>
            Введите e-mail, на который зарегистрирован аккаунт. Мы отправим ссылку для сброса пароля.
          </p>
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

          {resetMutation.isError && <p className={styles.apiError}>{apiError}</p>}
          {resetMutation.isSuccess && (
            <p className={styles.apiSuccess}>
              Если указанный e-mail существует, мы отправили на него письмо со ссылкой для сброса
              пароля.
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? "Отправляем..." : "Отправить ссылку"}
          </button>
        </form>
      </div>
    </div>
  )
}

