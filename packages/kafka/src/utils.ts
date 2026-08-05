import { env } from "@yukikaze/lib/create-env"
import path from "node:path"
import { fileURLToPath } from "node:url"
import fs from "node:fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const kafkaCaPem = fs.readFileSync(path.resolve(__dirname, '../../../kafka-ca.pem'), 'utf-8')

const isCommentKafkaEnabled = env.KAFKA_BROKERS && env.KAFKA_COMMENT_REPLY_TOPIC

const isChatKafkaEnabled = env.KAFKA_BROKERS && env.KAFKA_CHAT_EVENTS_TOPIC

const isKafkaEnabled = env.KAFKA_BROKERS && (env.KAFKA_COMMENT_REPLY_TOPIC || env.KAFKA_CHAT_EVENTS_TOPIC)

const getKafkaBrokers = () => (env.KAFKA_BROKERS?.split(',') ?? []).map((broker) => broker.trim()).filter(Boolean)

export { isCommentKafkaEnabled, isChatKafkaEnabled, isKafkaEnabled, getKafkaBrokers, kafkaCaPem }