import styles from './dashboard.module.css'

export default function DashboardLoading() {
  return (
    <div className={styles.pageLoading}>
      <div className={styles.spinner} />
    </div>
  )
}
