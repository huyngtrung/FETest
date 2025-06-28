import React from 'react';
import Image from 'next/image';
import styles from './Features.module.scss';

const Features: React.FC = () => {
  const features = [
    {
      icon: '/image2.svg',
      title: 'Search Data',
      description:
        "Don't worry if your data is very large, the Data Warehouse provides a search engine, which is useful for making it easier to find data effectively saving time.",
      link: 'Learn more',
    },
    {
      icon: '/image3.svg',
      title: '24 Hours Access',
      description:
        'Access is given 24 hours a full morning to night and meet again in the morning, giving you comfort when you need data when urgent.',
      link: 'Learn more',
    },
    {
      icon: '/image4.svg',
      title: 'Print Out',
      description:
        'Print out service gives you convenience if someday you need print data, just edit it all and just print it.',
      link: 'Learn more',
    },
    {
      icon: '/image5.svg',
      title: 'Security Code',
      description:
        'Data Security is one of our best facilities. Allows for your files to be safer. The file can be secured with a code or password that you created, so only you can open the file.',
      link: 'Learn more',
    },
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Features</h2>
          <p className={styles.subtitle}>
            Some of the features and advantages that we provide for those of you
            who store data in this Data Warehouse.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.feature}>
              <div className={styles.iconWrapper}>
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={120}
                  height={120}
                  className={styles.icon}
                />
              </div>
              <div className={styles.content}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
                <a href="#" className={styles.learnMore}>
                  {feature.link} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
