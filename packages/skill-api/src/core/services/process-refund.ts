import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {stripe} from '@skillrecordings/commerce-server'

export async function stripeRefund({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const {req} = params
    const skillSecret = req.headers['x-skill-secret'] as string

    if (skillSecret !== process.env.SKILL_SECRET) {
      return {
        status: 401,
        body: {
          error: 'Unauthorized',
        },
      }
    }

    const merchantChargeId =
      (req.query?.merchantChargeId as string) ||
      (req.body?.merchantChargeId as string)

    const processRefund = await stripe.refunds.create({
      charge: merchantChargeId,
    })

    return {
      status: 200,
      body: processRefund,
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
