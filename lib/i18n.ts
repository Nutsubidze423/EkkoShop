'use client'

import { create } from 'zustand'

type Lang = 'en' | 'ka'

const EN = {
  // Nav
  'nav.search': 'Search products…',
  'nav.login': 'Sign in',
  'nav.register': 'Create account',
  'nav.logout': 'Sign out',
  'nav.account': 'My Account',
  'nav.admin': 'Admin Panel',
  'nav.cart': 'Cart',
  'nav.wishlist': 'Wishlist',

  // Catalog
  'catalog.title': 'Our Collection',
  'catalog.noResults': 'No products found',
  'catalog.filters': 'Filters',
  'catalog.search': 'Search',
  'catalog.category': 'Category',
  'catalog.price': 'Price',
  'catalog.available': 'In stock only',
  'catalog.clear': 'Clear filters',
  'catalog.showing': 'Showing',
  'catalog.of': 'of',
  'catalog.products': 'products',

  // Product
  'product.addToCart': 'Add to Cart',
  'product.addedToCart': 'Added',
  'product.removeFromCart': 'Remove',
  'product.addToWishlist': 'Save',
  'product.removeFromWishlist': 'Saved',
  'product.inStock': 'In Stock',
  'product.outOfStock': 'Out of Stock',
  'product.qty': 'Qty',
  'product.edit': 'Edit Product',
  'product.delete': 'Delete',
  'product.uploadImage': 'Upload Image',
  'product.deleteImage': 'Delete Image',
  'product.price': 'Price',
  'product.category': 'Category',
  'product.description': 'Description',
  'product.youMayAlsoLike': 'You May Also Like',

  // Cart
  'cart.title': 'Shopping Cart',
  'cart.empty': 'Your cart is empty',
  'cart.subtotal': 'Subtotal',
  'cart.total': 'Total',
  'cart.checkout': 'Proceed to Checkout',
  'cart.continueShopping': 'Continue Shopping',
  'cart.remove': 'Remove',
  'cart.promo': 'Promo code',
  'cart.apply': 'Apply',
  'cart.items': 'items',

  // Wishlist
  'wishlist.title': 'Saved Items',
  'wishlist.empty': 'Your wishlist is empty',

  // Auth
  'auth.email': 'Email address',
  'auth.password': 'Password',
  'auth.confirmPassword': 'Confirm password',
  'auth.firstName': 'First name',
  'auth.lastName': 'Last name',
  'auth.login': 'Sign in',
  'auth.register': 'Create account',
  'auth.forgotPassword': 'Forgot password?',
  'auth.noAccount': "Don't have an account?",
  'auth.hasAccount': 'Already have an account?',
  'auth.verifyEmail': 'Verify Email',
  'auth.verifyCode': 'Verification code',
  'auth.verify': 'Verify',
  'auth.resetPassword': 'Reset Password',
  'auth.newPassword': 'New password',
  'auth.sendCode': 'Send recovery code',
  'auth.backToLogin': 'Back to sign in',

  // Account
  'account.title': 'My Account',
  'account.profile': 'Profile',
  'account.changePassword': 'Change Password',
  'account.currentPassword': 'Current password',
  'account.save': 'Save changes',
  'account.role': 'Role',

  // Admin
  'admin.title': 'Admin Panel',
  'admin.createProduct': 'Create Product',
  'admin.productName': 'Product name',
  'admin.description': 'Description',
  'admin.price': 'Price',
  'admin.amount': 'Stock amount',
  'admin.category': 'Category',
  'admin.create': 'Create',
  'admin.update': 'Update',
  'admin.cancel': 'Cancel',
  'admin.manageImages': 'Manage Images',
  'admin.allProducts': 'All Products',

  // Common
  'common.loading': 'Loading…',
  'common.error': 'Something went wrong',
  'common.retry': 'Try again',
  'common.close': 'Close',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.page': 'Page',
  'common.currency': '₾',
}

