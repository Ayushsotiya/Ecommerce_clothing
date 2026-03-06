import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

// Migrate old cart items to include quantity
const migrateCart = (cart) => {
    if (!Array.isArray(cart)) return []
    return cart.map(item => ({
        ...item,
        quantity: item.quantity || 1
    }))
}

const storedCart = localStorage.getItem("cart")
    ? migrateCart(JSON.parse(localStorage.getItem("cart")))
    : []

// Recalculate totals from migrated cart
const calculateTotalItems = (cart) => cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
const calculateTotal = (cart) => cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)

const initialState = {
    cart: storedCart,
    total: storedCart.length > 0 ? calculateTotal(storedCart) : 0,
    totalItems: storedCart.length > 0 ? calculateTotalItems(storedCart) : 0,
    loading: false,
}

// Helper function to update localStorage
const updateLocalStorage = (state) => {
    localStorage.setItem("cart", JSON.stringify(state.cart))
    localStorage.setItem("total", JSON.stringify(state.total))
    localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
}

// Helper function to recalculate totals
const recalculateTotals = (state) => {
    state.totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0)
    state.total = state.cart.reduce((sum, item) => {
        const price = item.negotiatedPrice || item.price
        return sum + (price * item.quantity)
    }, 0)
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        addToCart: (state, action) => {
            const product = action.payload
            const existingIndex = state.cart.findIndex((item) => item._id === product._id)
            
            if (existingIndex >= 0) {
                // Product already in cart, increase quantity
                state.cart[existingIndex].quantity += 1
                toast.success("Increased quantity in cart")
            } else {
                // Add new product with quantity 1
                state.cart.push({ ...product, quantity: 1 })
                toast.success("Product added to cart")
            }
            
            recalculateTotals(state)
            updateLocalStorage(state)
        },
        removeFromCart: (state, action) => {
            const productId = action.payload
            const index = state.cart.findIndex((item) => item._id === productId)
            
            if (index >= 0) {
                state.cart.splice(index, 1)
                recalculateTotals(state)
                updateLocalStorage(state)
                toast.success("Product removed from cart")
            }
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload
            const index = state.cart.findIndex((item) => item._id === productId)
            
            if (index >= 0) {
                if (quantity <= 0) {
                    // Remove item if quantity is 0 or less
                    state.cart.splice(index, 1)
                    toast.success("Product removed from cart")
                } else {
                    state.cart[index].quantity = quantity
                }
                recalculateTotals(state)
                updateLocalStorage(state)
            }
        },
        incrementQuantity: (state, action) => {
            const productId = action.payload
            const index = state.cart.findIndex((item) => item._id === productId)
            
            if (index >= 0) {
                state.cart[index].quantity += 1
                recalculateTotals(state)
                updateLocalStorage(state)
            }
        },
        decrementQuantity: (state, action) => {
            const productId = action.payload
            const index = state.cart.findIndex((item) => item._id === productId)
            
            if (index >= 0) {
                if (state.cart[index].quantity > 1) {
                    state.cart[index].quantity -= 1
                } else {
                    // Remove item if quantity becomes 0
                    state.cart.splice(index, 1)
                    toast.success("Product removed from cart")
                }
                recalculateTotals(state)
                updateLocalStorage(state)
            }
        },
        resetCart: (state) => {
            state.cart = []
            state.total = 0
            state.totalItems = 0
            localStorage.removeItem("cart")
            localStorage.removeItem("total")
            localStorage.removeItem("totalItems")
        },
        applyNegotiatedPrice: (state, action) => {
            const { productId, negotiatedPrice, negotiationToken, discount } = action.payload
            const index = state.cart.findIndex((item) => item._id === productId)
            if (index >= 0) {
                state.cart[index].negotiatedPrice = negotiatedPrice
                state.cart[index].negotiationToken = negotiationToken
                state.cart[index].discount = discount
                recalculateTotals(state)
                updateLocalStorage(state)
                toast.success(`Negotiated price applied! Save ₹${(state.cart[index].price - negotiatedPrice) * state.cart[index].quantity}`)
            }
        },
        removeNegotiatedPrice: (state, action) => {
            const productId = action.payload
            const index = state.cart.findIndex((item) => item._id === productId)
            if (index >= 0) {
                delete state.cart[index].negotiatedPrice
                delete state.cart[index].negotiationToken
                delete state.cart[index].discount
                recalculateTotals(state)
                updateLocalStorage(state)
            }
        },
    },
})

export const { 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    resetCart, 
    setLoading,
    applyNegotiatedPrice,
    removeNegotiatedPrice
} = cartSlice.actions

export default cartSlice.reducer
