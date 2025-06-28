'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './Testimonials.module.scss';
import Image from 'next/image';

const Testimonials: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [animationId, setAnimationId] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      quote:
        'Suspendisse ultrices at diam lectus nullam. Nisl, sagittis viverra enim erat tortor ultricies massa turpis. Arcu pulvinar aenean nam laoreet nulla.',
      author: 'John Fang',
      position: 'wordfaang.com',
      avatar: '/testimonials1.svg',
    },
    {
      quote:
        'Data Warehouse has completely transformed how we handle our data storage needs. The security features and 24/7 access make it indispensable for our business operations.',
      author: 'Jane C',
      position: 'janecdn.io',
      avatar: '/image2.svg',
    },
    {
      quote:
        'The search functionality is incredible! Finding specific data has never been easier. This platform has saved us countless hours and improved our productivity significantly.',
      author: 'Michael Rodriguez',
      position: 'dataexperts.com',
      avatar: '/image3.svg',
    },
  ];

  const setSliderPosition = () => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${currentTranslate}px)`;
    }
  };

  const animation = () => {
    setSliderPosition();
    if (isDragging) {
      setAnimationId(requestAnimationFrame(animation));
    }
  };

  const smoothAnimation = (
    startValue: number,
    endValue: number,
    duration: number
  ) => {
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;

      setCurrentTranslate(currentValue);
      setSliderPosition();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setPrevTranslate(endValue);
      }
    };

    requestAnimationFrame(animate);
  };

  const setPositionByIndex = (useSmooth = false) => {
    const slideWidth =
      window.innerWidth > 1200
        ? 580
        : window.innerWidth > 768
        ? 500
        : window.innerWidth > 480
        ? 370
        : 320;
    const newTranslate = activeSlide * -slideWidth;

    if (useSmooth && Math.abs(currentTranslate - newTranslate) > 0) {
      smoothAnimation(currentTranslate, newTranslate, 350);
    } else {
      setCurrentTranslate(newTranslate);
      setPrevTranslate(newTranslate);
      setSliderPosition();
    }
  };

  useEffect(() => {
    setPositionByIndex();
  }, [activeSlide]);

  const nextSlide = () => {
    if (activeSlide < testimonials.length - 1) {
      setActiveSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (activeSlide > 0) {
      setActiveSlide((prev) => prev - 1);
    }
  };

  const dragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setAnimationId(requestAnimationFrame(animation));
  };

  const dragMove = (clientX: number) => {
    if (isDragging) {
      const currentPosition = clientX - startX;
      const slideWidth =
        window.innerWidth > 1200
          ? 580
          : window.innerWidth > 768
          ? 500
          : window.innerWidth > 480
          ? 370
          : 320;
      const maxTranslate = (testimonials.length - 1) * -slideWidth;

      // Add some resistance at boundaries
      let newTranslate = prevTranslate + currentPosition;

      // Apply boundary resistance
      if (newTranslate > 0) {
        newTranslate = newTranslate * 0.3; // Resistance when going left of first slide
      } else if (newTranslate < maxTranslate) {
        const overshoot = newTranslate - maxTranslate;
        newTranslate = maxTranslate + overshoot * 0.3; // Resistance when going right of last slide
      }

      setCurrentTranslate(newTranslate);
    }
  };

  const dragEnd = () => {
    setIsDragging(false);
    cancelAnimationFrame(animationId);

    const movedBy = currentTranslate - prevTranslate;
    const slideWidth = window.innerWidth > 768 ? 420 : 320;
    const threshold = slideWidth * 0.2; // 20% of slide width for easier sliding
    const velocity = Math.abs(movedBy);

    let newActiveSlide = activeSlide;

    // Consider both distance and velocity for slide change
    if (movedBy < -threshold && activeSlide < testimonials.length - 1) {
      newActiveSlide = activeSlide + 1;
    } else if (movedBy > threshold && activeSlide > 0) {
      newActiveSlide = activeSlide - 1;
    } else if (velocity > 50) {
      // Quick swipe detection
      if (movedBy < -30 && activeSlide < testimonials.length - 1) {
        newActiveSlide = activeSlide + 1;
      } else if (movedBy > 30 && activeSlide > 0) {
        newActiveSlide = activeSlide - 1;
      }
    }

    if (newActiveSlide !== activeSlide) {
      setActiveSlide(newActiveSlide);
    } else {
      // Snap back to current position with smooth animation
      const targetTranslate = activeSlide * -slideWidth;
      smoothAnimation(currentTranslate, targetTranslate, 250);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    dragMove(e.clientX);
  };

  const handleMouseUp = () => {
    dragEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    dragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    dragEnd();
  };

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <h2 className={styles.title}>Testimonials</h2>

        <div className={styles.sliderContainer}>
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={prevSlide}
            disabled={activeSlide === 0}
          >
            <Image
              className={`${styles.arrowIcon} ${styles.rotateLeft}`}
              src="/arrow.svg"
              alt="Previous"
              width={24}
              height={16}
              priority
            />
          </button>

          <div
            className={styles.slider}
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <div className={styles.avatar}>
                  <img src={testimonial.avatar} alt={testimonial.author} />
                </div>
                <div className={styles.info}>
                  <div className={styles.name}>{testimonial.author}</div>
                  <div className={styles.position}>{testimonial.position}</div>
                  <p className={styles.quote}>{testimonial.quote}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={nextSlide}
            disabled={activeSlide === testimonials.length - 1}
          >
            <Image
              className={styles.arrowIcon}
              src="/arrow.svg"
              alt="Next"
              width={24}
              height={16}
              priority
            />
          </button>
        </div>

        <div className={styles.dots}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === activeSlide ? styles.active : ''
              }`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
