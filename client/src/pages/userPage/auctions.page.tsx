import { useState, type FormEvent } from "react"
import { Link } from "react-router"

import { useHistoryByAuctionIdQuery } from "../../hooks/history/historyByAuctionId.query"
import { auctionPage } from "../../shared/consts/routes"
import { useHistory } from "../../store/history.store"
import { useUsers } from "../../store/users.store"

import styles from "./auctions.page.module.css"

export const UserAuctions = () => {
  const { user } = useUsers((state) => state)
  const { history } = useHistory((state) => state)

  const [auctionId, setAuctionId] = useState("")
  const [submittedAuctionId, setSubmittedAuctionId] = useState("")

  const query = useHistoryByAuctionIdQuery(submittedAuctionId)

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Мои аукционы</h1>
          <p className={styles.subtitle}>
            Вы не авторизованы. Войдите, чтобы увидеть историю участия в аукционах.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = auctionId.trim()
    if (!trimmed) return

    setSubmittedAuctionId(trimmed)
  }

  const userHistory = (history ?? []).filter((item) => item.userId === user.id)
  const hasResults = submittedAuctionId && userHistory.length > 0

  const apiError = (query.error as any)?.response?.data?.message ?? "Произошла ошибка. Попробуйте ещё раз."

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <p className={styles.badge}>Участие в торгах</p>
            <h1 className={styles.title}>Мои аукционы</h1>
            <p className={styles.subtitle}>
              Введите ID аукциона, чтобы увидеть свою историю участия и быстро перейти к нужному лоту.
            </p>
          </div>

          <form className={styles.headerActions} onSubmit={handleSubmit}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="ID аукциона, например 123"
              value={auctionId}
              onChange={(e) => setAuctionId(e.target.value)}
            />
            <button type="submit" className={styles.primaryButton} disabled={query.isFetching}>
              {query.isFetching ? "Загружаем..." : "Показать участие"}
            </button>
            <p className={styles.helperText}>
              История берётся из ваших ставок и действий по выбранному аукциону.
            </p>
          </form>
        </header>

        <div className={styles.list}>
          {!submittedAuctionId && (
            <p className={styles.emptyText}>
              Чтобы увидеть список аукционов, в которых вы участвовали, начните с ввода ID интересующего аукциона.
            </p>
          )}

          {submittedAuctionId && query.isFetching && userHistory.length === 0 && (
            <p className={styles.emptyText}>Загружаем историю участия...</p>
          )}

          {submittedAuctionId && !query.isFetching && userHistory.length === 0 && !query.isError && (
            <p className={styles.emptyText}>
              Для аукциона с ID {submittedAuctionId} пока нет вашей истории участия.
            </p>
          )}

          {hasResults &&
            // history для одного аукциона, но на будущее оставляем поддержку нескольких записей
            userHistory.map((item) => {
              const targetUrl = auctionPage.replace(":id", item.auctionId)

              return (
                <Link key={item.id} to={targetUrl} className={styles.cardItem}>
                  <div className={styles.cardItemHeader}>
                    <div>
                      <h3 className={styles.cardItemTitle}>Аукцион #{item.auctionId}</h3>
                      <p className={styles.cardItemSubtitle}>
                        Переход к странице аукциона и продолжению участия в торгах.
                      </p>
                    </div>
                  </div>

                  <div className={styles.cardItemMeta}>
                    <div>
                      <span className={styles.cardItemLabel}>ID пользователя</span>
                      <div className={styles.cardItemValue}>{item.userId}</div>
                    </div>
                    <div>
                      <span className={styles.cardItemLabel}>Тип записи</span>
                      <div className={`${styles.cardItemValue} ${styles.pill}`}>История участия</div>
                    </div>
                  </div>
                </Link>
              )
            })}
        </div>

        {query.isError && <p className={styles.apiError}>{apiError}</p>}
      </div>
    </div>
  )
}
