import { useEffect, useState, type FormEvent } from "react"
import { useParams } from "react-router"

import { useDepositeCreateMutation } from "../../hooks/deposites/create-deposite.mutation"
import { useRatesByAuctionIdQuery } from "../../hooks/rates/ratesByAuctionId.query"
import { useRateCreateMutation } from "../../hooks/rates/rate-create.mutation"
import type { AuctionOutput } from "../../shared/types/output/auction-output.type"
import { useAuctions } from "../../store/auctions.store"
import { useDeposites } from "../../store/deposites.store"
import { useRates } from "../../store/rates.store"
import { useUsers } from "../../store/users.store"
import { useMedia } from "../../store/media.store"
import { useMediaByAuctionIdQuery } from "../../hooks/media/mediaByAuctionId.query"

import styles from "./auction.page.module.css"

type Status = AuctionOutput["status"]

const getStatusLabel = (status: Status) => {
  switch (status) {
    case "ACTIVE":
      return "Аукцион идёт"
    case "FINISHED":
      return "Аукцион завершён"
    default:
      return status
  }
}

type StatusBadgeProps = {
  status: Status
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const isActive = status === "ACTIVE"

  return (
    <span className={`${styles.statusBadge} ${isActive ? styles.statusActive : styles.statusFinished}`}>
      <span className={styles.statusDot} />
      {getStatusLabel(status)}
    </span>
  )
}

