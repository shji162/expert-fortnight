import { Link } from "react-router"

import {
  auctionsPage,
  loginPage,
  regPage,
} from "../../shared/consts/routes"

import styles from "./main.page.module.css"

export const Main = () => {
  return (
    <div className={styles.page}>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.badge}>Онлайн-аукцион нового поколения</p>
            <h1 className={styles.title}>
              Торгуйтесь за лучшие лоты
              <span className={styles.titleAccent}> в реальном времени.</span>
            </h1>
            <p className={styles.subtitle}>
              Auction Hub — платформа, где собираются продавцы и покупатели, чтобы честно и
              прозрачно торговаться за уникальные товары. Подключайтесь к аукционам, делайте
              ставки и отслеживайте результаты в один клик.
            </p>

            <div className={styles.actions}>
              <Link to={auctionsPage} className={styles.ctaPrimary}>
                Смотреть аукционы
              </Link>
              <Link to={regPage} className={styles.ctaSecondary}>
                Создать аккаунт
              </Link>
              <Link to={loginPage} className={styles.ctaGhost}>
                У меня уже есть аккаунт
              </Link>
            </div>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaTitle}>Прозрачные торги</span>
                <span className={styles.metaText}>История ставок и статусы в реальном времени.</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaTitle}>Защищённые сделки</span>
                <span className={styles.metaText}>Баланс, депозиты и роли пользователей под контролем.</span>
              </div>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardHeader}>
              <span className={styles.heroChip}>Пример лота</span>
              <span className={styles.heroStatus}>Live</span>
            </div>
            <div className={styles.heroLotTitle}>Коллекционная вещь для демонстрации</div>
            <p className={styles.heroLotText}>
              Здесь вы увидите краткое описание лота, текущую ставку и время до завершения.
            </p>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatLabel}>Текущая ставка</span>
                <span className={styles.heroStatValue}>12 500 ₽</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatLabel}>Ставок сделано</span>
                <span className={styles.heroStatValue}>18</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatLabel}>До завершения</span>
                <span className={styles.heroStatValue}>01:24:17</span>
              </div>
            </div>

            <Link to={auctionsPage} className={styles.heroButton}>
              Перейти к аукционам
            </Link>

            <p className={styles.heroHint}>
              Чтобы делать ставки, <Link to={regPage}>создайте аккаунт</Link> или{" "}
              <Link to={loginPage}>войдите</Link>.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}