import Layout from '@/components/app/layout'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import React from 'react'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import {
  PriceCheckProvider,
  usePriceCheck,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Purchase} from '@skillrecordings/database'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {trpc} from '@/trpc/trpc.client'
import Spinner from '@/components/spinner'
import {
  PriceDisplay,
  getFirstPPPCoupon,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import Link from 'next/link'
import {CheckCircleIcon} from '@heroicons/react/outline'
import {CheckIcon} from '@heroicons/react/solid'
import ReactMarkdown from 'react-markdown'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const products = await getAllProducts()
  const {req, query} = context
  const token = await getToken({req})

  const commerceProps = await propsForCommerce({
    query,
    token,
    products,
  })

  return commerceProps
}

type ProductsIndexProps = CommerceProps

const ProductsIndex: React.FC<ProductsIndexProps> = ({
  purchases,
  products,
  userId,
}) => {
  const purchasedProductIds = purchases?.map((purchase) => purchase.productId)
  return (
    <Layout meta={{title: `${process.env.NEXT_PUBLIC_SITE_TITLE} Products`}}>
      <header className="mx-auto flex w-full max-w-4xl flex-col justify-center px-5 pb-5 pt-32 sm:pt-40">
        <h1 className="mb-4 text-center font-heading text-4xl font-semibold sm:text-5xl">
          Total TypeScript Products
        </h1>
        <h2 className="text-center text-gray-300 sm:text-xl">
          <Balancer>
            All {process.env.NEXT_PUBLIC_SITE_TITLE} products that you can buy
            today to level up at TypeScript.
          </Balancer>
        </h2>
      </header>
      <main
        id="products-index-page"
        className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-5 py-16"
      >
        <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
          <Products products={products} userId={userId} purchases={purchases} />
        </PriceCheckProvider>
      </main>
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../../public/assets/landing/bg-divider-3.png')}
        objectPosition={'top'}
        className="-z-10 object-contain"
      />
    </Layout>
  )
}

export default ProductsIndex

const Products: React.FC<CommerceProps> = ({products, userId, purchases}) => {
  const [isPPPEnabled, setIsPPPEnabled] = React.useState(false)
  const {setMerchantCoupon} = usePriceCheck()

  return (
    <>
      {products?.map((product) => {
        return (
          <ProductTeaser
            isPPPEnabled={isPPPEnabled}
            product={product}
            userId={userId}
            key={product.title}
            purchases={purchases}
          />
        )
      })}
      {/* <div className="flex w-full items-center justify-end border-t border-gray-800 pb-16 pt-3">
        <label>
          <input
            value={isPPPEnabled ? 'on' : 'off'}
            type="checkbox"
            onChange={() => {
              setIsPPPEnabled(!isPPPEnabled)
              isPPPEnabled && setMerchantCoupon(undefined)
            }}
          />
          <span>Enable regional pricing</span>
        </label>
      </div> */}
    </>
  )
}

type ProductTeaserProps = {
  product: SanityProduct
  userId?: string
  purchases: Purchase[] | undefined
  isPPPEnabled?: boolean
}