export const Auction = () => {
  const { id } = useParams()

  const { user } = useUsers((state) => state)
  const { auctions } = useAuctions((state) => state)
  const { deposites } = useDeposites((state) => state)
  const { rates } = useRates((state) => state)
  const { media } = useMedia((state) => state)

  const [depositeAmount, setDepositeAmount] = useState("")
  const [rateAmount, setRateAmount] = useState("")
  const [timeLeft, setTimeLeft] = useState<string>("")

  const depositeMutation = useDepositeCreateMutation()
  const rateMutation = useRateCreateMutation()

  const numericAuctionId = id ?? ""

  const currentAuction = auctions?.find((auction) => auction.id === numericAuctionId)

  const { isLoading: isRatesLoading } = useRatesByAuctionIdQuery(numericAuctionId)
  const { isLoading: isMediaLoading } = useMediaByAuctionIdQuery(numericAuctionId)

  useEffect(() => {
    if (!currentAuction) {
      setTimeLeft("")
      return
    }

    const target = new Date(currentAuction.expiresIn)
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
    const idInterval = window.setInterval(update, 1000)

    return () => window.clearInterval(idInterval)
  }, [currentAuction])

  if (!id) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Аукцион не найден</h1>
          <p className={styles.subtitle}>Неверный адрес страницы аукциона.</p>
        </div>
      </div>
    )
  }

  const hasUserDepositeForAuction =
    !!user &&
    !!deposites?.some((d) => d.userId === user.id && d.auctionId === numericAuctionId)

  const handleCreateDeposite = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id || !numericAuctionId) return

    const amount = Number(depositeAmount)
    if (!Number.isFinite(amount) || amount <= 0) return

    depositeMutation.mutate({
      userId: user.id,
      auctionId: numericAuctionId,
      deposite: amount,
    })
  }

  const handleCreateRate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user?.id || !numericAuctionId) return

    const amount = Number(rateAmount)
    if (!Number.isFinite(amount) || amount <= 0) return

    rateMutation.mutate({
      userId: user.id,
      auctionId: numericAuctionId,
      cost: amount,
    })
  }

  const depositeApiError =
    (depositeMutation.error as any)?.response?.data?.message ??
    "Произошла ошибка при создании депозита. Попробуйте ещё раз."

  const rateApiError =
    (rateMutation.error as any)?.response?.data?.message ??
    "Произошла ошибка при создании ставки. Попробуйте ещё раз."

  const userRatesForAuction = rates?.filter((rate) => rate.auctionId === numericAuctionId) ?? []

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <p className={styles.badge}>Страница аукциона</p>
            <h1 className={styles.title}>{currentAuction?.name ?? `Аукцион #${numericAuctionId}`}</h1>
            <p className={styles.subtitle}>
              Внесите депозит, чтобы участвовать в торгах, и делайте ставки, когда будете готовы.
            </p>
          </div>

          {currentAuction && (
            <div className={styles.headerMeta}>
              <StatusBadge status={currentAuction.status} />
              <span className={styles.helperText}>ID аукциона: {currentAuction.id}</span>
            </div>
          )}
        </header>

        <div className={styles.layout}>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Информация о лоте</h2>
            <p className={styles.panelSubtitle}>
              Краткие параметры аукциона помогают вам принимать взвешенные решения по ставкам.
            </p>

            {currentAuction ? (
              <div className={styles.fieldGroup}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <span className={styles.label}>Текущая цена</span>
                    <span className={styles.valueStrong}>{currentAuction.currentPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Стартовая цена</span>
                    <span className={styles.value}>{currentAuction.minPrice.toLocaleString()} ₽</span>
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <span className={styles.label}>Шаг ставки</span>
                    <span className={styles.value}>{currentAuction.priceStep.toLocaleString()} ₽</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Требуемый депозит</span>
                    <span className={styles.value}>{currentAuction.depositAmount.toLocaleString()} ₽</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>До завершения</span>
                    <span className={styles.value}>{timeLeft || "—"}</span>
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Категория</span>
                  <span className={styles.value}>{currentAuction.category}</span>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Описание</span>
                  <span className={styles.value}>{currentAuction.description}</span>
                </div>
              </div>
            ) : (
              <p className={styles.emptyText}>
                Информация по аукциону ещё не загружена. Вернитесь на список аукционов и откройте страницу снова.
              </p>
            )}
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Участие в торгах</h2>
            <p className={styles.panelSubtitle}>
              Сначала внесите депозит, а затем делайте ставки, когда будете готовы повышать цену.
            </p>

            <div className={styles.actionsStack}>
              {!user && (
                <p className={styles.helperText}>
                  Чтобы вносить депозит и участвовать в торгах, войдите в аккаунт или зарегистрируйтесь.
                </p>
              )}

              {user && (
                <>
                  <form onSubmit={handleCreateDeposite}>
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
                        value={depositeAmount}
                        onChange={(e) => setDepositeAmount(e.target.value)}
                      />
                    </div>

                    {depositeMutation.isError && <p className={styles.apiError}>{depositeApiError}</p>}

                    <button
                      type="submit"
                      className={styles.primaryButton}
                      disabled={depositeMutation.isPending || !depositeAmount}
                    >
                      {depositeMutation.isPending ? "Создаём депозит..." : "Внести депозит"}
                    </button>
                  </form>

                  <div>
                    <span className={styles.label}>Статус депозита</span>
                    <div className={styles.helperText}>
                      {hasUserDepositeForAuction
                        ? "Вы уже внесли депозит для этого аукциона. Теперь вы можете делать ставки."
                        : "После внесения депозита вы сможете создавать ставки на этот аукцион."}
                    </div>
                  </div>

                  {hasUserDepositeForAuction && (
                    <form onSubmit={handleCreateRate}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="rate">
                          Сумма ставки
                        </label>
                        <input
                          id="rate"
                          type="number"
                          min={0}
                          className={styles.input}
                          placeholder="Введите сумму ставки"
                          value={rateAmount}
                          onChange={(e) => setRateAmount(e.target.value)}
                        />
                      </div>

                      {rateMutation.isError && <p className={styles.apiError}>{rateApiError}</p>}

                      <button
                        type="submit"
                        className={styles.secondaryButton}
                        disabled={rateMutation.isPending || !rateAmount}
                      >
                        {rateMutation.isPending ? "Создаём ставку..." : "Сделать ставку"}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </section>
        </div>

        <section className={styles.panel} style={{ marginTop: 14 }}>
          <h2 className={styles.panelTitle}>Ставки по этому аукциону</h2>
          <p className={styles.panelSubtitle}>
            Просматривайте все ставки, сделанные пользователями для этого аукциона.
          </p>

          {isRatesLoading ? (
            <p className={styles.emptyText}>Загружаем ставки...</p>
          ) : userRatesForAuction.length > 0 ? (
            <div className={styles.ratesList}>
              {userRatesForAuction.map((rate) => (
                <div key={rate.id} className={styles.rateItem}>
                  <div className={styles.rateMain}>
                    <span className={styles.rateCost}>{rate.cost.toLocaleString()} ₽</span>
                    <div className={styles.rateMeta}>
                      <span>ID пользователя: {rate.userId}</span>
                      <span>ID аукциона: {rate.auctionId}</span>
                    </div>
                  </div>
                  <span className={styles.pill}>Ставка</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>
              Для этого аукциона пока нет ставок. Будьте первым, кто сделает ставку.
            </p>
          )}
        </section>

        <section className={styles.panel} style={{ marginTop: 14 }}>
          <h2 className={styles.panelTitle}>Медиа аукциона</h2>
          <p className={styles.panelSubtitle}>Фото или видео, добавленные к этому аукциону.</p>

          {isMediaLoading ? (
            <p className={styles.emptyText}>Загружаем медиа...</p>
          ) : media && media.length > 0 ? (
            <div className={styles.ratesList}>
              {media
                .filter((item) => item.auctionId === numericAuctionId)
                .map((item) => {
                  const isVideo = item.media.startsWith("data:video")

                  return (
                    <div key={item.id} className={styles.rateItem}>
                      {isVideo ? (
                        <video controls className={styles.media}>
                          <source src={item.media} />
                        </video>
                      ) : (
                        <img src={item.media} alt="Медиа аукциона" className={styles.media} />
                      )}
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className={styles.emptyText}>Для этого аукциона пока нет медиа.</p>
          )}
        </section>
      </div>
    </div>
  )
}
