// frontend/src/app/products/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiHeart, FiShoppingCart, FiShare2, FiChevronLeft, FiStar, FiTruck, FiShield } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useFavoriteStore } from '@/store/favoriteStore'
import { toast } from 'react-hot-toast'

interface ProductDetails {
  id: string
  title: string
  description: string
  price: number
  discountedPrice?: number
  images: string[]
  category: string
  brand: string
  specs: { [key: string]: string }
  inStock: boolean
  rating: number
  reviewsCount: number
  colors: Array<{
    id: string
    name: string
    code: string
  }>
  sizes?: Array<{
    id: string
    name: string
    inStock: boolean
  }>
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')

  const addToCart = useCartStore((state) => state.addItem)
  const addToFavorites = useFavoriteStore((state) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // در پروژه واقعی از API دریافت می‌شود
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProduct({
          id: params.id,
          title: 'گوشی سامسونگ گلکسی S23 Ultra',
          description: 'گوشی هوشمند سامسونگ گلکسی S23 Ultra با دوربین 200 مگاپیکسلی و قلم S Pen',
          price: 45000000,
          discountedPrice: 42000000,
          images: [
            '/images/products/s23-ultra-1.jpg',
            '/images/products/s23-ultra-2.jpg',
            '/images/products/s23-ultra-3.jpg',
          ],
          category: 'موبایل',
          brand: 'سامسونگ',
          specs: {
            'پردازنده': 'Snapdragon 8 Gen 2',
            'رم': '12 گیگابایت',
            'حافظه داخلی': '256 گیگابایت',
            'دوربین اصلی': '200 مگاپیکسل',
            'باتری': '5000 میلی‌آمپر ساعت'
          },
          inStock: true,
          rating: 4.5,
          reviewsCount: 128,
          colors: [
            { id: 'black', name: 'مشکی', code: '#000000' },
            { id: 'cream', name: 'کرمی', code: '#F5E6E0' },
            { id: 'green', name: 'سبز', code: '#2E7D32' }
          ],
          sizes: [
            { id: '256', name: '256 گیگابایت', inStock: true },
            { id: '512', name: '512 گیگابایت', inStock: true },
            { id: '1024', name: '1 ترابایت', inStock: false }
          ]
        })
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات محصول')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">محصول مورد نظر یافت نشد</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          بازگشت
        </button>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedColor || (product.sizes && !selectedSize)) {
      toast.error('لطفاً تمام گزینه‌ها را انتخاب کنید')
      return
    }

