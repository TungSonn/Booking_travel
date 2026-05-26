import { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

const defaultDraft = {
  type: null,       // 'hotel' | 'tour' | 'guide'
  itemId: null,
  itemName: '',
  startDate: null,
  endDate: null,
  adults: 1,
  children: 0,
  unitPrice: 0,
  specialRequests: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
};

export function BookingProvider({ children }) {
  const [draft, setDraft] = useState(defaultDraft);
  const [step, setStep] = useState(1); // 1:details  2:review  3:payment  4:success

  const updateDraft = (data) => setDraft((prev) => ({ ...prev, ...data }));

  const initBooking = (type, item) => {
    setDraft({
      ...defaultDraft,
      type,
      itemId: item.id,
      itemName: item.name,
      unitPrice: item.price_per_night || item.price_per_person || item.price_per_day || 0,
    });
    setStep(1);
  };

  const resetBooking = () => { setDraft(defaultDraft); setStep(1); };

  // Calculate totals
  const nights = draft.startDate && draft.endDate
    ? Math.max(1, Math.ceil((new Date(draft.endDate) - new Date(draft.startDate)) / 86400000))
    : 1;

  const participants = draft.type === 'tour' ? (draft.adults + draft.children) : 1;
  const subtotal     = draft.unitPrice * (draft.type === 'hotel' ? nights : draft.type === 'tour' ? participants : nights);
  const tax          = subtotal * 0.08;
  const total        = subtotal + tax;

  return (
    <BookingContext.Provider value={{
      draft, updateDraft, initBooking, resetBooking,
      step, setStep,
      calculated: { nights, participants, subtotal, tax, total },
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBookingContext = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookingContext must be used within BookingProvider');
  return ctx;
};
