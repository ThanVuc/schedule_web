export interface Notification {
  id: string
  title: string
  message: string
  sender_id: string
  receiver_ids: string[]
  is_read: boolean
  link: string
  created_at: number
  update_at: number
  trigger_at: number
  image_url: any
  is_send_mail: boolean
  is_active: boolean
  correlation_id: string
  correlation_type: number
}