    addToCart({
      id: product.id,
      title: product.title,
      price: product.discountedPrice || product.price,
      image: product.images[0],
      quantity,
      color: selectedColor,
      size: selectedSize
    })
    toast.success('محصول به سبد خرید اضافه شد')
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        url: window.location.href
      })
    } catch (error) {
      // اگر مرورگر از قابلیت share پشتیبانی نکند
      navigator.clipboard.writeText(window.location.href)
      toast.success('لینک محصول کپی شد')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition
                  ${selectedImage === index ? 'border-blue-600' : 'border-transparent'}`}
              >
                <Image
                  src={image}
                  alt={`${product.title} - تصویر ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-yellow-400">
                <FiStar className="fill-current" />
                <span className="ml-1 text-gray-600">{product.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{product.reviewsCount} دیدگاه</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-600">{product.category}</span>
            </div>
          </div>

          {/* Price */}
          <div>
            {product.discountedPrice ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="line-through text-gray-400">
                    {new Intl.NumberFormat('fa-IR').format(product.price)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                    {Math.round((1 - product.discountedPrice / product.price) * 100)}٪
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('fa-IR').format(product.discountedPrice)} تومان
                </div>
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
              </div>
            )}
          </div>

          {/* Colors */}
          {product.colors && (
            <div>
              <h3 className="font-medium mb-3">رنگ</h3>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`group relative w-12 h-12 rounded-full border-2 transition
                      ${selectedColor === color.id ? 'border-blue-600' : 'border-gray-200'}`}
                    title={color.name}
                  >
                    <span
                      className="block w-10 h-10 rounded-full m-auto"
                      style={{ backgroundColor: color.code }}
                    />
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && (
            <div>
              <h3 className="font-medium mb-3">ظرفیت</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    disabled={!size.inStock}
                    className={`px-4 py-2 rounded-lg border-2 transition
                      ${selectedSize === size.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}
                      ${size.inStock ? 'hover:border-blue-600' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-medium mb-3">تعداد</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition
                ${product.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              <FiShoppingCart />
              {product.inStock ? 'افزودن به سبد خرید' : 'ناموجود'}
            </button>
            <button
              onClick={() => {
                addToFavorites({
                  id: product.id,
                  title: product.title,
                  price: product.discountedPrice || product.price,
                  image: product.images[0],
                  category: product.category,
                  inStock: product.inStock
                })
                toast.success('به علاقه‌مندی‌ها اضافه شد')
              }}
              className="w-12 h-12 flex items-center justify-center rounded-lg border hover:bg-gray-100 transition"
              aria-label="افزودن به علاقه‌مندی‌ها"
            >
              <FiHeart />
            </button>
            <button
              onClick={handleShare}
              className="w-12 h-12 flex items-center justify-center rounded-lg border hover:bg-gray-100 transition"
              aria-label="اشتراک‌گذاری"
            >
              <FiShare2 />
            </button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3 text-gray-600">
              <FiTruck className="text-xl" />
              <div className="text-sm">ارسال سریع</div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FiShield className="text-xl" />
              <div className="text-sm">گارانتی اصالت و سلامت</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="border-b">
          <div className="flex gap-8">
            {[
              { id: 'description', label: 'توضیحات' },
              { id: 'specs', label: 'مشخصات' },
              { id: 'reviews', label: 'دیدگاه‌ها' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-4 relative ${
                 // ادامه کد قبلی در frontend/src/app/products/[id]/page.tsx

                 activeTab === tab.id ? 
                 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'
               }`}
             >
               {tab.label}
               {activeTab === tab.id && (
                 <motion.div
                   layoutId="activeTab"
                   className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                 />
               )}
             </button>
           ))}
         </div>
       </div>

       <div className="mt-8">
         <AnimatePresence mode="wait">
           {/* توضیحات محصول */}
           {activeTab === 'description' && (
             <motion.div
               key="description"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="prose prose-lg max-w-none"
             >
               <div className="space-y-4">
                 <p>{product.description}</p>
                 {/* اطلاعات بیشتر محصول */}
                 <div className="bg-blue-50 p-4 rounded-lg">
                   <h4 className="font-medium text-blue-900 mb-2">ویژگی‌های برجسته:</h4>
                   <ul className="list-disc list-inside space-y-1 text-blue-800">
                     <li>دوربین حرفه‌ای 200 مگاپیکسلی</li>
                     <li>صفحه نمایش 6.8 اینچی Dynamic AMOLED 2X</li>
                     <li>قلم S Pen با حساسیت فوق‌العاده</li>
                     <li>باتری قدرتمند 5000 میلی‌آمپر ساعت</li>
                   </ul>
                 </div>
               </div>
             </motion.div>
           )}

           {/* مشخصات فنی */}
           {activeTab === 'specs' && (
             <motion.div
               key="specs"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="divide-y"
             >
               {Object.entries(product.specs).map(([key, value], index) => (
                 <div
                   key={key}
                   className={`grid grid-cols-3 py-4 ${index === 0 ? 'border-t' : ''}`}
                 >
                   <div className="font-medium text-gray-600">{key}</div>
                   <div className="col-span-2">{value}</div>
                 </div>
               ))}
             </motion.div>
           )}

           {/* دیدگاه‌های کاربران */}
           {activeTab === 'reviews' && (
             <motion.div
               key="reviews"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-8"
             >
               {/* نمودار امتیازها */}
               <div className="bg-gray-50 p-6 rounded-lg">
                 <div className="flex items-center gap-8">
                   <div className="text-center">
                     <div className="text-3xl font-bold">{product.rating}</div>
                     <div className="flex items-center text-yellow-400 mt-1">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <FiStar
                           key={star}
                           className={star <= Math.floor(product.rating) ? 'fill-current' : ''}
                         />
                       ))}
                     </div>
                     <div className="text-sm text-gray-600 mt-1">
                       از {product.reviewsCount} دیدگاه
                     </div>
                   </div>
                   <div className="flex-1 space-y-2">
                     {[5, 4, 3, 2, 1].map((star) => (
                       <div key={star} className="flex items-center gap-2">
                         <div className="text-sm text-gray-600 w-6">{star}</div>
                         <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div
                             className="h-full bg-yellow-400"
                             style={{
                               width: `${Math.random() * 100}%`
                             }}
                           />
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>

               {/* فرم ثبت دیدگاه */}
               <div className="bg-white p-6 rounded-lg border">
                 <h3 className="text-lg font-medium mb-4">ثبت دیدگاه</h3>
                 <form className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium mb-1">امتیاز شما</label>
                     <div className="flex items-center gap-1">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <button
                           key={star}
                           type="button"
                           className="text-2xl text-yellow-400 hover:scale-110 transition"
                         >
                           <FiStar className="hover:fill-current" />
                         </button>
                       ))}
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-1">دیدگاه شما</label>
                     <textarea
                       rows={4}
                       className="w-full border rounded-lg p-2"
                       placeholder="دیدگاه خود را بنویسید..."
                     />
                   </div>
                   <button
                     type="submit"
                     className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                   >
                     ثبت دیدگاه
                   </button>
                 </form>
               </div>

               {/* لیست دیدگاه‌ها */}
               <div className="space-y-6">
                 {[...Array(3)].map((_, index) => (
                   <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                     <div className="flex items-center justify-between mb-2">
                       <div className="font-medium">کاربر {index + 1}</div>
                       <div className="text-sm text-gray-600">2 روز پیش</div>
                     </div>
                     <div className="flex items-center text-yellow-400 mb-2">
                       {[...Array(5)].map((_, starIndex) => (
                         <FiStar
                           key={starIndex}
                           className={starIndex < 4 ? 'fill-current' : ''}
                         />
                       ))}
                     </div>
                     <p className="text-gray-600">
                       لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
                     </p>
                   </div>
                 ))}
               </div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     </div>
   </div>
 )
}