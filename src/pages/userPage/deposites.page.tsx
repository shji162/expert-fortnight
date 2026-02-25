import { useState } from "react"
import { useForm } from "react-hook-form"

import { useDepositeCreateMutation } from "../../hooks/deposites/create-deposite.mutation"
import { useDepositeDeleteMutation } from "../../hooks/deposites/deposite-delete.mutation"
import { useDepositeUpdateMutation } from "../../hooks/deposites/deposite-update.mutation"
import { useDepositesQuery } from "../../hooks/deposites/deposites.query"
import type { DepositeOutput } from "../../shared/types/output/deposite-output.type"
import { useDeposites } from "../../store/deposites.store"
import { useUsers } from "../../store/users.store"

import styles from "./deposites.page.module.css"

type CreateDepositeFormValues = {
  auctionId: string
  deposite: number
}

type UpdateDepositeFormValues = {
  deposite: number
}

type DepositeCardProps = {
  deposite: DepositeOutput
}

const DepositeCard = ({ deposite }: DepositeCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateDepositeFormValues>({
    defaultValues: {
      deposite: deposite.deposite,
    },
    values: {
      deposite: deposite.deposite,
    },
  })

  const updateMutation = useDepositeUpdateMutation()
  const deleteMutation = useDepositeDeleteMutation()

  const openEdit = () => {
    reset({ deposite: deposite.deposite })
    setIsEditOpen(true)
  }

  const closeEdit = () => {
    setIsEditOpen(false)
  }

  const onUpdateSubmit = (values: UpdateDepositeFormValues) => {
    updateMutation.mutate(
      {
        id: deposite.id,
        deposite: values.deposite.toString(),
      },
      {
        onSuccess: () => {
          closeEdit()
        },
      },
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(deposite.id)
  }

  const apiError =
    (updateMutation.error as any)?.response?.data?.message ??
    (deleteMutation.error as any)?.response?.data?.message ??
    "Произошла ошибка. Попробуйте ещё раз."

  return (
    <div className={styles.cardItem}>
      <div className={styles.cardItemHeader}>
        <div>
          <p className={styles.cardItemLabel}>ID аукциона</p>
          <p className={styles.cardItemValue}>{deposite.auctionId}</p>
        </div>
        <div>
          <p className={styles.cardItemLabel}>Депозит</p>
          <p className={styles.cardItemValueStrong}>{deposite.deposite.toLocaleString()} ₽</p>
        </div>
        <div>
          <p className={styles.cardItemLabel}>Статус</p>
          <p className={styles.cardItemValue}>{deposite.status}</p>
        </div>
      </div>

      <div className={styles.cardItemActions}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={openEdit}
          disabled={updateMutation.isPending}
        >
          Изменить депозит
        </button>
        <button
          type="button"
          className={styles.dangerButton}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          Удалить депозит
        </button>
      </div>

      {isEditOpen && (
        <div className={styles.inlineModal}>
          <form className={styles.formInline} onSubmit={handleSubmit(onUpdateSubmit)} noValidate>
            <div className={styles.fieldInline}>
              <label className={styles.label} htmlFor={`deposite-${deposite.id}`}>
                Новый размер депозита
              </label>
              <input
                id={`deposite-${deposite.id}`}
                type="number"
                min={0}
                className={styles.input}
                {...register("deposite", {
                  required: "Введите сумму депозита",
                  min: {
                    value: 0,
                    message: "Сумма не может быть отрицательной",
                  },
                })}
              />
              {errors.deposite && <p className={styles.error}>{errors.deposite.message}</p>}
            </div>

            {updateMutation.isError && <p className={styles.apiError}>{apiError}</p>}

            <div className={styles.inlineActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={closeEdit}
                disabled={updateMutation.isPending}
              >
                Отмена
              </button>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={updateMutation.isPending || !isDirty}
              >
                {updateMutation.isPending ? "Сохраняем..." : "Сохранить"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export const Deposites = () => {
  const { user } = useUsers((state) => state)
  const { deposites } = useDeposites((state) => state)

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDepositeFormValues>({
    defaultValues: {
      auctionId: "",
      deposite: 0,
    },
  })

  const createMutation = useDepositeCreateMutation()

  useDepositesQuery(user?.email ?? "")

  const openCreate = () => {
    reset({
      auctionId: "",
      deposite: 0,
    })
    setIsCreateOpen(true)
  }

  const closeCreate = () => {
    setIsCreateOpen(false)
  }

  const onCreateSubmit = (values: CreateDepositeFormValues) => {
    if (!user?.id) return

    createMutation.mutate(
      {
        userId: user.id,
        auctionId: values.auctionId,
        deposite: Number(values.deposite),
      },
      {
        onSuccess: () => {
          closeCreate()
        },
      },
    )
  }

  const apiError =
    (createMutation.error as any)?.response?.data?.message ?? "Произошла ошибка. Попробуйте ещё раз."

  /*if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Депозиты</h1>
          <p className={styles.subtitle}>Вы не авторизованы. Войдите, чтобы управлять депозитами.</p>
        </div>
      </div>
    )
  }*/

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <p className={styles.badge}>Баланс и участие</p>
            <h1 className={styles.title}>Ваши депозиты</h1>
            <p className={styles.subtitle}>
              Отслеживайте внесённые депозиты по аукционам и гибко управляйте ими.
            </p>
          </div>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={openCreate}
            disabled={createMutation.isPending}
          >
            Создать депозит
          </button>
        </header>

        <div className={styles.list}>
          {deposites && deposites.length > 0 ? (
            deposites.map((item) => <DepositeCard key={item.id} deposite={item} />)
          ) : (
            <p className={styles.emptyText}>У вас пока нет депозитов.</p>
          )}
        </div>
      </div>

      {isCreateOpen && (
        <div className={styles.backdrop} onClick={closeCreate}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Новый депозит</h2>
              <button type="button" className={styles.closeButton} onClick={closeCreate}>
                ✕
              </button>
            </header>

            <form className={styles.form} onSubmit={handleSubmit(onCreateSubmit)} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="auctionId">
                  ID аукциона
                </label>
                <input
                  id="auctionId"
                  type="text"
                  className={styles.input}
                  placeholder="Например, 123"
                  {...register("auctionId", {
                    required: "Введите ID аукциона",
                  })}
                />
                {errors.auctionId && <p className={styles.error}>{errors.auctionId.message}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="deposite">
                  Сумма депозита
                </label>
                <input
                  id="deposite"
                  type="number"
                  min={0}
                  className={styles.input}
                  placeholder="Минимальная сумма определяется правилами аукциона"
                  {...register("deposite", {
                    required: "Введите сумму депозита",
                    min: {
                      value: 0,
                      message: "Сумма не может быть отрицательной",
                    },
                  })}
                />
                {errors.deposite && <p className={styles.error}>{errors.deposite.message}</p>}
              </div>

              {createMutation.isError && <p className={styles.apiError}>{apiError}</p>}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={closeCreate}
                  disabled={createMutation.isPending}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Создаём..." : "Создать депозит"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}