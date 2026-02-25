import { useState } from "react"
import { useForm } from "react-hook-form"

import { useUserUpdateMutation } from "../../hooks/users/user-update.mutation"
import { useUsers } from "../../store/users.store"

import styles from "./user.page.module.css"

type ProfileFormValues = {
  name: string
  email: string
}

export const User = () => {
  const { user, setUser } = useUsers((state) => state)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  })

  const updateMutation = useUserUpdateMutation()

  const openModal = () => {
    reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const onSubmit = (values: ProfileFormValues) => {
    if (!user?.id) return

    updateMutation.mutate(
      {
        id: user.id,
        user: {
          name: values.name !== user.name ? values.name : undefined,
          email: values.email !== user.email ? values.email : undefined,
        },
      },
      {
        onSuccess: () => {
          setUser({
            ...user,
            name: values.name,
            email: values.email,
          } as any)
          closeModal()
        },
      },
    )
  }

  const apiError =
    (updateMutation.error as any)?.response?.data?.message ?? "Произошла ошибка. Попробуйте ещё раз."

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Профиль</h1>
          <p className={styles.subtitle}>Вы не авторизованы. Войдите, чтобы увидеть профиль.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <p className={styles.badge}>Профиль</p>
            <h1 className={styles.title}>Личные данные</h1>
            <p className={styles.subtitle}>
              Управляйте именем и почтой, чтобы получать уведомления и выигрывать аукционы вовремя.
            </p>
          </div>

          <button type="button" className={styles.editButton} onClick={openModal}>
            Изменить профиль
          </button>
        </header>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Имя</span>
            <span className={styles.infoValue}>{user.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{user.email}</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.backdrop} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Изменение профиля</h2>
              <button type="button" className={styles.closeButton} onClick={closeModal}>
                ✕
              </button>
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

              {updateMutation.isError && <p className={styles.apiError}>{apiError}</p>}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={closeModal}
                  disabled={updateMutation.isPending}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={updateMutation.isPending || !isDirty}
                >
                  {updateMutation.isPending ? "Сохраняем..." : "Сохранить изменения"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}