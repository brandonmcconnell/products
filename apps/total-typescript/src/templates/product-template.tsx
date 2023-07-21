import React from 'react'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {Element} from 'react-scroll'
import Layout from '@/components/app/layout'
import Image from 'next/legacy/image'
import {motion, useScroll, useTransform} from 'framer-motion'
import {PricingTiers} from '@skillrecordings/skill-lesson/path-to-purchase/product-tiers'
import {ProductPageProps} from '@/pages/products/[slug]'

const ProductTemplate: React.FC<ProductPageProps> = ({
  products,
  allowPurchase,
  couponFromCode,
  couponIdFromCoupon,
  defaultCoupon,
  purchases = [],
  userId,
  workshop,
}) => {
  const {scrollYProgress} = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <Layout
      meta={{
        title: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
        titleAppendSiteName: false,
        ogImage: couponFromCode
          ? {
              url: 'https://res.cloudinary.com/total-typescript/image/upload/v1669888351/illustrations/golden-ticket_2x_hkd8x3.png',
              alt: 'Golden Ticket',
            }
          : {
              url: workshop
                ? workshop.ogImage
                : 'https://res.cloudinary.com/total-typescript/image/upload/v1670407830/pricing/card_2x_isoiaa.png',
              alt: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
            },
      }}
      defaultCoupon={defaultCoupon}
    >
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../public/assets/landing/bg-divider-3.png')}
        objectPosition={'top'}
        className="select-none object-contain"
        quality={100}
      />
      <main className="relative z-10 flex flex-col items-center justify-center py-28 sm:py-36">
        <h1 className="relative z-10 px-5 text-center font-heading  text-4xl font-bold sm:text-5xl">
          Become a TypeScript Wizard
        </h1>
        <motion.div style={{y}} className="absolute top-0 h-screen w-full">
          <Image
            src={require('../../public/assets/landing/bg-divider-5.png')}
            alt=""
            aria-hidden="true"
            layout="fill"
            className="pointer-events-none z-0 translate-y-80 select-none object-contain object-top"
            quality={100}
          />
        </motion.div>
        <section className="px-5 pt-8">
          <Element name="buy" aria-hidden="true" />
          <PricingTiers
            products={products}
            userId={userId}
            purchases={purchases}
            couponIdFromCoupon={couponIdFromCoupon}
            couponFromCode={couponFromCode}
            allowPurchase={allowPurchase}
          />
        </section>
      </main>
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../public/assets/landing/bg-divider-7.png')}
        objectPosition={'bottom'}
        className="select-none object-contain"
        quality={100}
      />
    </Layout>
  )
}

export default ProductTemplate
