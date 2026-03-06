import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
    messages: [],
    conversationId: null,
    isLoading: false,
    error: null,
    negotiatedPrices: {}, // { productId: { price, token, productName, originalPrice, discount, expiresAt } }
    preFilledMessage: null,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        toggleChat: (state) => {
            state.isOpen = !state.isOpen;
        },
        openChat: (state) => {
            state.isOpen = true;
        },
        closeChat: (state) => {
            state.isOpen = false;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setConversationId: (state, action) => {
            state.conversationId = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearChat: (state) => {
            state.messages = [];
            state.conversationId = null;
            state.error = null;
        },
        addNegotiatedPrice: (state, action) => {
            const { productId, price, token, productName, originalPrice, discount, expiresAt } = action.payload;
            state.negotiatedPrices[productId] = { price, token, productName, originalPrice, discount, expiresAt };
        },
        removeNegotiatedPrice: (state, action) => {
            const productId = action.payload;
            delete state.negotiatedPrices[productId];
        },
        clearNegotiatedPrices: (state) => {
            state.negotiatedPrices = {};
        },
        setPreFilledMessage: (state, action) => {
            state.preFilledMessage = action.payload;
        },
    },
});

export const {
    toggleChat,
    openChat,
    closeChat,
    addMessage,
    setConversationId,
    setLoading,
    setError,
    clearChat,
    addNegotiatedPrice,
    removeNegotiatedPrice,
    clearNegotiatedPrices,
    setPreFilledMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
