import { env } from '@yukikaze/lib/create-env'
import { Kafka } from 'kafkajs'
import type { ChatMessageEvent, CommentReplyEvent } from './types'
import { getKafkaBrokers, isKafkaEnabled, kafkaCaPem } from './utils'

let producer: ReturnType<Kafka['producer']> | null = null

const createProducer = () => {
    if (!isKafkaEnabled || producer) return

    const brokers = getKafkaBrokers()
    if (brokers.length === 0) return

    const kafka = new Kafka({
        clientId: env.KAFKA_CLIENT_ID,
        brokers,
        ssl: {
            ca: [kafkaCaPem]
        },
        sasl: {
            mechanism: "plain",
            username: env.KAFKA_SASL_USERNAME!,
            password: env.KAFKA_SASL_PASSWORD!,
        },
    })
    producer = kafka.producer()
}

export const emitCommentReplyEvent = async (payload: CommentReplyEvent) => {
    if (!env.KAFKA_BROKERS || !env.KAFKA_COMMENT_REPLY_TOPIC) return
    if (!producer) createProducer()
    if (!producer) return

    try {
        await producer.connect()
        await producer.send({
            topic: env.KAFKA_COMMENT_REPLY_TOPIC,
            messages: [
                {
                    key: payload.commentId,
                    value: JSON.stringify(payload),
                },
            ],
        })
    } catch (error) {
        console.error('[Kafka] Failed to emit comment reply event:', error)
    }
}

export const emitChatMessageEvent = async (payload: ChatMessageEvent) => {
    if (!env.KAFKA_BROKERS || !env.KAFKA_CHAT_EVENTS_TOPIC) return
    if (!producer) createProducer()
    if (!producer) return

    try {
        await producer.connect()
        await producer.send({
            topic: env.KAFKA_CHAT_EVENTS_TOPIC,
            messages: [
                {
                    key: payload.chatId,
                    value: JSON.stringify(payload),
                },
            ],
        })
    } catch (error) {
        console.error('[Kafka] Failed to emit chat message event:', error)
    }
}
