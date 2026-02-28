import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"

import { useAuctionCreateMutation } from "../../hooks/auctions/auction-create.mutation"
import { useMediaCreateMutation } from "../../hooks/media/media-create.mutation"
import { useAuctionsQuery } from "../../hooks/auctions/auctions.query"
import type { AuctionOutput } from "../../shared/types/output/auction-output.type"
import { auctionPage } from "../../shared/consts/routes"
import { useAuctions } from "../../store/auctions.store"
import { useUsers } from "../../store/users.store"

import styles from "./auctions.page.module.css"

type CreateAuctionFormValues = {
  name: string
  description: string
  minPrice: number
  priceStep: number
  depositAmount: number
  expiresIn: string
  category: string
  media?: FileList
}

type AuctionCardProps = {
  auction: AuctionOutput
}

const AuctionCard = ({ auction }: AuctionCardProps) => {
  const targetUrl = auctionPage.replace(":id", auction.id)

  const [timeLeft, setTimeLeft] = useState<string>("")

  timeLeft+1;

  useEffect(() => {
    const target = new Date(auction.expiresIn)
    if (Number.isNaN(target.getTime())) {
      setTimeLeft("—")
      return
    }

    const update = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft("00:00:00")
        return
      }
      const totalSeconds = Math.floor(diff / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
    }

    update()
    const id = window.setInterval(update, 1000)

    return () => window.clearInterval(id)
  }, [auction.expiresIn])

  return (
    <Link to={targetUrl} className={styles.cardItem}>
      <div className={styles.cardItemHeader}>
        <div className={styles.cardItemTitleRow}>
          <h3 className={styles.cardItemTitle}>{auction.name}</h3>
          <span className={styles.cardItemStatus}>{auction.status}</span>
        </div>
        <span className={styles.cardItemCategory}>{auction.category}</span>
      </div>

      <p className={styles.cardItemDescription}>{auction.description}</p>

      <div className={styles.cardItemMeta}>
        <div className={styles.cardItemMetaBlock}>
          <span className={styles.cardItemLabel}>Текущая цена</span>
          <span className={styles.cardItemValueStrong}>
            {auction.currentPrice.toLocaleString()} ₽
          </span>
        </div>
        <div className={styles.cardItemMetaBlock}>
          <span className={styles.cardItemLabel}>Стартовая цена</span>
          <span className={styles.cardItemValue}>{auction.minPrice.toLocaleString()} ₽</span>
        </div>
        <div className={styles.cardItemMetaBlock}>
          <span className={styles.cardItemLabel}>Шаг ставки</span>
          <span className={styles.cardItemValue}>{auction.priceStep.toLocaleString()} ₽</span>
        </div>
        <div className={styles.cardItemMetaBlock}>
          <span className={styles.cardItemLabel}>Депозит</span>
          <span className={styles.cardItemValue}>{auction.depositAmount.toLocaleString()} ₽</span>
        </div>
        <div className={styles.cardItemMetaBlock}>
          <span className={styles.cardItemLabel}>До завершения</span>
          <span className={styles.cardItemValue}>{auction.expiresIn}</span>
        </div>
      </div>
    </Link>
  )
}

