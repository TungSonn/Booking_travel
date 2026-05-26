import api from './api';

export const hotelService = {
  getAll:    (params) => api.get('/hotels', { params }),
  getBySlug: (slug)   => api.get(`/hotels/${slug}`),
  getRooms:  (id)     => api.get(`/hotels/${id}/rooms`),
  create:    (data)   => api.post('/hotels', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:    (id, data) => api.put(`/hotels/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove:    (id)     => api.delete(`/hotels/${id}`),
  verify:    (id)     => api.patch(`/hotels/${id}/verify`),
};

export const tourService = {
  getAll:      (params) => api.get('/tours', { params }),
  getFeatured: ()       => api.get('/tours/featured'),
  getBySlug:   (slug)   => api.get(`/tours/${slug}`),
  getSchedules:(id)     => api.get(`/tours/${id}/schedules`),
  create:      (data)   => api.post('/tours', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:      (id, data) => api.put(`/tours/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove:      (id)     => api.delete(`/tours/${id}`),
  toggleFeatured: (id)  => api.patch(`/tours/${id}/feature`),
};

export const guideService = {
  getAll:        (params) => api.get('/guides', { params }),
  getById:       (id)     => api.get(`/guides/${id}`),
  getCalendar:   (id, month) => api.get(`/guides/${id}/calendar`, { params: { month } }),
  createProfile: (data)   => api.post('/guides/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProfile: (data)   => api.put('/guides/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  verify:        (id)     => api.patch(`/guides/${id}/verify`),
  remove:        (id)     => api.delete(`/guides/${id}`),
};

export const bookingService = {
  create:          (data)   => api.post('/bookings', data),
  getMyBookings:   (params) => api.get('/bookings', { params }),
  getById:         (id)     => api.get(`/bookings/${id}`),
  cancel:          (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }),
  confirm:         (id)     => api.patch(`/bookings/${id}/confirm`),
  complete:        (id)     => api.patch(`/bookings/${id}/complete`),
  initiatePayment: (id)     => api.post(`/bookings/${id}/payment`),
  getAllAdmin:      (params) => api.get('/bookings/admin/all', { params }),
};

export const reviewService = {
  getHotelReviews: (hotelId) => api.get(`/reviews/hotel/${hotelId}`),
  getTourReviews:  (tourId)  => api.get(`/reviews/tour/${tourId}`),
  getGuideReviews: (guideId) => api.get(`/reviews/guide/${guideId}`),
  create:     (data) => api.post('/reviews', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  reply:      (id, reply) => api.patch(`/reviews/${id}/reply`, { reply }),
  markHelpful:(id)   => api.patch(`/reviews/${id}/helpful`),
  remove:     (id)   => api.delete(`/reviews/${id}`),
};
