import mongoose from 'mongoose'
import { Article } from '../routes/article/articleModal'
const util = require('util')
const cron = require('node-cron')
const redis = require('redis')

const client = redis.createClient()
client.get = util.promisify(client.get)
client.keys = util.promisify(client.keys)

const getAllValue = async (key) => {
  const data = await client.get(key)
  return {
    id: key.replace('storyViews_', ''),
    value: Number(data)
  }
}

cron.schedule('* 0 2 * * *', async () => {
  try {
    const keys = await client.keys('storyViews_*')
    if (keys) {
      const data = await Promise.all(
        keys.map((key) => {
          return getAllValue(key).then((value) => {
            return value
          })
        })
      )
      if (data && data.length > 0) {
        const bulk = Article.collection.initializeOrderedBulkOp()
        data.forEach((updateValue) => {
          bulk
            .find({ _id: mongoose.Types.ObjectId(updateValue.id) })
            .updateOne({ $inc: { views: updateValue.value } })
          client.del(`storyViews_${updateValue.id}`)
        })
        const updated = await bulk.execute()
        console.log('updated', updated)
      }
    }
  } catch (err) {
    console.log(err)
  }
})

export default cron