const KA: typeof EN = {
  'nav.search': 'პროდუქტის ძიება…',
  'nav.login': 'შესვლა',
  'nav.register': 'რეგისტრაცია',
  'nav.logout': 'გასვლა',
  'nav.account': 'ჩემი ანგარიში',
  'nav.admin': 'ადმინ პანელი',
  'nav.cart': 'კალათა',
  'nav.wishlist': 'სურვილების სია',

  'catalog.title': 'ჩვენი კოლექცია',
  'catalog.noResults': 'პროდუქტი ვერ მოიძებნა',
  'catalog.filters': 'ფილტრები',
  'catalog.search': 'ძიება',
  'catalog.category': 'კატეგორია',
  'catalog.price': 'ფასი',
  'catalog.available': 'მარაგშია',
  'catalog.clear': 'გასუფთავება',
  'catalog.showing': 'ნაჩვენებია',
  'catalog.of': '-დან',
  'catalog.products': 'პროდუქტი',

  'product.addToCart': 'კალათაში',
  'product.addedToCart': 'დამატებულია',
  'product.removeFromCart': 'წაშლა',
  'product.addToWishlist': 'შენახვა',
  'product.removeFromWishlist': 'შენახულია',
  'product.inStock': 'მარაგშია',
  'product.outOfStock': 'არ არის მარაგში',
  'product.qty': 'რაოდ.',
  'product.edit': 'რედაქტირება',
  'product.delete': 'წაშლა',
  'product.uploadImage': 'სურათის ატვირთვა',
  'product.deleteImage': 'სურათის წაშლა',
  'product.price': 'ფასი',
  'product.category': 'კატეგორია',
  'product.description': 'აღწერა',
  'product.youMayAlsoLike': 'შეიძლება მოგეწონოთ',

  'cart.title': 'სავაჭრო კალათა',
  'cart.empty': 'კალათა ცარიელია',
  'cart.subtotal': 'შუალედური ჯამი',
  'cart.total': 'სულ',
  'cart.checkout': 'გადახდაზე გადასვლა',
  'cart.continueShopping': 'შოპინგის გაგრძელება',
  'cart.remove': 'წაშლა',
  'cart.promo': 'პრომო კოდი',
  'cart.apply': 'გამოყენება',
  'cart.items': 'ნივთი',

  'wishlist.title': 'შენახული ნივთები',
  'wishlist.empty': 'სურვილების სია ცარიელია',

  'auth.email': 'ელ-ფოსტა',
  'auth.password': 'პაროლი',
  'auth.confirmPassword': 'პაროლის დადასტურება',
  'auth.firstName': 'სახელი',
  'auth.lastName': 'გვარი',
  'auth.login': 'შესვლა',
  'auth.register': 'რეგისტრაცია',
  'auth.forgotPassword': 'დაგავიწყდა პაროლი?',
  'auth.noAccount': 'არ გაქვს ანგარიში?',
  'auth.hasAccount': 'უკვე გაქვს ანგარიში?',
  'auth.verifyEmail': 'ელ-ფოსტის დადასტურება',
  'auth.verifyCode': 'დადასტურების კოდი',
  'auth.verify': 'დადასტურება',
  'auth.resetPassword': 'პაროლის განახლება',
  'auth.newPassword': 'ახალი პაროლი',
  'auth.sendCode': 'კოდის გაგზავნა',
  'auth.backToLogin': 'შესვლაზე დაბრუნება',

  'account.title': 'ჩემი ანგარიში',
  'account.profile': 'პროფილი',
  'account.changePassword': 'პაროლის შეცვლა',
  'account.currentPassword': 'მიმდინარე პაროლი',
  'account.save': 'შენახვა',
  'account.role': 'როლი',

  'admin.title': 'ადმინ პანელი',
  'admin.createProduct': 'პროდუქტის შექმნა',
  'admin.productName': 'პროდუქტის სახელი',
  'admin.description': 'აღწერა',
  'admin.price': 'ფასი',
  'admin.amount': 'მარაგი',
  'admin.category': 'კატეგორია',
  'admin.create': 'შექმნა',
  'admin.update': 'განახლება',
  'admin.cancel': 'გაუქმება',
  'admin.manageImages': 'სურათების მართვა',
  'admin.allProducts': 'ყველა პროდუქტი',

  'common.loading': 'იტვირთება…',
  'common.error': 'შეცდომა მოხდა',
  'common.retry': 'სცადეთ ისევ',
  'common.close': 'დახურვა',
  'common.save': 'შენახვა',
  'common.cancel': 'გაუქმება',
  'common.confirm': 'დადასტურება',
  'common.delete': 'წაშლა',
  'common.edit': 'რედაქტირება',
  'common.back': 'უკან',
  'common.next': 'შემდეგი',
  'common.previous': 'წინა',
  'common.page': 'გვერდი',
  'common.currency': '₾',
}

const DICTS = { en: EN, ka: KA }

interface I18nState {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useI18nStore = create<I18nState>()((set) => ({
  lang: 'en',
  setLang: (lang) => {
    if (typeof window !== 'undefined') localStorage.setItem('ekko_lang', lang)
    set({ lang })
  },
}))

export function useTranslation() {
  const { lang, setLang } = useI18nStore()
  const dict = DICTS[lang]
  const t = (key: keyof typeof EN): string => dict[key] ?? key
  const tCat = (name: string): string => name // categories come from API already localized via name/nameKa
  return { t, tCat, lang, setLang }
}

export function hydrateI18n(): void {
  if (typeof window === 'undefined') return
  const saved = localStorage.getItem('ekko_lang') as Lang | null
  if (saved === 'en' || saved === 'ka') {
    useI18nStore.getState().setLang(saved)
  }
}