export const Auctions = () => {
  const { user } = useUsers((state) => state)
  const { auctions, search, setSearch } = useAuctions((state) => state)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAuctionFormValues>({
    defaultValues: {
      name: "",
      description: "",
      minPrice: 0,
      priceStep: 0,
      depositAmount: 0,
      expiresIn: "",
      category: "",
    },
  })

  const createMutation = useAuctionCreateMutation()
  const mediaMutation = useMediaCreateMutation()

  useAuctionsQuery(search)

  const openCreate = () => {
    reset({
      name: "",
      description: "",
      minPrice: 0,
      priceStep: 0,
      depositAmount: 0,
      expiresIn: "",
      category: "",
    })
    setIsCreateOpen(true)
  }

  const closeCreate = () => {
    setIsCreateOpen(false)
  }

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })

  const onCreateSubmit = async (values: CreateAuctionFormValues) => {
    if (!user?.id) return

    const expiresDate = new Date(values.expiresIn)

    let mediaBase64: string | null = null
    if (mediaFile) {
      try {
        mediaBase64 = await fileToBase64(mediaFile)
      } catch {
        mediaBase64 = null
      }
    }

    createMutation.mutate(
      {
        userId: user.id,
        name: values.name,
        description: values.description,
        minPrice: Number(values.minPrice),
        priceStep: Number(values.priceStep),
        depositAmount: Number(values.depositAmount),
        expiresIn: expiresDate,
        category: values.category,
      },
      {
        onSuccess: (res) => {
          if (mediaBase64 && res?.data?.id) {
            mediaMutation.mutate({
              auctionId: res.data.id,
              media: mediaBase64,
            })
          }
          setMediaFile(null)
          closeCreate()
        },
      },
    )
  }

  const apiError =
    (createMutation.error as any)?.response?.data?.message ?? "Произошла ошибка. Попробуйте ещё раз."

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <p className={styles.badge}>Маркет аукционов</p>
            <h1 className={styles.title}>Активные аукционы</h1>
            <p className={styles.subtitle}>
              Находите интересующие вас лоты и участвуйте в торгах в один клик. Гости могут просматривать
              аукционы, но для участия требуется авторизация.
            </p>
          </div>

          <div className={styles.headerActions}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {user && (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={openCreate}
                disabled={createMutation.isPending}
              >
                Создать аукцион
              </button>
            )}
          </div>
        </header>

        <div className={styles.list}>
          {auctions && auctions.length > 0 ? (
            auctions.map((auction) => <AuctionCard key={auction.id} auction={auction} />)
          ) : (
            <p className={styles.emptyText}>
              Аукционы не найдены. Измените параметры поиска или создайте первый аукцион.
            </p>
          )}
        </div>
      </div>

      {isCreateOpen && (
        <div className={styles.backdrop} onClick={closeCreate}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Новый аукцион</h2>
              <button type="button" className={styles.closeButton} onClick={closeCreate}>
                ✕
              </button>
            </header>

            <form className={styles.form} onSubmit={handleSubmit(onCreateSubmit)} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">
                  Название
                </label>
                <input
                  id="name"
                  type="text"
                  className={styles.input}
                  placeholder="Например, Коллекционная вещь"
                  {...register("name", {
                    required: "Введите название",
                    minLength: {
                      value: 3,
                      message: "Минимум 3 символа",
                    },
                  })}
                />
                {errors.name && <p className={styles.error}>{errors.name.message}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="description">
                  Описание
                </label>
                <textarea
                  id="description"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Кратко опишите лот и его особенности"
                  {...register("description", {
                    required: "Введите описание",
                    minLength: {
                      value: 10,
                      message: "Минимум 10 символов",
                    },
                  })}
                />
                {errors.description && <p className={styles.error}>{errors.description.message}</p>}
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="minPrice">
                    Стартовая цена
                  </label>
                  <input
                    id="minPrice"
                    type="number"
                    min={0}
                    className={styles.input}
                    {...register("minPrice", {
                      required: "Введите стартовую цену",
                      min: {
                        value: 0,
                        message: "Цена не может быть отрицательной",
                      },
                    })}
                  />
                  {errors.minPrice && <p className={styles.error}>{errors.minPrice.message}</p>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="priceStep">
                    Шаг ставки
                  </label>
                  <input
                    id="priceStep"
                    type="number"
                    min={1}
                    className={styles.input}
                    {...register("priceStep", {
                      required: "Введите шаг ставки",
                      min: {
                        value: 1,
                        message: "Минимальный шаг — 1",
                      },
                    })}
                  />
                  {errors.priceStep && <p className={styles.error}>{errors.priceStep.message}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="depositAmount">
                  Размер депозита для участия
                </label>
                <input
                  id="depositAmount"
                  type="number"
                  min={0}
                  className={styles.input}
                  {...register("depositAmount", {
                    required: "Укажите размер депозита",
                    min: {
                      value: 0,
                      message: "Сумма не может быть отрицательной",
                    },
                  })}
                />
                {errors.depositAmount && <p className={styles.error}>{errors.depositAmount.message}</p>}
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="expiresIn">
                    Время завершения
                  </label>
                  <input
                    id="expiresIn"
                    type="datetime-local"
                    className={styles.input}
                    {...register("expiresIn", {
                      required: "Укажите время завершения",
                    })}
                  />
                  {errors.expiresIn && <p className={styles.error}>{errors.expiresIn.message}</p>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="category">
                    Категория
                  </label>
                  <input
                    id="category"
                    type="text"
                    className={styles.input}
                    placeholder="Например, Коллекции"
                    {...register("category", {
                      required: "Укажите категорию",
                    })}
                  />
                  {errors.category && <p className={styles.error}>{errors.category.message}</p>}
                </div>
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
                  {createMutation.isPending ? "Создаём..." : "Создать аукцион"}
                </button>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="media">
                  Медиа (фото или видео)
                </label>
                <input
                  id="media"
                  type="file"
                  accept="image/*,video/*"
                  className={styles.input}
                  onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}