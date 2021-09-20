import React, { useState } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from 'reactstrap';

const items = [
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/ecommerce-cms-react.appspot.com/o/banner_1.jpeg?alt=media&token=ca0733dd-8627-47cf-acdb-ecbb686fc7ba',
    altText: 'Slide 1',
    caption: 'Slide 1'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/ecommerce-cms-react.appspot.com/o/banner_2.png?alt=media&token=87d01584-ef54-4351-b48b-789a11cd25b9',
    altText: 'Slide 2',
    caption: 'Slide 2'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/ecommerce-cms-react.appspot.com/o/banner_3.jpeg?alt=media&token=9a1b3927-52d5-4455-90d3-9e64e099c0d5',
    altText: 'Slide 3',
    caption: 'Slide 3'
  }
];

const Home = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const slides = items.map((item) => {
    return (
        <CarouselItem
          onExiting={() => setAnimating(true)}
          onExited={() => setAnimating(false)}
          key={item.src}
        >
          <img src={item.src} alt={item.altText} style={{ width: '100%', height: '70vh' }} />
        </CarouselItem>
    );
  });

  return (
    <div style={{ marginTop: '8vh' }}>
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
      >
        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
      </Carousel>
    </div>
  );
}

export default Home;