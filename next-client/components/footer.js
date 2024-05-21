import styles from '../styles/footer.module.css';
import GitHubIcon from '@mui/icons-material/GitHub';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a
        href="https://www.oklink.com/amoy/address/0x47e8d4d6d272e1b469f02842194f9d2f6cbbf2eb"
        target="_blank"
        rel="noreferrer"
      >
        <ReceiptIcon className={styles.icon} />
        <span>Contract Address</span>
      </a>
      <a href="https://www.ombayus.com" target="_blank" rel="noreferrer">
        © 2024 | Created by Denis
      </a>
    </footer>
  );
};

export default Footer;
