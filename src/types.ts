export type PortalType = 'customer' | 'pharmacy';

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Family' | 'Other';
  recipientName: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaarNumber: string; // e.g. XXXX-XXXX-1234
  isAadhaarVerified: boolean;
  age: number;
  isAgeVerified: boolean;
  walletBalance: number;
  addresses: Address[];
  preferredLanguage: string; // 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'mr' | 'bn'
  theme: 'light' | 'dark' | 'system';
}

export interface Medicine {
  id: string;
  name: string;
  brand: string;
  composition: string;
  category: string; // e.g. 'Painkiller', 'Antibiotic', 'Diabetes', 'Cardiac', 'Vitamin'
  requiresPrescription: boolean;
  ageLimit?: number; // e.g. 18 for Schedule H1
  unitPrice: number;
  mrp: number;
  image: string;
  description: string;
  dosageInstructions: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  licenseNo: string;
  ownerName: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  rating: number;
  reviewCount: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  distanceKm: number;
  lat: number;
  lng: number;
}

export interface PharmacyStockItem {
  id: string;
  pharmacyId: string;
  medicineId: string;
  medicine: Medicine;
  quantityInStock: number;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  discountPercent: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string; // 'Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter'
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  medicalConditions: string[];
  prescriptionsCount: number;
  avatarColor: string;
}

export interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  time: string; // HH:mm
  repeat: 'Daily' | 'Twice Daily' | 'Weekly' | 'Custom';
  familyMemberName: string;
  pillsRemaining: number;
  lowStockAlertThreshold: number;
  isTakenToday: boolean;
  isActive: boolean;
}

export interface CartItem {
  medicine: Medicine;
  pharmacy: Pharmacy;
  quantity: number;
  stockAvailable: number;
}

export interface OrderItem {
  medicineName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface DeliveryAgent {
  name: string;
  phone: string;
  rating: number;
  photo: string;
  vehicleNumber: string;
  currentLat: number;
  currentLng: number;
  etaMinutes: number;
  otp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  pharmacyName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: 'UPI' | 'Wallet' | 'Cash on Delivery';
  deliveryAddress: string;
  trackingStep: number; // 1: Confirmed, 2: Packed, 3: Out for delivery, 4: Delivered
  deliveryAgent?: DeliveryAgent;
}

export interface PrescriptionVaultItem {
  id: string;
  title: string;
  doctorName: string;
  uploadedDate: string;
  forFamilyMember: string;
  fileType: 'image' | 'pdf';
  fileUrl: string;
  extractedMedicines?: {
    medicineName: string;
    dosage: string;
    frequency: string;
  }[];
}

export interface PharmacyInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string;
  doctorName?: string;
  date: string;
  items: {
    medicineName: string;
    batchNo: string;
    quantity: number;
    mrp: number;
    amount: number;
  }[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentMode: 'Cash' | 'UPI' | 'Card';
}

export interface WalletTransaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'Completed' | 'Pending';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'reminder' | 'offer' | 'system';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