const ProductTeaser: React.FC<ProductTeaserProps> = ({
  product,
  userId,
  purchases,
  isPPPEnabled = false,
}) => {
  const {addPrice, isDowngrade, merchantCoupon, setMerchantCoupon} =
    usePriceCheck()
  const {data: formattedPrice, status} = trpc.pricing.formatted.useQuery(
    {
      productId: product.productId,
      userId,
      quantity: 1,
      // couponId,
      merchantCoupon: merchantCoupon || undefined,
    },
    {
      onSuccess: (formattedPrice) => {
        addPrice(formattedPrice, product.productId)
      },
    },
  )

  const {data: purchaseToUpgrade} = trpc.purchases.getPurchaseById.useQuery({
    purchaseId: formattedPrice?.upgradeFromPurchaseId,
  })

  const isRestrictedUpgrade = purchaseToUpgrade?.status === 'Restricted'

  const defaultCoupon = formattedPrice?.defaultCoupon
  const appliedMerchantCoupon = formattedPrice?.appliedMerchantCoupon

  const pppCoupon = getFirstPPPCoupon(formattedPrice?.availableCoupons)

  const purchasedProductIds = purchases?.map((purchase) => purchase.productId)
  const purchased = purchasedProductIds?.includes(product.productId)
  const isPPPAvailable =
    Boolean(pppCoupon || merchantCoupon?.type === 'ppp') &&
    !purchased &&
    !isDowngrade(formattedPrice) &&
    isPPPEnabled

  React.useEffect(() => {
    if (isPPPAvailable && pppCoupon && isPPPEnabled) {
      setMerchantCoupon(pppCoupon)
    }
  }, [isPPPAvailable, pppCoupon, isPPPEnabled, setMerchantCoupon])

  return (
    <div
    // className="rounded-md border border-gray-700/20 bg-gray-800/20 p-8 px-2 py-0.5 shadow-2xl"
    >
      <div className="mt-4 flex grid-cols-5 flex-col md:grid">
        <aside className="col-span-2">
          {product.image && (
            <Image
              src={product.image.url}
              alt={product.title || `Product image`}
              width={300}
              height={300}
              className="mx-auto"
            />
          )}
        </aside>
        <div className="col-span-3 flex flex-col items-center gap-3 py-5 pt-5 sm:items-start sm:pl-3 sm:pr-8 md:pt-5">
          <div className="font-mono text-xs font-semibold uppercase text-cyan-300">
            {product.slug === 'core-volume-react-bundle' ? (
              <span className="mr-3 rounded-full bg-cyan-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
                FEATURED PRODUCT
              </span>
            ) : product.slug === 'advanced-react-with-typescript' ? (
              <span className="mr-3 rounded-full bg-cyan-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
                NEW
              </span>
            ) : null}
          </div>

          <h3 className="text-center font-text text-3xl font-bold sm:text-left sm:text-4xl">
            <Link
              href={{
                pathname: '/products/[slug]',
                query: {
                  slug: product.slug,
                },
              }}
              className="underline decoration-gray-600 underline-offset-4 transition hover:decoration-cyan-300 sm:flex-row"
            >
              <Balancer>{product.title}</Balancer>
            </Link>
          </h3>
          <div className="flex items-center gap-3 pt-2">
            {purchased ? (
              <div className="flex gap-1 text-lg text-cyan-300">
                <CheckCircleIcon className="w-5" /> Purchased
              </div>
            ) : (
              <>
                {status === 'success' ? (
                  <div>
                    <PriceDisplay
                      status={status}
                      formattedPrice={formattedPrice}
                    />
                    {appliedMerchantCoupon?.type === 'ppp'
                      ? 'Regional access'
                      : null}
                  </div>
                ) : (
                  <div
                    role="status"
                    aria-label="loading price"
                    className="flex h-9 w-24 animate-pulse items-center justify-center rounded bg-gradient-to-l from-gray-700 to-gray-600"
                  >
                    <Spinner className="w-4" />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="w-full text-gray-300">
            <Balancer>
              <ReactMarkdown className="prose w-full max-w-none pt-5 sm:prose-lg prose-p:text-gray-200">
                {product.description || ''}
              </ReactMarkdown>
            </Balancer>
          </div>
          {product.modules?.length && (
            <>
              <h4 className="pt-5 text-sm font-semibold uppercase text-gray-300">
                Includes
              </h4>
              <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
                {product.modules.map((module) => {
                  return (
                    <Link
                      href={{
                        pathname: '/workshops/[slug]',
                        query: {
                          slug: module.slug,
                        },
                      }}
                      className="group flex w-full flex-row items-center gap-2"
                    >
                      {module.image && (
                        <Image
                          src={module.image.url}
                          alt={module.title}
                          width={72}
                          height={72}
                        />
                      )}
                      <span className="w-full leading-tight text-gray-200 transition group-hover:text-white group-hover:underline">
                        {module.slug === 'typescript-expert-interviews' ? (
                          <h3 className="font-semibold text-yellow-200">
                            Bonus🎁
                          </h3>
                        ) : null}
                        <Balancer>{module.title}</Balancer>
                      </span>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
          <h4 className="pt-5 text-sm font-semibold uppercase text-gray-300">
            Features
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {product.features?.map((feature) => {
              return (
                <div className="flex items-center space-x-2 text-base text-gray-300">
                  <CheckIcon
                    className="h-4 w-4 text-cyan-300"
                    aria-hidden="true"
                  />{' '}
                  <span>{feature.value}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <footer className="flex items-center px-5 py-3"></footer>
    </div>
  )
}
