import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import Swal from 'sweetalert2';
import Style from 'style-it';
import Loader from "react-loader-spinner";
import Footer from '../../components/Footer';
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from 'react-redux';
import { gettingProducts } from '../../store/action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCreditCard, faShoppingCart, faSortAmountDown, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { addToCart } from '../../store/action';

var formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const useStyles = makeStyles((theme) => ({
  scaffold: {
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("images/tech_background.jpg") no-repeat center center/cover',
  },
  container: {
    margin: '0 auto',
    padding: '45px 0',
    width: '1200px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridGap: '20px',
  }
}));

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

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.close)
  }
})

const Home = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const products = useSelector(state => state.product.products);
  const [modal, setModal] = useState(false);
  const [productTitle, setProductTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const status = useSelector(state => state.user.status);

  const toggle = () => setModal(!modal);

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

  useEffect(async () => {
    await dispatch(gettingProducts());
  }, []);

  useEffect(() => {
    console.log(status);
  }, [status]);

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
    <div style={{ paddingTop: '8vh', fontWeight: '100' }}>
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
      {products.length > 0 ? <div className={classes.scaffold}><div className={classes.container}>
        {products.map((product) => {
          return <Card style={{ display: 'flex', justifyContent: 'end', alignContent: 'flex-end', height: '100%' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(217, 83, 79, 0.7)', padding: 10, borderRadius: 15 }}>
              <p style={{ padding: 0, margin: 0, color: '#ffffff' }}>{product.category}</p>
            </div>
            <CardImg onClick={(e) => {
              e.preventDefault();
              setProductTitle(product.name);
              toggle();
            }} style={{ cursor: 'pointer' }} top width="100%" height="60%" src={product.image_url} alt="Card image cap" />
            <CardBody style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: "rgba(92, 184, 92, 0.2)" }}>
              <CardTitle style={{ margin: 'auto', fontWeight: '600' }} tag="h5">{product.name}</CardTitle>
              <hr />
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', color: '#6c757d' }}>
                <CardText><FontAwesomeIcon icon={faWarehouse} /> {product.stock} Left</CardText>
                <CardText><FontAwesomeIcon icon={faCreditCard} /> {formatter.format(product.price)}</CardText>
              </div>
              <Button onClick={async () => {
                if (localStorage.getItem('status') != "logged_in") {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: "You need to login to add to cart!",
                  });
                } else {
                  const { value: quantity } = await Swal.fire({
                    input: 'number',
                    inputLabel: 'Quantity',
                    inputPlaceholder: 'Enter quantity',
                    showCancelButton: true,
                    confirmButtonText: loading ? <Loader
                      type="Puff"
                      color="#00BFFF"
                      height={35}
                      width={35}
                      timeout={10000000} //3 secs
                    /> : 'Add To Cart',
                    showConfirmButton: true,
                    inputValidator: (value) => {
                      return new Promise((resolve) => {
                        if (value < 1) {
                          resolve("Value cannot be less than 1!");
                        } else if (value > product.stock) {
                          resolve("Sorry, we don't have that many of this product!");
                        } else {
                          dispatch(addToCart(localStorage.getItem('user_id'), product.product_id, value, 'add', resolve, setLoading));
                        }
                      })
                    }
                  });
                }
              }} style={{ width: '100%' }} color="success"><FontAwesomeIcon icon={faShoppingCart} /> Add To Cart</Button>
            </CardBody>
          </Card>;
        })}
      </div></div> : <div style={{ width: '100%', margin: '20px auto 0' }}>
        <Loader
          style={{ textAlign: 'center' }}
          type="Puff"
          color="#00BFFF"
          height={150}
          width={150}
          timeout={10000000}
        />
        <h2 style={{ textAlign: 'center' }}>Loading...</h2>
      </div>}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{productTitle}</ModalHeader>
        <ModalBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>OK</Button>{' '}
        </ModalFooter>
      </Modal>
      <Footer />
    </div>
  );
}

export default Home;