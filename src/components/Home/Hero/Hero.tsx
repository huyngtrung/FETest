import Image from 'next/image';
import styles from './Hero.module.scss';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Save your data
            <br />
            storage here.
          </h1>
          <p className={styles.subtitle}>
            Data Warehouse is a data storage area that has been tested for
            security, so you can store your data here safely but not be afraid
            of being stolen by others.
          </p>
          <Link href="/signin" className={styles.cta}>
            Learn more
          </Link>
        </div>

        <div className={styles.illustration}>
          <Image
            src="/image1.svg"
            alt="Illustration"
            width={800}
            height={450}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
