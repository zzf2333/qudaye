// import { createClient } from 'supabase-minichat'
import { createClient } from 'supabase-wechat-stable-v2'

const url = "https://cvs79i8g91hkparud8fg.baseapi.memfiredb.com"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzMyMTEzNjA3MywiaWF0IjoxNzQ0MzM2MDczLCJpc3MiOiJzdXBhYmFzZSJ9.fHgc6p4Gu6fNd_Oo0o6RnVF2tXtTS-U_9bQmZHGXMfE"
export const supabase = createClient(url, key);