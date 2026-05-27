import { apiClient } from './client';
import {
  StoreProfile, StoreNote, StoreProduct, StoreBooking,
  StorePhoto, StoreProductPhoto, StorePhotoCategory,
  StoreProfileFormData, StoreNoteFormData, StoreProductFormData, BookingFormData,
  PaginatedResponse, NoteType, BookingStatus,
} from './types';

export interface StoreSearchParams {
  query: string;
  type?: NoteType;
  shop_slug?: string;
  top_k?: number;
}

export interface StoreSearchResult {
  query: string;
  results: StoreNote[];
  count: number;
}

export const storeApi = {
  // ── 私有：店铺管理 ──
  getMyStore: (token: string) =>
    apiClient.get<StoreProfile>('/my-store', token),

  updateMyStore: (data: StoreProfileFormData, token: string) =>
    apiClient.put<StoreProfile>('/my-store', data, token),

  // ── 私有：Notes ──
  getMyNotes: (token: string, page = 1) =>
    apiClient.get<PaginatedResponse<StoreNote>>(`/my-store/notes?page=${page}`, token),

  createNote: (data: StoreNoteFormData, token: string) =>
    apiClient.post<StoreNote>('/my-store/notes', data, token),

  updateNote: (id: number, data: Partial<StoreNoteFormData>, token: string) =>
    apiClient.put<StoreNote>(`/my-store/notes/${id}`, data, token),

  deleteNote: (id: number, token: string) =>
    apiClient.delete<{ message: string }>(`/my-store/notes/${id}`, token),

  // ── 私有：商品库 ──
  getMyProducts: (token: string, page = 1) =>
    apiClient.get<PaginatedResponse<StoreProduct>>(`/my-store/products?page=${page}`, token),

  createProduct: (data: StoreProductFormData, token: string) =>
    apiClient.post<StoreProduct>('/my-store/products', data, token),

  updateProduct: (id: number, data: Partial<StoreProductFormData>, token: string) =>
    apiClient.put<StoreProduct>(`/my-store/products/${id}`, data, token),

  deleteProduct: (id: number, token: string) =>
    apiClient.delete<{ message: string }>(`/my-store/products/${id}`, token),

  // ── 公开：店铺查询 ──
  getPublicStores: (page = 1) =>
    apiClient.get<PaginatedResponse<StoreProfile>>(`/public/store?page=${page}`),

  getPublicStore: (slug: string) =>
    apiClient.get<StoreProfile>(`/public/store/${slug}`),

  getPublicNotes: (slug: string, type?: NoteType, page = 1) => {
    let url = `/public/store/${slug}/notes?page=${page}`;
    if (type) url += `&type=${type}`;
    return apiClient.get<PaginatedResponse<StoreNote>>(url);
  },

  getPublicProducts: (slug: string, page = 1) =>
    apiClient.get<PaginatedResponse<StoreProduct>>(`/public/store/${slug}/products?page=${page}`),

  // ── 公开：语义搜索 ──
  search: (params: StoreSearchParams) =>
    apiClient.post<StoreSearchResult>('/public/search', params),

  // ── 公开：提交预定 ──
  createBooking: (slug: string, data: BookingFormData) =>
    apiClient.post<StoreBooking>(`/public/store/${slug}/bookings`, data),

  // ── 私有：预定管理 ──
  getMyBookings: (token: string, status?: BookingStatus | 'all', page = 1) => {
    let url = `/my-store/bookings?page=${page}`;
    if (status && status !== 'all') url += `&status=${status}`;
    return apiClient.get<PaginatedResponse<StoreBooking>>(url, token);
  },

  updateBookingStatus: (id: number, status: BookingStatus, token: string) =>
    apiClient.put<StoreBooking>(`/my-store/bookings/${id}/status`, { status }, token),

  deleteBooking: (id: number, token: string) =>
    apiClient.delete<{ message: string }>(`/my-store/bookings/${id}`, token),

  // ── 私有：店铺相册 ──
  uploadStorePhoto: (file: File, token: string, category: StorePhotoCategory = 'environment') => {
    const form = new FormData();
    form.append('photo', file);
    form.append('category', category);
    return apiClient.postForm<StorePhoto>('/my-store/photos', form, token);
  },

  deleteStorePhoto: (id: number, token: string) =>
    apiClient.delete<{ message: string }>(`/my-store/photos/${id}`, token),

  reorderStorePhotos: (ids: number[], token: string) =>
    apiClient.put<{ message: string }>('/my-store/photos/reorder', { ids }, token),

  getPublicStorePhotos: (slug: string) =>
    apiClient.get<StorePhoto[]>(`/public/store/${slug}/photos`),

  // ── 私有：商品图片 ──
  uploadProductPhoto: (productId: number, file: File, token: string) => {
    const form = new FormData();
    form.append('photo', file);
    return apiClient.postForm<StoreProductPhoto>(`/my-store/products/${productId}/photos`, form, token);
  },

  deleteProductPhoto: (id: number, token: string) =>
    apiClient.delete<{ message: string }>(`/my-store/product-photos/${id}`, token),

  setProductPhotoPrimary: (id: number, token: string) =>
    apiClient.put<StoreProductPhoto>(`/my-store/product-photos/${id}/primary`, {}, token),

  getPublicProductPhotos: (slug: string, productId: number) =>
    apiClient.get<StoreProductPhoto[]>(`/public/store/${slug}/products/${productId}/photos`),

  // ── 公开：开店助手 LLM 行业分类兜底 ──
  classifyIndustry: (text: string) =>
    apiClient.post<{ industry: string; confidence: number; reason: string }>(
      '/onboarding/classify-industry',
      { text },
    ),

  // ── 公开：开店助手 name/functions/hasAccount 自由文本校验 ──
  validateOnboarding: (
    step: 'name' | 'functions' | 'hasAccount',
    text: string,
  ) =>
    apiClient.post<{
      valid: boolean;
      reason: string;
      data: { matched?: string[]; has_account?: boolean } | null;
    }>('/onboarding/validate', { step, text }),
};
