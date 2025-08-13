// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import { chatSlice } from '@/redux-store/slices/chat'
import { emailSlice } from '@/redux-store/slices/email'
import { kanbanSlice } from '@/redux-store/slices/kanban'

// Api Imports
import { authService } from './services/auth'
import { orderService } from './services/order'
import { imageService } from './services/image'
import { productService } from './services/product'
import { categoryService } from './services/category'
import { templateService } from './services/template'

import { templateCategoryService } from './services/templateCategory'

export const store = configureStore({
  reducer: {
    [chatSlice.name]: chatSlice.reducer,
    [emailSlice.name]: chatSlice.reducer,
    [kanbanSlice.name]: chatSlice.reducer,

    [authService.reducerPath]: authService.reducer,
    [orderService.reducerPath]: orderService.reducer,
    [imageService.reducerPath]: imageService.reducer,
    [productService.reducerPath]: productService.reducer,
    [categoryService.reducerPath]: categoryService.reducer,
    [templateService.reducerPath]: templateService.reducer,

    [templateCategoryService.reducerPath]: templateCategoryService.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }).concat(
      authService.middleware,
      orderService.middleware,
      imageService.middleware,
      productService.middleware,
      categoryService.middleware,
      templateService.middleware,

      templateCategoryService.middleware
    )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
