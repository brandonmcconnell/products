import {ArrowRightIcon} from '@heroicons/react/solid'
import {Purchase} from '@skillrecordings/database'
import Layout from 'components/app/layout'
import Link from 'next/link'
import {DatePurchased, Price} from 'purchase-details/purchase-details-template'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'

export type PurchasesIndexProps = {
  purchases: Purchase &
    {
      id: string
      bulkCoupon: string
      product: {name: string}
      createdAt: string
      totalAmount: number
      redeemedBulkCouponId: string | null
    }[]
}

const PurchasesIndexTemplate: React.FC<PurchasesIndexProps> = ({purchases}) => {
  return (
    <Layout meta={{title: 'Your Purchases'}}>
      <header className="px-5 pt-24 text-center sm:pt-40">
        <h1 className="font-heading text-4xl font-black sm:text-5xl">
          Your Purchases
        </h1>
        <h2 className="mx-auto w-full max-w-lg pt-3 text-lg text-cyan-300">
          <Balancer>
            View details about your purchases. Get your invoice, buy more seats,
            or invite team members.
          </Balancer>
        </h2>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-16 px-5">
        {purchases
          ?.filter((p) => !p.redeemedBulkCouponId)
          .map((purchase) => {
            return (
              <article className="rounded-lg border border-gray-700/50 bg-gray-800 px-8 pt-8 pb-5 shadow-2xl shadow-black/20">
                <h2 className="font-heading text-2xl font-extrabold sm:text-3xl">
                  <Balancer>
                    <Link
                      href={`/purchases/${purchase.id}`}
                      className="hover:underline"
                    >
                      {purchase.product.name}
                    </Link>
                  </Balancer>
                </h2>
                <div className="mt-8 flex w-full flex-col justify-between gap-5 border-t border-dotted border-gray-700 pt-4 sm:flex-row sm:items-center sm:gap-0">
                  <div className="flex items-center text-gray-300">
                    <Price amount={purchase.totalAmount} />
                    {' ・ '}
                    <DatePurchased date={purchase.createdAt} />
                  </div>
                  <Link
                    href={`/purchases/${purchase.id}`}
                    className="flex items-center gap-2 font-medium text-cyan-300 underline"
                  >
                    View details {purchase.bulkCoupon && 'and invite your team'}{' '}
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            )
          })}
        <Image
          src={require('../../public/assets/gem-red@2x.png')}
          aria-hidden="true"
          alt=""
          width={100}
          className="mx-auto pt-10"
        />
      </main>
    </Layout>
  )
}

export default PurchasesIndexTemplate