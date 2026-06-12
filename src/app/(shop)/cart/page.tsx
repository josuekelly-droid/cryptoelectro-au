"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  const shipping = subtotal > 500 ? 0 : 29.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Cart" }]} />
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-20 h-20 text-text-primary/20 mb-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          <h2 className="text-2xl font-heading font-bold mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-text-primary/50 mb-8 max-w-md">
            Looks like you haven&apos;t added any products to your cart yet.
            Explore our premium electronics collection.
          </p>
          <Link href="/category/all" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Cart" }]} />

      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">
        Shopping Cart{" "}
        <span className="text-text-primary/50 text-lg font-body">
          ({totalItems} {totalItems === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => {
            const brandName =
  typeof item.product.brand === "object" && item.product.brand !== null
    ? (item.product.brand as { name: string }).name
    : String(item.product.brand || "");
const brandLetter = brandName ? brandName.charAt(0) : "?";
const productImages = item.product.images || [];
const mainImage =
  productImages.length > 0
    ? (typeof productImages[0] === "string"
        ? productImages[0]
        : (productImages[0] as { url: string }).url)
    : null;

            return (
              <motion.div
                key={`${item.product.id}-${item.color}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-4 sm:p-6 flex gap-4 sm:gap-6"
              >
                {/* Product Image */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-heading font-bold text-text-primary/10">
                      {brandLetter}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${item.product.slug || item.product.id}`}
                        className="text-sm sm:text-base font-heading font-semibold hover:text-accent transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-text-primary/50 mt-1">
                        {brandName} · {item.color}
                      </p>
                    </div>
                    <p className="text-base sm:text-lg font-heading font-bold text-text-primary whitespace-nowrap">
                      ${(Number(item.product.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-secondary-light rounded-md">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-secondary transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-secondary transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-sm text-text-primary/40 hover:text-error transition-colors flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-4">
            <h3 className="text-lg font-heading font-bold">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-primary/60">Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-primary/60">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-primary/60">Tax (GST 10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-secondary-light pt-3 flex justify-between">
                <span className="font-heading font-semibold">Total</span>
                <span className="font-heading font-bold text-lg">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-text-primary/40">
                Add ${(500 - subtotal).toFixed(2)} more to qualify for free
                shipping.
              </p>
            )}

            <Link href="/checkout" className="btn-primary w-full text-center">
              Proceed to Checkout
            </Link>

            <Link
              href="/category/smartphones"
              className="block text-center text-sm text-accent hover:text-accent-hover transition-colors"
            >
              Continue Shopping
            </Link>

            {/* Accepted Payment Methods */}
            <div className="pt-4 border-t border-secondary-light">
              <p className="text-xs text-text-primary/40 mb-2">We Accept</p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-accent text-xs">Credit cards</span>
                <span className="badge badge-accent text-xs">₿ BTC</span>
                <span className="badge badge-accent text-xs">Ξ ETH</span>
                <span className="badge badge-accent text-xs">₮ USDT</span>
                <span className="badge badge-accent text-xs">+100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}