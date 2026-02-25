import { Link } from "react-router"
import {
  adminPage,
  auctionsPage,
  depositesPage,
  loginPage,
  mainPage,
  regPage,
  userAuctionsPage,
  userPage,
} from "../../shared/consts/routes"
import auth from "../../api/endpoints/auth"
import { useDeposites } from "../../store/deposites.store"
import { useUsers } from "../../store/users.store"
import styles from "./header.module.css"

export const Header = () => {
  const { user, isAuth, isAdmin, setAuth, setUser, setAdmin } = useUsers((state) => state)
  const { deposites } = useDeposites((state) => state)

  const userBalance =
    user && deposites
      ? deposites
          .filter((d) => d.userId === user.id)
          .reduce((sum, d) => sum + d.deposite, 0)
      : 0

  const handleLogout = async () => {
    try {
      await auth.logout()
    } catch {
      // игнорируем ошибки логаута на сервере, выходим локально
    }

    localStorage.removeItem("token")
    setAuth(false)
    setUser(null)
    setAdmin(false)
  }

  return (
    <header className={styles.header}>
      <Link to={mainPage} className={styles.logo}>
        <span className={styles.logoMark}>AU</span>
        <span className={styles.logoText}>Auction Hub</span>
      </Link>

      <nav className={styles.nav}>
        <Link to={auctionsPage} className={styles.navLink}>
          Аукционы
        </Link>
        <Link to={userPage} className={styles.navLink}>
          Профиль
        </Link>
        <Link to={userAuctionsPage} className={styles.navLink}>
          Мои аукционы
        </Link>
        <Link to={depositesPage} className={styles.navLink}>
          Депозиты
        </Link>
        {isAdmin && (
          <Link to={adminPage} className={styles.navLink}>
            Админ
          </Link>
        )}
      </nav>

      <div className={styles.headerActions}>
        {isAuth && user ? (
          <>
            <div className={styles.balanceBadge}>
              <span className={styles.balanceLabel}>Баланс</span>
              <span className={styles.balanceValue}>{userBalance.toLocaleString()} ₽</span>
            </div>
            <button type="button" className={styles.linkGhostButton} onClick={handleLogout}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to={loginPage} className={styles.linkGhost}>
              Войти
            </Link>
            <Link to={regPage} className={styles.linkPrimary}>
              Регистрация
            </Link>
          </>
        )}
      </div>
    </header>
  )
}