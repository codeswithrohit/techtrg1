import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Navbar1 from '../components/Navbar1'  // Import Navbar1
import LoadingBar from 'react-top-loading-bar'
import '../styles/globals.css'
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState({})
  const [subTotal, setSubTotal] = useState(0)
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState({ value: null })
  const [key, setKey] = useState()
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const [selectedCourse, setSelectedCourse] = useState('')
  const [userData, setUserData] = useState('')
  const [email, setEmail] = useState('')
  useEffect(() => {
    const myuser = JSON.parse(localStorage.getItem('myuser'))
    if (!myuser) {
      router.push('/')
    }

    if (myuser && myuser.token) {
      setUser(myuser)
      setEmail(myuser.email)
      fetchData(myuser.token)
      
    }
  }, [router.query])

  const fetchData = async(token)=>{
    let data = { token: token }
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let res = await a.json()
    if (res.selectedCourse) {
      console.log("res",res)
      setUserData(res)
      console.log("selectedcourseapp",res.selectedCourse)
      setSelectedCourse(res.selectedCourse);
    }

  }

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch('/api/fetch');
      const data = await res.json();
      setFiles(data);
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registration successful with scope: ', registration.scope);
        }).catch((error) => {
          console.log('Service Worker registration failed: ', error);
        });
    }
  }, []);

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setProgress(40)
    })
    router.events.on('routeChangeComplete', () => {
      setProgress(100)
    })

    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")))
        saveCart(JSON.parse(localStorage.getItem("cart")))
      }

    } catch (error) {
      localStorage.clear()
    }
    const myuser = JSON.parse(localStorage.getItem('myuser'))
    if (myuser) {
      setUser({ value: myuser.token, email: myuser.email })
    }
    setKey(Math.random())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query])

  const logout = () => {
    localStorage.removeItem('myuser')
    setUser({ value: null })
    setKey(Math.random())
    router.push('/')
  }

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart))
    let subt = 0;
    let keys = Object.keys(myCart)
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]]["price"] * myCart[keys[i]].qty;
    }
    setSubTotal(subt)
  }

  const addToCart = (itemCode, qty, price, name, date, variant) => {
    if (Object.keys(cart).length == 0) {
      setKey(Math.random)
    }
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty + qty
    }
    else {
      newCart[itemCode] = { qty: 1, price, name, date, variant }
    }
    setCart(newCart)
    saveCart(newCart)
  }

  const bookNow = (itemCode, qty, price, name, date, variant) => {
    let newCart = {}
    newCart[itemCode] = { qty: 1, price, name, date, variant }

    setCart(newCart)
    saveCart(newCart)

    router.push('/checkout')
  }

  const clearCart = () => {
    setCart({})
    saveCart({})
  }

  const removeFromCart = (itemCode, qty, price, name, date, variant) => {
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty - qty
    }
    if (newCart[itemCode]["qty"] < 0) {
      delete newCart[itemCode]
    }
    setCart(newCart)
    saveCart(newCart)
  }

  const isPhase1Route = router.pathname.startsWith('/phase1'); // Check if the route starts with '/phase1'
  const isAdminRoute = router.pathname.startsWith('/Admin');
  const isHomeRoute = router.pathname === '/';

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet" />
      </Head>

      <LoadingBar
        color='#4cd964'
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />

      {/* Conditionally render Navbar1 if route starts with '/phase1', else render Navbar unless on / or Admin routes */}
      {!isAdminRoute && !isHomeRoute && key ? (
  <Navbar
    classname="absolute w-full header-bg z-10"
    logout={logout}
    user={user}
    key={key}
    cart={cart}
    selectedCourse={selectedCourse}
    addToCart={addToCart}
    removeFromCart={removeFromCart}
    clearCart={clearCart}
    subTotal={subTotal}
  />
) : null}


      <Component
        files={files}
        bookNow={bookNow}
        cart={cart}
        userData={userData}
        selectedCourse={selectedCourse}
        user={user}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        {...pageProps}
      />

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default MyApp;
