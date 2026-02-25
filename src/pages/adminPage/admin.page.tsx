import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import auctions from "../../api/endpoints/auctions"
import depositesApi from "../../api/endpoints/deposites"
import { useUsersQuery } from "../../hooks/users/users.query"
import { useUserUpdateMutation } from "../../hooks/users/user-update.mutation"
import type { AuctionOutput } from "../../shared/types/output/auction-output.type"
import type { DepositeOutput } from "../../shared/types/output/deposite-output.type"
import type { UserOutput } from "../../shared/types/output/user-output.type"

import styles from "./admin.page.module.css"

type Tab = "users" | "auctions" | "deposites"

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>("users")
  const [selectedAuctionId, setSelectedAuctionId] = useState<string>("")

  const usersQuery = useUsersQuery()
  const updateUserMutation = useUserUpdateMutation()

  const auctionsQuery = useQuery({
    queryKey: ["admin-auctions"],
    queryFn: async (): Promise<AuctionOutput[] | undefined> => {
      const res = await auctions.getAllAdmin()
      return res.data
    },
  })

  const finishAuctionMutation = useMutation({
    mutationFn: async (id: string) => {
      await auctions.finish(id)
    },
    onSuccess: () => {
      auctionsQuery.refetch()
    },
  })

  const depositesQuery = useQuery({
    queryKey: ["admin-deposites", selectedAuctionId],
    enabled: !!selectedAuctionId,
    queryFn: async (): Promise<DepositeOutput[] | undefined> => {
      const res = await depositesApi.getByAuctionId(selectedAuctionId)
      return res.data
    },
  })

  const toggleBan = (user: UserOutput) => {
    updateUserMutation.mutate({
      id: user.id,
      user: { isBanned: !user.isBanned },
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <p className={styles.badge}>Административная панель</p>
            <h1 className={styles.title}>Управление платформой</h1>
            <p className={styles.subtitle}>
              Управляйте пользователями, аукционами и депозитами, чтобы поддерживать порядок на площадке.
            </p>
          </div>

          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === "users" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Пользователи
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === "auctions" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("auctions")}
            >
              Аукционы
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === "deposites" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("deposites")}
            >
              Депозиты
            </button>
          </div>
        </header>

        {activeTab === "users" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Пользователи</h2>
            {usersQuery.isLoading && <p className={styles.muted}>Загружаем пользователей...</p>}
            {usersQuery.data && usersQuery.data.length === 0 && (
              <p className={styles.muted}>Пользователи не найдены.</p>
            )}
            {usersQuery.data && usersQuery.data.length > 0 && (
              <div className={styles.list}>
                {usersQuery.data.map((user) => (
                  <div key={user.id} className={styles.row}>
                    <div>
                      <div className={styles.rowTitle}>{user.name}</div>
                      <div className={styles.rowSubtitle}>{user.email}</div>
                    </div>
                    <div className={styles.rowMeta}>
                      <span className={styles.pill}>{user.role}</span>
                      {user.isBanned && <span className={styles.pillDanger}>Заблокирован</span>}
                    </div>
                    <button
                      type="button"
                      className={styles.rowAction}
                      onClick={() => toggleBan(user)}
                      disabled={updateUserMutation.isPending}
                    >
                      {user.isBanned ? "Разблокировать" : "Заблокировать"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "auctions" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Аукционы</h2>
            {auctionsQuery.isLoading && <p className={styles.muted}>Загружаем аукционы...</p>}
            {auctionsQuery.data && auctionsQuery.data.length === 0 && (
              <p className={styles.muted}>Аукционы не найдены.</p>
            )}
            {auctionsQuery.data && auctionsQuery.data.length > 0 && (
              <div className={styles.list}>
                {auctionsQuery.data.map((auction) => (
                  <div key={auction.id} className={styles.row}>
                    <div>
                      <div className={styles.rowTitle}>{auction.name}</div>
                      <div className={styles.rowSubtitle}>
                        Категория: {auction.category} · Статус: {auction.status}
                      </div>
                    </div>
                    <div className={styles.rowMeta}>
                      <span className={styles.pill}>Текущая цена: {auction.currentPrice.toLocaleString()} ₽</span>
                      <span className={styles.pill}>Депозит: {auction.depositAmount.toLocaleString()} ₽</span>
                    </div>
                    {auction.status === "ACTIVE" && (
                      <button
                        type="button"
                        className={styles.rowAction}
                        onClick={() => finishAuctionMutation.mutate(auction.id)}
                        disabled={finishAuctionMutation.isPending}
                      >
                        Завершить
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "deposites" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Депозиты по аукционам</h2>

            <div className={styles.filterRow}>
              <label className={styles.label} htmlFor="auctionId">
                ID аукциона
              </label>
              <input
                id="auctionId"
                className={styles.input}
                value={selectedAuctionId}
                onChange={(e) => setSelectedAuctionId(e.target.value)}
                placeholder="Введите ID аукциона"
              />
            </div>

            {selectedAuctionId && depositesQuery.isLoading && (
              <p className={styles.muted}>Загружаем депозиты...</p>
            )}

            {selectedAuctionId && depositesQuery.data && depositesQuery.data.length === 0 && (
              <p className={styles.muted}>Для этого аукциона нет депозитов.</p>
            )}

            {depositesQuery.data && depositesQuery.data.length > 0 && (
              <div className={styles.list}>
                {depositesQuery.data.map((dep) => (
                  <div key={dep.id} className={styles.row}>
                    <div>
                      <div className={styles.rowTitle}>Пользователь: {dep.userId}</div>
                      <div className={styles.rowSubtitle}>Аукцион: {dep.auctionId}</div>
                    </div>
                    <div className={styles.rowMeta}>
                      <span className={styles.pill}>Депозит: {dep.deposite.toLocaleString()} ₽</span>
                      <span className={styles.pill}>{dep.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}